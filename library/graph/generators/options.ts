import { validateOptions } from "../../agent/state.ts";
import { finite, normalizeSpace, type Position, type Space, type NormalizedSpace } from "../../geometry/space.ts";
import type { Random } from "../../random/random.ts";
import { validateTopologyGenerator, type TopologyGeneratorSpec, type TopologyGeneratorOptions } from "./topology-options.ts";
import {
  preferentialEdgeCount, readDenseArray, readFlag, readNodes, readPositiveInteger,
  readPreferentialEdgesPerNode, readProbability, readRandom, requireEdgeBudget, requireWheelSize,
} from "./validation.ts";

type GenericGeneratorOptions<N> =
  | { kind: "path" | "cycle" | "star" | "wheel" | "complete" | "tree"; nodes: readonly N[]; directed?: boolean; branching?: never }
  | { kind: "tree"; nodes: readonly N[]; branching?: number; directed?: boolean }
  | { kind: "lattice"; nodes: readonly N[]; shape: readonly number[]; wrap?: boolean; directed?: boolean }
  | { kind: "random"; nodes: readonly N[]; probability: number; directed?: boolean; random: Random }
  | { kind: "small-world"; nodes: readonly N[]; neighborCount: number; probability: number; random: Random }
  | { kind: "preferential"; nodes: readonly N[]; edgesPerNode: number; random: Random }
  | { kind: "geometric"; nodes: readonly N[]; position: (node: N) => Position; radius: number; space?: Space };
/**
 * Generator options accepted by `graph.generate`. A `profile` selects the
 * explicit ordered topology profile; without it the generic generator kinds apply.
 */
export type GeneratorOptions<N> = GenericGeneratorOptions<N> | TopologyGeneratorOptions<N>;

const optionsByKind = {
  path: ["directed"], cycle: ["directed"], star: ["directed"], wheel: ["directed"], complete: ["directed"],
  tree: ["branching", "directed"], lattice: ["shape", "wrap", "directed"],
  random: ["probability", "directed", "random"], "small-world": ["neighborCount", "probability", "random"],
  preferential: ["edgesPerNode", "random"], geometric: ["position", "radius", "space"],
} as const;
type GenericKind = keyof typeof optionsByKind;
const suppliedOptionNames = [
  "kind", "nodes", "directed", "branching", "shape", "wrap", "probability", "neighborCount", "edgesPerNode", "random",
  "position", "radius", "space", "profile", "clusteringExponent", "neighborCountPerSide", "spokes",
];

/** Validated generic generator settings; each kind carries only its own parameters. */
export type GenericGeneratorSpec<N> = { readonly nodes: readonly N[]; readonly directed: boolean } & (
  | { readonly kind: "path" | "cycle" | "star" | "wheel" | "complete" }
  | { readonly kind: "tree"; readonly branching: number }
  | { readonly kind: "lattice"; readonly shape: readonly number[]; readonly wrap: boolean }
  | { readonly kind: "random"; readonly probability: number; readonly random: Random }
  | { readonly kind: "small-world"; readonly neighborCount: number; readonly probability: number; readonly random: Random }
  | { readonly kind: "preferential"; readonly edgesPerNode: number; readonly random: Random }
  | {
    readonly kind: "geometric";
    readonly position: (node: N) => Position;
    readonly radius: number;
    readonly space: NormalizedSpace | undefined;
  }
);
export type GeneratorSpec<N> = GenericGeneratorSpec<N> | TopologyGeneratorSpec<N>;

/**
 * Validates all generator options before any planning callback or draw.
 * Failure order: option record, kind, inapplicable keys, nodes, direction flag,
 * kind parameters, known edge budget, then the Random stream.
 */
