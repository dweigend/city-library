import { defineUI, netLogoColor } from "../../ui/index.ts";
import { model, patterns } from "./model.ts";
export const ui = defineUI(model, {
  setup: [
    { field: "width" },
    { field: "height" },
    { field: "seed" },
    { field: "density" },
  ],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/CAStochastic",
    label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0",
  },
  actions: [
    { label: "Setup random", run: (m) => m.setupRandom() },
    { label: "Setup example", run: (m) => m.setupExample() },
    { label: "Continue", run: (m) => m.continueRun(), enabled: (s) => s.done },
  ],
  live: [
    ...patterns.map((field) => ({
      field,
      value: (s: ReturnType<ReturnType<typeof model.create>["read"]>) =>
        s.parameters[field],
      set: (m: ReturnType<typeof model.create>, v: string | number | boolean) =>
        m.setRules({ [field]: Number(v) }),
    })),
    {
      field: "example",
      value: (s) => s.parameters.example,
      set: (m, v) => m.setRules({ example: Number(v) }),
    },
    {
      field: "autoContinue",
      value: (s) => s.parameters.autoContinue,
      set: (m, v) => m.setRules({ autoContinue: Boolean(v) }),
    },
    {
      field: "autoClear",
      value: (s) => s.parameters.autoClear,
      set: (m, v) => m.setRules({ autoClear: Boolean(v) }),
    },
    {
      field: "plot",
      value: (s) => s.parameters.plot,
      set: (m, v) => m.setRules({ plot: Boolean(v) }),
    },
    {
      field: "onColor",
      value: (s) => s.parameters.onColor,
      set: (m, v) => m.setRules({ onColor: Number(v) }),
    },
    {
      field: "offColor",
      value: (s) => s.parameters.offColor,
      set: (m, v) => m.setRules({ offColor: Number(v) }),
    },
  ],
  complete: (s) => s.done,
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Row", value: (s) => s.row },
    { label: "Metric entropy", value: (s) => s.entropy.metric.toFixed(5) },
    {
      label: "Topological entropy",
      value: (s) => s.entropy.topological.toFixed(5),
    },
  ],
  views: [
    {
      type: "grid",
      label: "Rows",
      data: (s) => ({
        width: s.width,
        height: s.height,
        cells: s.cells.map((c) => ({
          ...c,
          color: netLogoColor(c.colorNumber),
        })),
      }),
    },
    {
      type: "line",
      label: "Entropy",
      series: (s) => [
        {
          label: "Topological",
          points: s.history.map((p) => ({ x: p.tick, y: p.topological })),
        },
        {
          label: "Metric",
          points: s.history.map((p) => ({ x: p.tick, y: p.metric })),
        },
      ],
    },
  ],
});
