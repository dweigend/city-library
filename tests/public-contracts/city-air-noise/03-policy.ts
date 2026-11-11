import assert from "node:assert/strict";
import { model } from "../../../models/city-air-noise/model.ts";

const rounded = (values: readonly number[], digits: number) => values.map(value => Number(value.toFixed(digits)));
function hour(changes: Parameters<ReturnType<typeof model.create>["setPolicy"]>[0]) {
  const instance = model.create();
  instance.setPolicy(changes);
  instance.advance(60);
  return instance.read();
}

// Experiment A: halve traffic. Air halves; noise falls only 3 dB.
const half = model.create();
half.setTraffic(300);
half.advance(60);
assert.equal(Number(half.read().meanConcentrationMicrogramsPerCubicMeter.toFixed(4)), 3.5634);
assert.equal(Number(half.read().receptors[1]!.noiseDecibels.toFixed(3)), 67.041);

// Experiment B: stronger ventilation lowers the hotspot but moves pollution downwind.
const vent = hour({ transportFraction: 0.8 });
assert.deepEqual(rounded(vent.receptors.map(receptor => receptor.concentrationMicrogramsPerCubicMeter), 4),
  [0, 1.7647, 10.0692, 14.1665, 9.9999, 7.0587, 4.9826, 3.5172]);
assert.equal(Number(vent.meanConcentrationMicrogramsPerCubicMeter.toFixed(4)), 6.4449);
assert.equal(vent.hotspotReceptorId, "receptor:3");
assert.equal(Number(vent.receptors[1]!.noiseDecibels.toFixed(3)), 70.047);

// Moving receptors away from the street changes noise, not air.
const far = hour({ receptorDistanceM: 40 });
assert.equal(Number(far.receptors[1]!.noiseDecibels.toFixed(3)), 58.581);
assert.equal(Number(far.meanConcentrationMicrogramsPerCubicMeter.toFixed(4)), 7.1268);
console.log("city-air-noise traffic, ventilation and distance experiments passed");
