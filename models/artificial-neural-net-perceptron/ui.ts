import { defineUI, type Observation, type Series } from "../../ui/index.ts";

import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["seed"],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/ArtificialNeuralNet-Perceptron",
    label: "Rand & Wilensky · CC BY-NC-SA 3.0",
  },
  actions: [
    {
      label: "Test",
      run: (m) => {
        m.test();
      },
    },
  ],
  change: (instance, changes) => instance.setParameters(changes),
  live: {
    learningRate: {},
    examplesPerEpoch: {},
    targetFunction: {},
    input1: {
      label: "Input 1",
    },
    input2: {
      label: "Input 2",
    },
    showWeights: {},
  },
  monitors: [
    { label: "Epoch", value: (s) => s.tick },
    {
      label: "Epoch error",
      value: (s) => s.epochError,
      format: (value: number) => value.toFixed(5),
    },
    { label: "Output", value: (s) => s.activations[3]! },
    {
      label: "Test",
      value: (s) =>
        s.lastTest
          ? `${s.lastTest.output} / expected ${s.lastTest.expected} · ${s.lastTest.correct ? "correct" : "incorrect"}`
          : "—",
    },
    { label: "Decision boundary", value: (s) => s.boundary.kind },
  ],
  views: [
    {
      type: "network",
      label: "Perceptron",
      nodes: (s) =>
        s.nodes.map((n) => ({
          id: String(n.id),
          label: `${n.kind}: ${n.activation}`,
          color: n.activation === 1 ? "#eeeeee" : "#242424",
          position: { x: n.x * 20, y: -n.y * 20 },
          size: n.kind === "output" ? 32 : 26,
        })),
      edges: (s) =>
        s.edges.map((e) => ({
          id: e.id,
          from: String(e.from),
          to: String(e.to),
          directed: true,
          color: e.weight > 0 ? "#d74343" : "#3975bc",
          width: Math.max(0.5, 0.2 * Math.abs(e.weight) * 20),
        })),
    },
    {
      type: "line",
      label: "Error vs. epochs",
      series: (s) => [
        {
          label: "Squared signed error × 0.5",
          points: s.history.map((h) => ({ x: h.tick, y: h.error })),
        },
      ],
    },
    {
      type: "scatter",
      label: "Rule learned",
      series: ruleLearnedSeries,
    },
    {
      type: "table",
      label: "Weights",
      rows: (s) =>
        s.parameters.showWeights
          ? s.edges.map((e) => ({
              input: s.nodes[e.from]!.kind,
              weight: e.weight,
            }))
          : [],
    },
  ],
});

type UIObservation = Observation<typeof model>;

function ruleLearnedSeries(s: UIObservation): readonly Series[] {
  return [
    {
      label: "Positive",
      color: "#47a66a",
      points: s.truthPoints.filter((p) => p.target === 1),
    },
    {
      label: "Negative",
      color: "#d74343",
      points: s.truthPoints.filter((p) => p.target === -1),
    },
    { label: "Boundary", color: "#8a8a8a", points: s.boundary.points },
  ];
}
