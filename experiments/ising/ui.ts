import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: [
    "width",
    "height",
    "seed",
    { field: "probabilityOfSpinUp", label: "Initial spin up (%)" },
  ],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/Ising",
    label: "Original NetLogo model · Uri Wilensky · CC BY-NC-SA 3.0",
  },
  live: {
    temperature: {
      set: (m, v) => m.setTemperature(v),
    },
  },
  monitors: [
    { label: "Attempted flips", value: (s) => s.tick },
    { label: "Magnetization", value: (s) => s.magnetization.toFixed(4) },
  ],
  views: [
    {
      type: "grid",
      label: "Spins",
      data: (s) => ({
        width: s.width,
        height: s.height,
        cells: s.cells.map((c) => ({
          ...c,
          color: c.spin === 1 ? "#5a8fd8" : "#15336b",
        })),
      }),
    },
    {
      type: "line",
      label: "Magnetization",
      series: (s) => [
        {
          label: "Magnetization",
          points: s.history.map((p) => ({ x: p.tick, y: p.magnetization })),
        },
      ],
    },
  ],
});
