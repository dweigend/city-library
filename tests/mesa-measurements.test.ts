import { describe, expect, test } from "bun:test";
import { Agent, experiments, measurements, storage, World } from "city-library";

function counter() {
  return { world: World.add(), value: 0, step() { this.value += 1; } };
}

describe("explicit measurement and history boundaries", () => {
  test("copies projections and preserves history schema insertion order", () => {
    const source = { heat: 20, water: 3 };
    const definition = measurements.define(() => source);
    const first = definition.read({});
    source.heat = 21;
    expect(first.heat).toBe(20);
    const history = storage.history({ capacity: 2 });
    history.add({ tick: 0.5, values: source });
    history.add({ tick: 2, values: { water: 4, heat: 22 } });
    expect(Object.keys(history.samples[1]!.values)).toEqual(["heat", "water"]);
    history.add({ tick: 3, values: { heat: 23, water: 5 } });
    expect(history.samples.map(sample => sample.tick)).toEqual([2, 3]);
    expect(() => history.add({ tick: 4, values: { heat: Infinity, water: 0 } })).toThrow(RangeError);
    history.add({ tick: 4, values: { heat: 24, water: 6 } });
    expect(history.samples[1]!.tick).toBe(4);
    history.delete();
    history.add({ tick: 0, values: {} });
    expect(history.samples).toEqual([{ tick: 0, values: {} }]);
  });

  test("rejects accessors and invalid capacity without executing accessors", () => {
    let calls = 0;
    const definition = measurements.define(() => ({ get heat() { calls += 1; return 3; } }));
    expect(() => definition.read({})).toThrow(TypeError);
    expect(calls).toBe(0);
    expect(() => storage.history({ capacity: 0 })).toThrow(RangeError);
    expect(() => storage.history({ capacity: 1_000_001 })).toThrow(RangeError);
  });
});

