import { defineUI, type SpatialData } from "../../ui/index.ts";

import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: [
    "seed",
    { field: "numAgents", label: "Number of agents" },
    "scaleFactor",
  ],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/Mandelbrot",
    label: "Wilensky (1997) · CC BY-NC-SA 3.0",
  },
  live: {
    throw: {
      set: (m, v) => m.setRules({ throw: v }),
    },
  },
  actions: [{ label: "Hide agents", run: (m) => m.hideAgents() }],
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Computed fields", value: (s) => s.computedFields },
    { label: "Total iterations", value: (s) => s.iterations },
  ],
  views: [
    {
      type: "spatial",
      label: "Mandelbrot",
      data: mandelbrotData,
    },
  ],
});

type UIObservation = ReturnType<ReturnType<typeof model.create>["read"]>;

function mandelbrotData(s: UIObservation): SpatialData {
  return {
    width: 301,
    height: 301,
    showLabels: false,
    cells: s.fields
      .filter((p) => p.counter > 0)
      .map((p) => ({
        id: p.id,
        x: p.x,
        y: p.y,
        color: `hsl(${(p.counter / 115) * 320} 80% ${25 + (p.counter / 115) * 45}%)`,
      })),
    agents: s.agents
      .filter((t) => !t.hidden)
      .map((t) => ({
        id: t.id,
        x: t.x,
        y: t.y,
        heading: t.heading,
        color: t.color,
        size: 3,
      })),
  };
}
