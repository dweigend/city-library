import { defineUI, type Observation, type SpatialData, type Series } from "../../ui/index.ts";

import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: [
    "memorySize",
    { field: "numberStrategies", label: "Number of strategies" },
    "seed",
  ],
  live: {
    overcrowdingThreshold: {
      set: (m, value) => m.setRules({ overcrowdingThreshold: value }),
    },
  },
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/IABM%20Textbook/chapter%203/El%20Farol%20Extensions/El%20Farol.nlogox",
    label: "Source attribution · Rand & Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    { label: "Week", value: (s) => s.tick },
    { label: "Attendance", value: (s) => s.attendance },
    { label: "Crowded", value: (s) => (s.crowded ? "Yes" : "No") },
  ],
  views: [
    {
      type: "spatial",
      label: "Homes and bar",
      data: homesAndBarData,
    },
    {
      type: "line",
      label: "Bar attendance",
      series: barAttendanceSeries,
    },
    {
      type: "inspector",
      label: "Patron",
      value: (s, id) => {
        const p = s.people.find((p) => p.id === id);
        return (
          p && {
            id: p.id,
            strategy: p.bestStrategy,
            attend: p.attend,
            "Last scored prediction": p.prediction,
          }
        );
      },
    },
  ],
});

type UIObservation = Observation<typeof model>;

function homesAndBarData(s: UIObservation): SpatialData {
  return {
    width: s.width,
    height: s.height,
    cells: s.cells.map((c) => ({
      id: c.id,
      x: c.x,
      y: c.y,
      color:
        c.area === "bar"
          ? "#315bd5"
          : c.area === "home"
            ? "#38a339"
            : "#171717",
    })),
    agents: s.people.map((p) => ({
      id: p.id,
      x: p.x,
      y: p.y,
      color: "#ffffff",
      size: 6,
    })),
  };
}

function barAttendanceSeries(s: UIObservation): readonly Series[] {
  return [
    {
      label: "Attendance",
      points: s.plotHistory.map((p) => ({ x: p.tick, y: p.attendance })),
    },
    {
      label: "Threshold",
      color: "#d43b36",
      points: [
        { x: 0, y: s.parameters.overcrowdingThreshold },
        { x: Math.max(10, s.tick), y: s.parameters.overcrowdingThreshold },
      ],
    },
  ];
}
