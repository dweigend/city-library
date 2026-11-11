import assert from "node:assert/strict";
import { model } from "../../../models/city-heat/model.ts";

const state = model.create().read();
assert.equal(state.tick, 0);
assert.deepEqual(state.parameters, { airTemperatureC: 26, initialTemperatureC: 22, solarFluxWm2: 800, shadeFraction: 0, waterAvailability: 0.5 });
assert.deepEqual(state.blocks.map(block => [block.label, block.sealedFraction, block.temperatureC, block.heatCapacityJm2K]),
  [["Sealed", 1, 22, 1_000_000], ["Mixed", 0.5, 22, 750_000], ["Planted", 0, 22, 500_000]]);
assert.equal(state.clockHour, 0);
assert.equal(state.irrigationWaterKg, 0);
assert.equal(state.balanceResidualJ, 0);
assert.equal(state.history.length, 1);
console.log("city-heat setup passed");
