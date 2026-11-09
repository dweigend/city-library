import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
import { officeScene } from "./scene.ts";

export const ui = defineUI(model, {
  setup: ["residents", "serviceMinutes"],
  live: { clerks: { set: (instance, value) => instance.setClerks(value) } },
  actions: [{ label: "Add resident", run: (instance) => instance.addResident() }],
  monitors: [
    { label: "Time (min)", value: (state) => state.tick },
    { label: "Waiting", value: (state) => state.waiting },
    { label: "Busy desks", value: (state) => state.busy },
    { label: "Completed", value: (state) => state.completed },
  ],
  views: [
    { type: "spatial", label: "Residents and clerk capacity", data: officeScene },
    { type: "line", label: "Waiting residents", xAxis: { label: "Time", unit: "min" }, yAxis: { label: "Residents" }, series: (state) => [{ label: "Waiting", points: state.history }] },
    { type: "table", label: "Service ledger", rows: (state) => state.residents },
  ],
});
