import assert from "node:assert/strict";
import { model } from "../../../models/city-population/model.ts";

// Experiment: one immigration pulse versus the same inflow spread over ten years.
const pulse = model.create();
const spread = model.create();
pulse.scheduleImmigrationPulse(100);
assert.equal(pulse.read().pendingImmigrationPulse, 100);
spread.setPolicy({ annualMigration: 20 });
const pulseBirths: number[] = [];
const spreadBirths: number[] = [];
for (let year = 1; year <= 17; year += 1) {
  if (year === 11) spread.setPolicy({ annualMigration: 10 });
  pulse.advance();
  spread.advance();
  pulseBirths.push(pulse.read().birthCount);
  spreadBirths.push(spread.read().birthCount);
  if (year === 1) {
    assert.equal(pulse.read().netMigration, 110);
    assert.equal(pulse.read().pendingImmigrationPulse, 0);
    assert.equal(pulse.read().populationCount, 1084);
    assert.equal(spread.read().populationCount, 994);
  }
  if (year === 10) assert.equal(pulse.read().cumulativeNetMigration, spread.read().cumulativeNetMigration);
}
assert.deepEqual(pulseBirths.slice(1, 9), [18, 19, 20, 21, 21, 21, 22, 23]);
assert.deepEqual(spreadBirths.slice(1, 9), [13, 14, 16, 17, 18, 19, 20, 22]);
assert.equal(pulseBirths[15], 26);
assert.equal(pulseBirths[16], 21);

// Bounded migration and household size.
const instance = model.create({ initialPopulation: 100, birthRate: 0, deathRate: 0, elderlyDeathRate: 0 });
instance.setPolicy({ annualMigration: -100, migrationLimit: 7, householdSize: 2 });
assert.equal(instance.read().householdCount, 34); // Setup still uses size 3 until next year.
instance.advance();
let state = instance.read();
assert.equal(state.netMigration, -7);
assert.equal(state.populationCount, 93);
assert.ok(state.cohorts.slice(94).every(cohort => cohort.residentCount === 0));
assert.equal(state.cohorts[93]!.residentCount, 1);
assert.equal(state.householdCount, 47);
assert.equal(state.formedHouseholdCount, 13);
instance.setPolicy({ migrationLimit: 1000 });
instance.advance();
assert.equal(instance.read().populationCount, 0);
assert.equal(instance.read().householdCount, 0);
instance.setPolicy({ annualMigration: 11, migrationLimit: 4 });
instance.advance();
state = instance.read();
assert.equal(state.populationCount, 4);
assert.equal(state.cohorts[25]!.residentCount, 4);
assert.equal(state.householdCount, 2);
console.log("city-population pulse and live policy passed");
