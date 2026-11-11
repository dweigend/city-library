import assert from "node:assert/strict";
import { model } from "../../../models/city-stormwater/model.ts";

const state = model.create().read();
assert.equal(state.tick, 0);
assert.deepEqual(state.parameters, { rainMmPerHour: 10, infiltrationMmPerHour: 6, retentionCapacityM3: 60, outletM3PerHour: 4, stormPattern: "single" });
assert.equal(state.areaM2, 4000);
assert.equal(state.imperviousAreaM2, 2000);
assert.deepEqual(state.plots.map(plot => [plot.id, plot.imperviousShare, plot.soilStorageMm]), [["plot:sealed", 0.8, 0], ["plot:green", 0.2, 0]]);
assert.equal(state.storedM3, 0);
assert.equal(state.isRainingNextHour, true);
assert.equal(state.history.length, 1);
console.log("city-stormwater setup passed");
