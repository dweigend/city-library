import assert from "node:assert/strict";
import { model } from "../../../models/city-population/model.ts";

// Default city: integer deaths follow the expected total, not per-cohort flooring.
const instance = model.create();
instance.advance();
const first = instance.read();
assert.equal(first.birthCount, 12);
assert.equal(first.deathCount, 38);
assert.equal(first.netMigration, 10);
assert.equal(first.populationCount, 984);
assert.ok(Math.abs(first.mortalityRemainder - 0.25) < 1e-9);
assert.equal(first.cohorts[0]!.residentCount, 12);
assert.equal(first.cohorts[25]!.residentCount, 20);
assert.equal(first.cohorts[63]!.residentCount, 9); // Age 62 received a tied remainder death.
assert.equal(first.cohorts[62]!.residentCount, 10);
assert.equal(first.cohorts[100]!.residentCount, 9);
assert.equal(first.householdCount, 328);
instance.advance();
const second = instance.read();
assert.equal(second.birthCount, 12);
assert.equal(second.deathCount, 35);
assert.equal(second.populationCount, 971);
assert.ok(Math.abs(second.mortalityRemainder - 0.95) < 1e-9);
assert.ok(Math.abs(second.birthRemainder - 0.6) < 1e-9);
assert.equal(second.cohorts[100]!.residentCount, 16);
instance.advance();
assert.equal(instance.read().birthCount, 13);
assert.equal(instance.read().deathCount, 34);
assert.equal(instance.read().populationCount, 960);

// Small cohorts are no longer immortal: one resident per age, 10 % mortality everywhere.
const small = model.create({ initialPopulation: 100, birthRate: 0, deathRate: 0.1, elderlyDeathRate: 0.1, annualMigration: 0 });
const deaths: number[] = [];
for (let year = 1; year <= 30; year += 1) {
  small.advance();
  deaths.push(small.read().deathCount);
  if (year === 1) assert.ok(small.read().cohorts.slice(91, 101).every(cohort => cohort.residentCount === 0));
}
assert.deepEqual(deaths.slice(0, 3), [10, 9, 8]);
assert.equal(small.read().populationCount, 4);

for (let year = 0; year < 200; year += 1) {
  const previous = instance.read();
  instance.advance();
  const state = instance.read();
  assert.equal(state.populationCount, previous.populationCount + state.birthCount - state.deathCount + state.netMigration);
  assert.equal(state.populationCount, state.cohorts.reduce((sum, cohort) => sum + cohort.residentCount, 0));
  assert.equal(state.populationCount, state.ageBands.reduce((sum, band) => sum + band.residentCount, 0));
  assert.equal(state.populationCount, state.householdsBySize.reduce((sum, group) => sum + group.size * group.householdCount, 0));
  assert.ok(state.mortalityRemainder >= 0 && state.mortalityRemainder < 1);
  assert.ok(state.birthRemainder >= 0 && state.birthRemainder < 1);
  assert.equal(state.accountingError, 0);
}
console.log("city-population mortality and conservation passed");
