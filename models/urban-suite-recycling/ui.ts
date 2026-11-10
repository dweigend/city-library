import { defineUI, type Observation, type SpatialData, type Series } from "../../ui/index.ts";

import { model } from "./model.ts";

export const ui = defineUI(model, {
  setup: [
    "seed",
    { field: "recyclerCount", label: "Recyclers" },
    { field: "wastefulCount", label: "Wastefuls" },
  ],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/UrbanSuite-Recycling",
    label: "Source attribution · Felsen and Wilensky · CC BY-NC-SA 3.0",
  },
  change: (instance, changes) => instance.setRules(changes),
  live: {
    maxStoredEnergy: {
      label: "Maximum energy",
    },
    recyclingWasteCost: {
      label: "Waste recycling cost",
    },
    resourceRegeneration: {},
    agentsSeekResources: {
      label: "Seek resources",
    },
    showEnergy: {},
  },
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    { label: "Recyclers", value: (state) => state.counts.recyclers },
    { label: "Wastefuls", value: (state) => state.counts.wastefuls },
    {
      label: "New (%)",
      value: (state) => state.landPercentages.new,
      format: (value: number) => value.toFixed(2),
    },
    {
      label: "Recycled (%)",
      value: (state) => state.landPercentages.recycled,
      format: (value: number) => value.toFixed(2),
    },
    {
      label: "Waste (%)",
      value: (state) => state.landPercentages.waste,
      format: (value: number) => value.toFixed(2),
    },
  ],
  views: [
    {
      type: "inspector",
      label: "Selected",
      value: (state, id) =>
        state.people.find((person) => person.id === id) ??
        state.cells.find((cell) => cell.id === id),
    },
    {
      type: "spatial",
      label: "People and resources",
      data: peopleAndResourcesData,
    },
    {
      type: "line",
      label: "Populations",
      series: populationsSeries,
    },
    {
      type: "line",
      label: "Land types (%)",
      series: landTypesSeries,
    },
  ],
});

type UIObservation = Observation<typeof model>;

function peopleAndResourcesData(state: UIObservation): SpatialData {
  return {
    width: state.width,
    height: state.height,
    showLabels: state.parameters.showEnergy,
    cells: state.cells.map((cell) => ({
      id: cell.id,
      x: cell.x,
      y: cell.y,
      color:
        cell.resource === "new"
          ? "#4f8736"
          : cell.resource === "recycled"
            ? "#9ec850"
            : "#d6ae45",
    })),
    agents: state.people.map((person) => ({
      ...person,
      label: String(Math.round(person.energy)),
      color: person.kind === "recycler" ? "#234f9b" : "#a4212b",
      size: 9,
      shape: "circle" as const,
    })),
  };
}

function populationsSeries(state: UIObservation): readonly Series[] {
  return [
    {
      label: "Recyclers",
      color: "#234f9b",
      points: state.history.map((point) => ({
        x: point.tick,
        y: point.recyclers,
      })),
    },
    {
      label: "Wastefuls",
      color: "#a4212b",
      points: state.history.map((point) => ({
        x: point.tick,
        y: point.wastefuls,
      })),
    },
  ];
}

function landTypesSeries(state: UIObservation): readonly Series[] {
  return [
    {
      label: "New",
      color: "#4f8736",
      points: state.history.map((point) => ({
        x: point.tick,
        y: point.new,
      })),
    },
    {
      label: "Recycled",
      color: "#9ec850",
      points: state.history.map((point) => ({
        x: point.tick,
        y: point.recycled,
      })),
    },
    {
      label: "Waste",
      color: "#d6ae45",
      points: state.history.map((point) => ({
        x: point.tick,
        y: point.waste,
      })),
    },
  ];
}
