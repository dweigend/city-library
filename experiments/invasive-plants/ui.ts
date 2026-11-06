import { defineUI, type SpatialData } from "../../ui/index.ts";

import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["seed", "initialDensity", "initialResistanceShape"],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/InvasivePlants",
    label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0",
  },
  live: {
    seedProductionRate: {
      set: (m, v) => m.setRules({ seedProductionRate: v }),
    },
    spreadDistance: {
      set: (m, v) => m.setRules({ spreadDistance: v }),
    },
    weedKillerThreshold: {
      set: (m, v) => m.setRules({ weedKillerThreshold: v }),
    },
    weedKillerEffectiveness: {
      set: (m, v) => m.setRules({ weedKillerEffectiveness: v }),
    },
    weedKillerRate: {
      set: (m, v) => m.setRules({ weedKillerRate: v }),
    },
    showSeeds: {
      set: (m, v) => m.setRules({ showSeeds: v }),
    },
    drawMode: {
      set: (m, v) => m.setRules({ drawMode: v }),
    },
    drawValue: {
      set: (m, v) => m.setRules({ drawValue: v }),
    },
  },
  actions: [
    { label: "Clear fields", run: (m) => m.clearFields() },
    { label: "Clear plots", run: (m) => m.clearPlots() },
    {
      label: "Drawing tick",
      run: (m) => m.drawingTick(),
      repeat: { label: "Draw clock", intervalMs: 100 },
    },
  ],
  drawing: {
    toggleLabel: "Draw infestation or resistance",
    enabled: () => true,
    intent: (m, i) => {
      if (i.phase !== "end") m.draw(i.position.x, i.position.y);
    },
  },
  monitors: [
    { label: "Year", value: (s) => s.tick },
    {
      label: "Aggregate infestation",
      value: (s) => s.aggregateInfestation.toFixed(2),
    },
    { label: "Seeds", value: (s) => s.seeds.length },
  ],
  views: [
    {
      type: "spatial",
      label: "Infestation, resistance and seeds",
      data: infestationResistanceAndSeedsData,
    },
    {
      type: "inspector",
      label: "Selected field",
      value: (s, id) =>
        s.cells.find((c) => c.id === id) ??
        s.seeds.find((seed) => seed.id === id),
    },
    {
      type: "line",
      label: "Aggregate infestation",
      series: (s) => [
        {
          label: "Infestation",
          points: s.history.map((p) => ({ x: p.tick, y: p.infestation })),
        },
      ],
    },
    {
      type: "bar",
      label: "Infestation levels",
      series: (s) => [
        {
          label: "Fields",
          points: s.histogram.counts.map((y, i) => ({
            x: s.histogram.edges[i]!,
            y,
          })),
        },
      ],
    },
  ],
});

type UIObservation = ReturnType<ReturnType<typeof model.create>["read"]>;

function infestationResistanceAndSeedsData(s: UIObservation): SpatialData {
  return {
    width: s.width,
    height: s.height,
    cells: s.cells.map((c) => ({
      ...c,
      color: `hsl(120 80% ${Math.sqrt(c.infestation / 100) * 45}%)`,
    })),
    agents: [
      ...s.cells
        .filter((c) => c.hasResistanceBlock && c.resistance > 0)
        .map((c) => ({
          ...c,
          size: Math.sqrt(c.resistance / 100) * 10,
          color: "#999999",
          shape: "circle" as const,
        })),
      ...s.seeds
        .filter((seed) => !seed.hidden)
        .map((seed) => ({
          ...seed,
          size: 4,
          color: "#44ee44",
          shape: "circle" as const,
        })),
    ],
  };
}
