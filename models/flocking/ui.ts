import { defineUI, type Observation } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["seed", "population"],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/Flocking",
    label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0",
  },
  change: (instance, changes) => instance.setRules(changes),
  live: {
    vision: {},
    minimumSeparation: {},
    maxAlignTurn: {
      label: "Max alignment turn",
    },
    maxCohereTurn: {
      label: "Max cohesion turn",
    },
    maxSeparateTurn: {
      label: "Max separation turn",
    },
  },
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
      value: selectedBirdInspector,
    },
  ],
});

type UIObservation = Observation<typeof model>;

function selectedBirdInspector(
  s: UIObservation,
  id: string | null,
): Readonly<Record<string, string | number | boolean>> | undefined {
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
}
