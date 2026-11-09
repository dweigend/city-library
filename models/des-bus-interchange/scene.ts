import { scientificPalette } from "../../ui/index.ts";
import type { Observation, SpatialAgent, SpatialData } from "../../ui/index.ts";
import type { model } from "./model.ts";

interface DiagramPoint { x: number; y: number }
const stops: Readonly<Record<string, DiagramPoint>> = {
  "stop:origin": { x: -8, y: -2 },
  "stop:junction": { x: -3, y: 3 },
  "stop:interchange": { x: 3, y: -2 },
};

/** Travel progress maps declared route minutes into diagram coordinates only. */
export function busScene(state: Observation<typeof model>): SpatialData {
  const waiting = state.buses.filter(bus => bus.arrived >= 0 && bus.started < 0);
  const active = state.buses.filter(bus => bus.started >= 0 && bus.departed < 0);
  const departed = state.buses.filter(bus => bus.departed >= 0);
  const traveling = state.buses.filter(bus => bus.arrived < 0);
  const capacity = state.parameters.berths;
  const height = Math.max(12, state.buses.length * 0.45 + 5);
  const berthPoint = (index: number) => ({ x: 7 + (index % 2) * 2,
    y: 2 - Math.floor(index / 2) * 1.3 });
  const agents: SpatialAgent[] = state.nodes.map(node => ({
    id: node.id, ...stops[node.id]!, size: 12, filled: false, stroke: scientificPalette.neutral,
  }));
  for (let index = 0; index < capacity; index++) agents.push({
    id: `berth:${index + 1}`, ...berthPoint(index), shape: "rectangle",
    extent: { width: 1.6, height: 0.8 }, filled: false, stroke: scientificPalette.neutral,
  });
  for (const bus of state.buses) {
    let position: DiagramPoint;
    let color: string;
    if (bus.arrived < 0) {
      position = routePoint(state, state.time - bus.dispatchedAt);
      position.y += (traveling.indexOf(bus) - (traveling.length - 1) / 2) * 0.4;
      color = scientificPalette.active;
    } else if (bus.started < 0) {
      const index = waiting.indexOf(bus);
      position = { x: 4.8 + (index % 7) * 0.85, y: -2.5 - Math.floor(index / 7) * 0.8 };
      color = scientificPalette.waiting;
    } else if (bus.departed < 0) {
      const index = active.indexOf(bus);
      position = index < capacity ? berthPoint(index) : { x: 6 + (index - capacity) * 1.3, y: -0.8 };
      color = scientificPalette.active;
    } else {
      const index = departed.indexOf(bus);
      position = { x: 5 + (index % 7) * 0.85, y: -4.2 - Math.floor(index / 7) * 0.8 };
      color = scientificPalette.completed;
    }
    agents.push({ id: `bus:${bus.number}`, ...position, shape: "rectangle",
      extent: { width: 0.7, height: 0.35 }, color });
  }
  return {
    width: 26, height, showLabels: false,
    description: `${traveling.length} buses traveling on the ${state.travelMinutes}-minute route; ${state.waiting} waiting; ${state.occupied} at berth; ${capacity} berth slots; ${state.departed} departed.`,
    agents,
    segments: state.edges.map(edge => ({ from: stops[edge.from]!, to: stops[edge.to]!, color: scientificPalette.neutral })),
    labels: [
      ...state.nodes.map(node => ({ ...stops[node.id]!, y: stops[node.id]!.y + 0.8, text: node.label })),
      ...state.edges.map(edge => ({
        x: (stops[edge.from]!.x + stops[edge.to]!.x) / 2,
        y: (stops[edge.from]!.y + stops[edge.to]!.y) / 2 - 0.5,
        text: String(state.edgeCosts.find(cost => cost.id === edge.id)!.minutes),
      })),
      { x: 8, y: 3.3, text: "Berths" },
      ...(state.occupied > capacity ? [{ x: 8, y: 0, text: "Retained service" }] : []),
    ],
  };
}

function routePoint(state: Observation<typeof model>, elapsed: number): DiagramPoint {
  let remaining = Math.max(0, elapsed);
  for (const leg of state.route) {
    const from = stops[leg.from]!;
    const to = stops[leg.to]!;
    if (remaining <= leg.minutes) {
      const fraction = remaining / leg.minutes;
      return { x: from.x + (to.x - from.x) * fraction, y: from.y + (to.y - from.y) * fraction };
    }
    remaining -= leg.minutes;
  }
  return { ...stops["stop:interchange"]! };
}
