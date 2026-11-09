import assert from "node:assert/strict";
import { scientificPalette, type SpatialData } from "../../ui/index.ts";
import { model } from "../../experiments/des-goods-buffer/model.ts";

const buffer = model.create();
buffer.produce(); buffer.produce(); buffer.produce();
const state = buffer.read();
const before = structuredClone(state);
export const scene: SpatialData = {
  width: 14, height: 6, showLabels: false,
  description: "Two crates stored in two bounded slots; one producer blocked outside the store.",
  agents: [
    ...Array.from({ length: state.parameters.capacity }, (_, index) => ({
      id: `slot:${index}`, x: index * 2, y: 0, shape: "rectangle" as const,
      extent: { width: 1.8, height: 1.8 }, filled: false,
      stroke: scientificPalette.neutral, strokeWidth: 1,
    })),
    ...state.crates.map((crate, index) => ({ id: `crate:${crate.crate}`, x: index * 2, y: 0, shape: "rectangle" as const, size: 14, color: scientificPalette.active })),
    ...Array.from({ length: state.blocked }, (_, index) => ({ id: `blocked:${index}`, x: -4 - index, y: 0, shape: "rectangle" as const, size: 14, color: scientificPalette.waiting })),
  ],
};
assert.equal(scene.agents.filter(agent => agent.extent).length, state.parameters.capacity);
assert.equal(scene.agents.filter(agent => agent.color === scientificPalette.active).length, state.stored);
assert.equal(scene.agents.filter(agent => agent.color === scientificPalette.waiting).length, state.blocked);
assert.equal(scene.agents.find(agent => agent.id === "slot:0")!.extent!.width, 1.8);
assert.equal(scene.agents.find(agent => agent.id === "crate:1")!.size, 14);
assert.deepEqual(state, before);
buffer.collect();
assert.equal(buffer.read().blocked, 0);
assert.equal(buffer.read().stored, 2);
