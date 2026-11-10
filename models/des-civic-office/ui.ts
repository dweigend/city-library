import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
import { officeScene } from "./scene.ts";

export const ui = defineUI(model, {
  setup: ["residentCount", "serviceMinutes"],
  live: { clerkCount: { set: (instance, value) => instance.setClerks(value) } },
  actions: [{ label: "Add resident", run: (instance) => instance.addResident() }],
  monitors: [
    { label: "Time (min)", value: (state) => state.tick },
    { label: "Waiting", value: (state) => state.waitingResidentCount },
    { label: "Busy desks", value: (state) => state.busyClerkCount },
    { label: "Completed", value: (state) => state.completedResidentCount },
  ],
  views: [
    { type: "spatial", label: "Residents and clerk capacity", data: officeScene },
    { type: "line", label: "Waiting residents", xAxis: { label: "Time", unit: "min" }, yAxis: { label: "Residents" }, series: (state) => [{ label: "Waiting", points: state.history }] },
    { type: "table", label: "Service ledger", rows: (state) => state.residents },
  ],
});
