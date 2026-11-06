import { defineUI, netLogoColor, type SpatialData } from "../../ui/index.ts";

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
  live: {
    particleInertia: {
      label: "Inertia",
      set: (m, v) => m.setParameters({ particleInertia: v }),
    },
    particleSpeedLimit: {
      label: "Speed limit",
      set: (m, v) => m.setParameters({ particleSpeedLimit: v }),
    },
    attractionToPersonalBest: {
      label: "Personal attraction",
      set: (m, v) => m.setParameters({ attractionToPersonalBest: v }),
    },
    attractionToGlobalBest: {
      label: "Global attraction",
      set: (m, v) => m.setParameters({ attractionToGlobalBest: v }),
    },
    highlightMode: {
      label: "Highlight",
      set: (m, v) => m.setParameters({ highlightMode: v }),
    },
    trailsMode: {
      label: "Trails",
      set: (m, v) => m.setParameters({ trailsMode: v }),
    },
  },
  complete: (s) => s.complete,
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Best value found", value: (s) => s.globalBestValue.toFixed(5) },
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

type UIObservation = ReturnType<ReturnType<typeof model.create>["read"]>;

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
