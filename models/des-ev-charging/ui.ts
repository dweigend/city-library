import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

export const ui = defineUI(model, {
  setup: ["vehicles", "sessionMinutes"],
  live: { chargers: { set: (instance, value) => instance.setChargers(value) } },
  actions: [
    { label: "Add priority vehicle", run: (instance) => instance.addVehicle(-1) },
    { label: "Cancel waiting vehicle", run: (instance) => instance.abandonWaiting(), enabled: (state) => state.waiting > 0 },
  ],
  monitors: [
    { label: "Time (min)", value: (state) => state.tick },
    { label: "Charging", value: (state) => state.active },
    { label: "Waiting", value: (state) => state.waiting },
    { label: "Completed", value: (state) => state.completed },
    { label: "Abandoned", value: (state) => state.abandoned },
  ],
  views: [
    { type: "line", label: "Charger occupancy", xAxis: { label: "Time", unit: "min" }, yAxis: { label: "Vehicles" }, series: (state) => [{ label: "Charging", points: state.history }] },
    { type: "table", label: "Charging sessions", rows: (state) => state.vehicles },
  ],
});
