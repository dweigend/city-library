import assert from "node:assert/strict";
import { model } from "../../../models/city-stormwater/model.ts";

for (const options of [{ rainMmPerHour: -1 }, { infiltrationMmPerHour: 101 }, { retentionCapacityM3: 1001 }]) assert.throws(() => model.create(options), RangeError);
assert.throws(() => model.create({ stormPattern: "monsoon" as never }), RangeError);
assert.throws(() => model.create({ roofs: 3 } as never), TypeError);
const instance = model.create();
const snapshot = instance.read();
assert.throws(() => instance.setRain(undefined as never), TypeError);
assert.throws(() => instance.setInfiltration("5" as never), TypeError);
assert.throws(() => instance.setInfiltration(200), RangeError);
assert.throws(() => instance.setStormPattern(undefined as never), TypeError);
assert.throws(() => instance.setStormPattern("triple" as never), RangeError);
for (const steps of [-1, 0.5, 1_000_001]) assert.throws(() => instance.advance(steps), RangeError);
assert.deepEqual(instance.read(), snapshot);
try { (snapshot.plots[0] as { soilStorageMm: number }).soilStorageMm = 9; } catch { /* Frozen is allowed. */ }
assert.equal(instance.read().plots[0]!.soilStorageMm, 0);
const first = model.create({ stormPattern: "double" });
const second = model.create({ stormPattern: "double" });
first.advance(30);
for (let hour = 0; hour < 30; hour += 1) second.advance();
assert.deepEqual(first.read(), second.read());
console.log("city-stormwater validation and snapshots passed");
