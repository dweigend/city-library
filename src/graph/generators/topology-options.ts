import { isRandom, type Random } from "../../random/random.ts";
import type { GeneratorSpec } from "./options.ts";
import { boolean, dense, edgeLimit, integer, number } from "./validation.ts";

type Profile = "ordered-topology/1";
export type TopologyGeneratorOptions<N> =
  | { kind: "kleinberg"; profile: Profile; nodes: readonly N[]; shape: readonly [number, number]; clusteringExponent: number; wrap?: boolean; directed?: boolean; random: Random }
  | { kind: "preferential"; profile: Profile; nodes: readonly N[]; edgesPerNode: number; directed?: boolean; random: Random }
  | { kind: "small-world"; profile: Profile; nodes: readonly N[]; neighborsPerSide: number; probability: number; directed?: boolean; random: Random }
  | { kind: "wheel"; profile: Profile; nodes: readonly N[]; directed?: boolean; spokes?: "in" | "out" }
  | { kind: "lattice"; profile: Profile; nodes: readonly N[]; shape: readonly [number, number]; wrap?: boolean; directed?: boolean };
const keys = {
  kleinberg: ["shape", "clusteringExponent", "wrap", "directed", "random"],
  preferential: ["edgesPerNode", "directed", "random"],
  "small-world": ["neighborsPerSide", "probability", "directed", "random"],
  wheel: ["directed", "spokes"],
  lattice: ["shape", "wrap", "directed"],
} as const;

export function validateTopologyGenerator<N>(supplied: Record<string, unknown>): GeneratorSpec<N> {
  if (supplied.profile !== "ordered-topology/1") throw new TypeError("Unknown topology profile.");
  if (typeof supplied.kind !== "string" || !Object.hasOwn(keys, supplied.kind)) throw new TypeError("Generator has no ordered topology profile.");
  const kind = supplied.kind as keyof typeof keys;
  const allowed: readonly string[] = ["kind", "nodes", "profile", ...keys[kind]];
  if (Object.keys(supplied).some(key => !allowed.includes(key))) throw new TypeError("Inapplicable topology profile option.");
  const nodes = dense(supplied.nodes, 100_000) as N[];
  if (new Set(nodes).size !== nodes.length) throw new TypeError("Generator nodes must be unique.");
  const count = nodes.length;
  const config: GeneratorSpec<N> = { profile: "ordered-topology/1", kind, nodes, directed: boolean(supplied.directed),
    branching: 2, shape: [], wrap: false, probability: 0, neighbors: 0, edgesPerNode: 0, radius: 0 };
  let knownEdges = 0;
  if (kind === "wheel") {
    if (count < 4) throw new RangeError("Wheel requires at least four nodes.");
    config.spokes = supplied.spokes === undefined ? "in" : supplied.spokes as "in" | "out";
    if (config.spokes !== "in" && config.spokes !== "out") throw new TypeError("Invalid wheel spokes direction.");
    knownEdges = 2 * (count - 1);
  } else if (kind === "lattice" || kind === "kleinberg") {
    config.shape = dense(supplied.shape, 2).map(integer);
    if (config.shape.length !== 2 || config.shape.some(axis => axis < 2) || config.shape[0]! * config.shape[1]! !== count)
      throw new RangeError("Ordered lattice requires two axes of at least two matching node count.");
    config.wrap = boolean(supplied.wrap);
    knownEdges = config.shape.reduce((sum, axis) => sum + (config.wrap && axis > 2 ? count : count / axis * (axis - 1)), 0);
    if (kind === "kleinberg") {
      config.clusteringExponent = number(supplied.clusteringExponent);
      if (config.clusteringExponent < 0) throw new RangeError("Clustering exponent must be nonnegative.");
    }
  } else if (kind === "preferential") {
    config.edgesPerNode = integer(supplied.edgesPerNode);
    if (config.edgesPerNode >= count) throw new RangeError("Preferential edgesPerNode must be less than node count.");
    knownEdges = config.edgesPerNode * (config.edgesPerNode + 1) / 2 + (count - config.edgesPerNode - 1) * config.edgesPerNode;
  } else {
    config.neighbors = number(supplied.neighborsPerSide);
    if (count < 1 || !Number.isInteger(config.neighbors) || config.neighbors < 0 || config.neighbors > Math.floor((count - 1) / 2))
      throw new RangeError("Invalid per-side neighborhood.");
    config.probability = number(supplied.probability);
    if (config.probability < 0 || config.probability > 1) throw new RangeError("Probability must lie in [0,1].");
    knownEdges = count * config.neighbors;
  }
  if (knownEdges > edgeLimit) throw new RangeError("Generated edge count exceeds limit.");
  if (kind === "kleinberg" || kind === "preferential" || kind === "small-world") {
    if (!isRandom(supplied.random)) throw new TypeError("Generator requires a library Random.");
    config.random = supplied.random;
  }
  return config;
}
