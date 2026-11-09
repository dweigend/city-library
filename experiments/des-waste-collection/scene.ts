import { scientificPalette } from "../../ui/index.ts";
import type { Observation, SpatialAgent, SpatialData } from "../../ui/index.ts";
import type { model } from "./model.ts";

/** Diagram coordinates enlarge the six actual Grid fields without adding routes. */
export function scene(state: Observation<typeof model>): SpatialData {
  const agents: SpatialAgent[] = [];
  for (const field of state.fields) {
    const x = field.x * 3 + 1;
    const y = field.y * 3;
    agents.push({ id: field.id, x, y, shape: "rectangle", extent: { width: 2.5, height: 2.5 },
      filled: false, stroke: field.waste ? scientificPalette.waiting : scientificPalette.completed });
    for (let unit = 0; unit < field.waste; unit++) agents.push({ id: `waste:${field.id}:${unit}`, x: x - 0.4 + unit * 0.8, y,
      shape: "rectangle", extent: { width: 0.5, height: 0.5 }, color: scientificPalette.waiting });
  }
  agents.push({ id: "depot", x: -6, y: 0, shape: "rectangle", extent: { width: 2, height: 2 }, filled: false,
    stroke: state.depotBusy ? scientificPalette.active : scientificPalette.neutral });
  const truck = { x: state.truck.x === -2 ? -6 : state.truck.x * 3 + 1, y: state.truck.y * 3 - 0.8 };
  agents.push({ id: state.truck.id, ...truck, shape: "triangle", size: 15, color: scientificPalette.active });
  for (let unit = 0; unit < state.parameters.loadCapacity; unit++) agents.push({ id: `load:${unit}`, x: -5.5 + (unit % 6) * 0.65, y: -4 - Math.floor(unit / 6) * 0.65,
    shape: "rectangle", extent: { width: 0.5, height: 0.5 }, filled: unit < state.carried,
    color: scientificPalette.active, stroke: scientificPalette.neutral });
  return { width: 20, height: 13, showLabels: false, agents,
    description: `Six collection patches contain ${state.remaining} load units; triangle truck carries ${state.carried} of ${state.parameters.loadCapacity}; ${state.delivered} delivered. Squares mark individual units, outlined patches are empty when collected.`,
    labels: [{ x: -6, y: 1.7, text: state.depotBusy ? "Depot · unloading" : "Depot" },
      { x: -3.8, y: -3.3, text: `Truck load ${state.carried}/${state.parameters.loadCapacity}` },
      { x: 3, y: 4.5, text: `Collection sites · ${state.remaining} remaining` },
      { x: 3, y: -4.3, text: `Delivered ${state.delivered}` }] };
}
