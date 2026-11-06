import type { SpatialData } from "../../ui/index.ts";
import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
const colors = [
  "#16a34a",
  "#2563eb",
  "#c026d3",
  "#06b6d4",
  "#ec4899",
  "#eab308",
];
export const ui = defineUI(model, {
  setup: ["seed", "width", "height", "choices", "dice"],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/RandomCombinationsandPermutations",
    label: "Wilensky (2004) · CC BY-NC-SA 3.0",
  },
  complete: (s) => s.done,
  live: {
    singleSuccess: {
      set: (m, v) => m.setRules({ singleSuccess: v }),
    },
    analysisType: {
      set: (m, v) => m.setRules({ analysisType: v }),
    },
    bars: {
      set: (m, v) => m.setRules({ bars: v }),
    },
    sampleSize: {
      set: (m, v) => m.setRules({ sampleSize: v }),
    },
  },
  actions: [
    {
      label: "Create Combi",
      run: (m) => m.createCombi(),
      enabled: (s) => !s.abortCreate,
      pressed: (s) => s.creating,
    },
    {
      label: "Finish Combi",
      run: (m) => m.finishCombi(),
      enabled: (s) => s.creating,
    },
    {
      label: "Hide / Reveal",
      run: (m) => m.hideReveal(),
      enabled: (s) => s.exists,
    },
  ],
  drawing: {
    toggleLabel: "Edit combination",
    enabled: (s) => s.creating,
    intent: (m, intent) => {
      if (intent.phase === "begin")
        m.selectAt(intent.position.x, intent.position.y);
    },
  },
  monitors: [
    { label: "Search attempts", value: (s) => s.attempts },
    { label: "Steps in sample", value: (s) => s.countSteps },
    { label: "Samples", value: (s) => s.samplesCounter },
    { label: "Combination successes", value: (s) => s.countCombiSuccesses },
    { label: "Permutation successes", value: (s) => s.countPermisSuccesses },
    {
      label: "Mean combination",
      value: (s) => s.combiMean?.toFixed(3) ?? "N/A",
    },
    {
      label: "Mean permutations",
      value: (s) => s.permisMean?.toFixed(3) ?? "N/A",
    },
    { label: "Ratio", value: (s) => s.ratio?.toFixed(2) ?? "N/A" },
    { label: "Instructions", value: (s) => s.instructions },
  ],
  views: [
    {
      type: "spatial",
      label: "Combination and guess",
      data: combinationAndGuessData,
    },
    {
      type: "bar",
      label: "Successes per sample distribution",
      series: (s) => (s.parameters.bars ? s.distributionSeries : []),
    },
    {
      type: "line",
      label: "Success frequency lines",
      series: (s) => (s.parameters.bars ? [] : s.distributionSeries),
    },
  ],
});

type UIObservation = ReturnType<ReturnType<typeof model.create>["read"]>;

function combinationAndGuessData(s: UIObservation): SpatialData {
  return {
    width: 11,
    height: 7,
    showLabels: s.parameters.dice,
    cells: s.squares.map((p) => ({
      id: p.id,
      x: p.x,
      y: p.y,
      color:
        p.original && s.hidden
          ? "#525252"
          : p.value === null
            ? "#4b5563"
            : s.parameters.dice
              ? "#d1fae5"
              : colors[p.value]!,
    })),
    agents: s.parameters.dice
      ? s.squares
          .filter((p) => p.value !== null && !(p.original && s.hidden))
          .map((p) => ({
            id: `die-${p.id}`,
            x: p.x,
            y: p.y,
            color: "#111827",
            size: 3,
            label: String(p.value! + 1),
          }))
      : [],
  };
}
