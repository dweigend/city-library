import assert from "node:assert/strict";
import { model } from "../../../models/city-biodiversity/model.ts";

const r = (value: number) => Number(value.toFixed(4));
const instance = model.create();
instance.advance();
assert.equal(r(instance.read().meanOccupancy), 0.4093);
assert.equal(r(instance.read().eastOccupancy), 0.0226);
assert.ok(instance.read().patches.find(patch => patch.id === "bridge")!.colonizationGain > 0);
instance.advance(9);
assert.equal(r(instance.read().meanOccupancy), 0.4864);
assert.equal(r(instance.read().eastOccupancy), 0.2704);
instance.advance(40);
const state = instance.read();
assert.equal(r(state.meanOccupancy), 0.5278);
assert.equal(r(state.eastOccupancy), 0.3678);
assert.ok(state.patches.every(patch => patch.occupancy >= 0 && patch.occupancy <= 1));
assert.equal(state.history.length, 51);
console.log("city-biodiversity occupancy recurrence passed");
