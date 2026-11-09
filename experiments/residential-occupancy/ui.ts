import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  live: { slots: { label: "Dwelling slots", set: (instance, value) => instance.setSlots(value) } },
  actions: [{ label: "Move out first household", run: instance => instance.moveOut(), enabled: state => state.occupied > 0 }],
  monitors: [{ label: "Day", value: state => state.tick }, { label: "Occupied", value: state => state.occupied },
    { label: "Available", value: state => state.available }, { label: "Waiting", value: state => state.waiting }],
  views: [{ type: "table", label: "Reservation status", rows: state => state.households },
    { type: "line", label: "Occupancy", xAxis: { unit: "day" }, yAxis: { label: "Households" },
      series: state => ["occupied", "waiting"].map(key => ({ label: key, points: state.history.map(sample => ({ x: sample.tick, y: sample.values[key]! })) })) }],
});
