import { defineUI } from "../../ui/index.ts";
import { netLogoColor } from "../../ui/palette/netlogo-color.ts";
import { model, type HeatParameters } from "./model.ts";
export const ui = defineUI(model, {
  setup: [
    { field: "width" },
    { field: "height" },
    { field: "seed" },
    { field: "initialPlateTemp", label: "Initial plate temperature" },
  ],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/HeatDiffusion",
    label: "Original NetLogo model · Uri Wilensky · CC BY-NC-SA 3.0",
  },
  live: (
    [
      "leftTemp",
      "rightTemp",
      "topTemp",
      "bottomTemp",
      "alpha",
      "materialType",
    ] as const
  ).map((field) => ({
    field,
    value: (s) => s.parameters[field],
    set: (m, v) => m.setRules({ [field]: v } as Partial<HeatParameters>),
  })),
  actions: [{ label: "Update alpha", run: (m) => m.updateAlpha() }],
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Heat diffusivity", value: (s) => s.heatDiffusivity.toFixed(6) },
  ],
  views: [
    {
      type: "grid",
      label: "Plate temperature",
      data: (s) => ({
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
                ? netLogoColor(10 + Math.min(9.9, fraction * 10))
                : "#8d8d8d",
          };
        }),
      }),
    },
    {
      type: "inspector",
      label: "ModelField",
      value: (s, id) => s.cells.find((c) => c.id === id),
    },
  ],
});
