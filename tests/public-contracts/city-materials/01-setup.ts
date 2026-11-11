import assert from "node:assert/strict";
import { model } from "../../../models/city-materials/model.ts";

const state = model.create().read();
assert.equal(state.tick, 0);
assert.deepEqual(state.parameters, {
  wasteGeneration: 100, collectionCapacity: 120, reuseFraction: 0.1, recyclingFraction: 0.4,
  initialUncollected: 0, pulseExtraKg: 150, pulseStartDay: 10, pulseDays: 5,
});
assert.equal(state.uncollected, 0);
assert.deepEqual(state.flows, { generated: 0, collected: 0, reused: 0, recycled: 0, disposed: 0 });
assert.equal(state.peakBacklog, 0);
assert.equal(state.clearedDay, null);
assert.equal(state.isPulseTomorrow, false);
assert.equal(state.history.length, 1);
console.log("city-materials setup passed");
