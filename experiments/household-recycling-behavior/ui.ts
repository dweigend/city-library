import { defineUI, netLogoColor, type Observation, type NetworkNode } from "../../ui/index.ts";
import { model } from "./model.ts";

export const ui = defineUI(model, {
  live: { influence: { set: (instance, value) => instance.setInfluence(value) } },
  monitors: [{ label: "Tick", value: state => state.tick }, { label: "Recycling households", value: state => state.adopters }],
  views: [
    { type: "network", label: "Peer adoption · green recycling, orange waiting", nodes: recyclingNodes, edges: state => state.edges },
    { type: "inspector", label: "Household", value: (state, selected) => {
      const node = state.nodes.find(node => node.id === selected);
      return node ? { household: node.label, recycling: node.recycling } : undefined;
    } },
    { type: "line", label: "Adoption share", yAxis: { label: "Share" },
      series: state => [{ label: "Recycling", points: state.history.map(sample => ({ x: sample.tick, y: sample.values.share! })) }] },
  ],
});

/** Fixed ring positions expose the model's actual ring edges without consuming its Random stream. */
export function recyclingNodes(state: Observation<typeof model>): readonly NetworkNode[] {
  return state.nodes.map((node, index) => {
    const angle = 2 * Math.PI * index / state.nodes.length - Math.PI / 2;
    return { id: node.id, label: `H${index + 1}`, color: netLogoColor(node.recycling ? 55 : 25), size: node.recycling ? 18 : 13,
      position: { x: Math.cos(angle) * 150, y: Math.sin(angle) * 150 } };
  });
}
