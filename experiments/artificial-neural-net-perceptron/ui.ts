import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: [{ field: "seed" }],
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
  live: [
    {
      field: "learningRate",
      label: "Learning rate",
      value: (s) => s.parameters.learningRate,
      set: (m, v) => m.setParameters({ learningRate: Number(v) }),
    },
    {
      field: "examplesPerEpoch",
      label: "Examples per epoch",
      value: (s) => s.parameters.examplesPerEpoch,
      set: (m, v) => m.setParameters({ examplesPerEpoch: Number(v) }),
    },
    {
      field: "targetFunction",
      label: "Target function",
      value: (s) => s.parameters.targetFunction,
      set: (m, v) =>
        m.setParameters({
          targetFunction: String(v) as "or" | "xor" | "and" | "nor" | "nand",
        }),
    },
    {
      field: "input1",
      label: "Input 1",
      value: (s) => s.parameters.input1,
      set: (m, v) => m.setParameters({ input1: Number(v) }),
    },
    {
      field: "input2",
      label: "Input 2",
      value: (s) => s.parameters.input2,
      set: (m, v) => m.setParameters({ input2: Number(v) }),
    },
    {
      field: "showWeights",
      label: "Show weights",
      value: (s) => s.parameters.showWeights,
      set: (m, v) => m.setParameters({ showWeights: Boolean(v) }),
    },
  ],
  monitors: [
    { label: "Epoch", value: (s) => s.tick },
    { label: "Epoch error", value: (s) => s.epochError.toFixed(5) },
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
      series: (s) => [
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
      ],
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
