import { defineUI, indexedColor, type Observation, type GridData } from "../../ui/index.ts";

import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: [
    "width",
    "height",
    "seed",
    { field: "initialPlateTemp", label: "Initial plate temperature" },
  ],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/HeatDiffusion",
    label: "Source attribution · Uri Wilensky · CC BY-NC-SA 3.0",
  },
  live: {
    leftTemp: {
      set: (m, v) => m.setRules({ leftTemp: v }),
    },
    rightTemp: {
      set: (m, v) => m.setRules({ rightTemp: v }),
    },
    topTemp: {
      set: (m, v) => m.setRules({ topTemp: v }),
    },
    bottomTemp: {
      set: (m, v) => m.setRules({ bottomTemp: v }),
    },
    alpha: {
      set: (m, v) => m.setRules({ alpha: v }),
    },
    materialType: {
      set: (m, v) => m.setRules({ materialType: v }),
    },
  },
  actions: [{ label: "Update alpha", run: (m) => m.updateAlpha() }],
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    {
      label: "Heat diffusivity",
      value: (s) => s.heatDiffusivity,
      format: (value: number) => value.toFixed(6),
    },
  ],
  views: [
    {
      type: "grid",
      label: "Plate temperature",
      data: plateTemperatureData,
    },
    {
      type: "inspector",
      label: "ModelField",
      value: (s, id) => s.cells.find((c) => c.id === id),
    },
  ],
});

type UIObservation = Observation<typeof model>;

function plateTemperatureData(s: UIObservation): GridData {
  return {
    width: s.width,
    height: s.height,
    cells: s.cells.map((c) => {
      const value =
        !c.inPlate && c.legendLevel >= 0 ? c.legendLevel : c.temperature;
      const fraction =
        s.maxTemp === s.minTemp
          ? 0.5
          : Math.max(
              0,
              Math.min(1, (value - s.minTemp) / (s.maxTemp - s.minTemp)),
            );
      return {
        id: c.id,
        x: c.x,
        y: c.y,
        color:
          c.inPlate || c.legendLevel >= 0
            ? indexedColor(10 + Math.min(9.9, fraction * 10))
            : "#8d8d8d",
      };
    }),
  };
}
