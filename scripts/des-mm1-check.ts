/** Synthetic M/M/1 countercheck; this is not a calibrated city forecast. */
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { Agenda, Random, Resource, TimeWeighted } from "city-library";

const arrivalRate = 0.5;
const serviceRate = 1;
const warmup = 10_000;
const duration = 50_000;
const end = warmup + duration;
const seeds = [1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008];
const eventLimit = 1_000_000;
const confidenceMultiplier = 2.364624251;
const targets = { utilization: 0.5, L: 1, Lq: 0.5, W: 2, Wq: 1 };
const tolerances = { utilization: 0.02, L: 0.10, Lq: 0.08, W: 0.15, Wq: 0.12 };
type Metric = keyof typeof targets;
type EventData = { kind: "arrival" } | { kind: "departure"; customer: number };

function replication(seed: number) {
  const random = Random.create({ seed });
  const agenda = Agenda.create<EventData>();
  const server = Resource.add<number>({ capacity: 1 });
  interface Customer {
    id: number;
    arrival: number;
    started?: number;
    departure?: number;
    ticket: ReturnType<typeof server.request>;
  }
  const customers: Customer[] = [];
  const present = new Set<Customer>();
  let handled = 0;
  let systemLevel: ReturnType<typeof TimeWeighted.create> | undefined;
  let queueLevel: ReturnType<typeof TimeWeighted.create> | undefined;
  let busyLevel: ReturnType<typeof TimeWeighted.create> | undefined;

  function nextArrival() {
    const at = agenda.time + random.number({ distribution: "exponential", mean: 1 / arrivalRate });
    if (at <= end) agenda.add({ at, data: { kind: "arrival" } });
  }
  function startGranted() {
    for (const customer of present) {
      if (customer.started !== undefined || customer.ticket.status !== "granted") continue;
      customer.started = agenda.time;
      const service = random.number({ distribution: "exponential", mean: 1 / serviceRate });
      agenda.add({ at: agenda.time + service, data: { kind: "departure", customer: customer.id } });
    }
  }
  function dispatch(data: EventData) {
    if (++handled > eventLimit) throw new RangeError("M/M/1 event limit exceeded.");
    if (data.kind === "arrival") {
      const id = customers.length;
      const customer = { id, arrival: agenda.time, ticket: server.request({ owner: id }) };
      customers.push(customer);
      present.add(customer);
      nextArrival();
    } else {
      const customer = customers[data.customer]!;
      assert.equal(customer.ticket.status, "granted");
      customer.departure = agenda.time;
      server.release(customer.ticket);
      present.delete(customer);
    }
    startGranted();
    assert.equal(server.used + server.waiting.length, present.size);
    if (systemLevel) {
      systemLevel.set({ at: agenda.time, value: present.size });
      queueLevel!.set({ at: agenda.time, value: server.waiting.length });
      busyLevel!.set({ at: agenda.time, value: server.used });
    }
  }
  function drainUntil(until: number) {
    for (;;) {
      const event = agenda.next({ until });
      if (!event) return;
      dispatch(event.data);
    }
  }

  nextArrival();
  drainUntil(warmup);
  systemLevel = TimeWeighted.create({ at: warmup, value: present.size });
  queueLevel = TimeWeighted.create({ at: warmup, value: server.waiting.length });
  busyLevel = TimeWeighted.create({ at: warmup, value: server.used });
  drainUntil(end);
  const system = systemLevel.read({ until: end });
  const queue = queueLevel.read({ until: end });
  const busy = busyLevel.read({ until: end });

  // Continue admitted customers to completion without adding arrivals or extending measurements.
  systemLevel = undefined;
  while (present.size > 0) drainUntil(agenda.time + 1000);
  assert.equal(server.used, 0);
  assert.equal(server.waiting.length, 0);
  assert.equal(agenda.size, 0);

  const overlap = (from: number, until: number) => Math.max(0, Math.min(end, until) - Math.max(warmup, from));
  let clippedResidence = 0;
  let clippedWait = 0;
  let clippedService = 0;
  let admitted = 0;
  let residence = 0;
  let waiting = 0;
  for (const customer of customers) {
    assert.notEqual(customer.started, undefined);
    assert.notEqual(customer.departure, undefined);
    const started = customer.started!;
    const departed = customer.departure!;
    assert.ok(started >= customer.arrival && departed >= started);
    clippedResidence += overlap(customer.arrival, departed);
    clippedWait += overlap(customer.arrival, started);
    clippedService += overlap(started, departed);
    if (customer.arrival >= warmup && customer.arrival <= end) {
      admitted++;
      residence += departed - customer.arrival;
      waiting += started - customer.arrival;
    }
  }
  const relativeError = (left: number, right: number) => Math.abs(left - right) / Math.max(1, Math.abs(right));
  const areaErrors = {
    residence: relativeError(system.integral, clippedResidence),
    waiting: relativeError(queue.integral, clippedWait),
    service: relativeError(busy.integral, clippedService),
  };
  for (const error of Object.values(areaErrors)) assert.ok(error < 1e-10, "Clipped-area conservation failed.");
  assert.ok(admitted > 0);
  return {
    seed, customers: customers.length, admitted, events: handled, areaErrors,
    utilization: busy.mean!, L: system.mean!, Lq: queue.mean!, W: residence / admitted, Wq: waiting / admitted,
  };
}

