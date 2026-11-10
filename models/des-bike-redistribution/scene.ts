import { scientificPalette } from "../../ui/index.ts";
import type { Observation, SpatialAgent, SpatialData } from "../../ui/index.ts";
import type { model } from "./model.ts";

/** Stations keep their observed order; slots show actual bounded Store capacity. */
export function scene(state: Observation<typeof model>): SpatialData {
  const agents: SpatialAgent[] = [];
  for (const station of state.stations) {
    const x = station.x * 3;
    agents.push({ id: station.id, x, y: 0, shape: "rectangle", extent: { width: 4.6, height: 3.8 }, filled: false, stroke: scientificPalette.neutral });
    for (let slot = 0; slot < station.capacity; slot++) agents.push({ id: `bike-slot:${station.id}:${slot}`, x: x - 1.7 + (slot % 6) * 0.68, y: 0.8 - Math.floor(slot / 6) * 0.8,
      size: 7, filled: slot < station.bikeCount, color: scientificPalette.completed, stroke: scientificPalette.neutral });
  }
  agents.push({ id: state.truck.id, x: state.truck.x * 3, y: -3.3, shape: "triangle", size: 15,
    color: state.done ? scientificPalette.neutral : scientificPalette.active });
  for (let bike = 0; bike < state.inTransitBikeCount; bike++) agents.push({ id: `cargo:${bike}`, x: state.truck.x * 3 - 1.5 + bike * 0.6, y: -4.2,
    size: 7, color: scientificPalette.active });
  return { width: 22, height: 12, showLabels: false, agents,
    segments: state.stations.slice(1).map((station, index) => ({ from: { x: state.stations[index]!.x * 3, y: -2.3 }, to: { x: station.x * 3, y: -2.3 }, color: scientificPalette.neutral })),
    labels: [...state.stations.map(station => ({ x: station.x * 3, y: 2.6, text: `${station.label} · ${station.bikeCount}/${station.capacity}` })),
      { x: 0, y: 4.2, text: `Target ${state.parameters.targetBikeCount} per station · conserved fleet ${state.totalBikeCount}` },
      { x: 0, y: -5.2, text: `Truck · ${state.inTransitBikeCount} aboard` }],
    description: `${state.totalBikeCount} bikes conserved across three stores and truck: ${state.stations.map(station => `${station.label} ${station.bikeCount} of ${station.capacity} slots`).join(", ")}; ${state.inTransitBikeCount} aboard. Dots are bikes; outlined dots are free slots; triangle is the truck at its last recorded stop.` };
}
