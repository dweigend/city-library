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
