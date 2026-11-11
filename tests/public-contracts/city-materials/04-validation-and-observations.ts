import assert from "node:assert/strict";
import { model } from "../../../models/city-materials/model.ts";

for (const options of [{ wasteGeneration: -1 }, { reuseFraction: 1.1 }, { pulseDays: 0.5 }, { collectionCapacity: NaN }]) assert.throws(() => model.create(options), RangeError);
assert.throws(() => model.create({ trucks: 3 } as never), TypeError);
const instance = model.create();
const snapshot = instance.read();
assert.throws(() => instance.setPolicy({ reuseFraction: 0.9, recyclingFraction: undefined }), TypeError);
assert.throws(() => instance.setPolicy({ recyclingFraction: 2 }), RangeError);
assert.throws(() => instance.setPolicy({ pulseExtraKg: 10 } as never), TypeError);
assert.throws(() => instance.setPolicy(Object.defineProperty({}, "collectionCapacity", { get: () => 10, enumerable: true })), TypeError);
for (const steps of [-1, 0.5, 1_000_001]) assert.throws(() => instance.advance(steps), RangeError);
assert.deepEqual(instance.read(), snapshot);
instance.setPolicy({});
assert.deepEqual(instance.read().parameters, snapshot.parameters);
try { (snapshot.flows as { generated: number }).generated = 5; } catch { /* Frozen is allowed. */ }
assert.equal(instance.read().flows.generated, 0);
const first = model.create();
const second = model.create();
first.advance(30);
for (let day = 0; day < 30; day += 1) second.advance();
assert.deepEqual(first.read(), second.read());
console.log("city-materials validation and observations passed");
