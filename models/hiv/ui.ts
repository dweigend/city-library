import { defineUI, type Observation, type Series } from "../../ui/index.ts";

import { model } from "./model.ts";

const numbers = new Intl.NumberFormat("en", { maximumFractionDigits: 3 });

const binding = defineUI(model, {
  setup: ["seed", "initialPersonCount"],
  change: (instance, changes) => instance.setParameters(changes),
  live: {
    averageCommitment: {},
    averageCouplingTendency: {},
    averageCondomUse: {},
    averageTestFrequency: {},
  },
  actions: [],
  complete: (state) => state.stopped,
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Biology/HIV.nlogox",
    label: "Source attribution · source notices",
  },
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    {
      label: "Infected %",
      value: (state) => numbers.format(state.percentInfected),
    },
  ],
  views: [
    {
      type: "spatial",
      label: "HIV",
      data: (state) => ({
        width: state.width,
        height: state.height,
        agents: state.agents.map((agent) => ({ ...agent, size: 5 })),
        cells: state.cells,
      }),
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

function historySeries(state: UIObservation): readonly Series[] {
  return [
    {
      label: "Infected %",
      color: "#df4545",
      points: state.history.map((point) => ({
        x: point.tick,
        y: Number(point.infectedPersonCount),
      })),
    },
    {
      label: "Known %",
      color: "#408dde",
      points: state.history.map((point) => ({
        x: point.tick,
        y: Number(point.diagnosedPersonCount),
      })),
    },
    {
      label: "Coupled",
      color: "#888888",
      points: state.history.map((point) => ({
        x: point.tick,
        y: Number(point.coupledPersonCount),
      })),
    },
  ];
}
