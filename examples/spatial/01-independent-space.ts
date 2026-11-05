import assert from "node:assert/strict";
import { Agent, Random, World, run } from "city-library";

const random = Random.add({ seed: 7 });
const before = random.state;
const world = World.add({ x: 4, y: 4, boundary: "wrap" }, { random });
const separate = World.add();
const traveler = Agent.add({ energy: 5 }, { position: { x: 1.5, y: 0 } });
world.add(traveler);
assert.equal(world.agents[0], traveler);
run(world, () => traveler.move({ by: { x: 1 } }));
assert.equal(traveler.x, -1.5);
assert.equal(traveler.y, 0);
assert.equal(world.tick.value, 1);
assert.equal(separate.tick.value, 0);
assert.equal(separate.space, undefined);
assert.deepEqual(random.state, before);
