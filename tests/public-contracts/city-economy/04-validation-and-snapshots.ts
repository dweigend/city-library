import assert from "node:assert/strict";
import { model } from "../../../models/city-economy/model.ts";

for (const options of [{ householdCount: 0 }, { firmCount: 11 }, { spendingFraction: 0.45 }, { externalDemand: -1 }, { hiringLimit: 0 }]) {
  assert.throws(() => model.create(options), RangeError);
}
assert.throws(() => model.create({ banks: 1 } as never), TypeError);
const instance = model.create();
const snapshot = instance.read();
assert.throws(() => instance.setExternalDemand(undefined as never), TypeError);
assert.throws(() => instance.setExternalDemand("90" as never), TypeError);
assert.throws(() => instance.setExternalDemand(1001), RangeError);
assert.throws(() => instance.setHiringLimit(undefined as never), TypeError);
assert.throws(() => instance.setHiringLimit(1.5), RangeError);
for (const steps of [-1, 0.5, 1_000_001]) assert.throws(() => instance.advance(steps), RangeError);
assert.deepEqual(instance.read(), snapshot);
try { (snapshot.households[0] as { employerId: string | null }).employerId = null; } catch { /* Frozen is allowed. */ }
assert.equal(instance.read().households[0]!.employerId, "firm:1");
const first = model.create({ externalDemand: 40 });
const second = model.create({ externalDemand: 40 });
first.advance(30);
for (let month = 0; month < 30; month += 1) second.advance();
assert.deepEqual(first.read(), second.read());
console.log("city-economy validation and snapshots passed");
