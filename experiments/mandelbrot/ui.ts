import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: [
    { field: "seed" },
    { field: "numTurtles", label: "Number of turtles" },
    { field: "scaleFactor", label: "Scale factor" },
  ],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/Mandelbrot",
    label: "Wilensky (1997) · CC BY-NC-SA 3.0",
  },
  live: [
    {
      field: "throw",
      label: "Throw",
      value: (s) => s.parameters.throw,
      set: (m, v) => m.setRules({ throw: Number(v) }),
    },
  ],
  actions: [{ label: "Hide turtles", run: (m) => m.hideTurtles() }],
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Computed patches", value: (s) => s.computedPatches },
    { label: "Total iterations", value: (s) => s.iterations },
  ],
  views: [
    {
      type: "spatial",
      label: "Mandelbrot",
      data: (s) => ({
        width: 301,
        height: 301,
        showLabels: false,
        cells: s.patches
          .filter((p) => p.counter > 0)
          .map((p) => ({
            id: p.id,
            x: p.x,
            y: p.y,
            color: `hsl(${(p.counter / 115) * 320} 80% ${25 + (p.counter / 115) * 45}%)`,
          })),
        agents: s.turtles
          .filter((t) => !t.hidden)
          .map((t) => ({
            id: t.id,
            x: t.x,
            y: t.y,
            heading: t.heading,
            color: t.color,
            size: 3,
          })),
      }),
    },
  ],
});
