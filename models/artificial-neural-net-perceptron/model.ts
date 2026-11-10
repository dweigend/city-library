/** Rand & Wilensky (2006), CC BY-NC-SA 3.0. Exact source and notices adjacent. */
import { Graph, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export type TruthFunction = "or" | "xor" | "and" | "nor" | "nand";
export interface Parameters {
  seed: number;
  learningRate: number;
  examplesPerEpoch: number;
  targetFunction: TruthFunction;
  input1: number;
  input2: number;
  showWeights: boolean;
}
export const inputs: Inputs<Parameters> = {
  seed: {
    kind: "number",
    default: 1,
    integer: true,
    min: -2147483648,
    max: 4294967295,
  },
  learningRate: { kind: "number", default: 0.5, min: 0, max: 1, step: 0.0001 },
  examplesPerEpoch: {
    kind: "number",
    default: 500,
    min: 1,
    max: 1000,
    integer: true,
  },
  targetFunction: {
    kind: "choice",
    default: "xor",
    options: ["or", "xor", "and", "nor", "nand"],
  },
  input1: { kind: "number", default: 1, min: -1, max: 1, step: 2 },
  input2: { kind: "number", default: 1, min: -1, max: 1, step: 2 },
  showWeights: { kind: "boolean", default: false },
};
export function targetAnswer(
  target: TruthFunction,
  a: number,
  b: number,
): number {
  if (![1, -1].includes(a) || ![1, -1].includes(b))
    throw new RangeError("Perceptron inputs must be -1 or 1.");
  const x = a === 1,
    y = b === 1;
  let answer: boolean;
  switch (target) {
    case "or":
      answer = x || y;
      break;
    case "xor":
      answer = x !== y;
      break;
    case "and":
      answer = x && y;
      break;
    case "nor":
      answer = !(x || y);
      break;
    case "nand":
      answer = !(x && y);
      break;
    default:
      throw new RangeError("Unknown target function.");
  }
  return answer ? 1 : -1;
}
export function sign(value: number, threshold = 0) {
  if (!Number.isFinite(value) || !Number.isFinite(threshold))
    throw new RangeError("Finite sign inputs required.");
  return value > threshold ? 1 : -1;
}
export function create(options: Partial<Parameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.create({ seed: settings.seed }),
    world = World.create({ random });
  const graph = Graph.create<
    { id: number; kind: string; activation: number; x: number; y: number },
    { weight: number }
  >({ edgeState: { weight: 0 } });
  const nodes = [
    { id: 0, kind: "bias", activation: 1, x: 3, y: 7 },
    {
      id: 1,
      kind: "input1",
      activation: random.number() < 0.5 ? 1 : -1,
      x: -6,
      y: 5,
    },
    {
      id: 2,
      kind: "input2",
      activation: random.number() < 0.5 ? 1 : -1,
      x: -6,
      y: 0,
    },
    {
      id: 3,
      kind: "output",
      activation: random.number() < 0.5 ? 1 : -1,
      x: 6,
      y: 0,
    },
  ];
  nodes.forEach((n) => graph.nodes.add(n));
  const edges = nodes.slice(0, 3).map((from) =>
    graph.edges.add({
      from,
      to: nodes[3]!,
      directed: true,
      state: { weight: random.number() * 0.1 - 0.05 },
    }),
  );
  let epochError = 0;
  let lastTest: { output: number; expected: number; correct: boolean } | null =
    null;
  const history: { tick: number; error: number }[] = [];
  function computeActivation() {
    const out = nodes[3]!;
    out.activation = sign(
      edges.reduce((sum, e) => sum + e.from.activation * e.weight, 0),
    );
    return out.activation;
  }
  function updateWeights(answer: number) {
    if (![-1, 1].includes(answer))
      throw new RangeError("Signed target required.");
    const output = nodes[3]!.activation;
    epochError += (answer - sign(output)) ** 2;
    for (const edge of edges)
      edge.weight +=
        settings.learningRate * (answer - output) * edge.from.activation;
  }
  function trainExample(a: number, b: number) {
    targetAnswer(settings.targetFunction, a, b);
    nodes[1]!.activation = a;
    nodes[2]!.activation = b;
    computeActivation();
    updateWeights(targetAnswer(settings.targetFunction, a, b));
  }
  function train() {
    epochError = 0;
    for (let i = 0; i < settings.examplesPerEpoch; i++)
      trainExample(
        random.number() < 0.5 ? 1 : -1,
        random.number() < 0.5 ? 1 : -1,
      );
    epochError = (epochError / settings.examplesPerEpoch) * 0.5;
  }
  function decisionBoundary() {
    const [bias, w1, w2] = edges.map((e) => e.weight) as [
      number,
      number,
      number,
    ];
    if (w2 !== 0)
      return Object.freeze({
        kind: "line" as const,
        points: Object.freeze(
          Array.from({ length: 5 }, (_, i) =>
            Object.freeze({ x: i - 2, y: (-bias - w1 * (i - 2)) / w2 }),
          ),
        ),
      });
    if (w1 !== 0)
      return Object.freeze({
        kind: "vertical" as const,
        points: Object.freeze([
          Object.freeze({ x: -bias / w1, y: -2 }),
          Object.freeze({ x: -bias / w1, y: 2 }),
        ]),
      });
    return Object.freeze({
      kind: "degenerate" as const,
      points: Object.freeze([] as { x: number; y: number }[]),
    });
  }
  computeActivation();
  return {
    computeActivation,
    updateWeights,
    trainExample,
    decisionBoundary,
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i++) {
        run(world, train);
        history.push({ tick: world.tick.value, error: epochError });
        if (history.length > 1001) history.shift();
      }
    },
    setParameters(changes: Partial<Omit<Parameters, "seed">>) {
      parameters(inputs, changes);
      if (Object.hasOwn(changes, "seed"))
        throw new TypeError("Seed is setup-only.");
      settings = parameters(inputs, { ...settings, ...changes });
    },
    setScenario(s: { weights: readonly number[]; inputs: readonly number[] }) {
      if (
        s.weights.length !== 3 ||
        Array.from({ length: s.weights.length }, (_, i) => i).some(
          (i) => !Object.hasOwn(s.weights, i) || !Number.isFinite(s.weights[i]),
        ) ||
        s.inputs.length !== 2
      )
        throw new RangeError(
          "Three finite weights and two signed inputs required.",
        );
      targetAnswer(settings.targetFunction, s.inputs[0]!, s.inputs[1]!);
      edges.forEach((e, i) => (e.weight = s.weights[i]!));
      nodes[1]!.activation = s.inputs[0]!;
      nodes[2]!.activation = s.inputs[1]!;
      computeActivation();
      lastTest = null;
    },
    test(a = settings.input1, b = settings.input2) {
      const expected = targetAnswer(settings.targetFunction, a, b);
      nodes[1]!.activation = a;
      nodes[2]!.activation = b;
      const output = computeActivation();
      lastTest = { output, expected, correct: output === expected };
      return Object.freeze({ ...lastTest });
    },
    read() {
      const activations = Object.freeze(nodes.map((n) => n.activation));
      return Object.freeze({
        tick: world.tick.value,
        parameters: settings,
        randomState: random.state,
        epochError,
        activations,
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
        boundary: decisionBoundary(),
        truthPoints: Object.freeze(
          [-1, 1].flatMap((a) =>
            [-1, 1].map((b) =>
              Object.freeze({
                x: a,
                y: b,
                target: targetAnswer(settings.targetFunction, a, b),
              }),
            ),
          ),
        ),
        lastTest: lastTest ? Object.freeze({ ...lastTest }) : null,
      });
    },
  };
}
export const model = {
  title: "Perceptron",
  description: "A single threshold unit learns a logic function from two inputs; it cannot learn XOR. Rand & Wilensky (2006), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<Parameters, ReturnType<typeof create>>;
