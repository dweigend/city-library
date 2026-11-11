import assert from "node:assert/strict";
import { model } from "../../../models/city-air-noise/model.ts";

for (const options of [{ trafficVehiclesPerHour: -1 }, { transportFraction: 1.5 }, { decayFraction: NaN }, { receptorDistanceM: 4 }]) {
  assert.throws(() => model.create(options), RangeError);
}
assert.throws(() => model.create({ buses: 3 } as never), TypeError);
const instance = model.create();
const snapshot = instance.read();
assert.throws(() => instance.setTraffic(undefined as never), TypeError);
assert.throws(() => instance.setTraffic(7000), RangeError);
assert.throws(() => instance.setPolicy({ transportFraction: 0.7, receptorDistanceM: undefined }), TypeError);
assert.throws(() => instance.setPolicy({ decayFraction: 0.1 } as never), TypeError);
for (const steps of [-1, 0.5, 1_000_001]) assert.throws(() => instance.advance(steps), RangeError);
assert.deepEqual(instance.read(), snapshot);
try { (snapshot.receptors[0] as { noiseDecibels: number }).noiseDecibels = 0; } catch { /* Frozen is allowed. */ }
assert.ok(instance.read().receptors[0]!.noiseDecibels > 50);
const first = model.create({ trafficVehiclesPerHour: 1200 });
const second = model.create({ trafficVehiclesPerHour: 1200 });
first.advance(45);
for (let minute = 0; minute < 45; minute += 1) second.advance();
assert.deepEqual(first.read(), second.read());
console.log("city-air-noise validation and snapshots passed");
