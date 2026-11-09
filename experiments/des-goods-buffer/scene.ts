import { scientificPalette } from "../../ui/index.ts";
import type { Observation, SpatialAgent, SpatialData } from "../../ui/index.ts";
import type { model } from "./model.ts";

export function bufferScene(state: Observation<typeof model>): SpatialData {
  const capacity = state.parameters.capacity;
  const columns = Math.min(8, capacity);
  const height = Math.max(10, 2 * (Math.ceil(Math.max(state.blocked, state.collected) / 6) * 0.9 + 2));
  const slotPoint = (index: number) => ({ x: (index % columns - (columns - 1) / 2) * 1.15,
    y: (Math.ceil(capacity / columns) - 1) * 0.6 - Math.floor(index / columns) * 1.2 });
  const agents: SpatialAgent[] = Array.from({ length: capacity }, (_, index) => ({
    id: `slot:${index + 1}`, ...slotPoint(index), shape: "rectangle", extent: { width: 1, height: 1 },
    filled: false, stroke: scientificPalette.neutral,
  }));
  state.crates.forEach((crate, index) => agents.push({ id: `crate:${crate.crate}`, ...slotPoint(index),
    shape: "rectangle", extent: { width: 0.65, height: 0.65 }, color: scientificPalette.active }));
  state.blockedCrates.forEach((crate, index) => agents.push({ id: `crate:${crate.crate}`,
    x: -6 - (index % 6) * 0.9, y: -Math.floor(index / 6) * 0.9,
    shape: "rectangle", extent: { width: 0.65, height: 0.65 }, color: scientificPalette.waiting }));
  state.deliveries.forEach((crate, index) => agents.push({ id: `crate:${crate.crate}`,
    x: 6 + (index % 6) * 0.9, y: -Math.floor(index / 6) * 0.9,
    shape: "rectangle", extent: { width: 0.65, height: 0.65 }, color: scientificPalette.completed }));
  return {
    width: 26, height, showLabels: false,
    description: `${state.produced} crates produced: ${state.stored} stored in ${capacity} bounded slots, ${state.blocked} blocked outside the store, ${state.collected} collected.`,
    agents,
    labels: [
      { x: -8, y: height / 2 - 1, text: "Blocked puts" },
      { x: 0, y: height / 2 - 1, text: "Buffer" },
      { x: 8, y: height / 2 - 1, text: "Collected" },
    ],
    segments: [
      { from: { x: -5.2, y: 0 }, to: { x: -4.5, y: 0 }, color: scientificPalette.neutral },
      { from: { x: 4.5, y: 0 }, to: { x: 5.2, y: 0 }, color: scientificPalette.neutral },
    ],
  };
}
