import assert from "node:assert/strict";
import { Agent, World } from "city-library";

const world = World.create();
const first = world.add(Agent.create({ name: "first" }));
const second = world.add(Agent.create({ name: "second" }));
const visited: string[] = [];
world.activate([first, second, first], ({ self }) => {
  visited.push(self.name);
  if (self === first) {
    second.delete();
    world.add(Agent.create({ name: "born" }));
  }
}, { order: "fixed" });
assert.deepEqual(visited, ["first"]);
assert.equal(world.agents.length, 2);
assert.equal(world.tick.value, 0);
let afterDeath = false;
world.activate(first, (context) => {
  context.die();
  afterDeath = true;
});
assert.equal(afterDeath, false);
assert.equal(first.alive, false);
