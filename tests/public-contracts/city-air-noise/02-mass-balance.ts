import assert from "node:assert/strict";
import { model } from "../../../models/city-air-noise/model.ts";

const rounded = (values: readonly number[], digits: number) => values.map(value => Number(value.toFixed(digits)));
const instance = model.create();
instance.advance();
assert.equal(instance.read().emittedMassMicrograms, 20000);
instance.advance(59);
const state = instance.read();
assert.deepEqual(rounded(state.receptors.map(receptor => receptor.concentrationMicrogramsPerCubicMeter), 4),
  [0, 6, 15.6, 15.36, 9.216, 5.5296, 3.3178, 1.9907]);
assert.equal(Number(state.meanConcentrationMicrogramsPerCubicMeter.toFixed(4)), 7.1268);
assert.equal(state.hotspotReceptorId, "receptor:2");
assert.deepEqual(rounded(state.receptors.map(receptor => receptor.noiseDecibels), 3), [51.269, 70.047, 70.047, 51.269, 46.631, 44.369, 43.063, 42.247]);
const balance = state.emittedMassMicrograms - state.retainedMassMicrograms - state.decayedMassMicrograms - state.exitedMassMicrograms;
assert.ok(Math.abs(balance) < 1e-6 * state.emittedMassMicrograms);
assert.ok(state.receptors[2]!.concentrationExposureMicrogramMinutesPerCubicMeter > state.receptors[7]!.concentrationExposureMicrogramMinutesPerCubicMeter);
console.log("city-air-noise corridor balance passed");
