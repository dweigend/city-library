import { defineUI, type SpatialData } from "../../ui/index.ts";

import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["seed", "number"],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/Fireflies",
    label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0",
  },
  live: {
    strategy: {
      set: (m, v) => m.setRules({ strategy: v }),
    },
    flashLength: {
      set: (m, v) => m.setRules({ flashLength: v }),
    },
    cycleLength: {
      set: (m, v) => m.setRules({ cycleLength: v }),
    },
    flashesToReset: {
      set: (m, v) => m.setRules({ flashesToReset: v }),
    },
    showDarkFireflies: {
      set: (m, v) => m.setRules({ showDarkFireflies: v }),
    },
  },
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Flashing", value: (s) => s.flashingCount },
    { label: "Fireflies", value: (s) => s.fireflies.length },
  ],
  views: [
    {
      type: "spatial",
      label: "Fireflies",
      data: firefliesData,
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

type UIObservation = ReturnType<ReturnType<typeof model.create>["read"]>;

function firefliesData(s: UIObservation): SpatialData {
  return {
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
  };
}
