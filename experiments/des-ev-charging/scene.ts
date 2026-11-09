import { scientificPalette } from "../../ui/index.ts";
import type { Observation, SpatialAgent, SpatialData } from "../../ui/index.ts";
import type { model } from "./model.ts";

/** Vehicle order comes directly from the Resource's policy-sorted waiting list. */
export function chargingScene(state: Observation<typeof model>): SpatialData {
  const active = state.vehicles.filter(vehicle => vehicle.status === "granted");
  const finished = state.vehicles.filter(vehicle => vehicle.status === "released");
  const cancelled = state.vehicles.filter(vehicle => vehicle.status === "cancelled");
  const capacity = state.parameters.chargers;
  const columns = Math.min(5, capacity);
  const height = Math.max(10, 2 * (Math.ceil(Math.max(state.waiting, finished.length, cancelled.length) / 6) * 0.9 + 3.7));
  const chargerPoint = (index: number) => ({ x: (index % columns - (columns - 1) / 2) * 1.7,
    y: (Math.ceil(capacity / columns) - 1) * 1.2 - Math.floor(index / columns) * 2.4 });
  const agents: SpatialAgent[] = Array.from({ length: capacity }, (_, index) => ({
    id: `charger:${index + 1}`, ...chargerPoint(index), shape: "rectangle",
    extent: { width: 1.3, height: 1.8 }, filled: false, stroke: scientificPalette.neutral,
  }));
  for (const vehicle of state.vehicles) {
    let position: { x: number; y: number };
    let color: string;
    if (vehicle.status === "waiting") {
      const index = state.waitingVehicles.indexOf(vehicle.number);
      position = { x: -5 - (index % 7) * 0.9, y: -Math.floor(index / 7) * 0.9 };
      color = scientificPalette.waiting;
    } else if (vehicle.status === "granted") {
      const index = active.indexOf(vehicle);
      position = index < capacity ? chargerPoint(index) : { x: (index - capacity) * 1.1 - 1.5, y: -3.5 };
      color = scientificPalette.active;
    } else if (vehicle.status === "released") {
      const index = finished.indexOf(vehicle);
      position = { x: 5.5 + (index % 6) * 0.95, y: -Math.floor(index / 6) * 0.9 };
      color = scientificPalette.completed;
    } else {
      const index = cancelled.indexOf(vehicle);
      position = { x: 5.5 + (index % 6) * 0.95, y: -2.7 - Math.floor(index / 6) * 0.9 };
      color = scientificPalette.unavailable;
    }
    agents.push({ id: `vehicle:${vehicle.number}`, ...position, shape: "rectangle", extent: { width: 0.8, height: 0.4 }, color });
    if (vehicle.priority < 0) agents.push({ id: `priority:${vehicle.number}`, x: position.x,
      y: position.y + 0.45, shape: "triangle", size: 4, color: scientificPalette.neutral });
  }
  return {
    width: 26, height, showLabels: false,
    description: `${state.waiting} vehicles waiting in resource priority order; ${state.active} charging; ${Math.max(0, capacity - state.active)} free charger slots; ${state.completed} completed; ${state.abandoned} cancelled. Triangles mark priority vehicles.`,
    agents,
    segments: [{ from: { x: -11, y: -0.6 }, to: { x: 11, y: -0.6 }, color: scientificPalette.neutral }],
    labels: [
      { x: -8, y: height / 2 - 1, text: "Queue" }, { x: 0, y: height / 2 - 1, text: "Chargers" },
      { x: 8, y: height / 2 - 1, text: "Completed" },
      ...(cancelled.length ? [{ x: 8, y: -1.9, text: "Cancelled" }] : []),
      ...(state.active > capacity ? [{ x: 0, y: -2.7, text: "Retained service" }] : []),
    ],
  };
}
