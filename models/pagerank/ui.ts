import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: [{ field: "networkChoice", label: "Network" }, "seed"],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/PageRank",
    label: "Stonedahl & Wilensky · CC BY-NC-SA 3.0",
  },
  change: (instance, changes) => instance.setParameters(changes),
  live: {
    calculationMethod: {},
    dampingFactor: {},
    surferCount: {},
    watchSurfers: {},
    showPageRanks: {},
  },
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    {
      label: "Total rank",
      value: (s) => s.totalRank,
      format: (value: number) => value.toFixed(6),
    },
    {
      label: "Maximum rank",
      value: (s) => s.maxRank,
      format: (value: number) => value.toFixed(6),
    },
    { label: "Surfers", value: (s) => s.surfers.length },
  ],
  views: [
    {
      type: "network",
      label: "Pages and edges",
      nodes: (s) =>
        s.pages.map((p) => ({
          id: String(p.id),
          label: `${p.id}${s.parameters.showPageRanks ? `: ${p.rank.toFixed(3)}` : ""}${s.parameters.watchSurfers && p.surferCount ? ` [${p.surferCount} ${p.surferCount === 1 ? "surfer" : "surfers"}]` : ""}`,
          color: p.color,
          size: Math.max(8, p.size * 10),
          position: { x: p.x * 20, y: -p.y * 20 },
        })),
      edges: (s) =>
        s.edges.map((e) => ({
          id: e.id,
          from: String(e.from),
          to: String(e.to),
          directed: true,
          color: e.color,
          width: e.traveledBy === null ? 1 : 3,
        })),
    },
    {
      type: "bar",
      label: "Current ranks",
      series: (s) => [
        {
          label: "PageRank",
          points: s.pages.map((p) => ({ x: p.id, y: p.rank })),
        },
      ],
    },
    {
      type: "table",
      label: "Surfers",
      rows: (s) =>
        s.parameters.watchSurfers
          ? s.surfers.map((p) => ({ surfer: p.id, page: p.currentPage }))
          : [],
    },
    {
      type: "table",
      label: "Page visits",
      rows: (s) =>
        s.pages.map((p) => ({ page: p.id, visits: p.visitCount, rank: p.rank })),
    },
  ],
});
