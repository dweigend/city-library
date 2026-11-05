import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: [{ field: "seed" }, { field: "blockSide", label: "Block side" }],
  live: [
    {
      field: "targetPercent",
      label: "Target color (%)",
      value: (s) => s.parameters.targetPercent,
      set: (m, v) => m.setRules({ targetPercent: Number(v) }),
    },
  ],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/StochasticPatchwork",
    label: "Original · Abrahamson and Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Target color", value: (s) => s.targetCount },
  ],
  views: [
    {
      type: "grid",
      label: "Patchwork",
      data: (s) => ({
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
      }),
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
