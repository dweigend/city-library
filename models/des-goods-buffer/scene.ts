import { collectionDiagram, scientificPalette } from "../../ui/index.ts";
import type { Observation, SpatialData } from "../../ui/index.ts";
import type { model } from "./model.ts";

/** Store-owned snapshots supply every identity and the actual order of blocked puts. */
export function bufferScene(state: Observation<typeof model>): SpatialData {
  return collectionDiagram([
    {
      id: "blocked", label: "Blocked puts", kind: "items", order: "supplied", color: scientificPalette.waiting,
      items: state.blockedCrates.map(crate => ({ id: `crate:${crate.crate}` })),
    },
    {
      id: "stored", label: "Stored crates", kind: "items", order: "supplied", color: scientificPalette.active,
      items: state.crates.map(crate => ({ id: `crate:${crate.crate}` })),
    },
    {
      id: "capacity", label: "Store capacity", kind: "capacity", color: scientificPalette.neutral,
      used: state.stored, capacity: state.parameters.capacity, unit: "crates",
    },
    {
      id: "collected", label: "Collected crates", kind: "items", color: scientificPalette.completed,
      items: state.deliveries.map(crate => ({ id: `crate:${crate.crate}` })),
    },
  ]);
}
