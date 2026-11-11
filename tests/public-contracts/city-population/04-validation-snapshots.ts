import assert from "node:assert/strict";
import { model } from "../../../models/city-population/model.ts";

for (const options of [{ initialPopulation: -1 }, { birthRate: NaN }, { deathRate: 1.1 }, { elderlyDeathRate: -0.1 }, { householdSize: 1.5 }, { migrationLimit: -1 }]) {
  assert.throws(() => model.create(options), RangeError);
}
assert.throws(() => model.create({ unknown: 1 } as never), TypeError);
const first = model.create();
const second = model.create();
const snapshot = first.read();
for (const steps of [-1, 1.5, Infinity, 1_000_001]) assert.throws(() => first.advance(steps), RangeError);
// Live changes are atomic: a failing key leaves every value unchanged.
assert.throws(() => first.setPolicy({ annualMigration: 20, householdSize: 0 }), RangeError);
assert.throws(() => first.setPolicy({ annualMigration: 20, deathRate: undefined }), TypeError);
assert.throws(() => first.setPolicy({ initialPopulation: 20 } as never), TypeError);
assert.throws(() => first.scheduleImmigrationPulse(undefined as never), TypeError);
assert.throws(() => first.scheduleImmigrationPulse("5" as never), TypeError);
for (const count of [0, 1.5, 1001, NaN]) assert.throws(() => first.scheduleImmigrationPulse(count), RangeError);
assert.deepEqual(first.read(), snapshot);
first.setPolicy({});
assert.deepEqual(first.read().parameters, snapshot.parameters);
for (let index = 0; index < 10; index += 1) first.scheduleImmigrationPulse(1000);
assert.throws(() => first.scheduleImmigrationPulse(1), RangeError);
assert.equal(first.read().pendingImmigrationPulse, 10_000);
const fresh = model.create();
try { (snapshot.cohorts[0] as { residentCount: number }).residentCount = 999; } catch { /* Frozen is allowed. */ }
try { (snapshot.parameters as { birthRate: number }).birthRate = 1; } catch { /* Frozen is allowed. */ }
assert.equal(fresh.read().cohorts[0]!.residentCount, 10);
assert.equal(snapshot.cohorts[0]!.residentCount, 10);
fresh.advance(20);
for (let year = 0; year < 20; year += 1) second.advance();
assert.deepEqual(fresh.read(), second.read());
assert.equal(snapshot.tick, 0);
const before = fresh.read();
fresh.advance(0);
assert.deepEqual(fresh.read(), before);
console.log("city-population validation and independent snapshots passed");
