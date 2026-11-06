import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: [{ field: "seed" }],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/CentralLimitTheorem",
    label: "Wilensky (2005) · CC BY-NC-SA 3.0",
  },
  live: [
    {
      field: "sampleSize",
      label: "Sample size",
      value: (s) => s.parameters.sampleSize,
      set: (m, v) => m.setRules({ sampleSize: Number(v) }),
    },
    {
      field: "maxValue",
      label: "Max value",
      value: (s) => s.parameters.maxValue,
      set: (m, v) => m.setRules({ maxValue: Number(v) }),
    },
    {
      field: "alsoSums",
      label: "Also sums",
      value: (s) => s.parameters.alsoSums,
      set: (m, v) => m.setRules({ alsoSums: Boolean(v) }),
    },
    {
      field: "showEV",
      label: "Show expected value",
      value: (s) => s.parameters.showEV,
      set: (m, v) => m.setRules({ showEV: Boolean(v) }),
    },
  ],
  actions: [
    { label: "Create random people", run: (m) => m.createPopulation() },
    ...([1, 2, 3, 4, 5, 6] as const).map((n) => ({
      label: `Preset ${n}`,
      run: (m: ReturnType<typeof model.create>) => m.preset(n),
    })),
  ],
  drawing: {
    toggleLabel: "Create my own people",
    enabled: () => true,
    intent: (m, intent) => {
      if (intent.phase !== "end")
        m.drawYourOwnPeople(intent.position.x, intent.position.y);
    },
  },
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Population", value: (s) => s.population },
    { label: "Samples", value: (s) => s.numSamples },
    {
      label: "Expected value",
      value: (s) => s.expectedValue?.toFixed(3) ?? "N/A",
    },
    {
      label: "Std dev means",
      value: (s) => s.stdDevMeans?.toFixed(3) ?? "N/A",
    },
    { label: "Std dev sums", value: (s) => s.stdDevSums?.toFixed(3) ?? "N/A" },
    { label: "State", value: (s) => s.message || "Ready" },
  ],
  views: [
    {
      type: "spatial",
      label: "Population",
      data: (s) => ({
        width: 31,
        height: 31,
        cells: s.cells.map((p) => ({
          id: p.id,
          x: p.x,
          y: p.y,
          color: p.active ? "#f5f5f5" : "#bdbdbd",
        })),
        agents: s.people.map((p) => ({
          id: p.id,
          x: p.x,
          y: p.y,
          color: p.chosen ? "#16a34a" : "#f87171",
          size: 9,
        })),
      }),
    },
    {
      type: "bar",
      label: "Sample-data distribution",
      series: (s) => [
        { label: "Means", color: "#b91c1c", points: s.meanHistogram },
        ...(s.parameters.alsoSums
          ? [{ label: "Sums", color: "#2563eb", points: s.sumHistogram }]
          : []),
      ],
    },
  ],
});
