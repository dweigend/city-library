import assert from "node:assert/strict";
import { Agent, World } from "city-library";

interface Details {
  score: number;
  self?: Details;
}
const details: Details = { score: 1 };
details.self = details;
const friend = Agent.add({ name: "Friend" });
const initial = {
  energy: 10,
  details,
  alias: details,
  lookup: new Map([["details", details]]),
  selected: new Set([details]),
  friend,
};
const person = Agent.add(initial);
const sibling = Agent.add(initial);
const world = World.add();
world.add(person);
const copy = person.copy();

assert.notEqual(person.details, details);
assert.equal(person.alias, person.details);
assert.equal(person.details.self, person.details);
assert.equal(person.lookup.get("details"), person.details);
assert.ok(person.selected.has(person.details));
assert.equal(person.friend, friend);
assert.equal(friend.world, undefined);
assert.notEqual(sibling.details, person.details);
assert.notEqual(copy.id, person.id);
assert.equal(copy.alive, true);
assert.equal(copy.world, undefined);
assert.notEqual(copy.details, person.details);
assert.equal(copy.alias, copy.details);
assert.equal(copy.details.self, copy.details);
assert.equal(copy.lookup.get("details"), copy.details);
assert.ok(copy.selected.has(copy.details));
assert.equal(copy.friend, friend);
assert.deepEqual([copy.x, copy.y, copy.heading], [person.x, person.y, person.heading]);

copy.details.score = 9;
assert.equal(person.details.score, 1);
assert.equal(sibling.details.score, 1);
assert.equal(details.score, 1);

// Later assignments deliberately share ordinary model data.
const shared: Details = { score: 5 };
person.details = shared;
sibling.details = shared;
shared.score = 6;
assert.equal(person.details.score, 6);
assert.equal(sibling.details.score, 6);
console.log("copy-and-custom-state: cloned graphs, retained framework references, explicit later sharing");
