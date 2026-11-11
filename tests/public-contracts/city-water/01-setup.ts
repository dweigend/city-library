import assert from "node:assert/strict";
import { model } from "../../../models/city-water/model.ts";

const state = model.create().read();
assert.equal(state.tick, 0);
assert.deepEqual(state.parameters, {
  reservoirCapacityM3: 10000, initialStoredM3: 8000, inflowM3PerDay: 220, dryInflowM3PerDay: 40,
  drySpellStartDay: 20, drySpellDays: 60, demandM3PerDay: 200, conservationTrigger: 1, conservationShare: 0,
  wastewaterShare: 0.8, treatmentCapacityM3PerDay: 120,
});
assert.equal(state.storedM3, 8000);
assert.equal(state.suppliedM3, 0);
assert.equal(state.isDrySpellTomorrow, false);
assert.equal(state.balanceErrorM3, 0);
assert.equal(state.history.length, 1);
console.log("city-water setup passed");
