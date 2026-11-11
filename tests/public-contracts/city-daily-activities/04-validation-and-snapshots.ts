import assert from "node:assert/strict";
import { model } from "../../../models/city-daily-activities/model.ts";

for (const options of [{ householdCount: 0 }, { householdCount: 1.5 }, { servicesCloseHour: 15 }, { servicesCloseHour: 18.1 }]) {
  assert.throws(() => model.create(options), RangeError);
}
assert.throws(() => model.create({ remoteWork: "yes" as never }), TypeError);
assert.throws(() => model.create({ servicesLocation: "online" as never }), RangeError);
const instance = model.create();
const snapshot = instance.read();
assert.throws(() => instance.setRemoteWork(undefined as never), TypeError);
assert.throws(() => instance.setRemoteWork(1 as never), TypeError);
assert.throws(() => instance.setServicePolicy({ servicesCloseHour: 23 }), RangeError);
assert.throws(() => instance.setServicePolicy({ servicesLocation: "local", servicesCloseHour: undefined }), TypeError);
assert.throws(() => instance.setServicePolicy({ householdCount: 3 } as never), TypeError);
for (const steps of [-1, 0.5, 1_000_001]) assert.throws(() => instance.advance(steps), RangeError);
assert.deepEqual(instance.read(), snapshot);
instance.setServicePolicy({});
assert.deepEqual(instance.read().parameters, snapshot.parameters);
try { (snapshot.residents[0] as { activity: string }).activity = "work"; } catch { /* Frozen is allowed. */ }
try { (snapshot.personHours as { travel: number }).travel = 99; } catch { /* Frozen is allowed. */ }
assert.equal(instance.read().residents[0]!.activity, "home");
assert.equal(instance.read().personHours.travel, 0);
const first = model.create({ householdCount: 9 });
const second = model.create({ householdCount: 9 });
first.advance(150);
for (let index = 0; index < 150; index += 1) second.advance();
assert.deepEqual(first.read(), second.read());
assert.ok(first.read().history.length <= 193);
console.log("city-daily-activities validation and snapshots passed");
