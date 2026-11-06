import { defineUI, netLogoColor } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: [
    { field: "seed" },
    { field: "width" },
    { field: "height" },
    { field: "landscapeSmoothness", label: "Landscape smoothness" },
    { field: "populationSize", label: "Particles" },
  ],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/ParticleSwarmOptimization",
    label:
      "Original NetLogo model \u00B7 Stonedahl and Wilensky \u00B7 CC BY-NC-SA 3.0",
  },
  live: [
    {
      field: "particleInertia",
      label: "Inertia",
      value: (s) => s.parameters.particleInertia,
      set: (m, v) => m.setParameters({ particleInertia: Number(v) }),
    },
    {
      field: "particleSpeedLimit",
      label: "Speed limit",
      value: (s) => s.parameters.particleSpeedLimit,
      set: (m, v) => m.setParameters({ particleSpeedLimit: Number(v) }),
    },
    {
      field: "attractionToPersonalBest",
      label: "Personal attraction",
      value: (s) => s.parameters.attractionToPersonalBest,
      set: (m, v) => m.setParameters({ attractionToPersonalBest: Number(v) }),
    },
    {
      field: "attractionToGlobalBest",
      label: "Global attraction",
      value: (s) => s.parameters.attractionToGlobalBest,
      set: (m, v) => m.setParameters({ attractionToGlobalBest: Number(v) }),
    },
    {
      field: "highlightMode",
      label: "Highlight",
      value: (s) => s.parameters.highlightMode,
      set: (m, v) =>
        m.setParameters({
          highlightMode: v as "None" | "Best found" | "True best",
        }),
    },
    {
      field: "trailsMode",
      label: "Trails",
      value: (s) => s.parameters.trailsMode,
      set: (m, v) =>
        m.setParameters({ trailsMode: v as "None" | "Tails" | "Traces" }),
    },
  ],
  complete: (s) => s.complete,
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Best value found", value: (s) => s.globalBestValue.toFixed(5) },
  ],
  views: [
    {
      type: "spatial",
      label: "Search landscape",
      data: (s) => ({
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
      }),
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
