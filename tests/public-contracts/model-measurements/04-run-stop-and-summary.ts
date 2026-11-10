import assert from "node:assert/strict";
import { studies, World } from "city-library";

const result = studies.run({
  parameters: [{ cooling: 2 }], seeds: [11, 17], stepCount: 10, sampleIntervalSteps: 2,
  create: ({ cooling }) => {
    const world = World.create();
    return { world, temperature: 24, step() { this.temperature -= cooling; } };
  },
  measure: model => ({ temperature: model.temperature, tick: model.world.tick.value }),
  stopWhen: model => model.temperature <= 18,
});
assert.deepEqual(result.outcomes.map(outcome => [outcome.status, outcome.reason, outcome.completedStepCount]), [
  ["stopped", "stop-condition", 3], ["stopped", "stop-condition", 3],
]);
assert.deepEqual(result.outcomes[0]!.samples.map(sample => sample.step), [0, 2, 3]);
const summary = studies.summarize(result, outcome => outcome.samples.at(-1)?.measurement.temperature);
assert.equal(summary[0]!.mean, 18);
assert.equal(summary[0]!.sampleStandardDeviation, 0);
assert.equal(summary[0]!.stoppedRunCount, 2);
