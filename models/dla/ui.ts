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

/**
 * The aggregate is drawn as squares slightly larger than one 3-pixel source patch, so a
 * young cluster of a few cells is visible; walkers are drawn above it.
 */
function aggregateAndWalkersData(s: UIObservation): SpatialData {
  const aggregate = s.cells.filter((c) => c.occupied);
  return {
    width: s.width,
    height: s.height,
    agents: [
      ...aggregate.map((c) => ({
        id: c.id,
        x: c.x,
        y: c.y,
        color: "#59b03c",
        size: 5,
        shape: "rectangle" as const,
        selectable: false,
      })),
      ...s.agents.map((a) => ({
        ...a,
        color: "#ff6b5e",
        size: 4,
        shape: "circle" as const,
      })),
    ],
    description: `${aggregate.length} aggregate cells, ${s.agents.length} walkers.`,
  };
}
