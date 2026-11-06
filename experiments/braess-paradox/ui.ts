import { defineUI } from "../../ui/index.ts";
import { model, type Parameters } from "./model.ts";
const rules = [
  "middleOn",
  "spawnRate",
  "smoothing",
  "mode",
  "randomness",
] as const;
const labels = {
  middleOn: "Middle road",
  spawnRate: "Spawn rate",
  smoothing: "Smoothing",
  mode: "Route choice",
  randomness: "Randomness",
};
export const ui = defineUI(model, {
  setup: [{ field: "seed" }],
  live: rules.map((field) => ({
    field,
    label: labels[field],
    value: (s) => s.parameters[field],
    set: (m, value) => m.setRules({ [field]: value } as Partial<Parameters>),
  })),
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/BraessParadox",
    label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Active commuters", value: (s) => s.commuters.length },
    { label: "Cars spawned", value: (s) => s.carsSpawned },
    { label: "Completed", value: (s) => s.completed },
    { label: "Last travel time", value: (s) => s.travelTime },
    { label: "Average travel time", value: (s) => s.avg },
  ],
  views: [
    {
      type: "spatial",
      label: "Road congestion and commuters",
      data: (s) => ({
        width: 49,
        height: 49,
        cells: s.cells,
        agents: s.commuters.map((a) => ({
          ...a,
          color: "#70cced",
          shape: "triangle" as const,
          size: 10,
        })),
      }),
    },
    {
      type: "line",
      label: "Travel time (ticks / 450)",
      series: (s) =>
        (["top", "bottom", "middle", "avg"] as const).map((key) => ({
          label: key,
          points: s.history.map((h) => ({ x: h.tick, y: h[key] })),
        })),
    },
    {
      type: "bar",
      label: "Routes taken",
      series: (s) => [
        {
          label: "Active commuters",
          points: [0, 1, 2].map((x) => ({
            x,
            y: s.routeCounts[x]!,
          })),
        },
      ],
    },
    {
      type: "bar",
      label: "Choice probabilities",
      series: (s) => [
        {
          label: "Probability",
          points: [
            { x: 0, y: s.topProb },
            { x: 1, y: s.bottomProb },
            { x: 2, y: s.middleProb },
          ],
        },
      ],
    },
  ],
});
