import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: [
    { field: "seed" },
    { field: "initialDensity", label: "Initial density" },
    { field: "initialResistanceShape", label: "Initial resistance shape" },
  ],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/InvasivePlants",
    label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0",
  },
  live: [
    {
      field: "seedProductionRate",
      label: "Seed production rate",
      value: (s) => s.parameters.seedProductionRate,
      set: (m, v) => m.setRules({ seedProductionRate: Number(v) }),
    },
    {
      field: "spreadDistance",
      label: "Spread distance",
      value: (s) => s.parameters.spreadDistance,
      set: (m, v) => m.setRules({ spreadDistance: Number(v) }),
    },
    {
      field: "weedKillerThreshold",
      label: "Weed killer threshold",
      value: (s) => s.parameters.weedKillerThreshold,
      set: (m, v) => m.setRules({ weedKillerThreshold: Number(v) }),
    },
    {
      field: "weedKillerEffectiveness",
      label: "Weed killer effectiveness",
      value: (s) => s.parameters.weedKillerEffectiveness,
      set: (m, v) => m.setRules({ weedKillerEffectiveness: Number(v) }),
    },
    {
      field: "weedKillerRate",
      label: "Weed killer rate",
      value: (s) => s.parameters.weedKillerRate,
      set: (m, v) => m.setRules({ weedKillerRate: Number(v) }),
    },
    {
      field: "showSeeds",
      label: "Show seeds",
      value: (s) => s.parameters.showSeeds,
      set: (m, v) => m.setRules({ showSeeds: Boolean(v) }),
    },
    {
      field: "drawMode",
      label: "Draw mode",
      value: (s) => s.parameters.drawMode,
      set: (m, v) =>
        m.setRules({ drawMode: String(v) as "infestation" | "resistance" }),
    },
    {
      field: "drawValue",
      label: "Draw value",
      value: (s) => s.parameters.drawValue,
      set: (m, v) => m.setRules({ drawValue: Number(v) }),
    },
  ],
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
      data: (s) => ({
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
      }),
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
