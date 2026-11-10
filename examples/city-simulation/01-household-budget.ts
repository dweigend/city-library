import assert from "node:assert/strict";
import { Agent, World, run } from "city-library";

const months = 12;

const household = Agent.create({
  balance: 1000,
  income: 2400,
  rent: 900,
});

const world = World.create();

world.add(household);

run(world, settleMonth, months);

console.log(household.balance);

// Acceptance assertions are separate from the accepted author workflow.
assert.equal(household.balance, 19000);
assert.equal(world.tick.value, 12);
assert.equal(household.income, 2400);
assert.equal(household.rent, 900);
assert.equal(world.agents[0], household);

function settleMonth() {
  household.balance += household.income - household.rent;
}
