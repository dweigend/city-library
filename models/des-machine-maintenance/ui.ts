import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
import { scene } from "./scene.ts";
export const ui = defineUI(model, {
  setup: ["repairMinutes", "failureMinutes"],
  live: { repairTeamCount: { set: (instance, value) => instance.setRepairTeams(value) } },
  monitors: [
    { label: "Time (min)", value: (state) => state.time },
    { label: "Operational machines", value: (state) => state.operationalMachineCount },
    { label: "Waiting repairs", value: (state) => state.waitingMachineCount },
    { label: "Completed repairs", value: (state) => state.completedRepairCount },
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
        repairs: machine.repairCount,
        availability: machine.availability.toFixed(3),
      })),
    },
    { type: "table", label: "Event trace", rows: (state) => state.trace },
  ],
});
