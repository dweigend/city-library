import { defineUI, type Observation, type SpatialData, type Series } from "../../ui/index.ts";

import { model } from "./model.ts";

export const ui = defineUI(model, {
  setup: [
    "seed",
    { field: "initialPopulation", label: "Initial people" },
    "powerPlants",
  ],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/UrbanSuite-Pollution",
    label: "Source attribution · Felsen and Wilensky · CC BY-NC-SA 3.0",
  },
  complete: (state) => state.done,
  live: {
    birthRate: {
      set: (instance, value) => instance.setRules({ birthRate: value }),
    },
    plantingRate: {
      set: (instance, value) => instance.setRules({ plantingRate: value }),
    },
    pollutingRate: {
      set: (instance, value) => instance.setRules({ pollutingRate: value }),
    },
  },
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    { label: "People", value: (state) => state.counts.people },
    { label: "Trees", value: (state) => state.counts.trees },
    { label: "Power plants", value: (state) => state.counts.powerPlants },
    {
      label: "Total pollution",
      value: (state) => state.totalPollution,
      format: (value: number) => value.toFixed(3),
    },
  ],
  views: [
    {
      type: "inspector",
      label: "Selected",
      value: (state, id) =>
        state.people.find((person) => person.id === id) ??
        state.trees.find((tree) => tree.id === id) ??
        state.cells.find((cell) => cell.id === id),
    },
    {
      type: "spatial",
      label: "People, trees and pollution",
      data: peopleTreesAndPollutionData,
    },
    {
      type: "line",
      label: "World status · counts and total pollution",
      series: worldStatusCountsAndTotalPollutionSeries,
    },
  ],
});

type UIObservation = Observation<typeof model>;

function peopleTreesAndPollutionData(state: UIObservation): SpatialData {
  return {
    width: state.width,
    height: state.height,
    cells: state.cells.map((cell) => ({
      id: cell.id,
      x: cell.x,
      y: cell.y,
      color: cell.powerPlant
        ? "#9b2226"
        : `hsl(0 68% ${98 - 60 * Math.min(1, cell.pollution / 5)}%)`,
    })),
    agents: [
      ...state.trees.map((tree) => ({
        ...tree,
        color: "#26733b",
        shape: "triangle" as const,
        size: 10,
      })),
      ...state.people.map((person) => ({
        ...person,
        color: "#171717",
        shape: "circle" as const,
        size: 6,
      })),
    ],
  };
}

function worldStatusCountsAndTotalPollutionSeries(
  state: UIObservation,
): readonly Series[] {
  return [
    {
      label: "People",
      color: "#777777",
      points: state.history.map((point) => ({
        x: point.tick,
        y: point.people,
      })),
    },
    {
      label: "Trees",
      color: "#26733b",
      points: state.history.map((point) => ({
        x: point.tick,
        y: point.trees,
      })),
    },
    {
      label: "Total pollution",
      color: "#9b2226",
      points: state.history.map((point) => ({
        x: point.tick,
        y: point.totalPollution,
      })),
    },
  ];
}
