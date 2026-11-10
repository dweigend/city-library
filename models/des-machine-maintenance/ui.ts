import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
import { scene } from "./scene.ts";
export const ui = defineUI(model, {
  setup: ["repairMinutes", "failureMinutes"],
  live: { repairTeams: { set: (instance, value) => instance.setRepairTeams(value) } },
  monitors: [
    { label: "Time (min)", value: (state) => state.time },
    { label: "Operational machines", value: (state) => state.operational },
    { label: "Waiting repairs", value: (state) => state.waiting },
    { label: "Completed repairs", value: (state) => state.completedRepairs },
    { label: "Availability", value: (state) => state.availability, format: (value: number) => value.toFixed(3) },
  ],
  views: [
    { type: "spatial", label: "Machines and repair teams", data: scene },
    {
      type: "table",
      label: "Machine ledger",
      rows: (state) => state.machines.map((machine) => ({
        machine: machine.number,
        status: machine.status,
        repairs: machine.repairs,
        availability: machine.availability.toFixed(3),
      })),
    },
    { type: "table", label: "Event trace", rows: (state) => state.trace },
  ],
});