export function validateGenerator<N>(options: GeneratorOptions<N>): GeneratorSpec<N> {
  const supplied = validateOptions(options, suppliedOptionNames);
  if (Object.hasOwn(supplied, "profile")) return validateTopologyGenerator<N>(supplied);
  if (typeof supplied.kind !== "string" || !Object.hasOwn(optionsByKind, supplied.kind)) throw new TypeError("Unknown graph generator.");
  const kind = supplied.kind as GenericKind;
  const allowed: readonly string[] = ["kind", "nodes", ...optionsByKind[kind]];
  if (Object.keys(supplied).some(key => !allowed.includes(key))) throw new TypeError("Inapplicable generator option.");
  const nodes = readNodes<N>(supplied.nodes);
  const directed = readFlag(supplied.directed);
  return readGenericKind(kind, supplied, nodes, directed);
}

function readGenericKind<N>(
  kind: GenericKind, supplied: Record<string, unknown>, nodes: readonly N[], directed: boolean,
): GenericGeneratorSpec<N> {
  const count = nodes.length;
  switch (kind) {
    case "path":
    case "star":
      requireEdgeBudget(Math.max(0, count - 1));
      return { kind, nodes, directed };
    case "cycle":
      requireEdgeBudget(cycleEdgeCount(count, directed));
      return { kind, nodes, directed };
    case "wheel":
      requireWheelSize(count);
      requireEdgeBudget(2 * (count - 1));
      return { kind, nodes, directed };
    case "complete":
      requireEdgeBudget(count * (count - 1) / (directed ? 1 : 2));
      return { kind, nodes, directed };
    case "tree": {
      const branching = supplied.branching === undefined ? 2 : readPositiveInteger(supplied.branching);
      requireEdgeBudget(Math.max(0, count - 1));
      return { kind, nodes, directed, branching };
    }
    case "lattice": {
      const shape = readDenseArray(supplied.shape, 3).map(readPositiveInteger);
      if (!shape.length || shape.reduce((a, b) => a * b, 1) !== count) throw new RangeError("Lattice shape must match node count.");
      const wrap = readFlag(supplied.wrap);
      requireEdgeBudget(shape.reduce((total, axis) => total + latticeAxisEdgeCount(axis, count, wrap, directed), 0));
      return { kind, nodes, directed, shape, wrap };
    }
    case "random": {
      const probability = readProbability(supplied.probability);
      // Below certainty the realized edge count is checked while planning.
      if (probability === 1) requireEdgeBudget(count * (count - 1) / (directed ? 1 : 2));
      return { kind, nodes, directed, probability, random: readRandom(supplied.random) };
    }
    case "small-world": {
      const probability = readProbability(supplied.probability);
      const neighborCount = readPositiveInteger(supplied.neighborCount);
      if (count < 3 || neighborCount < 2 || neighborCount >= count || neighborCount % 2) throw new RangeError("Invalid small-world neighborhood.");
      requireEdgeBudget(count * neighborCount / 2);
      return { kind, nodes, directed, neighborCount, probability, random: readRandom(supplied.random) };
    }
    case "preferential": {
      const edgesPerNode = readPreferentialEdgesPerNode(supplied.edgesPerNode, count);
      requireEdgeBudget(preferentialEdgeCount(edgesPerNode, count));
      return { kind, nodes, directed, edgesPerNode, random: readRandom(supplied.random) };
    }
    case "geometric": {
      if (typeof supplied.position !== "function") throw new TypeError("Geometric generator requires a position callback.");
      const position = supplied.position as (node: N) => Position;
      const radius = finite(supplied.radius, "Geometric radius");
      if (radius < 0) throw new RangeError("Radius must be nonnegative.");
      const space = supplied.space === undefined ? undefined : normalizeSpace(supplied.space as Space);
      return { kind, nodes, directed, position, radius, space };
    }
  }
}

/** Two undirected nodes share one edge; a directed pair keeps both directions. */
function cycleEdgeCount(count: number, directed: boolean): number {
  if (count < 2) return 0;
  if (count === 2 && !directed) return 1;
  return count;
}

/** Wrapped axes close a ring, except an undirected two-node ring that would repeat its edge. */
function latticeAxisEdgeCount(axis: number, count: number, wrap: boolean, directed: boolean): number {
  if (axis === 1) return 0;
  if (wrap && (directed || axis > 2)) return count;
  return count / axis * (axis - 1);
}
