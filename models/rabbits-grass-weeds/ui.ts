import { defineUI, type Observation, type SpatialData, type Series } from "../../ui/index.ts";

import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["seed", "number"],
  live: {
    birthThreshold: {
      set: (m, v) => m.setRules({ birthThreshold: v }),
    },
    grassGrowRate: {
      set: (m, v) => m.setRules({ grassGrowRate: v }),
    },
    grassEnergy: {
      set: (m, v) => m.setRules({ grassEnergy: v }),
    },
    weedsGrowRate: {
      set: (m, v) => m.setRules({ weedsGrowRate: v }),
    },
    weedEnergy: {
      set: (m, v) => m.setRules({ weedEnergy: v }),
    },
  },
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/RabbitsGrassWeeds",
    label: "Source attribution · Wilensky · CC BY-NC-SA 3.0",
  },
  complete: (s) => s.done,
  monitors: [
    {
      label: "Tick",
      value: (s) => s.tick,
    },
    {
      label: "Rabbits",
      value: (s) => s.rabbits.length,
    },
  ],
  views: [
    {
      type: "spatial",
      label: "Rabbits and resources",
      data: rabbitsAndResourcesData,
    },
    {
      type: "line",
      label: "Populations (resources / 4)",
      series: populationsResources4Series,
    },
  ],
});

type UIObservation = Observation<typeof model>;

function rabbitsAndResourcesData(s: UIObservation): SpatialData {
  return {
    width: s.width,
    height: s.height,
    cells: s.cells.map((c) => ({
      ...c,
      color:
        c.cover === "grass"
          ? "#389b39"
          : c.cover === "weeds"
            ? "#b539ba"
            : "#000000",
    })),
    agents: s.rabbits.map((a) => ({
      ...a,
      color: "#ffffff",
      size: 5,
    })),
  };
}

function populationsResources4Series(s: UIObservation): readonly Series[] {
  return (["rabbits", "grass", "weeds"] as const).map((key) => ({
    label: key,
    color:
      key === "rabbits" ? "#d73027" : key === "grass" ? "#389b39" : "#b539ba",
    points: s.history.map((p) => ({
      x: p.tick,
      y: p[key],
    })),
  }));
}
