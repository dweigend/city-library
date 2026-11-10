import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/PreferentialAttachment",
    label: "Source attribution · Uri Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    { label: "Nodes", value: (state) => state.nodeCount },
    { label: "Edges", value: (state) => state.edgeCount },
  ],
  views: [
    {
      type: "inspector",
      label: "Selected",
      value: (state, selectedId) =>
        state.nodes.find((node) => node.id === selectedId),
    },
    {
      type: "network",
      label: "Network",
      nodes: (state) =>
        state.nodes.map((node) => ({
          id: node.id,
          label: node.label,
          color: "#e34a33",
          size: 8 + Math.sqrt(node.degree) * 3,
        })),
      edges: (state) => state.edges,
    },
    {
      type: "bar",
      label: "Degree distribution",
      series: (state) => [
        {
          label: "Nodes",
          points: state.distribution.map((point) => ({
            x: point.degree,
            y: point.count,
          })),
        },
      ],
    },
    {
      type: "scatter",
      label: "Degree distribution · log₁₀",
      series: (state) => [
        { label: "log count", points: state.logDistribution },
      ],
    },
  ],
});
