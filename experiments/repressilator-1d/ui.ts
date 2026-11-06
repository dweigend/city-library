import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

const binding = defineUI(model, {
  setup: [
    { field: "seed" },
    { field: "initialTF0s" },
    { field: "initialTF1s" },
    { field: "initialTF2s" },
  ],
  live: [
    {
      field: "tfsPerMRNA",
      value: (state) => state.parameters.tfsPerMRNA,
      set: (instance, value) =>
        instance.setParameters({ tfsPerMRNA: Number(value) }),
    },
    {
      field: "maxTFSynergy",
      value: (state) => state.parameters.maxTFSynergy,
      set: (instance, value) =>
        instance.setParameters({ maxTFSynergy: Number(value) }),
    },
    {
      field: "mrnaDecayProb",
      value: (state) => state.parameters.mrnaDecayProb,
      set: (instance, value) =>
        instance.setParameters({ mrnaDecayProb: Number(value) }),
    },
    {
      field: "signalDecayProb",
      value: (state) => state.parameters.signalDecayProb,
      set: (instance, value) =>
        instance.setParameters({ signalDecayProb: Number(value) }),
    },
    {
      field: "signalTFUnbindProb",
      value: (state) => state.parameters.signalTFUnbindProb,
      set: (instance, value) =>
        instance.setParameters({ signalTFUnbindProb: Number(value) }),
    },
    {
      field: "signalTFBindProb",
      value: (state) => state.parameters.signalTFBindProb,
      set: (instance, value) =>
        instance.setParameters({ signalTFBindProb: Number(value) }),
    },
    {
      field: "tfBindProb",
      value: (state) => state.parameters.tfBindProb,
      set: (instance, value) =>
        instance.setParameters({ tfBindProb: Number(value) }),
    },
    {
      field: "tfUnbindProb",
      value: (state) => state.parameters.tfUnbindProb,
      set: (instance, value) =>
        instance.setParameters({ tfUnbindProb: Number(value) }),
    },
    {
      field: "tfDecayProb",
      value: (state) => state.parameters.tfDecayProb,
      set: (instance, value) =>
        instance.setParameters({ tfDecayProb: Number(value) }),
    },
  ],
  actions: [],
  complete: (state) => state.stopped,
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Biology/Repressilator%201D.nlogox",
    label: "Original NetLogo model · source notices",
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
      series: (state) => [
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
      ],
    },
    {
      type: "line",
      label: "History",
      series: (state) => [
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
      ],
    },
  ],
});

export { model };
export const sourceMarker =
  "selected-disease-gene-b09:repressilator-1d:e222752e0f629c0ae1f6df4f6858fcecb5629868ffd6a52ed602e172084f1315";
export const ui = { ...binding, model, sourceMarker };
