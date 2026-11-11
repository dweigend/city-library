import assert from "node:assert/strict";
import { model } from "../../../models/city-heat/model.ts";

for (const options of [{ shadeFraction: 1.1 }, { waterAvailability: -0.1 }, { solarFluxWm2: 1300 }, { airTemperatureC: 50 }]) assert.throws(() => model.create(options), RangeError);
assert.throws(() => model.create({ wind: 3 } as never), TypeError);
const instance = model.create();
const snapshot = instance.read();
assert.throws(() => instance.setPolicy({ shadeFraction: 0.2, waterAvailability: undefined }), TypeError);
assert.throws(() => instance.setPolicy({ shadeFraction: 2 }), RangeError);
assert.throws(() => instance.setPolicy({ solarFluxWm2: 10 } as never), TypeError);
assert.throws(() => instance.setPolicy(Object.defineProperty({}, "shadeFraction", { get: () => 0.5, enumerable: true })), TypeError);
for (const steps of [-1, 0.5, 1_000_001]) assert.throws(() => instance.advance(steps), RangeError);
assert.deepEqual(instance.read(), snapshot);
instance.setPolicy({});
assert.deepEqual(instance.read().parameters, snapshot.parameters);
try { (snapshot.blocks[0] as { temperatureC: number }).temperatureC = 99; } catch { /* Frozen is allowed. */ }
assert.equal(instance.read().blocks[0]!.temperatureC, 22);
const first = model.create({ solarFluxWm2: 1000 });
const second = model.create({ solarFluxWm2: 1000 });
first.advance(30);
for (let hour = 0; hour < 30; hour += 1) second.advance();
assert.deepEqual(first.read(), second.read());
console.log("city-heat validation and isolation passed");
