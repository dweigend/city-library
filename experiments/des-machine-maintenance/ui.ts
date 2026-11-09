import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
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
    { type: "spatial", label: "Machine status", data: (state) => ({ width: 10, height: 4, agents: state.machines.map((machine) => ({ id: machine.id, x: machine.x, y: machine.y, label: `${machine.number}: ${machine.status}` })) }) },
    { type: "table", label: "Machine ledger", rows: (state) => state.machines },
    { type: "table", label: "Event trace", rows: (state) => state.trace },
  ],
});
