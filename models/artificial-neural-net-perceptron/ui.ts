import { defineUI, indexedColor, type Observation, type SpatialData } from "../../ui/index.ts";

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
          label: `${nodeName(n.kind)} · ${n.activation}`,
          color: indexedColor(n.activation === 1 ? 28 : 23),
          position: { x: n.x * 40, y: -n.y * 40 },
          size: n.kind === "output" ? 32 : 26,
        })),
      edges: (s) =>
        s.edges.map((e) => ({
          id: e.id,
          from: String(e.from),
          to: String(e.to),
          directed: true,
          color: indexedColor(e.weight > 0 ? 15 : 105),
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
      type: "spatial",
      label: "Rule learned · green = true, red = false, line = decision boundary",
      data: ruleLearnedScene,
    },
    {
      // Like the source's link labels, weights appear only while Show Weights is on.
      type: "inspector",
      label: "Weights",
      value: (s) =>
        s.parameters.showWeights
          ? Object.fromEntries(s.edges.map((e) => [`${nodeName(s.nodes[e.from]!.kind)} → Output`, e.weight.toFixed(3)]))
          : undefined,
    },
  ],
});

type UIObservation = Observation<typeof model>;

/**
 * The input plane from -2.5 to 2.5 on both axes: the four training inputs colored by
 * their target, and the model's decision boundary drawn as one straight line.
 */
function ruleLearnedScene(s: UIObservation): SpatialData {
  const scaled = (point: { x: number; y: number }) => ({ x: point.x * planeScale, y: point.y * planeScale });
  const boundary = s.boundary.points;
  const axisColor = "#5c5c5c";
  return {
    width: planeExtent * planeScale,
    height: planeExtent * planeScale,
    segments: [
      { from: scaled({ x: -planeExtent / 2, y: 0 }), to: scaled({ x: planeExtent / 2, y: 0 }), color: axisColor },
      { from: scaled({ x: 0, y: -planeExtent / 2 }), to: scaled({ x: 0, y: planeExtent / 2 }), color: axisColor },
      ...(boundary.length >= 2 ? [boundaryAcrossPlane(boundary[0]!, boundary.at(-1)!)] : []),
    ],
    labels: [
      { ...scaled({ x: 2.1, y: -0.25 }), text: "Input 1" },
      { ...scaled({ x: 0.55, y: 2.2 }), text: "Input 2" },
    ],
    showLabels: true,
    agents: s.truthPoints.map((point) => ({
      id: `input-${point.x}-${point.y}`,
      ...scaled(point),
      label: `(${point.x}, ${point.y})`,
      color: point.target === 1 ? "#47a66a" : "#d74343",
      size: 14,
    })),
    description: `Decision boundary: ${s.boundary.kind}. ${s.truthPoints.filter((point) => point.target === 1).length} of 4 inputs are true.`,
  };
}

/** The model samples the boundary inside ±2; extend that straight line past the plane edges. */
function boundaryAcrossPlane(first: { x: number; y: number }, last: { x: number; y: number }) {
  const middle = { x: (first.x + last.x) / 2, y: (first.y + last.y) / 2 };
  const direction = { x: last.x - first.x, y: last.y - first.y };
  return {
    from: { x: (middle.x - direction.x) * planeScale, y: (middle.y - direction.y) * planeScale },
    to: { x: (middle.x + direction.x) * planeScale, y: (middle.y + direction.y) * planeScale },
    color: "#e5e7eb",
    width: 2,
  };
}

// Input values are ±1; the plane shows ±2.5 at four scene units per input unit.
const planeExtent = 5;
const planeScale = 4;

function nodeName(kind: string) {
  return kind.replace(/^([a-z]+)(\d?)$/, (_, name: string, index: string) =>
    `${name[0]!.toUpperCase()}${name.slice(1)}${index ? ` ${index}` : ""}`);
}
