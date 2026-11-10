import { defineUI, type Observation, type GridData } from "../../ui/index.ts";

import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["seed", "blockSide"],
  live: {
    targetPercent: {
      label: "Target color (%)",
      set: (m, v) => m.setRules({ targetPercent: v }),
    },
  },
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/StochasticPatchwork",
    label: "Source attribution · · Abrahamson and Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Target color", value: (s) => s.targetCount },
  ],
  views: [
    {
      type: "grid",
      label: "Patchwork",
      data: patchworkData,
    },
    {
      type: "bar",
      label: "Color distribution",
      series: (s) => [
        {
          label: "Occurrences",
          points: s.histogram.map((p) => ({ x: p.percent, y: p.count })),
        },
      ],
    },
  ],
});

type UIObservation = Observation<typeof model>;

function patchworkData(s: UIObservation): GridData {
  return {
    width: s.width,
    height: s.height,
    cells: s.cells.map((p) => ({
      ...p,
      color: !p.inBlock
        ? "#80552e"
        : !p.drawn
          ? "#d4bb77"
          : p.target
            ? "#16833b"
            : "#245ba5",
    })),
  };
}
