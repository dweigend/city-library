import { defineUI, indexedColor } from "../../ui/index.ts";
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
          label: `${nodeName(n.kind)} · ${n.activation.toFixed(2)}`,
          color: activationColor(n.activation),
          position: { x: n.x * 40, y: -n.y * 40 },
          size: 30,
        })),
      edges: (s) =>
        s.edges.map((e) => ({
          id: e.id,
          from: String(e.from),
          to: String(e.to),
          directed: true,
          color: weightColor(e.weight),
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
      // Like the source's link labels, weights appear only while Show Weights is on.
      type: "inspector",
      label: "Weights",
      value: (s) =>
        s.parameters.showWeights
          ? Object.fromEntries(s.edges.map((e) => [
              `${nodeName(s.nodes[e.from]!.kind)} → ${nodeName(s.nodes[e.to]!.kind)}`,
              e.weight.toFixed(3),
            ]))
          : undefined,
    },
  ],
});

/** Positive weights are red and negative weights blue, as in the source model. */
function weightColor(weight: number) {
  // Blue is one shade lighter than the source so it stays visible on dark surfaces.
  return indexedColor(weight > 0 ? 15 : 106);
}

/** Activation 0…1 as a dark-to-light amber fill that stays visible in both themes. */
function activationColor(activation: number) {
  return indexedColor(23 + 5 * Math.min(1, Math.max(0, activation)));
}

function nodeName(kind: string) {
  return kind.replace(/^([a-z]+)(\d?)$/, (_, name: string, index: string) =>
    `${name[0]!.toUpperCase()}${name.slice(1)}${index ? ` ${index}` : ""}`);
}
