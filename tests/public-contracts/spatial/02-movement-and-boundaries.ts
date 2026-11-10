import assert from "node:assert/strict";
import { Agent } from "city-library";

const agent = Agent.add({}, { position: { x: 0, y: 0 } });
agent.move(1);
assert.equal(agent.y, 1);
agent.rotate(90);
agent.move(2);
assert.ok(Math.abs(agent.x - 2) < 1e-12);
assert.ok(Math.abs(agent.y - 1) < 1e-12);

const hard = { x: 4, y: 4 } as const;
agent.move({ to: { x: 0, y: 0 } });
agent.move({ by: { x: 4, y: 2 }, space: hard });
assert.equal(agent.x, 2);
assert.equal(agent.y, 1);
assert.throws(() => agent.move({ to: { x: 3, y: 0 }, space: hard }), RangeError);
assert.equal(agent.x, 2);
assert.equal(agent.y, 1);
