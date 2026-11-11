import assert from "node:assert/strict";
import { model } from "../../../models/city-services/model.ts";

for (const options of [{ capacityPerKind: -1 }, { capacityPerKind: 25 }, { capacityPerKind: 1.5 }, { maxDistanceKm: 11 }]) {
  assert.throws(() => model.create(options), RangeError);
}
assert.throws(() => model.create({ layout: "ring" as never }), RangeError);
assert.throws(() => model.create({ hubs: 2 } as never), TypeError);
const instance = model.create();
const snapshot = instance.read();
assert.throws(() => instance.setMaxDistanceKm(undefined as never), TypeError);
assert.throws(() => instance.setPolicy({ layout: "distributed", capacityPerKind: undefined }), TypeError);
assert.throws(() => instance.setPolicy({ layout: "distributed", capacityPerKind: 30 }), RangeError);
assert.throws(() => instance.setPolicy({ households: 3 } as never), TypeError);
for (const steps of [-1, 0.5, 1_000_001]) assert.throws(() => instance.advance(steps), RangeError);
assert.deepEqual(instance.read(), snapshot);
instance.advance();
const day = instance.read();
try { (day.requests[0] as { status: string }).status = "served"; } catch { /* Frozen is allowed. */ }
try { (day.facilities[0] as { used: number }).used = 0; } catch { /* Frozen is allowed. */ }
assert.equal(instance.read().facilities[0]!.used, 8);
const first = model.create({ layout: "distributed" });
const second = model.create({ layout: "distributed" });
first.advance(12);
for (let day = 0; day < 12; day += 1) second.advance();
assert.deepEqual(first.read(), second.read());
console.log("city-services validation and snapshots passed");
