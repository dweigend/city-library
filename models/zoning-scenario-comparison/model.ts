/** Original synthetic zoning-cap comparison. No planning-compliance or housing-demand claim. */
import { Random, World, run, studies, measurements } from "city-library";
import type { StudyOutcome } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";

export interface ZoningParameters {
  parcelCount: number;
  baseCap: number;
  seed: number;
}

export const inputs: Inputs<ZoningParameters> = {
  parcelCount: { kind: "number", default: 12, min: 1, max: 100, integer: true },
  baseCap: { kind: "number", default: 2, min: 1, max: 10, integer: true },
  seed: { kind: "number", default: 1, min: -2147483648, max: 4294967293, integer: true },
};

export const capacityMeasurement = measurements.define((state: { slotCount: number; evaluatedParcelCount: number }) => ({
  slotCount: state.slotCount,
  evaluatedParcelCount: state.evaluatedParcelCount,
}));

export function create(options: Partial<ZoningParameters> = {}) {
  const settings = parseParameters(inputs, options);
  const world = World.create();
  const scenarios = studies.design({
    defaults: { cap: settings.baseCap, parcelCount: settings.parcelCount },
    axes: [{ name: "cap", values: [settings.baseCap, settings.baseCap + 2] }],
  });
  const plan = studies.replicate(scenarios, [settings.seed, settings.seed + 1, settings.seed + 2]);
  const completed: StudyOutcome<{ cap: number; parcelCount: number }, { slotCount: number; evaluatedParcelCount: number }>[] = [];

  function createReplication(parameters: { cap: number; parcelCount: number }, seed: number) {
    const random = Random.create({ seed });
    const state = { slotCount: 0, evaluatedParcelCount: 0 };
    return {
      world: World.create({ random }),
      state,
      step() {
        state.slotCount += random.number() < 0.8 ? parameters.cap : 0;
        state.evaluatedParcelCount += 1;
      },
    };
  }

  // One outer step completes one independent replication, not one parcel.
  function step() {
    const planned = plan[completed.length];
    if (!planned) return;
    const result = studies.run({
      plan: [planned],
      stepCount: settings.parcelCount,
      create: createReplication,
      measure: instance => capacityMeasurement.read(instance.state),
      stopWhen: instance => instance.state.evaluatedParcelCount === settings.parcelCount,
      maxTotalStepCount: settings.parcelCount,
      maxTotalSampleCount: settings.parcelCount + 1,
    });
    // A nonempty one-run plan always returns its outcome, including failures.
    completed.push(result.outcomes[0]!);
  }

  return {
    advance(stepCount = 1) {
      validateStepCount(stepCount);
      for (let index = 0; index < stepCount && completed.length < plan.length; index += 1) {
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
        slotCount: outcome.samples.at(-1)!.measurement.slotCount,
        reason: outcome.reason,
      }));
      // Summaries aggregate independent terminal outcomes, never pool time samples.
      const summaries = studies.summarize(
        { version: 1, provenance: {}, outcomes: completed },
        entry => entry.samples.at(-1)?.measurement.slotCount,
      ).map(summary => Object.freeze({
        scenario: summary.scenarioId,
        replicationCount: summary.validRunCount,
        mean: summary.mean ?? "none",
        sampleStandardDeviation: summary.sampleStandardDeviation ?? "none",
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
        plannedRunCount: plan.length,
        completedRunCount: completed.length,
        outcomes: Object.freeze(outcomes),
        summaries: Object.freeze(summaries),
        done: completed.length === plan.length,
      });
    },
  };
}

export const model = {
  title: "Zoning Scenario Comparison",
  description: "Compare two density caps on synthetic parcels by the housing slots they allow. Illustrative only.",
  inputs,
  create,
} satisfies Definition<ZoningParameters, ReturnType<typeof create>>;
