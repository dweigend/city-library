import assert from "node:assert/strict";
import { Agent, Random, World, run } from "city-library";

const first = World.add();
const second = World.add();
const firstPerson = Agent.add({ energy: 10 });
const secondPerson = Agent.add({ energy: 20 });
first.add(firstPerson);
second.add(secondPerson);

run(first, () => { firstPerson.energy -= 1; }, 2);
run(second, () => { secondPerson.energy -= 2; });
run(first, () => { firstPerson.energy -= 1; });

assert.deepEqual([firstPerson.energy, first.tick.value], [7, 3]);
assert.deepEqual([secondPerson.energy, second.tick.value], [18, 1]);
assert.deepEqual(first.agents, [firstPerson]);
assert.deepEqual(second.agents, [secondPerson]);
assert.notEqual(first.random, second.random);
assert.equal(first.random.algorithm, "mulberry32");
assert.equal(first.random.seed, 1);

// Construction and ordinary model execution consume no implicit random draws.
const reference = Random.add({ seed: 1 });
assert.equal(first.random.number(), reference.number());
assert.equal(first.random.number(), reference.number());
assert.equal(second.random.number(), Random.add({ seed: 1 }).number());

const supplied = Random.add({ seed: 42 });
assert.equal(World.add({ random: supplied }).random, supplied);
console.log("independent-worlds: energies=7/18, ticks=3/1, streams isolated");
