import assert from "node:assert/strict";
import { model } from "../../../models/city-mobility/model.ts";

for (const options of [{ initialTrips: -1 }, { initialTrips: 1001 }, { carCapacity: 0 }, { carPenalty: 11 }, { walkMinutes: 7 }, { departuresPerMinute: 11 }]) {
  assert.throws(() => model.create(options), RangeError);
}
assert.throws(() => model.create({ lanes: 2 } as never), TypeError);
const instance = model.create();
const snapshot = instance.read();
assert.throws(() => instance.setCarPenalty(undefined as never), TypeError);
assert.throws(() => instance.setCarPenalty(20), RangeError);
assert.throws(() => instance.setPolicy({ carCapacity: 8, walkMinutes: undefined }), TypeError);
assert.throws(() => instance.setPolicy({ carCapacity: 8, walkMinutes: 40 }), RangeError);
assert.throws(() => instance.setPolicy({ initialTrips: 4 } as never), TypeError);
for (const count of [0, 1.5, 1001]) assert.throws(() => instance.dispatchTrips(count), RangeError);
assert.throws(() => instance.dispatchTrips(undefined as never), TypeError);
for (const steps of [-1, 0.5, 1_000_001]) assert.throws(() => instance.advance(steps), RangeError);
assert.deepEqual(instance.read(), snapshot);
assert.equal(instance.read().links[0]!.capacity, 5);
for (let index = 0; index < 5; index += 1) instance.dispatchTrips(1000);
assert.throws(() => instance.dispatchTrips(1), RangeError);
instance.advance();
assert.equal(instance.read().unservedDepartureCount, 3);
const first = model.create({ initialTrips: 7 });
const second = model.create({ initialTrips: 7 });
first.advance(70);
for (let minute = 0; minute < 70; minute += 1) second.advance();
assert.deepEqual(first.read(), second.read());
try { (snapshot.links[0] as { used: number }).used = 99; } catch { /* Frozen is allowed. */ }
assert.equal(model.create().read().links[0]!.used, 0);
console.log("city-mobility validation and snapshots passed");
