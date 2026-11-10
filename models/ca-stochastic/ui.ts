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
  change: (instance, changes) => instance.setRules(changes),
  live: {
    OOO: {},
    OOI: {},
    OIO: {},
    OII: {},
    IOO: {},
    IOI: {},
    IIO: {},
    III: {},
    example: {},
    autoContinue: {},
    autoClear: {},
    plot: {},
    onColor: {},
    offColor: {},
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
