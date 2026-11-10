import { defineUI, type Observation, type SpatialData, type Series } from "../../ui/index.ts";

import { model } from "./model.ts";

const numbers = new Intl.NumberFormat("en", { maximumFractionDigits: 3 });

const binding = defineUI(model, {
  setup: ["seed", "personCount"],
  change: (instance, changes) => instance.setParameters(changes),
  live: {
    infectiousness: {},
    chanceRecover: {},
    duration: {},
    agentShape: {
      set: (instance, value) =>
        instance.setParameters({
          agentShape: value === "circle" ? "circle" : "person",
        }),
    },
  },
  actions: [],
  complete: (state) => state.stopped,
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Biology/Virus.nlogox",
    label: "Source attribution · source notices",
  },
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    {
      label: "Infected %",
      value: (state) => numbers.format(state.percentInfected),
    },
    {
      label: "Immune %",
      value: (state) => numbers.format(state.percentImmune),
    },
  ],
  views: [
    {
      type: "spatial",
      label: "Virus",
      data: virusData,
    },
    {
      type: "line",
      label: "History",
      series: historySeries,
    },
  ],
});

export { model };

export const ui = { ...binding, model };

type UIObservation = Observation<typeof model>;

function virusData(state: UIObservation): SpatialData {
  return {
    width: state.width,
    height: state.height,
    agents: state.agents.map((agent) => ({
      ...agent,
      shape:
        agent.shape === "person" ? ("triangle" as const) : ("circle" as const),
      size: 5,
    })),
  };
}

function historySeries(state: UIObservation): readonly Series[] {
  return [
    {
      label: "Population",
      color: "#408dde",
      points: state.history.map((point) => ({
        x: point.tick,
        y: Number(point.personCount),
      })),
    },
    {
      label: "Infected %",
      color: "#df4545",
      points: state.history.map((point) => ({
        x: point.tick,
        y: Number(point.infectedPersonCount),
      })),
    },
    {
      label: "Immune %",
      color: "#888888",
      points: state.history.map((point) => ({
        x: point.tick,
        y: Number(point.immunePersonCount),
      })),
    },
  ];
}
