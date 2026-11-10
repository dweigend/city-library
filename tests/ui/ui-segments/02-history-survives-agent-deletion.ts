import { strict as assert } from "node:assert";
import { Agent, World } from "../../../index.ts";
import type { SpatialData, SpatialSegment } from "../../../ui/index.ts";
const world = World.create({ x: 10, y: 10 });
const agent = world.add(Agent.create({}, { position: { x: 0, y: -2 } }));
const strokes: readonly SpatialSegment[] = Object.freeze([
  Object.freeze({ from: Object.freeze({ x: 0, y: -2 }), to: Object.freeze({ x: 0, y: 2 }), width: 1.5 }),
]);
agent.delete();
const view: SpatialData = { width: 10, height: 10, agents: [], segments: strokes };
assert.equal(world.agents.length, 0);
assert.equal(view.segments!.length, 1);
assert.deepEqual(view.segments![0]!.to, { x: 0, y: 2 });
assert.ok(Object.isFrozen(strokes[0]!.to)); // historical coordinates, no retained live owner
