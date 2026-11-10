import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
import { busScene } from "./scene.ts";

export const ui = defineUI(model, {
  setup: ["busCount", "dwellMinutes"],
  live: { berthCount: { set: (instance, value) => instance.setBerths(value) } },
  actions: [{ label: "Dispatch bus", run: (instance) => instance.addBus() }],
  monitors: [
    { label: "Time (min)", value: (state) => state.time },
    { label: "Route (min)", value: (state) => state.travelMinutes },
    { label: "Waiting", value: (state) => state.waitingBusCount },
    { label: "Departed", value: (state) => state.departedBusCount },
  ],
  views: [
    { type: "spatial", label: "Bus route and berth capacity", data: busScene },
    { type: "line", label: "Interchange queue", xAxis: { label: "Time", unit: "min" }, yAxis: { label: "Buses" }, series: (state) => [{ label: "Waiting", points: state.history }] },
    { type: "table", label: "Bus ledger", rows: (state) => state.buses },
  ],
});
