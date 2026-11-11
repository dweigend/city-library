import assert from "node:assert/strict";
import { model } from "../../../models/city-stormwater/model.ts";

const close = (actual: number, expected: number) => assert.ok(Math.abs(actual - expected) < 1e-4, `${actual} != ${expected}`);
function day(options: Parameters<typeof model.create>[0], pattern: "single" | "double", infiltration?: number) {
  const instance = model.create(options);
  instance.setStormPattern(pattern);
  if (infiltration !== undefined) instance.setInfiltration(infiltration);
  instance.advance(24);
  return instance.read();
}

// Experiment A: a second storm before recovery.
const double = day({}, "double");
close(double.overflowM3, 88.0183);
close(double.storedM3, 8);

// Experiment B: infiltration versus retention, for one and two storms.
close(day({}, "single", 12).overflowM3, 8.32);
close(day({}, "double", 12).overflowM3, 78.1645);
assert.equal(day({ retentionCapacityM3: 90 }, "single").overflowM3, 0);
close(day({ retentionCapacityM3: 90 }, "double").overflowM3, 58.0183);

// Rain intensity is live; zero rain produces no runoff.
const dry = model.create();
dry.setRain(0);
dry.advance(24);
assert.equal(dry.read().runoffM3, 0);
console.log("city-stormwater storm spacing, infiltration and retention passed");
