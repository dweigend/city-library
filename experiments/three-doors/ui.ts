import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: [
    { field: "seed" },
    { field: "number", label: "Racers" },
    { field: "gradation" },
  ],
  complete: (s) => s.done,
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/ThreeDoors",
    label: "Original · Uri Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "State", value: (s) => (s.done ? "Race finished" : "Racing") },
  ],
  views: [
    {
      type: "spatial",
      label: "Race",
      data: (s) => ({
        width: s.width,
        height: s.height,
        agents: s.racers.map((r) => ({
          id: r.id,
          x: r.x,
          y: r.y,
          heading: 0,
          shape: "triangle",
          size: 5,
          color: `rgb(${Math.round(240 - (140 * r.hunch) / 100)},${Math.round(240 - (140 * r.hunch) / 100)},${Math.round(240 - (140 * r.hunch) / 100)})`,
        })),
      }),
    },
    {
      type: "scatter",
      label: "Switching and wins",
      series: (s) => [
        {
          label: "Racers",
          points: s.racers.map((r) => ({ x: r.hunch, y: r.wins })),
        },
      ],
    },
  ],
});
