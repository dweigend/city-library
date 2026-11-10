import { scientificPalette } from "../../ui/index.ts";
import type { Observation, SpatialAgent, SpatialData } from "../../ui/index.ts";
import type { model } from "./model.ts";

interface DiagramPoint { x: number; y: number }
const places: Readonly<Record<string, DiagramPoint>> = {
  "place:depot": { x: -6, y: 0 },
  "place:east": { x: 6, y: 3 },
  "place:west": { x: 6, y: -3 },
};

/** Cargo and capacity are observed; this projection owns only their diagram layout. */
export function parcelScene(state: Observation<typeof model>): SpatialData {
  const journey = state.parcels.find(parcel => parcel.dispatched >= 0 && parcel.returned < 0);
  const van = vanPosition(state, journey);
  const capacity = state.parameters.depotCapacity;
  const height = Math.max(12, Math.ceil(state.parcels.length / 6) * 1.4 + 7);
  const slotPoint = (index: number) => ({ x: -7 + (index % 3) * 0.9, y: 1 - Math.floor(index / 3) * 0.9 });
  const agents: SpatialAgent[] = [
    { id: "depot", x: -6, y: 0, shape: "rectangle", extent: { width: 3.5, height: 4.7 }, filled: false, stroke: scientificPalette.neutral },
    ...state.nodes.filter(node => node.id !== "place:depot").map(node => ({
      id: node.id, ...places[node.id]!, size: 12, filled: false, stroke: scientificPalette.neutral,
    })),
  ];
  for (let index = 0; index < capacity; index++) agents.push({ id: `slot:${index + 1}`,
    ...slotPoint(index), shape: "rectangle", extent: { width: 0.75, height: 0.75 }, filled: false, stroke: scientificPalette.neutral });
  for (const parcel of state.parcels) {
    let position: DiagramPoint;
    let color: string;
    if (parcel.deliveredAtMinutes >= 0) {
      const deliveredHere = state.parcels.filter(item => item.destination === parcel.destination && item.deliveredAtMinutes >= 0);
      const index = deliveredHere.indexOf(parcel);
      const destination = places[parcel.destination === "East" ? "place:east" : "place:west"]!;
      position = { x: destination.x + 1 + (index % 5) * 0.75, y: destination.y - Math.floor(index / 5) * 0.75 };
      color = scientificPalette.completed;
    } else if (parcel.dispatched >= 0) {
      position = { x: van.x, y: van.y + 0.65 };
      color = scientificPalette.active;
    } else if (state.queuedParcels.includes(parcel.number)) {
      position = slotPoint(state.queuedParcels.indexOf(parcel.number));
      color = scientificPalette.waiting;
    } else {
      const index = state.blockedParcels.indexOf(parcel.number);
      position = { x: -9 - (index % 4) * 0.75, y: 1 - Math.floor(index / 4) * 0.75 };
      color = scientificPalette.waiting;
    }
    agents.push({ id: `parcel:${parcel.number}`, ...position, shape: "rectangle",
      extent: { width: 0.5, height: 0.5 }, color });
  }
  agents.push({ id: "van", x: van.x, y: van.y, heading: van.heading, shape: "triangle", size: 11,
    color: state.busyVanCount ? scientificPalette.active : scientificPalette.neutral });
  const returning = journey !== undefined && journey.deliveredAtMinutes >= 0;
  return {
    width: 26, height, showLabels: false,
    description: `${state.queuedParcelCount} parcels in ${capacity} depot slots, ${state.blockedParcelCount} blocked outside, ${state.deliveredParcelCount} delivered; ${state.busyVanCount} van occupied${returning ? ", returning to the depot" : journey ? ", loading or outbound" : ", idle at the depot"}.`,
    agents,
    segments: state.edges.map(edge => ({ from: places[edge.from]!, to: places[edge.to]!, color: scientificPalette.neutral })),
    labels: [
      { x: -6, y: 3.2, text: "Depot" },
      ...state.nodes.filter(node => node.id !== "place:depot").map(node => ({ ...places[node.id]!, y: places[node.id]!.y + 0.8, text: node.label })),
      ...state.edges.map(edge => ({ x: (places[edge.from]!.x + places[edge.to]!.x) / 2,
        y: (places[edge.from]!.y + places[edge.to]!.y) / 2 - 0.4,
        text: String(state.edgeCosts.find(cost => cost.id === edge.id)!.minutes) })),
      ...(state.blockedParcelCount ? [{ x: -10.2, y: 2.1, text: "Blocked" }] : []),
    ],
  };
}

function vanPosition(state: Observation<typeof model>, journey: Observation<typeof model>["parcels"][number] | undefined) {
  const depot = places["place:depot"]!;
  if (!journey) return { ...depot, heading: 90 };
  const destination = places[journey.destination === "East" ? "place:east" : "place:west"]!;
  const returning = journey.deliveredAtMinutes >= 0;
  const from = returning ? destination : depot;
  const to = returning ? depot : destination;
  const departure = returning ? journey.deliveredAtMinutes : journey.dispatched + state.parameters.loadingMinutes;
  const fraction = Math.max(0, Math.min(1, (state.time - departure) / journey.routeMinutes));
  return { x: from.x + (to.x - from.x) * fraction, y: from.y + (to.y - from.y) * fraction,
    heading: Math.atan2(to.x - from.x, to.y - from.y) * 180 / Math.PI };
}
