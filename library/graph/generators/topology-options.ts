import type { Random } from "../../random/random.ts";
import {
  preferentialEdgeCount, readDenseArray, readFiniteNumber, readFlag, readNodes, readPositiveInteger,
  readPreferentialEdgesPerNode, readProbability, readRandom, requireEdgeBudget, requireWheelSize,
} from "./validation.ts";

type Profile = "ordered-topology/1";
export type TopologyGeneratorOptions<N> =
  | { kind: "kleinberg"; profile: Profile; nodes: readonly N[]; shape: readonly [number, number]; clusteringExponent: number; wrap?: boolean; directed?: boolean; random: Random }
  | { kind: "preferential"; profile: Profile; nodes: readonly N[]; edgesPerNode: number; directed?: boolean; random: Random }
  | { kind: "small-world"; profile: Profile; nodes: readonly N[]; neighborCountPerSide: number; probability: number; directed?: boolean; random: Random }
  | { kind: "wheel"; profile: Profile; nodes: readonly N[]; directed?: boolean; spokes?: "in" | "out" }
  | { kind: "lattice"; profile: Profile; nodes: readonly N[]; shape: readonly [number, number]; wrap?: boolean; directed?: boolean };
const optionsByKind = {
  kleinberg: ["shape", "clusteringExponent", "wrap", "directed", "random"],
  preferential: ["edgesPerNode", "directed", "random"],
  "small-world": ["neighborCountPerSide", "probability", "directed", "random"],
  wheel: ["directed", "spokes"],
  lattice: ["shape", "wrap", "directed"],
} as const;
type TopologyKind = keyof typeof optionsByKind;

/** Validated ordered topology profile settings; each kind carries only its own parameters. */
export type TopologyGeneratorSpec<N> = { readonly profile: Profile; readonly nodes: readonly N[]; readonly directed: boolean } & (
  | { readonly kind: "wheel"; readonly spokes: "in" | "out" }
  | { readonly kind: "lattice"; readonly shape: readonly [number, number]; readonly wrap: boolean }
  | {
    readonly kind: "kleinberg";
    readonly shape: readonly [number, number];
    readonly wrap: boolean;
    readonly clusteringExponent: number;
    readonly random: Random;
  }
  | { readonly kind: "preferential"; readonly edgesPerNode: number; readonly random: Random }
  | { readonly kind: "small-world"; readonly neighborCountPerSide: number; readonly probability: number; readonly random: Random }
);

/** Same failure order as generic generators, preceded by the profile check. */
export function validateTopologyGenerator<N>(supplied: Record<string, unknown>): TopologyGeneratorSpec<N> {
  if (supplied.profile !== "ordered-topology/1") throw new TypeError("Unknown topology profile.");
  if (typeof supplied.kind !== "string" || !Object.hasOwn(optionsByKind, supplied.kind)) throw new TypeError("Generator has no ordered topology profile.");
  const kind = supplied.kind as TopologyKind;
  const allowed: readonly string[] = ["kind", "nodes", "profile", ...optionsByKind[kind]];
  if (Object.keys(supplied).some(key => !allowed.includes(key))) throw new TypeError("Inapplicable topology profile option.");
  const nodes = readNodes<N>(supplied.nodes);
  const directed = readFlag(supplied.directed);
  return readTopologyKind(kind, supplied, { profile: "ordered-topology/1", nodes, directed });
}

function readTopologyKind<N>(
  kind: TopologyKind, supplied: Record<string, unknown>, base: { profile: Profile; nodes: readonly N[]; directed: boolean },
): TopologyGeneratorSpec<N> {
  const count = base.nodes.length;
  switch (kind) {
    case "wheel": {
      requireWheelSize(count);
      const spokes = supplied.spokes === undefined ? "in" : supplied.spokes;
      if (spokes !== "in" && spokes !== "out") throw new TypeError("Invalid wheel spokes direction.");
      requireEdgeBudget(2 * (count - 1));
      return { ...base, kind, spokes };
    }
    case "lattice": {
      const shape = readShape(supplied.shape, count);
      const wrap = readFlag(supplied.wrap);
      requireEdgeBudget(latticeEdgeCount(shape, count, wrap));
      return { ...base, kind, shape, wrap };
    }
    case "kleinberg": {
      const shape = readShape(supplied.shape, count);
      const wrap = readFlag(supplied.wrap);
      const clusteringExponent = readFiniteNumber(supplied.clusteringExponent);
      if (clusteringExponent < 0) throw new RangeError("Clustering exponent must be nonnegative.");
      requireEdgeBudget(latticeEdgeCount(shape, count, wrap));
      return { ...base, kind, shape, wrap, clusteringExponent, random: readRandom(supplied.random) };
    }
    case "preferential": {
      const edgesPerNode = readPreferentialEdgesPerNode(supplied.edgesPerNode, count);
      requireEdgeBudget(preferentialEdgeCount(edgesPerNode, count));
      return { ...base, kind, edgesPerNode, random: readRandom(supplied.random) };
    }
    case "small-world": {
      const neighborCountPerSide = readFiniteNumber(supplied.neighborCountPerSide);
      if (count < 1 || !Number.isInteger(neighborCountPerSide) || neighborCountPerSide < 0 || neighborCountPerSide > Math.floor((count - 1) / 2))
        throw new RangeError("Invalid per-side neighborhood.");
      const probability = readProbability(supplied.probability);
      requireEdgeBudget(count * neighborCountPerSide);
      return { ...base, kind, neighborCountPerSide, probability, random: readRandom(supplied.random) };
    }
  }
}

/** Columns then rows; both axes need at least two nodes and must cover the selection. */
function readShape(value: unknown, count: number): readonly [number, number] {
  const [columns, rows] = readDenseArray(value, 2).map(readPositiveInteger);
  if (columns === undefined || rows === undefined || columns < 2 || rows < 2 || columns * rows !== count)
    throw new RangeError("Ordered lattice requires two axes of at least two matching node count.");
  return [columns, rows];
}

/** Wrapped axes close a ring only above two nodes, so no edge repeats. */
function latticeEdgeCount(shape: readonly [number, number], count: number, wrap: boolean): number {
  return shape.reduce((sum, axis) => sum + (wrap && axis > 2 ? count : count / axis * (axis - 1)), 0);
}
