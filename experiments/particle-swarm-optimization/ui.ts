import { defineUI, netLogoColor, type Observation, type SpatialData } from "../../ui/index.ts";

import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: [
    "seed",
    "width",
    "height",
    "landscapeSmoothness",
    { field: "populationSize", label: "Particles" },
  ],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/ParticleSwarmOptimization",
    label:
      "Original NetLogo model \u00B7 Stonedahl and Wilensky \u00B7 CC BY-NC-SA 3.0",
  },
  change: (instance, changes) => instance.setParameters(changes),
  live: {
    particleInertia: {
      label: "Inertia",
    },
    particleSpeedLimit: {
      label: "Speed limit",
    },
    attractionToPersonalBest: {
      label: "Personal attraction",
    },
    attractionToGlobalBest: {
      label: "Global attraction",
    },
    highlightMode: {
      label: "Highlight",
    },
    trailsMode: {
      label: "Trails",
    },
  },
  complete: (s) => s.complete,
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    {
      label: "Best value found",
      value: (s) => s.globalBestValue,
      format: (value: number) => value.toFixed(5),
    },
  ],
  views: [
    {
      type: "spatial",
      label: "Search landscape",
      data: searchLandscapeData,
    },
    {
      type: "line",
      label: "Best found",
      series: (s) => [
        {
          label: "Best value",
          points: s.history.map((p) => ({ x: p.tick, y: p.best })),
        },
      ],
    },
  ],
});

type UIObservation = Observation<typeof model>;

function searchLandscapeData(s: UIObservation): SpatialData {
  return {
    width: s.width,
    height: s.height,
    cells: s.cells.map((f) => ({ ...f, color: netLogoColor(9.9 * f.val) })),
    segments: s.trails.map((t) => ({ ...t, color: "#dfae55", width: 1 })),
    agents: [
      ...s.particles.map((p) => ({
        ...p,
        color: "#db633c",
        size: 7,
        shape: "triangle" as const,
      })),
      ...(s.parameters.highlightMode === "None"
        ? []
        : [
            {
              id: "highlight",
              x:
                s.parameters.highlightMode === "True best"
                  ? s.trueBest.x
                  : s.globalBestX,
              y:
                s.parameters.highlightMode === "True best"
                  ? s.trueBest.y
                  : s.globalBestY,
              color: "#30b7dd",
              size: 13,
            },
          ]),
    ],
  };
}
