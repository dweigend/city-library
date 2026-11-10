import assert from "node:assert/strict";
import { Random, World, stats } from "city-library";
const random = Random.create({ seed: 3 });
const world = World.create({ random });
const before = random.state;
let visits = 0;
function* values() { for (const value of [3, 1, 2]) { visits += 1; yield value; } }
assert.ok(Math.abs(stats.gini(values()) - 2 / 9) < 1e-12);
assert.equal(visits, 3);
assert.equal(world.tick.value, 0);
assert.deepEqual(random.state, before);
