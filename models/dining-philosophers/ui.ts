import { defineUI, type Observation, type SpatialData, type Series } from "../../ui/index.ts";

import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: [{ field: "philosopherCount", label: "Philosophers" }, "seed"],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/DiningPhilosophers",
    label: "Wilensky · CC BY-NC-SA 3.0",
  },
  change: (instance, changes) => instance.setParameters(changes),
  live: {
    hungryChance: {},
    fullChance: {},
    cooperation: {},
  },
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Thinking", value: (s) => s.thinkingPhilosopherCount },
    { label: "Hungry", value: (s) => s.hungryPhilosopherCount },
    { label: "Eating", value: (s) => s.eatingPhilosopherCount },
  ],
  views: [
    {
      type: "spatial",
      label: "Table",
      data: tableData,
    },
    {
      type: "bar",
      label: "Spaghetti consumed",
      series: (s) => [
        {
          label: "Consumed",
          color: "#3975bc",
          points: s.philosophers.map((p) => ({ x: p.id, y: p.mealCount })),
        },
      ],
    },
    {
      type: "line",
      label: "Resource allocation",
      series: resourceAllocationSeries,
    },
    {
      type: "table",
      label: "Fork ownership",
      rows: (s) =>
        s.forks.map((f) => ({
          fork: f.id,
          owner: f.owner ?? "Table",
          marked: f.marked,
        })),
    },
  ],
});

type UIObservation = Observation<typeof model>;

function tableData(s: UIObservation): SpatialData {
  return {
    width: 1,
    height: 1,
    agents: [
      ...s.philosophers.map((p) => ({
        id: `p-${p.id}`,
        x: p.x,
        y: p.y,
        heading: p.heading,
        label: String(p.id),
        color:
          p.state === "thinking"
            ? "#3975bc"
            : p.state === "hungry"
              ? "#d74343"
              : "#47a66a",
        size: 25,
      })),
      ...s.forks.map((f) => ({
        id: `f-${f.id}`,
        x: f.x,
        y: f.y,
        heading: f.heading,
        label: `Fork ${f.id}`,
        color: s.parameters.cooperation && f.marked ? "#c15cbd" : "#e5e5e5",
        size: 9,
      })),
    ],
  };
}

function resourceAllocationSeries(s: UIObservation): readonly Series[] {
  return [
    {
      label: "Thinking",
      color: "#3975bc",
      points: s.history.map((h) => ({ x: h.tick, y: h.thinkingPhilosopherCount })),
    },
    {
      label: "Hungry",
      color: "#d74343",
      points: s.history.map((h) => ({ x: h.tick, y: h.hungryPhilosopherCount })),
    },
    {
      label: "Eating",
      color: "#47a66a",
      points: s.history.map((h) => ({ x: h.tick, y: h.eatingPhilosopherCount })),
    },
  ];
}
