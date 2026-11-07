import assert from "node:assert/strict";
import { Agent, World, run } from "city-library";

const world = World.add();
const person = Agent.add({ energy: 10 });
world.add(person);
let calls = 0;
const failure = new Error("second step failed");

function step() {
  calls += 1;
  person.energy -= 1;
  if (calls === 2) throw failure;
}

assert.throws(() => run(world, step, 5), (error) => error === failure);
assert.equal(calls, 2);
assert.equal(person.energy, 8);
assert.equal(world.tick.value, 1);

run(world, () => { throw new Error("zero steps must not invoke this"); }, 0);
assert.equal(world.tick.value, 1);

// The nested call rejects before its callback and prevents the outer tick.
assert.throws(() => run(world, () => {
  run(world, () => { person.energy = -100; });
}));
assert.equal(person.energy, 8);
assert.equal(world.tick.value, 1);

// The execution guard is released after failure; clock-only edits stay explicit.
run(world, () => { person.energy -= 1; });
assert.equal(person.energy, 7);
assert.equal(world.tick.value, 2);
world.tick.advance(0.5);
assert.equal(world.tick.value, 2.5);
world.tick.reset();
assert.equal(world.tick.value, 0);
assert.equal(person.energy, 7);
console.log("execution-errors: retained effects, successful ticks only, guard released");
