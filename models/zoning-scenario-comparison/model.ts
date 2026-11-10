/** Original synthetic zoning-cap comparison. No planning-compliance or housing-demand claim. */
import { Random, World, run, studies, measurements } from "city-library";
import type { StudyOutcome } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";

export interface ZoningParameters {
  parcels: number;
  baseCap: number;
  seed: number;
}

export const inputs: Inputs<ZoningParameters> = {
  parcels: { kind: "number", default: 12, min: 1, max: 100, integer: true },
  baseCap: { kind: "number", default: 2, min: 1, max: 10, integer: true },
  seed: { kind: "number", default: 1, min: -2147483648, max: 4294967293, integer: true },
};

export const capacityMeasurement = measurements.define((state: { slots: number; evaluated: number }) => ({
  slots: state.slots,
  evaluated: state.evaluated,
}));

export function create(options: Partial<ZoningParameters> = {}) {
  const settings = parameters(inputs, options);
  const world = World.create();
  const scenarios = studies.design({
    defaults: { cap: settings.baseCap, parcels: settings.parcels },
    axes: [{ name: "cap", values: [settings.baseCap, settings.baseCap + 2] }],
  });
  const plan = studies.replicate(scenarios, [settings.seed, settings.seed + 1, settings.seed + 2]);
  const completed: StudyOutcome<{ cap: number; parcels: number }, { slots: number; evaluated: number }>[] = [];

  function createReplication(parameters: { cap: number; parcels: number }, seed: number) {
    const random = Random.create({ seed });
    const state = { slots: 0, evaluated: 0 };
    return {
      world: World.create({ random }),
      state,
      step() {
        state.slots += random.number() < 0.8 ? parameters.cap : 0;
        state.evaluated += 1;
      },
    };
  }

  // One outer step completes one independent replication, not one parcel.
  function step() {
    const planned = plan[completed.length];
    if (!planned) return;
    const result = studies.run({
      plan: [planned],
      steps: settings.parcels,
      create: createReplication,
      measure: instance => capacityMeasurement.read(instance.state),
      stopWhen: instance => instance.state.evaluated === settings.parcels,
      maxTotalSteps: settings.parcels,
      maxTotalSamples: settings.parcels + 1,
    });
    // A nonempty one-run plan always returns its outcome, including failures.
    completed.push(result.outcomes[0]!);
  }

  return {
    advance(count = 1) {
      stepCount(count);
      for (let index = 0; index < count && completed.length < plan.length; index += 1) {
        run(world, step);
      }
    },
    read() {
      const outcomes = completed.map(outcome => Object.freeze({
        id: outcome.run.id,
        scenario: outcome.run.scenarioId,
        seed: outcome.run.seed,
        cap: outcome.run.parameters.cap,
        // Every completed replication records at least its initial sample.
        slots: outcome.samples.at(-1)!.measurement.slots,
        reason: outcome.reason,
      }));
      // Summaries aggregate independent terminal outcomes, never pool time samples.
      const summaries = studies.summarize(
        { version: 1, provenance: {}, outcomes: completed },
        entry => entry.samples.at(-1)?.measurement.slots,
      ).map(summary => Object.freeze({
        scenario: summary.scenarioId,
        replications: summary.valid,
        mean: summary.mean ?? "none",
        sampleSd: summary.sampleSd ?? "none",
      }));
      const runPlan = Object.freeze(plan.map(run => Object.freeze({
        id: run.id,
        scenarioId: run.scenarioId,
        cap: run.parameters.cap,
      })));
      return Object.freeze({
        tick: world.tick.value,
        parameters: settings,
        runPlan,
        plannedRuns: plan.length,
        completedRuns: completed.length,
        outcomes: Object.freeze(outcomes),
        summaries: Object.freeze(summaries),
        done: completed.length === plan.length,
      });
    },
  };
}

export const model = {
  title: "Zoning Scenario Comparison",
  description: "Illustrative seeded density-cap studies over synthetic buildable parcels; no planning-compliance claim.",
  inputs,
  create,
} satisfies Definition<ZoningParameters, ReturnType<typeof create>>;
