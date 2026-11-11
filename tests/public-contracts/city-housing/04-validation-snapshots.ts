import assert from "node:assert/strict";
import { model } from "../../../models/city-housing/model.ts";

for (const options of [{ householdCount: 0 }, { initialRent: 50 }, { housingAllowance: -1 }, { maxHomeCount: 2, initialHomeCount: 3 }]) {
  assert.throws(() => model.create(options), RangeError);
}
assert.throws(() => model.create({ landlords: 2 } as never), TypeError);
const instance = model.create();
const snapshot = instance.read();
assert.throws(() => instance.setHousingAllowance(undefined as never), TypeError);
assert.throws(() => instance.setHousingAllowance("100" as never), TypeError);
assert.throws(() => instance.setHousingAllowance(5001), RangeError);
assert.throws(() => instance.commissionHomes(undefined as never), TypeError);
for (const count of [0, 1.5, 11, NaN]) assert.throws(() => instance.commissionHomes(count), RangeError);
instance.commissionHomes(10);
assert.throws(() => instance.commissionHomes(3), RangeError); // 18 + 10 + 3 > 30
for (const steps of [-1, 0.5, 1_000_001]) assert.throws(() => instance.advance(steps), RangeError);
assert.equal(instance.read().pipelineCount, 10);
assert.equal(instance.read().parameters.housingAllowance, 0);
try { (snapshot.households[0] as { homeId: string | null }).homeId = "home-1"; } catch { /* Frozen is allowed. */ }
assert.equal(model.create().read().households[0]!.homeId, null);
assert.equal(snapshot.pipelineCount, 0);
const first = model.create();
const second = model.create();
first.setHousingAllowance(250);
second.setHousingAllowance(250);
first.advance(30);
for (let month = 0; month < 30; month += 1) second.advance();
assert.deepEqual(first.read(), second.read());
console.log("city-housing validation and snapshots passed");
