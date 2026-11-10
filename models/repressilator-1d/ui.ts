import { defineUI, type Observation, type BarSeries, type Series } from "../../ui/index.ts";

import { model } from "./model.ts";

const binding = defineUI(model, {
  setup: ["seed", "initialTf0Count", "initialTf1Count", "initialTf2Count"],
  change: (instance, changes) => instance.setParameters(changes),
  live: {
    tfsPerMRNA: {},
    maxTFSynergy: {},
    mrnaDecayProb: {},
    signalDecayProb: {},
    signalTFUnbindProb: {},
    signalTFBindProb: {},
    tfBindProb: {},
    tfUnbindProb: {},
    tfDecayProb: {},
  },
  actions: [],
  complete: (state) => state.stopped,
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Biology/Repressilator%201D.nlogox",
    label: "Source attribution · source notices",
  },
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    { label: "Signal", value: (state) => (state.signalOn ? "On" : "Off") },
    { label: "Mean on duration", value: (state) => state.meanOnDuration },
    { label: "Mean off duration", value: (state) => state.meanOffDuration },
  ],
  views: [
    {
      type: "spatial",
      label: "Repressilator 1D",
      data: (state) => ({
        width: state.width,
        height: state.height,
        agents: state.agents.map((agent) => ({ ...agent, size: 5 })),
        cells: state.genes.map((gene) => ({
          ...gene,
          id: String(gene.geneId),
        })),
      }),
    },
    {
      type: "bar",
      label: "Completed signal durations",
      series: completedSignalDurationsSeries,
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

function completedSignalDurationsSeries(
  state: UIObservation,
): readonly BarSeries[] {
  return [
    {
      label: "On",
      points: state.signalOnLengths.map((duration, index) => ({
        x: index,
        y: duration,
      })),
    },
    {
      label: "Off",
      points: state.signalOffLengths.map((duration, index) => ({
        x: index,
        y: duration,
      })),
    },
  ];
}

function historySeries(state: UIObservation): readonly Series[] {
  return [
    ...([0, 1, 2] as const).map((gene) => ({
      label: `mRNA ${gene}`,
      points: state.history.map((point) => ({
        x: point.tick,
        y: [point.mrna0, point.mrna1, point.mrna2][gene]!,
      })),
    })),
    {
      label: "TF 0",
      color: "#d86715",
      points: state.history.map((point) => ({
        x: point.tick,
        y: Number(point.tf0),
      })),
    },
    {
      label: "TF 1",
      color: "#9772b8",
      points: state.history.map((point) => ({
        x: point.tick,
        y: Number(point.tf1),
      })),
    },
    {
      label: "TF 2",
      color: "#26a779",
      points: state.history.map((point) => ({
        x: point.tick,
        y: Number(point.tf2),
      })),
    },
    {
      label: "Signal",
      color: "#888888",
      points: state.history.map((point) => ({
        x: point.tick,
        y: Number(point.signal),
      })),
    },
  ];
}
