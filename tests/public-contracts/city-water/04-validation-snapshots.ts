import assert from "node:assert/strict";
import { model } from "../../../models/city-water/model.ts";

assert.throws(() => model.create({ initialStoredM3: 20000 }), RangeError);
for (const options of [{ conservationShare: 0.7 }, { conservationTrigger: 1.1 }, { drySpellDays: 1.5 }, { demandM3PerDay: -1 }]) {
  assert.throws(() => model.create(options), RangeError);
}
assert.throws(() => model.create({ pipes: 2 } as never), TypeError);
const instance = model.create();
const snapshot = instance.read();
assert.throws(() => instance.setConservationShare(undefined as never), TypeError);
assert.throws(() => instance.setConservationRule({ conservationTrigger: 0.5, conservationShare: undefined }), TypeError);
assert.throws(() => instance.setConservationRule({ conservationTrigger: 0.5, conservationShare: 0.9 }), RangeError);
assert.throws(() => instance.setConservationRule({ demandM3PerDay: 1 } as never), TypeError);
assert.throws(() => instance.setTreatmentCapacity("120" as never), TypeError);
assert.throws(() => instance.setInflow(-5), RangeError);
for (const steps of [-1, 0.5, 1_000_001]) assert.throws(() => instance.advance(steps), RangeError);
assert.deepEqual(instance.read(), snapshot);
try { (snapshot as { storedM3: number }).storedM3 = 1; } catch { /* Frozen is allowed. */ }
assert.equal(instance.read().storedM3, 8000);
const first = model.create();
const second = model.create();
first.advance(90);
for (let day = 0; day < 90; day += 1) second.advance();
assert.deepEqual(first.read(), second.read());
console.log("city-water validation and snapshots passed");
