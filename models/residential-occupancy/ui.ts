import { defineUI, netLogoColor, type Observation, type SpatialData } from "../../ui/index.ts";
import { model } from "./model.ts";

export const ui = defineUI(model, {
  complete: state => state.done,
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

const SLOT_COLUMNS = 5;
const SLOT_SPACING = 1.5;
const WAITING_LANE_X = -6.7;
const MOVED_OUT_LANE_X = 6.2;
const QUEUE_COLUMN_SPACING = 0.7;
const QUEUE_ROW_SPACING = 0.55;
const SLOT_OCCUPIED_COLOR = netLogoColor(57);
const SLOT_AVAILABLE_COLOR = netLogoColor(8);
const RESIDENT_HOUSED_COLOR = netLogoColor(105);
const RESIDENT_WAITING_COLOR = netLogoColor(25);
const RESIDENT_MOVED_OUT_COLOR = netLogoColor(5);

/** Slots and status queues are schematic presentation positions, not dwelling identities. */
export function housingData(state: HousingObservation): SpatialData {
  const rows = Math.ceil(Math.max(state.parameters.slots, state.households.length) / SLOT_COLUMNS);
  const height = Math.max(8, rows * SLOT_SPACING + 2);
  const slotPosition = (index: number) => ({
    x: -SLOT_SPACING + (index % SLOT_COLUMNS) * SLOT_SPACING,
    y: height / 2 - SLOT_SPACING - Math.floor(index / SLOT_COLUMNS) * SLOT_SPACING,
  });
  const cells = Array.from({ length: state.parameters.slots }, (_, index) => ({
    id: `view:slot:${index}`,
    ...slotPosition(index),
    color: index < state.occupied ? SLOT_OCCUPIED_COLOR : SLOT_AVAILABLE_COLOR,
  }));
  const statusCounts = { waiting: 0, granted: 0, released: 0, cancelled: 0 };
  const agents = state.households.map((household, index) => {
    const ordinal = statusCounts[household.reservation]++;
    if (household.reservation === "granted") {
      return { id: household.id, ...slotPosition(ordinal), label: String(index + 1), size: 12, color: RESIDENT_HOUSED_COLOR };
    }
    const waiting = household.reservation === "waiting";
    return {
      id: household.id,
      x: (waiting ? WAITING_LANE_X : MOVED_OUT_LANE_X) + (ordinal % 2) * QUEUE_COLUMN_SPACING,
      y: height / 2 - SLOT_SPACING - Math.floor(ordinal / 2) * QUEUE_ROW_SPACING,
      size: 10,
      color: waiting ? RESIDENT_WAITING_COLOR : RESIDENT_MOVED_OUT_COLOR,
    };
  });
  return { width: 16, height, cells, agents, showLabels: true };
}
