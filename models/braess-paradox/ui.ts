import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["seed"],
  live: {
    middleOn: {
      label: "Middle road",
      set: (m, value) => m.setRules({ middleOn: value }),
    },
    spawnRate: {
      set: (m, value) => m.setRules({ spawnRate: value }),
    },
    smoothing: {
      set: (m, value) => m.setRules({ smoothing: value }),
    },
    mode: {
      label: "Route choice",
      set: (m, value) => m.setRules({ mode: value }),
    },
    randomness: {
      set: (m, value) => m.setRules({ randomness: value }),
    },
  },
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Social%20Science/Economics/Braess%20Paradox.nlogox",
    label: "Source attribution · Wilensky · CC BY-NC-SA 3.0",
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
