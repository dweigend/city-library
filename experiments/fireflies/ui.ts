import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: [{ field: "seed" }, { field: "number" }],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/Fireflies",
    label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0",
  },
  live: [
    {
      field: "strategy",
      value: (s) => s.parameters.strategy,
      set: (m, v) => m.setRules({ strategy: String(v) as "delay" | "advance" }),
    },
    {
      field: "flashLength",
      label: "Flash length",
      value: (s) => s.parameters.flashLength,
      set: (m, v) => m.setRules({ flashLength: Number(v) }),
    },
    {
      field: "cycleLength",
      label: "Cycle length",
      value: (s) => s.parameters.cycleLength,
      set: (m, v) => m.setRules({ cycleLength: Number(v) }),
    },
    {
      field: "flashesToReset",
      label: "Flashes to reset",
      value: (s) => s.parameters.flashesToReset,
      set: (m, v) => m.setRules({ flashesToReset: Number(v) }),
    },
    {
      field: "showDarkFireflies",
      label: "Show dark fireflies",
      value: (s) => s.parameters.showDarkFireflies,
      set: (m, v) => m.setRules({ showDarkFireflies: Boolean(v) }),
    },
  ],
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Flashing", value: (s) => s.flashingCount },
    { label: "Fireflies", value: (s) => s.fireflies.length },
  ],
  views: [
    {
      type: "spatial",
      label: "Fireflies",
      data: (s) => ({
        width: s.width,
        height: s.height,
        agents: s.fireflies
          .filter((f) => !f.hidden)
          .map((f) => ({
            ...f,
            color: f.flashing ? "#ffff38" : "#555555",
            shape: "triangle" as const,
            size: 8,
          })),
      }),
    },
    {
      type: "inspector",
      label: "Selected firefly",
      value: (s, id) => s.fireflies.find((f) => f.id === id),
    },
    {
      type: "line",
      label: "Flashing fireflies",
      series: (s) => [
        {
          label: "Flashing",
          color: "#bf3030",
          points: s.history.map((p) => ({ x: p.tick, y: p.flashing })),
        },
      ],
    },
  ],
});
