import { defineUI, type Observation, type SpatialData, type Series } from "../../ui/index.ts";

import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["seed", "initialFishCount", "initialFoodCount"],
  change: (instance, changes) => instance.setParameters(changes),
  live: {
    energyGainFromFood: {},
    foodReplenishRate: {},
    mutationRate: {},
    reproductionRate: {},
    eyeCost: {},
    maxEyeSize: {},
    showVision: {},
  },
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Biology/Evolution/Vision%20Evolution.nlogox",
    label: "Source attribution · Wilensky · CC BY-NC-SA 3.0",
  },
  complete: (s) => s.done,
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Fish", value: (s) => s.fish.length },
    { label: "Food", value: (s) => s.food.length },
  ],
  views: [
    {
      type: "spatial",
      label: "Water, land and vision",
      data: waterLandAndVisionData,
    },
    {
      type: "line",
      label: "Population size",
      series: populationSizeSeries,
    },
    {
      type: "line",
      label: "Average eye size",
      series: averageEyeSizeSeries,
    },
    ...(
      [
        "eyeSizeHistogram",
        "landMobilityHistogram",
        "foodPreferenceHistogram",
      ] as const
    ).map((key, i) => ({
      type: "bar" as const,
      label: [
        "Eye size histogram",
        "Land mobility histogram",
        "Food preference histogram",
      ][i]!,
      series: (s: Observation<typeof model>) => [
        {
          label: "Fish",
          points: s[key].counts.map((y, index) => ({
            x: s[key].edges[index]!,
            y,
          })),
        },
      ],
    })),
    {
      type: "inspector",
      label: "Selected fish",
      value: (s, id) => {
        const fishId = id?.startsWith("fov-") ? id.slice(4) : id;
        return s.fish.find((a) => a.id === fishId);
      },
    },
  ],
});

type UIObservation = Observation<typeof model>;

function waterLandAndVisionData(s: UIObservation): SpatialData {
  return {
    width: s.width,
    height: s.height,
    cells: s.cells.map((c) => ({
      ...c,
      color: c.water ? "#264e91" : "#8b603f",
    })),
    agents: [
      ...(s.parameters.showVision
        ? s.fish.map((a) => ({
            id: `fov-${a.id}`,
            selectable: false,
            x: a.x,
            y: a.y,
            color: "#9b9b9b32",
            size: a.fovRadius * 6,
          }))
        : []),
      ...s.food.map((a) => ({ ...a, color: "#000000", size: 4 })),
      ...s.fish.map((a) => ({
        ...a,
        color: `hsl(0 70% ${35 + a.landMobility * 35}%)`,
        shape: "triangle" as const,
        size: 12,
      })),
    ],
  };
}

function populationSizeSeries(s: UIObservation): readonly Series[] {
  return [
    {
      label: "Fish",
      color: "#ce4747",
      points: s.history.map((p) => ({ x: p.tick, y: p.fish })),
    },
    {
      label: "Food",
      color: "#888888",
      points: s.history.map((p) => ({ x: p.tick, y: p.food })),
    },
  ];
}

function averageEyeSizeSeries(s: UIObservation): readonly Series[] {
  return [
    {
      label: "Terrestrial",
      color: "#ce4747",
      points: s.history.map((p) => ({ x: p.tick, y: p.terrestrialEye })),
    },
    {
      label: "Aquatic",
      color: "#428bd0",
      points: s.history.map((p) => ({ x: p.tick, y: p.aquaticEye })),
    },
  ];
}
