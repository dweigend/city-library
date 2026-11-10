import assert from "node:assert/strict";
import { Agent, World, run } from "city-library";

const world = World.add({ x: 10, y: 10, boundary: "wrap" });
const parent = Agent.add({ energy: 8 }, { position: { x: 2, y: 1 }, orientation: { heading: 90 } });
world.add(parent);
const birth = parent.copy();
assert.equal(birth.world, undefined);
assert.equal(birth.x, 2);
assert.equal(birth.heading, 90);
birth.move(1);
assert.equal(birth.x, 3);
assert.equal(parent.x, 2);
world.add(birth);
const visited: string[] = [];
run(world, () => {
  // This caller-owned activation snapshot excludes births made during the pass.
  const population = [...world.agents];
  for (const agent of population) {
    if (!agent.alive) continue;
    visited.push(agent.id);
    if (agent === parent) world.add(agent.copy());
    else agent.delete();
  }
});
assert.deepEqual(visited, [parent.id, birth.id]);
assert.equal(world.agents.length, 2);
assert.equal(birth.alive, false);
assert.throws(() => birth.move(1));
assert.equal(world.tick.value, 1);
