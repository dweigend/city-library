import { strict as assert } from "node:assert";
import { Agent, World } from "../../../index.ts";
import type { SpatialData, SpatialSegment } from "../../../ui/index.ts";
const world = World.create({ x: 10, y: 10, boundary: "hard" });
const agent = world.add(Agent.create({}, { position: { x: -2, y: 0 } }));
const from = Object.freeze({ x: agent.x, y: agent.y });
agent.move({ by: { x: 4, y: 0 } });
const stroke: SpatialSegment = Object.freeze({ from, to: Object.freeze({ x: agent.x, y: agent.y }), color: "#ff0000", width: 2 });
const view: SpatialData = { width: 10, height: 10, agents: [], segments: [stroke] };
assert.deepEqual(view.segments![0]!.from, { x: -2, y: 0 });
assert.deepEqual(view.segments![0]!.to, { x: 2, y: 0 });
assert.equal(world.tick.value, 0); // observation does not advance domain time
assert.equal(agent.x, 2);
