import assert from "node:assert/strict";
import { model } from "../../../models/city-heat/model.ts";

function dayAndNight(shadeFraction: number, waterAvailability: number) {
  const instance = model.create();
  instance.setPolicy({ shadeFraction, waterAvailability });
  instance.advance(28);
  const night = instance.read().blocks.map(block => Number(block.temperatureC.toFixed(2)));
  instance.advance(12);
  const day = instance.read().blocks.map(block => Number(block.temperatureC.toFixed(2)));
  instance.advance(8);
  return { day, night, waterKg: instance.read().irrigationWaterKg };
}

// Experiment A: shade lowers day and night temperatures on every surface.
const shade = dayAndNight(0.4, 0.5);
assert.deepEqual(shade.day, [35.39, 33.85, 32.11]);
assert.deepEqual(shade.night, [28.11, 26.74, 24.86]);

// Experiment B: water cools vegetation mainly by day, and costs water.
const watered = dayAndNight(0, 1);
assert.equal(watered.day[2], 33.41);
assert.equal(watered.night[2], 25.08);
assert.ok(Math.abs(watered.waterKg - 1013.17) < 0.01);
const restricted = dayAndNight(0, 0);
assert.equal(restricted.day[2], 42.74);
assert.ok(restricted.day[2]! > restricted.day[0]!);
assert.equal(restricted.night[2], 26.7);
assert.ok(restricted.night[2]! < restricted.night[0]!);
assert.equal(restricted.waterKg, 0);
console.log("city-heat shade and water experiments passed");
