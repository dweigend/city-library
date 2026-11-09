import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  live: { influence: { set: (instance, value) => instance.setInfluence(value) } },
  monitors: [{ label: "Tick", value: state => state.tick }, { label: "Recycling households", value: state => state.adopters }],
  views: [{ type: "network", label: "Peer network", nodes: state => state.nodes.map((node, index) => ({ id: node.id, label: `H${index + 1}` })), edges: state => state.edges },
    { type: "inspector", label: "Household", value: (state, selected) => {
      const node = state.nodes.find(node => node.id === selected);
      return node ? { household: node.label, recycling: node.recycling } : undefined;
    } },
    { type: "line", label: "Adoption share", yAxis: { label: "Share" },
      series: state => [{ label: "Recycling", points: state.history.map(sample => ({ x: sample.tick, y: sample.values.share! })) }] }],
});
