import assert from "node:assert/strict";
import { model } from "../../../models/city-housing/model.ts";

const close = (actual: number, expected: number) => assert.ok(Math.abs(actual - expected) < 1e-6, `${actual} != ${expected}`);
const instance = model.create();
instance.advance();
let state = instance.read();
assert.equal(state.rent, 884.5); // 900 × (1 + 0.1 × (0.05 − 4/18))
assert.equal(state.housedHouseholdCount, 14);
assert.equal(state.displacedThisStepCount, 0);
assert.equal(state.startedThisStepCount, 0);
instance.advance(11);
state = instance.read();
close(state.rent, 768.644912);
assert.equal(state.housedHouseholdCount, 16);
instance.advance(12);
state = instance.read();
close(state.rent, 718.125925);
assert.equal(state.housedHouseholdCount, 17);
assert.equal(state.housedByGroup.low, 1);
for (const sample of state.history) {
  assert.equal(sample.values.housedHouseholdCount! + sample.values.searchingHouseholdCount!, 24);
  assert.equal(sample.values.housedHouseholdCount! + sample.values.vacantHomeCount!, sample.values.homeCount!);
}
console.log("city-housing monthly rent adjustment passed");
