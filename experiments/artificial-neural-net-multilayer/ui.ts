import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["seed"],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/ArtificialNeuralNet-Multilayer",
    label: "Wilensky · CC BY-NC-SA 3.0",
  },
  actions: [
    {
      label: "Test",
      run: (m) => {
        m.test();
      },
    },
  ],
  live: {
    learningRate: {
      set: (m, v) => m.setParameters({ learningRate: v }),
    },
    examplesPerEpoch: {
      set: (m, v) => m.setParameters({ examplesPerEpoch: v }),
    },
    targetFunction: {
      set: (m, v) => m.setParameters({ targetFunction: v }),
    },
    input1: {
      label: "Input 1",
      set: (m, v) => m.setParameters({ input1: v }),
    },
    input2: {
      label: "Input 2",
      set: (m, v) => m.setParameters({ input2: v }),
    },
    showWeights: {
      set: (m, v) => m.setParameters({ showWeights: v }),
    },
  },
  monitors: [
    { label: "Epoch", value: (s) => s.tick },
    {
      label: "Epoch error",
      value: (s) => s.epochError,
      format: (value: number) => value.toFixed(5),
    },
    {
      label: "Output activation",
      value: (s) => s.activations[5]!,
      format: (value: number) => value.toFixed(3),
    },
    {
      label: "Test",
      value: (s) =>
        s.lastTest
          ? `${s.lastTest.output} / expected ${s.lastTest.expected} · ${s.lastTest.correct ? "correct" : "incorrect"}`
          : "—",
    },
  ],
  views: [
    {
      type: "network",
      label: "Neural network",
      nodes: (s) =>
        s.nodes.map((n) => ({
          id: String(n.id),
          label: `${n.kind}: ${n.activation.toFixed(2)}`,
          color: n.activation > 0.5 ? "#eeeeee" : "#242424",
          position: { x: n.x * 20, y: -n.y * 20 },
          size: 28,
        })),
      edges: (s) =>
        s.edges.map((e) => ({
          id: e.id,
          from: String(e.from),
          to: String(e.to),
          directed: true,
          color: e.weight > 0 ? "#d74343" : "#3975bc",
          width: Math.max(0.5, 0.05 * Math.abs(e.weight) * 20),
        })),
    },
    {
      type: "line",
      label: "Error vs. epochs",
      series: (s) => [
        {
          label: "Mean squared error",
          points: s.history.map((h) => ({ x: h.tick, y: h.error })),
        },
      ],
    },
    {
      type: "table",
      label: "Weights",
      rows: (s) =>
        s.parameters.showWeights
          ? s.edges.map((e) => ({
              from: s.nodes[e.from]!.kind,
              to: s.nodes[e.to]!.kind,
              weight: e.weight,
            }))
          : [],
    },
  ],
});
