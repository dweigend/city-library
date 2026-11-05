import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
const palette = [
  "#064e3b",
  "#065f46",
  "#047857",
  "#10b981",
  "#6ee7b7",
  "#a7f3d0",
  "#d1fae5",
];
export const ui = defineUI(model, {
  setup: [
    { field: "seed" },
    ...(
      [
        "ratio0",
        "ratio1",
        "ratio2",
        "ratio3",
        "ratio4",
        "ratio5",
        "ratio6",
      ] as const
    ).map((field, i) => ({ field, label: `Ratio ${i} units` })),
    { field: "sampleSize", label: "Sample size" },
    { field: "setupApart", label: "Setup apart" },
  ],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/ExpectedValue",
    label: "Abrahamson & Wilensky (2004) · CC BY-NC-SA 3.0",
  },
  live: [
    {
      field: "blackOut",
      label: "Black out",
      value: (s) => s.parameters.blackOut,
      set: (m, v) => m.setDisplay({ blackOut: Boolean(v) }),
    },
    {
      field: "dieNums",
      label: "Die numbers",
      value: (s) => s.parameters.dieNums,
      set: (m, v) => m.setDisplay({ dieNums: Boolean(v) }),
    },
  ],
  actions: [{ label: "Clear selection", run: (m) => m.clearSelection() }],
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Expected value", value: (s) => s.expectedValue.toFixed(3) },
    { label: "Runs", value: (s) => s.runs },
    { label: "This sample total", value: (s) => s.sampleTotal },
    { label: "Mean of samples", value: (s) => s.mean.toFixed(3) },
    { label: "Calculation", value: (s) => s.calculation },
  ],
  views: [
    {
      type: "spatial",
      label: "Tiles",
      data: (s) => ({
        width: 15,
        height: 15,
        showLabels: true,
        cells: s.cells.map((t) => ({
          id: t.id,
          x: t.x,
          y: t.y,
          color: t.visible ? palette[t.value]! : "#101010",
        })),
        agents: [
          {
            id: "walker",
            x: s.walker.x,
            y: s.walker.y,
            color: "#2563eb",
            size: 12,
          },
          ...s.cells
            .filter((t) => t.selected)
            .map((t) => ({
              id: `selection-${t.id}`,
              x: t.x,
              y: t.y,
              label: s.parameters.dieNums
                ? ["○", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"][t.value]
                : String(t.value),
              color: "#b91c1c",
              size: 6,
            })),
        ],
      }),
    },
    {
      type: "bar",
      label: "Population (%)",
      series: (s) => [
        {
          label: "Tiles",
          points: s.populationPercentages.map((y, x) => ({ x, y })),
        },
      ],
    },
    {
      type: "line",
      label: "Cumulative mean",
      series: (s) => [
        { label: "Mean", points: s.cumulativeMeans },
        {
          label: "Expected value",
          color: "#b91c1c",
          points: [
            { x: 0, y: s.expectedValue },
            { x: s.tick, y: s.expectedValue },
          ],
        },
      ],
    },
    {
      type: "bar",
      label: "Sample totals",
      series: (s) => [{ label: "Samples", points: s.totalHistogram }],
    },
  ],
});
