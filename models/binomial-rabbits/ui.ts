import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: [
    "seed",
    { field: "number", label: "Rabbits" },
    { field: "hop1", label: "Hop 1" },
    { field: "ratio1", label: "Ratio 1" },
    { field: "hop2", label: "Hop 2" },
    { field: "ratio2", label: "Ratio 2" },
    { field: "hop3", label: "Hop 3" },
    { field: "ratio3", label: "Ratio 3" },
  ],
  complete: (s) => s.done,
  live: {
    hops: {
      set: (m, v) => m.setRules({ hops: v }),
    },
    xScaling: {
      set: (m, v) => m.setRules({ xScaling: v }),
    },
  },
  actions: [{ label: "Go one hop", run: (m) => m.goOneHop() }],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/BinomialRabbits",
    label: "Source attribution · Uri Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    {
      label: "Mean",
      value: (s) => s.mean,
      format: (value: number) => value.toFixed(3),
    },
    { label: "X scale", value: (s) => s.xScale },
    {
      label: "Y scale",
      value: (s) => s.yScale,
      format: (value: number) => value.toFixed(3),
    },
  ],
  views: [
    {
      type: "bar",
      label: "Rabbit distribution",
      series: (s) => [
        {
          label: "Rabbits",
          points: s.distribution.map((p) => ({ x: p.x, y: p.count })),
        },
      ],
    },
    {
      type: "spatial",
      label: "Rabbits",
      data: (s) => ({
        width: 45,
        height: 45,
        agents: s.rabbits.map((r) => ({
          ...r,
          y: -22,
          color: "#c94236",
          size: 3,
        })),
      }),
    },
  ],
});
