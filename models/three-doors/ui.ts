import { defineUI, type Observation, type SpatialData } from "../../ui/index.ts";

import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["seed", { field: "number", label: "Racers" }, "gradation"],
  complete: (s) => s.done,
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/ThreeDoors",
    label: "Source attribution · Uri Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "State", value: (s) => (s.done ? "Race finished" : "Racing") },
  ],
  views: [
    {
      type: "spatial",
      label: "Race",
      data: raceData,
    },
    {
      type: "scatter",
      label: "Switching and wins",
      series: (s) => [
        {
          label: "Racers",
          points: s.racers.map((r) => ({ x: r.hunch, y: r.wins })),
        },
      ],
    },
  ],
});

type UIObservation = Observation<typeof model>;

function raceData(s: UIObservation): SpatialData {
  return {
    width: s.width,
    height: s.height,
    agents: s.racers.map((r) => ({
      id: r.id,
      x: r.x,
      y: r.y,
      heading: 0,
      shape: "triangle",
      size: 5,
      color: hunchColor(r.hunch),
    })),
  };
}

function hunchColor(hunch: number): string {
  const channel = Math.round(240 - (140 * hunch) / 100);
  return `rgb(${channel},${channel},${channel})`;
}
