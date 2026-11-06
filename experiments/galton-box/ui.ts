import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: [
    { field: "seed" },
    { field: "numberOfRows", label: "Number of rows" },
  ],
  complete: (s) => s.done,
  live: [
    {
      field: "numberOfBalls",
      label: "Number of balls",
      value: (s) => s.parameters.numberOfBalls,
      set: (m, v) => m.setRules({ numberOfBalls: Number(v) }),
    },
    {
      field: "chanceOfBouncingRight",
      label: "Bounce right (%)",
      value: (s) => s.parameters.chanceOfBouncingRight,
      set: (m, v) => m.setRules({ chanceOfBouncingRight: Number(v) }),
    },
    {
      field: "pileUp",
      label: "Pile up",
      value: (s) => s.parameters.pileUp,
      set: (m, v) => m.setRules({ pileUp: Boolean(v) }),
    },
  ],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/GaltonBox",
    label: "Original · Uri Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Balls", value: (s) => s.balls },
    {
      label: "State",
      value: (s) => (s.full ? "Full" : s.done ? "Finished" : "Active"),
    },
  ],
  views: [
    {
      type: "spatial",
      label: "Galton box",
      data: (s) => ({
        width: s.width,
        height: s.height,
        cells: s.pegs.map((p, i) => ({
          ...p,
          id: `peg-${i}`,
          color: "#d6ad24",
        })),
        agents: s.particles.map((b) => ({ ...b, color: "#c94236", size: 5 })),
      }),
    },
    {
      type: "bar",
      label: "Counters",
      series: (s) => [
        {
          label: "Balls",
          points: s.counters.map((c) => ({ x: c.x, y: c.count })),
        },
      ],
    },
  ],
});
