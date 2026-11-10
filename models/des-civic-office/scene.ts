import { collectionDiagram, scientificPalette } from "../../ui/index.ts";
import type { Observation, SpatialData } from "../../ui/index.ts";
import type { model } from "./model.ts";

/** Waiting order is model-owned; capacity units never assign residents to desks. */
export function officeScene(state: Observation<typeof model>): SpatialData {
  return collectionDiagram([
    {
      id: "waiting", label: "Waiting residents", kind: "items", order: "supplied",
      color: scientificPalette.waiting,
      items: state.waitingResidents.map(number => ({ id: `resident:${number}`, shape: "circle" })),
    },
    {
      id: "service", label: "Residents in service", kind: "items", color: scientificPalette.active,
      items: state.residents.filter(resident => resident.status === "granted")
        .map(resident => ({ id: `resident:${resident.number}`, shape: "circle" })),
    },
    {
      id: "clerks", label: "Clerk capacity", kind: "capacity", color: scientificPalette.neutral,
      used: state.busyClerkCount, capacity: state.parameters.clerkCount, unit: "seats",
    },
    {
      id: "completed", label: "Completed residents", kind: "items", color: scientificPalette.completed,
      items: state.residents.filter(resident => resident.status === "released")
        .map(resident => ({ id: `resident:${resident.number}`, shape: "circle" })),
    },
  ]);
}
