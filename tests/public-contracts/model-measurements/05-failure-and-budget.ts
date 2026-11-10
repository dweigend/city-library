import assert from "node:assert/strict";
import { studies, World } from "city-library";

let creates = 0;
let disposals = 0;
const create = () => {
  creates += 1;
  return { world: World.create(), step() { throw new Error("rule failed"); }, dispose() { disposals += 1; } };
};
assert.throws(() => studies.run({ parameters: [{}], seeds: [1], stepCount: 10, maxTotalStepCount: 9, create, measure: () => ({ value: 0 }) }), RangeError);
assert.equal(creates, 0);
const result = studies.run({ parameters: [{}], seeds: [1, 2], stepCount: 3, create, measure: () => ({ value: 0 }) });
assert.deepEqual(result.outcomes.map(outcome => [outcome.status, outcome.completedStepCount]), [["failed", 0], ["skipped", 0]]);
assert.equal(result.outcomes[0]!.status === "failed" && result.outcomes[0]!.error.phase, "step");
assert.equal(creates, 1);
assert.equal(disposals, 1);
