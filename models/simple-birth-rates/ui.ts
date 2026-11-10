import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["seed"],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/SimpleBirthRates",
    label: "Source attribution · Wilensky · CC BY-NC-SA 3.0",
  },
  live: {
    carryingCapacity: {
      set: (m, v) => m.setRules({ carryingCapacity: v }),
    },
    redFertility: {
      set: (m, v) => m.setRules({ redFertility: v }),
    },
    blueFertility: {
      set: (m, v) => m.setRules({ blueFertility: v }),
    },
  },
  actions: [
    {
      label: "Advance population",
      run: (m) => m.advanceUntilRestart(),
      repeat: {
        label: "Repeat experiment",
        intervalMs: 100,
      },
    },
    {
      label: "Initialize population",
      run: (m) => m.initializePopulation(),
    },
  ],
  monitors: [
    {
      label: "Generation",
      value: (s) => s.tick,
    },
    {
      label: "Reds",
      value: (s) => s.redCount,
    },
    {
      label: "Blues",
      value: (s) => s.blueCount,
    },
  ],
  views: [
    {
      type: "spatial",
      label: "Population",
      data: (s) => ({
        width: s.width,
        height: s.height,
        agents: s.agents.map((a) => ({
          ...a,
          color: a.color === "red" ? "#d73027" : "#2878cb",
          size: 5,
        })),
      }),
    },
    {
      type: "line",
      label: "Populations",
      series: (s) =>
        (["red", "blue", "total"] as const).map((key) => ({
          label: key,
          color:
            key === "red" ? "#d73027" : key === "blue" ? "#2878cb" : "#259b45",
          points: s.history.map((p) => ({
            x: p.tick,
            y: p[key],
          })),
        })),
    },
    {
      type: "table",
      label: "Experiment output",
      rows: (s) =>
        s.output.map((message) => ({
          message,
        })),
    },
  ],
});