const results = seeds.map(replication);
const summaries = (Object.keys(targets) as Metric[]).map(metric => {
  const values = results.map(result => result[metric]);
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (values.length - 1);
  const deviation = Math.sqrt(variance);
  const standardError = deviation / Math.sqrt(values.length);
  const margin = confidenceMultiplier * standardError;
  return {
    metric, target: targets[metric], mean, deviation, standardError,
    lower95: mean - margin, upper95: mean + margin, tolerance: tolerances[metric],
    containsTarget95: mean - margin <= targets[metric] && mean + margin >= targets[metric],
    passed: Math.abs(mean - targets[metric]) < tolerances[metric],
  };
});
const format = (value: number) => value.toFixed(6);
const report = `# Synthetic M/M/1 countercheck results

Executed with \`bun scripts/des-mm1-check.ts\` on ${new Date().toISOString()}. This is target-runtime evidence for an idealized queue, not city calibration or whole-Salabim equivalence. The design was declared before inspecting results.

Assumptions: stationary Poisson arrivals at 0.5/minute, independent exponential services at 1/minute, one work-conserving nonpreemptive FIFO server, unlimited waiting room, no abandonment or blocking, stable utilization 0.5. One explicitly seeded Random stream supplies successive independent-distribution draws. Analytical targets follow the birth-death derivation in [Salabim research](salabim-concepts.md).

Eight replications use seeds 1001–1008, warm-up 10,000 minutes and observation 50,000 minutes. Every customer admitted before the observation end is drained to completion. Time averages integrate only the observation window. Waiting/residence averages include all arrivals in that window, including those finishing later. Replication estimates are the sampling units; successive event observations are not treated as independent.

| Metric | Analytic target | Replication mean | Replication SD | SE | 95% t7 interval | Target in interval | Fixed tolerance | Gate |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
${summaries.map(value => `| ${value.metric} | ${value.target} | ${format(value.mean)} | ${format(value.deviation)} | ${format(value.standardError)} | [${format(value.lower95)}, ${format(value.upper95)}] | ${value.containsTarget95 ? "yes" : "no"} | ±${value.tolerance} | ${value.passed ? "pass" : "FAIL"} |`).join("\n")}

Confidence intervals use the two-sided 95% Student t multiplier 2.364624251 with 7 degrees of freedom. Interval inclusion is reported rather than used as a deterministic pass criterion; the predeclared fixed engineering tolerances are separate, broad defect-detection gates. Estimates remain subject to finite-run error and the pseudorandom stream assumptions.

${summaries.filter(value => !value.containsTarget95).map(value => `The ${value.metric} interval excludes its analytic target. This is reported without changing seeds, horizon or tolerances; a nominal confidence interval can miss its target, and eight replications do not establish precise coverage.`).join("\n")}

| Seed | Admitted in observation | Events | Utilization | L | Lq | W | Wq | Maximum clipped-area relative error |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
${results.map(value => `| ${value.seed} | ${value.admitted} | ${value.events} | ${format(value.utilization)} | ${format(value.L)} | ${format(value.Lq)} | ${format(value.W)} | ${format(value.Wq)} | ${Math.max(...Object.values(value.areaErrors)).toExponential(3)} |`).join("\n")}

Each replication independently checks occupancy conservation after every event and the exact finite-window identity between time-integrated occupancy, waiting and service and the sum of each customer's clipped intervals (relative arithmetic tolerance 1e-10). These deterministic invariants are distinct from the statistical comparisons. No unfinished customer is discarded. No parameter was fitted to these results.
`;
await writeFile(new URL("../docs/research/des-mm1-results.md", import.meta.url), report);
console.log(JSON.stringify({ results, summaries }, null, 2));
for (const value of summaries) assert.ok(value.passed, `M/M/1 ${value.metric} exceeded the predeclared tolerance.`);
