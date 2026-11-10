import { defineUI, indexedColor } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["width", "height", "seed", "density"],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/CAStochastic",
    label: "Source attribution · Wilensky · CC BY-NC-SA 3.0",
  },
  actions: [
    { label: "Setup random", run: (m) => m.setupRandom() },
    { label: "Setup example", run: (m) => m.setupExample() },
    { label: "Continue", run: (m) => m.continueRun(), enabled: (s) => s.done },
  ],
  live: {
    OOO: {
      set: (m, v) => m.setRules({ OOO: v }),
    },
    OOI: {
      set: (m, v) => m.setRules({ OOI: v }),
    },
    OIO: {
      set: (m, v) => m.setRules({ OIO: v }),
    },
    OII: {
      set: (m, v) => m.setRules({ OII: v }),
    },
    IOO: {
      set: (m, v) => m.setRules({ IOO: v }),
    },
    IOI: {
      set: (m, v) => m.setRules({ IOI: v }),
    },
    IIO: {
      set: (m, v) => m.setRules({ IIO: v }),
    },
    III: {
      set: (m, v) => m.setRules({ III: v }),
    },
    example: {
      set: (m, v) => m.setRules({ example: v }),
    },
    autoContinue: {
      set: (m, v) => m.setRules({ autoContinue: v }),
    },
    autoClear: {
      set: (m, v) => m.setRules({ autoClear: v }),
    },
    plot: {
      set: (m, v) => m.setRules({ plot: v }),
    },
    onColor: {
      set: (m, v) => m.setRules({ onColor: v }),
    },
    offColor: {
      set: (m, v) => m.setRules({ offColor: v }),
    },
  },
  complete: (s) => s.done,
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Row", value: (s) => s.row },
    {
      label: "Metric entropy",
      value: (s) => s.entropy.metric,
      format: (value: number) => value.toFixed(5),
    },
    {
      label: "Topological entropy",
      value: (s) => s.entropy.topological,
      format: (value: number) => value.toFixed(5),
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
          color: indexedColor(c.colorNumber),
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
