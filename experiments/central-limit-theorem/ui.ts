import { defineUI, type Observation, type SpatialData } from "../../ui/index.ts";

import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["seed"],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/CentralLimitTheorem",
    label: "Wilensky (2005) · CC BY-NC-SA 3.0",
  },
  live: {
    sampleSize: {
      set: (m, v) => m.setRules({ sampleSize: v }),
    },
    maxValue: {
      set: (m, v) => m.setRules({ maxValue: v }),
    },
    alsoSums: {
      set: (m, v) => m.setRules({ alsoSums: v }),
    },
    showEV: {
      label: "Show expected value",
      set: (m, v) => m.setRules({ showEV: v }),
    },
  },
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
      value: (s) => s.expectedValue ?? "N/A",
      format: (value: number | string) =>
        typeof value === "number" ? value.toFixed(3) : value,
    },
    {
      label: "Std dev means",
      value: (s) => s.stdDevMeans ?? "N/A",
      format: (value: number | string) =>
        typeof value === "number" ? value.toFixed(3) : value,
    },
    {
      label: "Std dev sums",
      value: (s) => s.stdDevSums ?? "N/A",
      format: (value: number | string) =>
        typeof value === "number" ? value.toFixed(3) : value,
    },
    { label: "State", value: (s) => s.message || "Ready" },
  ],
  views: [
    {
      type: "spatial",
      label: "Population",
      data: populationData,
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

type UIObservation = Observation<typeof model>;

function populationData(s: UIObservation): SpatialData {
  return {
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
  };
}
