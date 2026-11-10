import { defineUI, indexedColor } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: [
    "width",
    "height",
    "seed",
    "preset",
    "neighborhood",
    "radius",
    "stateCount",
  ],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/CyclicCA",
    label: "Source attribution · Wilensky · CC BY-NC-SA 3.0",
  },
  live: {
    threshold: {
      set: (m, v) => m.setThreshold(v),
    },
  },
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Neighbors", value: (s) => s.neighborCount },
    { label: "States", value: (s) => s.parameters.stateCount },
    { label: "Threshold", value: (s) => s.parameters.threshold },
    { label: "Status", value: (s) => s.warning },
  ],
  views: [
    {
      type: "grid",
      label: "Cells",
      data: (s) => ({
        width: s.width,
        height: s.height,
        cells: s.cells.map((c) => ({
          ...c,
          color: indexedColor(c.colorNumber),
        })),
      }),
    },
  ],
});
