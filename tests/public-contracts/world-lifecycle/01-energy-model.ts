import assert from "node:assert/strict";
import { Agent, World, run } from "city-library";

const person = Agent.create({ energy: 10 });
const world = World.create();
assert.equal(world.add(person), person);

function step() {
  person.energy -= 1;
}

run(world, step, 5);

assert.equal(person.energy, 5);
assert.equal(world.tick.value, 5);
assert.equal(world.space, undefined);
assert.equal(world.agents[0], person);
console.log("energy-model: energy=5, tick=5");
