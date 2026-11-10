import { defineUI, type Observation, type SpatialData } from "../../ui/index.ts";

import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["width", "height", "seed"],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/DLA",
    label: "Source attribution · Uri Wilensky · CC BY-NC-SA 3.0",
  },
  change: (instance, changes) => instance.setRules(changes),
  live: {
    maxParticleCount: {},
    wiggleAngle: {},
    useWholeWorld: {},
  },
  complete: (s) => s.done,
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    {
      label: "Radius",
      value: (s) => s.radius,
      format: (value: number) => value.toFixed(3),
    },
    { label: "Walkers", value: (s) => s.agents.length },
  ],
  views: [
    {
      type: "spatial",
      label: "Aggregate and walkers",
      data: aggregateAndWalkersData,
    },
    {
      type: "inspector",
      label: "Walker",
      value: (s, id) => s.agents.find((a) => a.id === id),
    },
  ],
});

type UIObservation = Observation<typeof model>;

function aggregateAndWalkersData(s: UIObservation): SpatialData {
  return {
    width: s.width,
    height: s.height,
    cells: s.cells.map((c) => ({
      ...c,
      color: c.occupied ? "#59b03c" : "#000000",
    })),
    agents: s.agents.map((a) => ({
      ...a,
      // Slightly larger than one 3-pixel source patch so walkers stay visible on black.
      color: "#ff6b5e",
      size: 4,
      shape: "circle" as const,
    })),
  };
}
