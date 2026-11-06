import {
  defineUI,
  netLogoColor,
  type SpatialData,
  type Series,
} from "../../ui/index.ts";

import { model } from "./model.ts";

export const ui = defineUI(model, {
  setup: [
    "seed",
    { field: "smoothness", label: "Setup smoothing passes" },
    { field: "population", label: "Setup population" },
  ],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/UrbanSuite-SprawlEffect",
    label: "Original NetLogo model · Felsen and Wilensky · CC BY-NC-SA 3.0",
  },
  live: {
    maxAttraction: {
      label: "Maximum attraction",
      set: (instance, value) => instance.setRules({ maxAttraction: value }),
    },
    seekerSearchAngle: {
      label: "Search angle",
      set: (instance, value) => instance.setRules({ seekerSearchAngle: value }),
    },
    seekerPatience: {
      set: (instance, value) => instance.setRules({ seekerPatience: value }),
    },
    waitBetweenSeeking: {
      label: "House waiting time",
      set: (instance, value) =>
        instance.setRules({ waitBetweenSeeking: value }),
    },
  },
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    { label: "Seekers", value: (state) => state.counts.seekers },
    { label: "Houses", value: (state) => state.counts.houses },
    { label: "Build threshold", value: (state) => state.buildThreshold },
    {
      label: "Total attraction",
      value: (state) => state.totalAttraction.toPrecision(6),
    },
  ],
  views: [
    {
      type: "inspector",
      label: "Selected",
      value: (state, id) =>
        state.agents.find((agent) => agent.id === id) ??
        state.cells.find((cell) => cell.id === id),
    },
    {
      type: "spatial",
      label: "Seekers, houses and attraction",
      data: seekersHousesAndAttractionData,
    },
    {
      type: "line",
      label: "Residents",
      series: residentsSeries,
    },
  ],
});

type UIObservation = ReturnType<ReturnType<typeof model.create>["read"]>;

function seekersHousesAndAttractionData(state: UIObservation): SpatialData {
  return {
    width: state.width,
    height: state.height,
    cells: state.cells.map((cell) => ({
      id: cell.id,
      x: cell.x,
      y: cell.y,
      color: netLogoColor(cell.colorNumber),
    })),
    agents: state.agents.map((agent) => ({
      ...agent,
      color: agent.kind === "house" ? "#ffffff" : "#d73229",
      size: 7,
      shape:
        agent.kind === "house" ? ("circle" as const) : ("triangle" as const),
    })),
  };
}

function residentsSeries(state: UIObservation): readonly Series[] {
  return [
    {
      label: "Seekers",
      color: "#d73229",
      points: state.history.map((point) => ({
        x: point.tick,
        y: point.seekers,
      })),
    },
    {
      label: "Houses",
      points: state.history.map((point) => ({
        x: point.tick,
        y: point.houses,
      })),
    },
  ];
}
