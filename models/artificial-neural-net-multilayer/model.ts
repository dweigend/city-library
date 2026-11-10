/** Wilensky (2006), CC BY-NC-SA 3.0. Exact source and notices adjacent. */
import { Graph, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";
export interface Parameters {
  seed: number;
  learningRate: number;
  examplesPerEpoch: number;
  targetFunction: "or" | "xor";
  input1: number;
  input2: number;
  showWeights: boolean;
}
export const inputs: Inputs<Parameters> = {
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  learningRate: { kind: "number", default: 0.5, min: 0, max: 1, step: 0.0001 },
  examplesPerEpoch: {
    kind: "number",
    default: 500,
    min: 1,
    max: 1000,
    integer: true,
  },
  targetFunction: { kind: "choice", default: "xor", options: ["or", "xor"] },
  input1: { kind: "number", default: 1, min: 0, max: 1, integer: true },
  input2: { kind: "number", default: 0, min: 0, max: 1, integer: true },
  showWeights: { kind: "boolean", default: false },
};
export function sigmoid(value: number) {
  if (!Number.isFinite(value))
    throw new RangeError("Finite sigmoid input required.");
  return 1 / (1 + Math.exp(-value));
}
export function step(value: number) {
  if (!Number.isFinite(value))
    throw new RangeError("Finite activation required.");
  return value > 0.5 ? 1 : 0;
}
export function targetAnswer(target: "or" | "xor", a: number, b: number) {
  if (![0, 1].includes(a) || ![0, 1].includes(b))
    throw new RangeError("Binary input required.");
  if (target === "or") return a === 1 || b === 1 ? 1 : 0;
  if (target === "xor") return a !== b ? 1 : 0;
  throw new RangeError("Unknown target function.");
}
export function create(options: Partial<Parameters> = {}) {
  let settings = parseParameters(inputs, options);
  const random = Random.create({ seed: settings.seed }),
    world = World.create({ random });
  const graph = Graph.create<
    {
      id: number;
      kind: string;
      activation: number;
      err: number;
      x: number;
      y: number;
    },
    { weight: number }
  >({ edgeState: { weight: 0 } });
  const nodes = [
    { id: 0, kind: "bias", activation: 1, err: 0, x: -4, y: 6 },
    {
      id: 1,
      kind: "input1",
      activation: Math.floor(random.number() * 2),
      err: 0,
      x: -6,
      y: -2,
    },
    {
      id: 2,
      kind: "input2",
      activation: Math.floor(random.number() * 2),
      err: 0,
      x: -6,
      y: 2,
    },
    {
      id: 3,
      kind: "hidden1",
      activation: Math.floor(random.number() * 2),
      err: 0,
      x: 0,
      y: -2,
    },
    {
      id: 4,
      kind: "hidden2",
      activation: Math.floor(random.number() * 2),
      err: 0,
      x: 0,
      y: 2,
    },
    {
      id: 5,
      kind: "output",
      activation: Math.floor(random.number() * 2),
      err: 0,
      x: 5,
      y: 0,
    },
  ];
  nodes.forEach((n) => graph.nodes.add(n));
  const pairs = [
    [0, 3],
    [0, 4],
    [0, 5],
    [1, 3],
    [1, 4],
    [2, 3],
    [2, 4],
    [3, 5],
    [4, 5],
  ] as const;
  const edges = pairs.map(([a, b]) =>
    graph.edges.add({
      from: nodes[a]!,
      to: nodes[b]!,
      directed: true,
      state: { weight: random.number() * 0.2 - 0.1 },
    }),
  );
  let epochError = 0,
    lastTest: { output: number; expected: number; correct: boolean } | null =
      null;
  const history: { tick: number; error: number }[] = [];
  function newActivation(id: number) {
    if (![3, 4, 5].includes(id))
      throw new RangeError("Hidden/output node required.");
    return sigmoid(
      edges
        .filter((e) => e.to.id === id)
        .reduce((sum, e) => sum + e.weight * e.from.activation, 0),
    );
  }
  function propagate() {
    for (const id of [3, 4]) nodes[id]!.activation = newActivation(id);
    nodes[5]!.activation = newActivation(5);
  }
  function backpropagate() {
    const out = nodes[5]!,
      answer = targetAnswer(
        settings.targetFunction,
        nodes[1]!.activation,
        nodes[2]!.activation,
      );
    out.err = out.activation * (1 - out.activation) * (answer - out.activation);
    epochError += (answer - out.activation) ** 2;
    for (const id of [3, 4]) {
      const n = nodes[id]!;
      n.err =
        n.activation *
        (1 - n.activation) *
        edges
          .filter((e) => e.from === n)
          .reduce((s, e) => s + e.weight * e.to.err, 0);
    }
    for (const e of edges)
      e.weight += settings.learningRate * e.to.err * e.from.activation;
  }
  function trainExample(a: number, b: number) {
    targetAnswer(settings.targetFunction, a, b);
    nodes[1]!.activation = a;
    nodes[2]!.activation = b;
    propagate();
    backpropagate();
  }
  function train() {
    epochError = 0;
    for (let i = 0; i < settings.examplesPerEpoch; i++)
      trainExample(
        Math.floor(random.number() * 2),
        Math.floor(random.number() * 2),
      );
    epochError /= settings.examplesPerEpoch;
  }
  propagate();
  return {
    propagate,
    newActivation,
    backpropagate,
    trainExample,
    advance(stepCount = 1) {
      validateStepCount(stepCount);
      for (let i = 0; i < stepCount; i++) {
        run(world, train);
        history.push({ tick: world.tick.value, error: epochError });
        if (history.length > 1001) history.shift();
      }
    },
    setParameters(changes: Partial<Omit<Parameters, "seed">>) {
      parseParameters(inputs, changes);
      if (Object.hasOwn(changes, "seed"))
        throw new TypeError("Seed is setup-only.");
      settings = parseParameters(inputs, { ...settings, ...changes });
    },
    setScenario(s: { weights: readonly number[]; inputs: readonly number[] }) {
      if (
        s.weights.length !== 9 ||
        Array.from({ length: s.weights.length }, (_, i) => i).some(
          (i) => !Object.hasOwn(s.weights, i) || !Number.isFinite(s.weights[i]),
        ) ||
        s.inputs.length !== 2
      )
        throw new RangeError(
          "Nine finite weights and two binary inputs required.",
        );
      targetAnswer(settings.targetFunction, s.inputs[0]!, s.inputs[1]!);
      edges.forEach((e, i) => (e.weight = s.weights[i]!));
      nodes[1]!.activation = s.inputs[0]!;
      nodes[2]!.activation = s.inputs[1]!;
      nodes.forEach((n) => (n.err = 0));
      propagate();
      lastTest = null;
    },
    test(a = settings.input1, b = settings.input2) {
      const expected = targetAnswer(settings.targetFunction, a, b);
      nodes[1]!.activation = a;
      nodes[2]!.activation = b;
      propagate();
      const output = step(nodes[5]!.activation);
      lastTest = { output, expected, correct: output === expected };
      return Object.freeze({ ...lastTest });
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        parameters: settings,
        randomState: random.state,
        epochError,
        activations: Object.freeze(nodes.map((n) => n.activation)),
        errors: Object.freeze(nodes.map((n) => n.err)),
        weights: Object.freeze(edges.map((e) => e.weight)),
        nodes: Object.freeze(nodes.map((n) => Object.freeze({ ...n }))),
        edges: Object.freeze(
          edges.map((e, i) =>
            Object.freeze({
              id: `e-${i}`,
              from: e.from.id,
              to: e.to.id,
              weight: e.weight,
            }),
          ),
        ),
        history: Object.freeze(history.map((h) => Object.freeze({ ...h }))),
        lastTest: lastTest ? Object.freeze({ ...lastTest }) : null,
      });
    },
  };
}
export const model = {
  title: "Multilayer Neural Network",
  description: "A two-input network with one hidden layer learns a logic function by backpropagation. Wilensky (2006), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<Parameters, ReturnType<typeof create>>;
