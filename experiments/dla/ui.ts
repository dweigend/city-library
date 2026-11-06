import type { SpatialData } from "../../ui/index.ts";
import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["width", "height", "seed"],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/DLA",
    label: "Original NetLogo model · Uri Wilensky · CC BY-NC-SA 3.0",
  },
  live: {
    maxParticles: {
      set: (m, v) => m.setRules({ maxParticles: v }),
    },
    wiggleAngle: {
      set: (m, v) => m.setRules({ wiggleAngle: v }),
    },
    useWholeWorld: {
      set: (m, v) => m.setRules({ useWholeWorld: v }),
    },
  },
  complete: (s) => s.done,
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Radius", value: (s) => s.radius.toFixed(3) },
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

type UIObservation = ReturnType<ReturnType<typeof model.create>["read"]>;

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
      color: "#e4413b",
      size: 3,
      shape: "circle" as const,
    })),
  };
}
