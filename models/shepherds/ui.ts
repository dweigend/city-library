import { defineUI, indexedColor, type Observation, type SpatialData } from "../../ui/index.ts";

import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["seed", "sheepCount", "shepherdCount"],
  live: {
    sheepSpeed: {
      set: (m, v) => m.setRules({ sheepSpeed: v }),
    },
  },
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/Shepherds",
    label: "Source attribution · Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    {
      label: "Tick",
      value: (s) => s.tick,
    },
    {
      label: "Current efficiency (%)",
      value: (s) => s.herdingEfficiency,
      format: (value: number) => value.toFixed(1),
    },
    {
      label: "Carried sheep",
      value: (s) => s.sheep.filter((a) => a.hidden).length,
    },
  ],
  views: [
    {
      type: "spatial",
      label: "Sheep and shepherds",
      data: sheepAndShepherdsData,
    },
    {
      type: "line",
      label: "Herding efficiency",
      series: (s) => [
        {
          label: "efficiency",
          color: "#2878cb",
          points: s.history.map((p) => ({
            x: p.tick,
            y: p.efficiency,
          })),
        },
      ],
    },
  ],
});

type UIObservation = Observation<typeof model>;

function sheepAndShepherdsData(s: UIObservation): SpatialData {
  return {
    width: s.width,
    height: s.height,
    cells: s.cells.map((c) => ({
      ...c,
      color: indexedColor(c.green),
    })),
    agents: [
      ...s.sheep
        .filter((a) => !a.hidden)
        .map((a) => ({
          ...a,
          color: "#ffffff",
          size: 5,
        })),
      ...s.shepherds.map((a) => ({
        ...a,
        color: a.carriedSheep === null ? "#aa7038" : "#2878cb",
        size: 6,
      })),
    ],
  };
}
