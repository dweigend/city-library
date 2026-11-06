import type { Series } from "../../ui/index.ts";
import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

const numbers = new Intl.NumberFormat("en", { maximumFractionDigits: 3 });

const binding = defineUI(model, {
  setup: ["seed", "initialPeople"],
  live: {
    averageCommitment: {
      set: (instance, value) =>
        instance.setParameters({ averageCommitment: value }),
    },
    averageCouplingTendency: {
      set: (instance, value) =>
        instance.setParameters({ averageCouplingTendency: value }),
    },
    averageCondomUse: {
      set: (instance, value) =>
        instance.setParameters({ averageCondomUse: value }),
    },
    averageTestFrequency: {
      set: (instance, value) =>
        instance.setParameters({ averageTestFrequency: value }),
    },
  },
  actions: [],
  complete: (state) => state.stopped,
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Biology/HIV.nlogox",
    label: "Original NetLogo model · source notices",
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
export const sourceMarker =
  "selected-disease-gene-b09:hiv:ed3e832a9fadd101ff65eb20a313ee0941496db02d6d3cf15371568745f997d5";
export const ui = { ...binding, model, sourceMarker };

type UIObservation = ReturnType<ReturnType<typeof model.create>["read"]>;

function historySeries(state: UIObservation): readonly Series[] {
  return [
    {
      label: "Infected %",
      color: "#df4545",
      points: state.history.map((point) => ({
        x: point.tick,
        y: Number(point.infected),
      })),
    },
    {
      label: "Known %",
      color: "#408dde",
      points: state.history.map((point) => ({
        x: point.tick,
        y: Number(point.known),
      })),
    },
    {
      label: "Coupled",
      color: "#888888",
      points: state.history.map((point) => ({
        x: point.tick,
        y: Number(point.coupled),
      })),
    },
  ];
}
