import assert from "node:assert/strict";
import { Agent, Random, World } from "city-library";

const random = Random.add({ seed: 11 });
const world = World.add({ x: 4, y: 4, boundary: "wrap" }, { random });
const a = Agent.add({ role: "observer" }, { position: { x: 1.75, y: 0 } });
const b = Agent.add({ role: "neighbor" }, { position: { x: -1.75, y: 0 } });
const far = Agent.add({ role: "far" }, { position: { x: 0, y: 0 } });
world.add([a, b, far]);
const continuation = random.state;
assert.equal(a.distanceTo(b), 0.5);
assert.deepEqual(a.neighbors({ source: [far, b, a], radius: 0.5 }), [b]);
assert.equal(a.neighbors({ radius: 0.5 })[0], b);
assert.equal(a.x, 1.75);
assert.equal(world.tick.value, 0);
assert.deepEqual(random.state, continuation);

const observer = Agent.add();
const front = Agent.add({}, { position: { x: 0, y: 1 } });
const back = Agent.add({}, { position: { x: 0, y: -1 } });
assert.deepEqual(observer.neighbors({ source: [back, front], radius: 1, angle: 90 }), [front]);
