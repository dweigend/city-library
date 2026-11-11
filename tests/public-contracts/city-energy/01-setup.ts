import assert from "node:assert/strict";
import { model } from "../../../models/city-energy/model.ts";

const state = model.create().read();
assert.equal(state.tick, 0);
assert.deepEqual(state.parameters, {
  solarCapacityKw: 12, windOutputKw: 2, batteryCapacityKwh: 8, initialBatteryKwh: 4, batteryPowerKw: 4,
  electricityNetworkCapacityKw: 5, heatNetworkCapacityKw: 3, demandScale: 1, flexibleShare: 0,
});
assert.equal(state.batteryKwh, 4);
assert.equal(state.intervalHour, null);
assert.equal(state.flow.electricityDemandKwh, 0);
assert.equal(state.today.unmetKwh, 0);
assert.equal(state.history.length, 1);
assert.equal(state.demandProfile.reduce((sum, hour) => sum + hour.electricityKwh, 0), 168);
console.log("city-energy setup passed");
