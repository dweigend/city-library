import { scientificPalette } from "../../ui/index.ts";
import type { Observation, SpatialAgent, SpatialData } from "../../ui/index.ts";
import type { model } from "./model.ts";

export function scene(state: Observation<typeof model>): SpatialData {
  const agents: SpatialAgent[] = [];
  for (const machine of state.machines) {
    const x = machine.x * 2;
    let color: string = scientificPalette.waiting;
    if (machine.status === "operational") color = scientificPalette.completed;
    else if (machine.status === "repairing") color = scientificPalette.active;
    agents.push({ id: machine.id, x, y: 0, shape: "rectangle", extent: { width: 2, height: 2 }, color });
    if (machine.status === "repairing") agents.push({ id: `crew:${machine.number}`, x, y: -2.2, shape: "triangle", size: 15, color: scientificPalette.active });
  }
  for (let team = 0; team < Math.max(0, state.parameters.repairTeamCount - state.busyRepairTeamCount); team++) agents.push({ id: `idle-crew:${team}`, x: -1 + team, y: -3.8,
    shape: "triangle", size: 15, color: scientificPalette.neutral });
  return { width: 20, height: 12, showLabels: false, agents,
    labels: [...state.machines.flatMap(machine => [{ x: machine.x * 2, y: 2, text: `Machine ${machine.number}` },
      { x: machine.x * 2, y: -1.4, text: machine.status }, { x: machine.x * 2, y: 3, text: `${machine.repairCount} repairs` }]),
      { x: 0, y: -5, text: `Teams · ${state.busyRepairTeamCount} occupied · ${Math.max(0, state.parameters.repairTeamCount - state.busyRepairTeamCount)} available` }],
    description: `Three square machines: ${state.operationalMachineCount} operational, ${state.waitingMachineCount} waiting, ${state.busyRepairTeamCount} being repaired. Triangle teams appear beneath assigned machines; neutral triangles are available teams. Status labels distinguish each state. ${state.completedRepairCount} repairs completed.` };
}
