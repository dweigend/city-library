import assert from "node:assert/strict";
import { create } from "../../../models/household-budget/model.ts";

const months = 12;

const simulation = create();
const { household, world } = simulation;
simulation.advance(months);

console.log(household.balance);

// Acceptance assertions are separate from the accepted author workflow.
assert.equal(household.balance, 19000);
assert.equal(world.tick.value, 12);
assert.equal(household.income, 2400);
assert.equal(household.rent, 900);
assert.equal(world.agents[0], household);
