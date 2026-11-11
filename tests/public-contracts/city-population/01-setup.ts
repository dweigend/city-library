import assert from "node:assert/strict";
import { model } from "../../../models/city-population/model.ts";

const instance = model.create();
const state = instance.read();
assert.equal(state.tick, 0);
assert.deepEqual(state.parameters, {
  initialPopulation: 1000, birthRate: 0.06, deathRate: 0.005, elderlyDeathRate: 0.1,
  annualMigration: 10, migrationLimit: 20, householdSize: 3,
});
assert.equal(state.populationCount, 1000);
assert.equal(state.cohorts.length, 101);
assert.ok(state.cohorts.slice(0, 100).every(cohort => cohort.residentCount === 10));
assert.equal(state.cohorts[100]!.residentCount, 0);
assert.equal(state.ageBands.length, 21);
assert.deepEqual(state.ageBands[0], { label: "0–4", fromAge: 0, residentCount: 50 });
assert.deepEqual(state.ageBands[20], { label: "100+", fromAge: 100, residentCount: 0 });
assert.ok(state.ageBands.slice(0, 20).every(band => band.residentCount === 50));
assert.equal(state.elderlyShare, 0.35);
assert.equal(state.householdCount, 334);
assert.equal(state.householdsBySize.find(group => group.size === 3)!.householdCount, 333);
assert.equal(state.householdsBySize.find(group => group.size === 1)!.householdCount, 1);
assert.equal(state.birthCount, 0);
assert.equal(state.deathCount, 0);
assert.equal(state.netMigration, 0);
assert.equal(state.birthRemainder, 0);
assert.equal(state.mortalityRemainder, 0);
assert.equal(state.pendingImmigrationPulse, 0);
assert.equal(state.accountingError, 0);
assert.equal(state.history.length, 1);
console.log("city-population setup passed");
