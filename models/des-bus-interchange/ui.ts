import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

export const ui = defineUI(model, {
  setup: ["buses", "dwellMinutes"],
  live: { berths: { set: (instance, value) => instance.setBerths(value) } },
  actions: [{ label: "Dispatch bus", run: (instance) => instance.addBus() }],
  monitors: [
    { label: "Time (min)", value: (state) => state.time },
    { label: "Route (min)", value: (state) => state.travelMinutes },
    { label: "Waiting", value: (state) => state.waiting },
    { label: "Departed", value: (state) => state.departed },
  ],
  views: [
    { type: "network", label: "Bus routes", nodes: (state) => state.nodes, edges: (state) => state.edges },
    { type: "line", label: "Interchange queue", xAxis: { label: "Time", unit: "min" }, yAxis: { label: "Buses" }, series: (state) => [{ label: "Waiting", points: state.history }] },
    { type: "table", label: "Bus ledger", rows: (state) => state.buses },
  ],
});
