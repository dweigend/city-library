import { defineUI, netLogoColor, type Observation, type SpatialData } from "../../ui/index.ts";
import { model } from "./model.ts";

export const ui = defineUI(model, {
  live: { slots: { label: "Dwelling slots", set: (instance, value) => instance.setSlots(value) } },
  actions: [{ label: "Move out first household", run: instance => instance.moveOut(), enabled: state => state.occupied > 0 }],
  monitors: [{ label: "Day", value: state => state.tick }, { label: "Occupied", value: state => state.occupied },
    { label: "Available", value: state => state.available }, { label: "Waiting", value: state => state.waiting }],
  views: [
    { type: "spatial", label: "Housing · orange waiting, blue housed, gray moved out (schematic)", data: housingData },
    { type: "inspector", label: "Household", value: (state, selected) => {
      const household = state.households.find(household => household.id === selected);
      return household ? { household: household.label, reservation: household.reservation } : undefined;
    } },
    { type: "line", label: "Occupancy", xAxis: { unit: "day" }, yAxis: { label: "Households" },
      series: state => ["occupied", "waiting"].map(key => ({ label: key, points: state.history.map(sample => ({ x: sample.tick, y: sample.values[key]! })) })) },
  ],
});

type HousingObservation = Observation<typeof model>;

/** Slots and status queues are schematic presentation positions, not dwelling identities. */
export function housingData(state: HousingObservation): SpatialData {
  const rows = Math.ceil(Math.max(state.parameters.slots, state.households.length) / 5);
  const height = Math.max(8, rows * 1.5 + 2);
  const slotPosition = (index: number) => ({ x: -1.5 + (index % 5) * 1.5, y: height / 2 - 1.5 - Math.floor(index / 5) * 1.5 });
  const cells = Array.from({ length: state.parameters.slots }, (_, index) => ({
    id: `view:slot:${index}`, ...slotPosition(index), color: netLogoColor(index < state.occupied ? 57 : 8),
  }));
  const statusCounts = { waiting: 0, granted: 0, released: 0, cancelled: 0 };
  const agents = state.households.map((household, index) => {
    const ordinal = statusCounts[household.reservation]++;
    if (household.reservation === "granted") {
      return { id: household.id, ...slotPosition(ordinal), label: String(index + 1), size: 12, color: netLogoColor(105) };
    }
    const waiting = household.reservation === "waiting";
    return { id: household.id, x: (waiting ? -6.7 : 6.2) + (ordinal % 2) * 0.7,
      y: height / 2 - 1.5 - Math.floor(ordinal / 2) * 0.55, label: String(index + 1), size: 10,
      color: netLogoColor(waiting ? 25 : 5) };
  });
  return { width: 16, height, cells, agents, showLabels: true };
}
