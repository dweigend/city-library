import assert from "node:assert/strict";
import { model } from "../../../models/city-housing/model.ts";

const close = (actual: number, expected: number) => assert.ok(Math.abs(actual - expected) < 1e-6, `${actual} != ${expected}`);

// Experiment A: a targeted allowance without new supply, then its withdrawal.
const allowance = model.create();
allowance.setHousingAllowance(400);
allowance.advance();
assert.equal(allowance.read().housedHouseholdCount, 18);
assert.equal(allowance.read().housedByGroup.low, 4);
assert.ok(allowance.read().households.filter(household => household.incomeGroup === "low").every(household => household.receivesAllowance));
allowance.advance(5);
close(allowance.read().rent, 901.821827);
assert.equal(allowance.read().housedByGroup.middle, 5);
assert.equal(allowance.read().displacedHouseholdCount, 1);
assert.equal(allowance.read().households[10]!.status, "displaced");
allowance.advance(18);
close(allowance.read().rent, 902.799683);
allowance.advance(12);
allowance.setHousingAllowance(0);
allowance.advance();
assert.equal(allowance.read().displacedThisStepCount, 4);
assert.equal(allowance.read().housedByGroup.low, 0);

// Experiment B: the same city adds six public homes instead.
const supply = model.create();
supply.commissionHomes(6);
assert.equal(supply.read().pipelineCount, 6);
supply.advance(2);
assert.equal(supply.read().homeCount, 18);
supply.advance();
assert.equal(supply.read().homeCount, 24);
assert.equal(supply.read().pipelineCount, 0);
supply.advance(21);
close(supply.read().rent, 529.307668);
assert.equal(supply.read().housedHouseholdCount, 20);
assert.equal(supply.read().housedByGroup.low, 4);
assert.equal(supply.read().displacedHouseholdCount, 0);

// Market construction starts once rent reaches the construction threshold.
const tight = model.create({ householdCount: 30, initialHomeCount: 10, initialRent: 1200 });
tight.advance();
assert.equal(tight.read().startedThisStepCount, 1);
assert.equal(tight.read().pipelineCount, 1);
tight.advance(3);
assert.equal(tight.read().homeCount, 11);
console.log("city-housing allowance and supply experiments passed");
