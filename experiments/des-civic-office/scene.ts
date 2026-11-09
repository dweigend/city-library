import { scientificPalette } from "../../ui/index.ts";
import type { Observation, SpatialAgent, SpatialData } from "../../ui/index.ts";
import type { model } from "./model.ts";

/** Diagram coordinates describe queue order and capacity, not office geometry. */
export function officeScene(state: Observation<typeof model>): SpatialData {
  const waiting = state.residents.filter(resident => resident.status === "waiting");
  const active = state.residents.filter(resident => resident.status === "granted");
  const completed = state.residents.filter(resident => resident.status === "released");
  const capacity = state.parameters.clerks;
  const retained = Math.max(0, state.busy - capacity);
  const height = Math.max(10, Math.ceil(Math.max(waiting.length, completed.length) / 8) * 0.8 + 5);
  const agents: SpatialAgent[] = [];
  const deskColumns = Math.min(3, capacity);
  const deskPoint = (index: number) => ({
    x: (index % deskColumns - (deskColumns - 1) / 2) * 1.8,
    y: (Math.ceil(capacity / deskColumns) - 1) * 0.9 - Math.floor(index / deskColumns) * 1.8,
  });
  for (let index = 0; index < capacity; index++) {
    agents.push({ id: `desk:${index + 1}`, ...deskPoint(index), shape: "rectangle",
      extent: { width: 1.3, height: 1.3 }, filled: false, stroke: scientificPalette.neutral });
  }
  waiting.forEach((resident, index) => agents.push({
    id: `resident:${resident.number}`, x: -5 - (index % 8) * 0.7,
    y: (Math.ceil(waiting.length / 8) - 1) * 0.35 - Math.floor(index / 8) * 0.7,
    size: 7, color: scientificPalette.waiting,
  }));
  active.forEach((resident, index) => {
    const position = index < capacity ? deskPoint(index) : { x: (index - capacity) * 0.7 - 1.5, y: -3.6 };
    agents.push({ id: `resident:${resident.number}`, ...position, size: 7, color: scientificPalette.active });
  });
  completed.forEach((resident, index) => agents.push({
    id: `resident:${resident.number}`, x: 5 + (index % 8) * 0.7,
    y: (Math.ceil(completed.length / 8) - 1) * 0.35 - Math.floor(index / 8) * 0.7,
    size: 7, color: scientificPalette.completed,
  }));
  return {
    width: 24, height, showLabels: false,
    description: `${state.waiting} residents waiting; ${state.busy} in service; ${state.completed} completed. ${capacity} clerk slots, ${retained} retained service claims above current capacity.`,
    agents,
    segments: [
      { from: { x: -4, y: 0 }, to: { x: -3, y: 0 }, color: scientificPalette.neutral },
      { from: { x: 3, y: 0 }, to: { x: 4, y: 0 }, color: scientificPalette.neutral },
    ],
    labels: [
      { x: -7.4, y: height / 2 - 1, text: "Waiting" },
      { x: 0, y: height / 2 - 1, text: "Clerks" },
      { x: 7.4, y: height / 2 - 1, text: "Completed" },
      ...(retained ? [{ x: 0, y: -2.8, text: "Retained service" }] : []),
    ],
  };
}
