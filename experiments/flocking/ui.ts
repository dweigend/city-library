import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: [{ field: "seed" }, { field: "population" }],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/Flocking",
    label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0",
  },
  live: [
    {
      field: "vision",
      value: (s) => s.parameters.vision,
      set: (m, v) => m.setRules({ vision: Number(v) }),
    },
    {
      field: "minimumSeparation",
      label: "Minimum separation",
      value: (s) => s.parameters.minimumSeparation,
      set: (m, v) => m.setRules({ minimumSeparation: Number(v) }),
    },
    {
      field: "maxAlignTurn",
      label: "Max alignment turn",
      value: (s) => s.parameters.maxAlignTurn,
      set: (m, v) => m.setRules({ maxAlignTurn: Number(v) }),
    },
    {
      field: "maxCohereTurn",
      label: "Max cohesion turn",
      value: (s) => s.parameters.maxCohereTurn,
      set: (m, v) => m.setRules({ maxCohereTurn: Number(v) }),
    },
    {
      field: "maxSeparateTurn",
      label: "Max separation turn",
      value: (s) => s.parameters.maxSeparateTurn,
      set: (m, v) => m.setRules({ maxSeparateTurn: Number(v) }),
    },
  ],
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Birds", value: (s) => s.birds.length },
  ],
  views: [
    {
      type: "spatial",
      label: "Flock",
      data: (s) => ({
        width: s.width,
        height: s.height,
        agents: s.birds.map((b) => ({
          ...b,
          color: `hsl(55 90% ${40 + b.shade * 6}%)`,
          shape: "triangle" as const,
          size: 8,
        })),
      }),
    },
    {
      type: "inspector",
      label: "Selected bird",
      value: (s, id) => {
        const b = s.birds.find((b) => b.id === id);
        return b
          ? {
              id: b.id,
              x: b.x,
              y: b.y,
              heading: b.heading,
              flockmates: b.flockmateIds.length,
              nearest: b.nearestNeighbor ?? "none",
            }
          : undefined;
      },
    },
  ],
});
