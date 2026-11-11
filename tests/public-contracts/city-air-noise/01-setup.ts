import assert from "node:assert/strict";
import { model } from "../../../models/city-air-noise/model.ts";

const state = model.create().read();
assert.equal(state.tick, 0);
assert.deepEqual(state.parameters, { trafficVehiclesPerHour: 600, transportFraction: 0.5, decayFraction: 0.25, receptorDistanceM: 10 });
assert.equal(state.receptors.length, 8);
assert.deepEqual(state.receptors.map(receptor => receptor.xMeters), [50, 150, 250, 350, 450, 550, 650, 750]);
assert.deepEqual(state.streetBoxIndexes, [1, 2]);
assert.equal(state.emissionMicrogramsPerMinute, 20000);
assert.ok(state.receptors.every(receptor => receptor.concentrationMicrogramsPerCubicMeter === 0));
assert.equal(Number(state.receptors[1]!.noiseDecibels.toFixed(3)), 70.047);
assert.equal(state.history.length, 1);
console.log("city-air-noise setup passed");
