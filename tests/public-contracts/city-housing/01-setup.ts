import assert from "node:assert/strict";
import { model } from "../../../models/city-housing/model.ts";

const state = model.create().read();
assert.equal(state.tick, 0);
assert.deepEqual(state.parameters, {
  householdCount: 24, initialHomeCount: 18, maxHomeCount: 30, initialRent: 900, housingAllowance: 0,
  rentAdjustmentRate: 0.1, targetVacancyRate: 0.05, constructionRent: 1000, constructionLimit: 1,
});
assert.equal(state.rent, 900);
assert.equal(state.homeCount, 18);
assert.equal(state.pipelineCount, 0);
assert.equal(state.housedHouseholdCount, 14);
assert.equal(state.vacantHomeCount, 4);
assert.equal(state.searchingHouseholdCount, 10);
assert.equal(state.households[0]!.income, 1000);
assert.equal(state.households[23]!.income, 5600);
assert.deepEqual(state.households.map(household => household.incomeGroup).filter(group => group === "low").length, 8);
assert.equal(state.households[10]!.bid, 900);
assert.equal(state.households[23]!.homeId, "home-1"); // Highest bid moves in first.
assert.equal(state.households[10]!.homeId, "home-14");
assert.ok(state.households.slice(0, 10).every(household => household.status === "searching"));
assert.equal(state.housedByGroup.low, 0);
assert.equal(state.housedByGroup.middle, 6);
assert.equal(state.housedByGroup.high, 8);
assert.deepEqual(state.homes.slice(14).map(home => home.occupantId), [null, null, null, null]);
assert.equal(state.history.length, 1);
console.log("city-housing setup passed");
