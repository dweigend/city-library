import assert from "node:assert/strict";
import { Agent, World } from "city-library";

const home = World.create();
const other = World.create();
const person = Agent.create({ energy: 10 });
const companion = Agent.create({ energy: 20 });
const population = [person, companion];

assert.deepEqual(home.add([person, person, companion]), population);
home.add(person);
assert.deepEqual(home.agents, population);
assert.equal(person.world, home);

const newcomer = Agent.create({ energy: 30 });
assert.throws(() => other.add([newcomer, person]));
assert.deepEqual(other.agents, []);
assert.equal(newcomer.world, undefined);
assert.equal(person.world, home);

const capturedMembers = home.agents;
home.delete(person);
assert.equal(person.alive, true);
assert.equal(person.energy, 10);
assert.equal(person.world, undefined);
assert.deepEqual(home.agents, [companion]);
assert.deepEqual(capturedMembers, population);

other.add(person);
person.delete();
person.delete();
assert.equal(person.alive, false);
assert.equal(person.world, undefined);
assert.equal(person.energy, 10);
assert.deepEqual(other.agents, []);
assert.equal(population[0], person);
assert.equal(capturedMembers[0], person);
assert.throws(() => person.copy());
assert.throws(() => home.add(person));
console.log("membership-lifecycle: atomic ownership, detach preserves, delete invalidates");
