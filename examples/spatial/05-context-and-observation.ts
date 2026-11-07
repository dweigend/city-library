import assert from "node:assert/strict";
import { Agent, Random, World } from "city-library";

const random = Random.add({ seed: 19 });
const world = World.add({ x: 6, y: 6, boundary: "wrap" }, { random });
const agent = Agent.add({ energy: 9 }, { position: { x: 2, y: 0 } });
world.add(agent);
const before = random.state;
const captured = Object.freeze({ x: agent.x, y: agent.y, energy: agent.energy });
assert.throws(() => agent.move({ by: { x: 1 }, space: { x: 4, y: 4, boundary: "wrap" } }));
assert.equal(agent.x, 2);
agent.move({ by: { x: 2 } });
assert.equal(agent.x, -2);
assert.deepEqual(captured, { x: 2, y: 0, energy: 9 });
assert.deepEqual(random.state, before);
assert.equal(world.tick.value, 0);
