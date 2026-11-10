import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["seed"],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/SimpleBirthRates",
    label: "Source attribution · Wilensky · CC BY-NC-SA 3.0",
  },
  change: (instance, changes) => instance.setRules(changes),
  live: {
    carryingCapacity: {},
    redFertility: {},
    blueFertility: {},
  },
  actions: [
    {
      label: "Advance population",
      run: (m) => m.advanceUntilRestart(),
      repeat: {
        label: "Repeat population step",
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
        (["redPersonCount", "bluePersonCount", "personCount"] as const).map((key) => ({
          label: key === "redPersonCount" ? "Red" : key === "bluePersonCount" ? "Blue" : "Total",
          color:
            key === "redPersonCount" ? "#d73027" : key === "bluePersonCount" ? "#2878cb" : "#259b45",
          points: s.history.map((p) => ({
            x: p.tick,
            y: p[key],
          })),
        })),
    },
    {
      type: "table",
      label: "Population output",
      rows: (s) =>
        s.output.map((message) => ({
          message,
        })),
    },
  ],
});
