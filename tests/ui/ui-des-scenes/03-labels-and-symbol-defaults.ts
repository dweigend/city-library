import assert from "node:assert/strict";
import { scientificPalette, type SpatialData } from "../../../ui/index.ts";

export const elevation: SpatialData = {
  width: 12, height: 8, showLabels: false,
  description: "Two floor lines; cabin 1 has one passenger and capacity two. Triangle points upward.",
  labels: [{ x: -4.5, y: -2, text: "0" }, { x: -4.5, y: 2, text: "1" }],
  segments: [-2, 2].map(y => ({ from: { x: -4, y }, to: { x: 4, y }, color: scientificPalette.neutral })),
  agents: [
    { id: "cabin:1", x: 2, y: -1, shape: "rectangle", extent: { width: 2, height: 1.5 }, filled: false },
    { id: "person:1", x: 2, y: -1, size: 6, color: scientificPalette.active },
    { id: "direction:1", x: 2, y: 0.5, shape: "triangle", size: 8, color: scientificPalette.neutral },
    { id: "incident:1", x: -2, y: 2, shape: "diamond", size: 10, color: scientificPalette.waiting },
  ],
};
const symbolScene: SpatialData = { width: 10, height: 10, agents: [{ id: "old", x: 0, y: 0, size: 8 }] };
assert.equal(symbolScene.description, undefined);
assert.equal(symbolScene.agents[0]!.shape, undefined);
assert.equal(elevation.labels!.length, 2);
assert.equal(elevation.agents.length, 4);
assert.equal(elevation.agents.filter(agent => agent.id.startsWith("person:")).length, 1);
assert.deepEqual(elevation.segments![0], { from: { x: -4, y: -2 }, to: { x: 4, y: -2 }, color: scientificPalette.neutral });
assert.equal(elevation.agents[0]!.size, undefined);