describe("serial study lifecycle", () => {
  test("sample budgets count distinct completed boundaries", () => {
    const zero = experiments.run({ parameters: [{}], seeds: [1], steps: 0,
      maxTotalSamples: 1, create: counter, measure: model => model.value });
    expect(zero.outcomes[0]!.samples).toEqual([{ step: 0, measurement: 0 }]);
    const finalOnly = experiments.run({ parameters: [{}], seeds: [1], steps: 0,
      sampleInitial: false, maxTotalSamples: 1, create: counter, measure: model => model.value });
    expect(finalOnly.outcomes[0]!.samples).toEqual([{ step: 0, measurement: 0 }]);
    const everyBoundary = experiments.run({ parameters: [{}], seeds: [1], steps: 2,
      maxTotalSamples: 3, create: counter, measure: model => model.value });
    expect(everyBoundary.outcomes[0]!.samples.map(sample => sample.step)).toEqual([0, 1, 2]);
    expect(() => experiments.run({ parameters: [{}], seeds: [1], steps: 2,
      sampleWhen: () => false, maxTotalSamples: 2, create: counter, measure: model => model.value })).toThrow(RangeError);
  });

  test("initial stop, conditional scheduled sampling and forced terminal sample", () => {
    const stopped = experiments.run({ parameters: [{}], seeds: [1], steps: 9,
      create: counter, measure: model => model.value, stopWhen: () => true, sampleInitial: false });
    expect(stopped.outcomes[0]).toMatchObject({ status: "stopped", completedSteps: 0, samples: [{ step: 0, measurement: 0 }] });
    const filtered = experiments.run({ parameters: [{}], seeds: [1], steps: 3,
      create: counter, measure: model => model.value, sampleWhen: () => false });
    expect(filtered.outcomes[0]!.samples).toEqual([{ step: 3, measurement: 3 }]);
  });

  test("failed intervals retain prior samples and no failed tick; disposal errors retain primary failure", () => {
    let model: ReturnType<typeof counter> | undefined;
    let disposals = 0;
    const result = experiments.run({ parameters: [{}], seeds: [1, 2], steps: 3,
      create() {
        model = counter();
        return { ...model, step() { throw new Error("step failure"); }, dispose() { disposals += 1; throw new Error("cleanup failure"); } };
      }, measure: state => state.value });
    expect(model!.world.tick.value).toBe(0);
    expect(disposals).toBe(1);
    expect(result.outcomes[0]).toMatchObject({ status: "failed", error: { phase: "step", message: "step failure" }, cleanupError: { phase: "dispose" }, completedSteps: 0 });
    expect(result.outcomes[1]!.status).toBe("skipped");
  });

  test("adapter-stopped excludes incomplete count, tick and forced final read", () => {
    const instance = counter();
    let measures = 0;
    const result = experiments.run({ parameters: [{}], seeds: [1], steps: 10,
      create: () => instance,
      host: { advance(model) { model.value += 1; return model.value === 2 ? "stopped" : undefined; } },
      measure(model) { measures += 1; return model.value; },
    });
    expect(result.outcomes[0]).toMatchObject({ status: "stopped", reason: "adapter-stopped", completedSteps: 1 });
    expect(instance.world.tick.value).toBe(1);
    expect(instance.value).toBe(2);
    expect(measures).toBe(2);
  });

  test("thenable step effects remain without tick or forced partial-state sampling", () => {
    const instance = counter();
    let disposals = 0;
    const result = experiments.run({ parameters: [{}], seeds: [1], steps: 1,
      create: () => ({ ...instance, step() { this.value = 99; return Promise.resolve(); }, dispose() { disposals += 1; } }),
      measure: model => model.value });
    expect(result.outcomes[0]).toMatchObject({ status: "failed", completedSteps: 0, error: { phase: "step", name: "TypeError" } });
    expect(result.outcomes[0]!.samples).toEqual([{ step: 0, measurement: 0 }]);
    expect(instance.world.tick.value).toBe(0);
    expect(disposals).toBe(1);
  });

  test("preflight prevents allocations for invalid budgets, identities and async functions", () => {
    let creates = 0;
    const create = () => { creates += 1; return counter(); };
    expect(() => experiments.run({ parameters: [{}], seeds: [1], steps: 10, maxTotalSamples: 2, create, measure: state => state.value })).toThrow(RangeError);
    expect(() => experiments.run({ parameters: [{}], seeds: [1, 1], steps: 0, create, measure: state => state.value })).toThrow(RangeError);
    expect(() => experiments.run({ parameters: [{}], seeds: [1], steps: 0, create, measure: async () => 2 })).toThrow(TypeError);
    expect(creates).toBe(0);
  });

  test("clones cyclic settings, Map/Set observations and isolates hook effects", () => {
    const settings: { value: number; self?: unknown } = { value: 2 }; settings.self = settings;
    const result = experiments.run({ parameters: [settings], seeds: [1, 2], steps: 1,
      before(plan) { plan[0]!.parameters.value = 999; },
      create(parameters) { expect(parameters.value).toBe(2); parameters.value = 6; return counter(); },
      measure(model) { return { values: new Map([["count", model.value]]), tags: new Set(["heat"]) }; },
      after(study) { study.outcomes[0]!.samples[0]!.measurement.values.set("count", 999); },
    });
    expect(settings.value).toBe(2);
    expect(result.outcomes[0]!.samples[0]!.measurement.values.get("count")).toBe(0);
    expect(result.outcomes[1]!.run.parameters.self).toBe(result.outcomes[1]!.run.parameters);
  });

  test("before and after failures retain all identities and diagnostics", () => {
    let creates = 0; let afters = 0;
    const options = { parameters: [{}], seeds: [1, 2], steps: 0,
      create: () => { creates += 1; return counter(); }, measure: (model: ReturnType<typeof counter>) => model.value,
      after() { afters += 1; throw new Error("after"); },
    };
    const before = experiments.run({ ...options, before() { throw new Error("before"); } });
    expect(before.studyError?.phase).toBe("before");
    expect(before.outcomes.map(outcome => outcome.reason)).toEqual(["before-error", "before-error"]);
    expect(creates).toBe(0); expect(afters).toBe(0);
    const after = experiments.run(options);
    expect(after.studyError?.phase).toBe("after");
    expect(after.outcomes.map(outcome => outcome.status)).toEqual(["completed", "completed"]);
    expect(creates).toBe(2); expect(afters).toBe(1);
  });

  test("planning rejects framework references and summary selects only valid terminal runs", () => {
    expect(() => experiments.run({ parameters: [Agent.add({ value: 1 })], seeds: [1], steps: 0, create: counter, measure: () => 0 })).toThrow(TypeError);
    const result = experiments.run({ parameters: [{}], seeds: [1, 2, 3], steps: 1, onError: "continue",
      create(_parameters, seed) { return { ...counter(), step() { if (seed === 2) throw new Error("missing"); this.value = seed; } }; },
      measure: model => model.value });
    let selections = 0;
    const summary = experiments.summarize(result, outcome => { selections += 1; return outcome.samples.at(-1)?.measurement; });
    expect(selections).toBe(2);
    expect(summary[0]).toMatchObject({ requested: 3, completed: 2, failed: 1, valid: 2, missing: 1, mean: 2, sampleSd: Math.sqrt(2) });
  });
});
