import { collectionDiagram, scientificPalette } from "../../ui/index.ts";
import type { CollectionItem, Observation, SpatialData } from "../../ui/index.ts";
import type { model } from "./model.ts";

type Vehicle = Observation<typeof model>["vehicles"][number];

/** Resource order and identity are separate from anonymous charger capacity units. */
export function chargingScene(state: Observation<typeof model>): SpatialData {
  const diagram = collectionDiagram([
    {
      id: "queue", label: "Priority queue", kind: "items", order: "supplied", color: scientificPalette.waiting,
      items: state.waitingVehicles.map(number => vehicleItem(state.vehicles[number - 1]!)),
    },
    {
      id: "active", label: "Charging vehicles", kind: "items", color: scientificPalette.active,
      items: state.vehicles.filter(vehicle => vehicle.status === "granted").map(vehicleItem),
    },
    {
      id: "chargers", label: "Charger capacity", kind: "capacity", color: scientificPalette.neutral,
      used: state.activeVehicleCount, capacity: state.parameters.chargerCount, unit: "vehicles",
    },
    {
      id: "completed", label: "Completed vehicles", kind: "items", color: scientificPalette.completed,
      items: state.vehicles.filter(vehicle => vehicle.status === "released").map(vehicleItem),
    },
    {
      id: "cancelled", label: "Cancelled vehicles", kind: "items", color: scientificPalette.unavailable,
      items: state.vehicles.filter(vehicle => vehicle.status === "cancelled").map(vehicleItem),
    },
  ]);
  return { ...diagram, description: `${diagram.description} Diamonds mark priority vehicles; rectangles mark ordinary vehicles. Capacity units do not identify a vehicle's charger.` };
}

function vehicleItem(vehicle: Vehicle): CollectionItem {
  return {
    id: `vehicle:${vehicle.number}`,
    label: vehicle.priority < 0 ? `Vehicle ${vehicle.number} · priority ${vehicle.priority}` : `Vehicle ${vehicle.number}`,
    shape: vehicle.priority < 0 ? "diamond" : "rectangle",
  };
}
