import assert from "node:assert/strict";
import { studies } from "city-library";

const scenarios = studies.design({ defaults: { shade: 0, demand: 10 }, axes: [
  { name: "shade", values: [0, 1] }, { name: "demand", values: [10, 20] },
] });
assert.deepEqual(scenarios.map(scenario => scenario.parameters), [
  { shade: 0, demand: 10 }, { shade: 0, demand: 20 },
  { shade: 1, demand: 10 }, { shade: 1, demand: 20 },
]);
const plan = studies.replicate(scenarios, [11, 17]);
assert.equal(plan.length, 8);
assert.equal(plan[3]!.id, "run-1-1");
assert.equal(plan[3]!.scenarioId, "scenario-1");
assert.throws(() => studies.replicate(scenarios, [11, 11]), RangeError);
assert.throws(() => studies.design({ axes: [{ name: "x", values: [1, 2] }], maxScenarioCount: 1 }), RangeError);
