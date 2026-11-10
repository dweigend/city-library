import { defineUI, type Observation, type SpatialData } from "../../ui/index.ts";

import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["seed", "bugCount"],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/Heatbugs",
    label: "Source attribution · Wilensky · CC BY-NC-SA 3.0",
  },
  complete: (s) => s.done,
  change: (instance, changes) => instance.setRules(changes),
  live: {
    maxOutputHeat: {},
    minOutputHeat: {},
    maxIdealTemp: {
      label: "Max ideal temperature",
    },
    minIdealTemp: {
      label: "Min ideal temperature",
    },
    evaporationRate: {},
    diffusionRate: {},
    randomMoveChance: {
      label: "Random move chance (%)",
    },
  },
  actions: [
    { label: "Deep freeze", run: (m) => m.deepFreeze() },
    { label: "Heat up", run: (m) => m.heatUp() },
    {
      label: "Ideal temperature",
      run: (m) => m.setColorMode("ideal"),
      pressed: (s) => !s.colorByUnhappiness,
    },
    {
      label: "Happiness",
      run: (m) => m.setColorMode("unhappiness"),
      pressed: (s) => s.colorByUnhappiness,
    },
    { label: "Watch happiest", run: (m) => m.watch("happiest") },
    { label: "Watch saddest", run: (m) => m.watch("saddest") },
    { label: "Reset perspective", run: (m) => m.watch("reset") },
  ],
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Bugs", value: (s) => s.bugs.length },
    {
      label: "Mean unhappiness",
      value: (s) => s.meanUnhappiness ?? "undefined",
      format: (value: number | string) =>
        typeof value === "number" ? value.toFixed(3) : value,
    },
    { label: "Watched bug", value: (s) => s.watched ?? "none" },
  ],
  views: [
    {
      type: "spatial",
      label: "Heat and bugs",
      data: heatAndBugsData,
    },
    {
      type: "inspector",
      label: "Selected bug",
      value: (s, id) => s.bugs.find((b) => b.id === id),
    },
    {
      type: "line",
      label: "Average bug unhappiness",
      series: (s) => [
        {
          label: "Unhappiness",
          points: s.history
            .filter((p) => p.unhappiness !== null)
            .map((p) => ({ x: p.tick, y: p.unhappiness! })),
        },
      ],
    },
  ],
});

type UIObservation = Observation<typeof model>;

function heatAndBugsData(s: UIObservation): SpatialData {
  return {
    width: s.width,
    height: s.height,
    cells: s.cells.map((c) => ({
      ...c,
      color: `hsl(0 80% ${Math.min(100, (c.temp / 150) * 100)}%)`,
    })),
    agents: s.bugs.map((b) => ({
      ...b,
      shape: "triangle" as const,
      size: b.id === s.watched ? 14 : 8,
      color: s.colorByUnhappiness
        ? `hsl(220 80% ${20 + 60 * (1 - b.unhappiness / (s.maxUnhappiness || 1))}%)`
        : `hsl(90 80% ${30 + (40 * (b.idealTemp - s.parameters.minIdealTemp)) / (s.parameters.maxIdealTemp - s.parameters.minIdealTemp || 1)}%)`,
    })),
  };
}
