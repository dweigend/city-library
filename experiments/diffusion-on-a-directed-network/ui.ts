import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

export const ui = defineUI(model, {
  setup: [{ field: "seed" }, { field: "gridSize", label: "Grid size" }, { field: "linkChance", label: "Link chance (%)" }],
  source: { url: "https://ccl.northwestern.edu/netlogo/models/DiffusiononaDirectedNetwork", label: "Original NetLogo model · Stonedahl and Wilensky · CC BY-NC-SA 3.0" },
  actions: [{ label: "Rewire a link", repeat: { label: "Keep rewiring", intervalMs: 200 }, run: instance => instance.rewire(), enabled: state => state.counts.activeLinks > 0 }],
  live: [{ field: "diffusionRate", label: "Diffusion rate (%)", value: state => state.parameters.diffusionRate, set: (instance, value) => instance.setRules({ diffusionRate: Number(value) }) }],
  monitors: [
    { label: "Tick", value: state => state.tick },
    { label: "Nodes", value: state => state.counts.nodes },
    { label: "Active links", value: state => state.counts.activeLinks },
    { label: "Total value", value: state => state.totalValue.toPrecision(6) },
    { label: "Max flow", value: state => state.maxFlow.toPrecision(4) },
    { label: "Mean flow", value: state => state.meanFlow.toPrecision(4) },
  ],
  views: [
    { type: "inspector", label: "Selected", value: (state, selected) => state.nodes.find(node => node.id === selected) },
    {
      type: "network", label: "Active directed connections",
      nodes: state => state.nodes.map(node => ({ id: node.id, label: String(node.index), color: "#355fa5", position: { x: node.x * 25, y: -node.y * 25 }, size: 4 + (state.totalValue === 0 ? 0 : 50 * Math.sqrt(node.value / state.totalValue)) })),
      // Width, rather than source grayscale brightness, visualizes the observed flow.
      edges: state => state.edges.filter(edge => edge.active).map(edge => ({
        id: edge.id, from: edge.from, to: edge.to, directed: true,
        width: 1 + (Number.isFinite(state.maxFlow) && state.maxFlow > 0 && Number.isFinite(edge.currentFlow)
          ? 4 * Math.max(0, Math.min(1, edge.currentFlow / state.maxFlow)) : 0),
      })),
    },
    {
      type: "bar", label: "Current value distribution",
      series: state => [{ label: "Nodes", points: state.histogram.counts.map((count, index) => ({ x: (state.histogram.edges[index]! + state.histogram.edges[index + 1]!) / 2, y: count })) }],
    },
    { type: "table", label: "Active transfers · first 20", rows: state => state.edges.filter(edge => edge.active).slice(0, 20).map(edge => ({ from: edge.fromIndex, to: edge.toIndex, flow: edge.currentFlow })) },
  ],
});
