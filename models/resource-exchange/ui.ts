import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

export const ui = defineUI(model, {
  setup: ["count", "initialEnergy", "seed"],
  monitors: [
    { label: "Tick", value: state => state.tick },
    { label: "Attached agents", value: state => state.agentCount },
    { label: "Total energy", value: state => state.totalEnergy },
    { label: "Minimum energy", value: state => state.minimumEnergy },
    { label: "Maximum energy", value: state => state.maximumEnergy },
  ],
  views: [{
    type: "bar",
    label: "Energy distribution",
    xAxis: { label: "Energy" },
    yAxis: { label: "Agents" },
    series: state => [{ label: "Agents", points: energyHistogram(state.agents.map(agent => agent.energy)) }],
  }, {
    type: "table",
    label: "Exchange ledger",
    rows: state => state.agents.map(agent => ({
      agent: agent.label,
      energy: agent.energy,
      sent: agent.sent,
      received: agent.received,
    })),
  }],
});

/** Number of agents holding each energy amount, in ascending energy order. */
function energyHistogram(energies: readonly number[]) {
  const counts = new Map<number, number>();
  for (const energy of energies) counts.set(energy, (counts.get(energy) ?? 0) + 1);
  return [...counts].sort(([a], [b]) => a - b).map(([energy, agents]) => ({ x: energy, y: agents }));
}
