import assert from "node:assert/strict";
import { model } from "../../../models/city-biodiversity/model.ts";

const state = model.create().read();
assert.equal(state.tick, 0);
assert.deepEqual(state.parameters, { initialOccupancy: 1, vegetationQuality: 0.5, dispersalRate: 1, extinctionRate: 0.25, permeability: 1, restorationPlan: "none" });
assert.deepEqual(state.patches.map(patch => [patch.id, patch.areaHa, patch.occupancy]), [
  ["west-core", 8, 1], ["west-north", 1.5, 1], ["west-south", 1.5, 1], ["bridge", 1, 0],
  ["east-a", 1.5, 0], ["east-b", 1.2, 0], ["east-c", 1, 0],
]);
assert.equal(Number(state.meanOccupancy.toFixed(4)), 0.4286);
assert.equal(state.eastOccupancy, 0);
assert.equal(state.history.length, 1);
console.log("city-biodiversity setup passed");
