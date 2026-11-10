import { validateOptions } from "../../agent/state.ts";
import { finite, normalizeSpace, type Position, type Space, type NormalizedSpace } from "../../geometry/space.ts";
import { isRandom, type Random } from "../../random/random.ts";
import { validateTopologyGenerator, type TopologyGeneratorOptions } from "./topology-options.ts";
import { boolean, dense, edgeLimit, integer, number } from "./validation.ts";
export { edgeLimit } from "./validation.ts";

type GenericGeneratorOptions<N> =
  | { kind: "path" | "cycle" | "star" | "wheel" | "complete" | "tree"; nodes: readonly N[]; directed?: boolean; branching?: never }
  | { kind: "tree"; nodes: readonly N[]; branching?: number; directed?: boolean }
  | { kind: "lattice"; nodes: readonly N[]; shape: readonly number[]; wrap?: boolean; directed?: boolean }
  | { kind: "random"; nodes: readonly N[]; probability: number; directed?: boolean; random: Random }
  | { kind: "small-world"; nodes: readonly N[]; neighbors: number; probability: number; random: Random }
  | { kind: "preferential"; nodes: readonly N[]; edgesPerNode: number; random: Random }
  | { kind: "geometric"; nodes: readonly N[]; position: (node: N) => Position; radius: number; space?: Space };
export type GeneratorOptions<N> = GenericGeneratorOptions<N> | TopologyGeneratorOptions<N>;
const keys = {
  path: ["directed"], cycle: ["directed"], star: ["directed"], wheel: ["directed"], complete: ["directed"],
  tree: ["branching", "directed"], lattice: ["shape", "wrap", "directed"],
  random: ["probability", "directed", "random"], "small-world": ["neighbors", "probability", "random"],
  preferential: ["edgesPerNode", "random"], geometric: ["position", "radius", "space"],
} as const;
export interface GeneratorSpec<N> {
  kind: keyof typeof keys | "kleinberg";
  profile?: "ordered-topology/1";
  clusteringExponent?: number;
  spokes?: "in" | "out";
  nodes: readonly N[];
  directed: boolean;
  branching: number;
  shape: readonly number[];
  wrap: boolean;
  probability: number;
  neighbors: number;
  edgesPerNode: number;
  random?: Random;
  position?: (node: N) => Position;
  radius: number;
  space?: NormalizedSpace;
}
export function validateGenerator<N>(options: GeneratorOptions<N>): GeneratorSpec<N> {
  const supplied = validateOptions(options, ["kind", "nodes", "directed", "branching", "shape", "wrap", "probability", "neighbors", "edgesPerNode", "random", "position", "radius", "space", "profile", "clusteringExponent", "neighborsPerSide", "spokes"]);
  if (Object.hasOwn(supplied, "profile")) return validateTopologyGenerator<N>(supplied);
  if (typeof supplied.kind !== "string" || !Object.hasOwn(keys, supplied.kind)) throw new TypeError("Unknown graph generator.");
  const kind = supplied.kind as keyof typeof keys;
  const allowed: readonly string[] = ["kind", "nodes", ...keys[kind]];
  if (Object.keys(supplied).some(key => !allowed.includes(key))) throw new TypeError("Inapplicable generator option.");
  const nodes = dense(supplied.nodes, 100_000) as N[];
  if (new Set(nodes).size !== nodes.length) throw new TypeError("Generator nodes must be unique.");
  const count = nodes.length;
  const config: GeneratorSpec<N> = { kind, nodes, directed: boolean(supplied.directed), branching: 2,
    shape: [], wrap: false, probability: 0, neighbors: 0, edgesPerNode: 0, radius: 0 };
  let knownEdges: number | undefined;
  if (kind === "path" || kind === "star") knownEdges = Math.max(0, count - 1);
  else if (kind === "cycle") knownEdges = count < 2 ? 0 : count === 2 && !config.directed ? 1 : count;
  else if (kind === "wheel") {
    if (count < 4) throw new RangeError("Wheel requires at least four nodes.");
    knownEdges = 2 * (count - 1);
  } else if (kind === "complete") knownEdges = count * (count - 1) / (config.directed ? 1 : 2);
  else if (kind === "tree") {
    config.branching = supplied.branching === undefined ? 2 : integer(supplied.branching);
    knownEdges = Math.max(0, count - 1);
  } else if (kind === "lattice") {
    config.shape = dense(supplied.shape, 3).map(integer);
    if (!config.shape.length || config.shape.reduce((a, b) => a * b, 1) !== count) throw new RangeError("Lattice shape must match node count.");
    config.wrap = boolean(supplied.wrap);
    knownEdges = config.shape.reduce((total, axis) => total + (axis === 1 ? 0 : config.wrap && (config.directed || axis > 2) ? count : count / axis * (axis - 1)), 0);
  } else if (kind === "random" || kind === "small-world") {
    config.probability = number(supplied.probability);
    if (config.probability < 0 || config.probability > 1) throw new RangeError("Probability must lie in [0,1].");
    if (kind === "random") {
      if (config.probability === 1) knownEdges = count * (count - 1) / (config.directed ? 1 : 2);
    } else {
      config.neighbors = integer(supplied.neighbors);
      if (count < 3 || config.neighbors < 2 || config.neighbors >= count || config.neighbors % 2) throw new RangeError("Invalid small-world neighborhood.");
      knownEdges = count * config.neighbors / 2;
    }
  } else if (kind === "preferential") {
    config.edgesPerNode = integer(supplied.edgesPerNode);
    if (config.edgesPerNode >= count) throw new RangeError("Preferential edgesPerNode must be less than node count.");
    knownEdges = config.edgesPerNode * (config.edgesPerNode + 1) / 2 + (count - config.edgesPerNode - 1) * config.edgesPerNode;
  } else {
    if (typeof supplied.position !== "function") throw new TypeError("Geometric generator requires a position callback.");
    config.position = supplied.position as (node: N) => Position;
    config.radius = finite(supplied.radius, "Geometric radius");
    if (config.radius < 0) throw new RangeError("Radius must be nonnegative.");
    if (supplied.space !== undefined) config.space = normalizeSpace(supplied.space as Space);
  }
  if (knownEdges !== undefined && knownEdges > edgeLimit) throw new RangeError("Generated edge count exceeds limit.");
  if (kind === "random" || kind === "small-world" || kind === "preferential") {
    if (!isRandom(supplied.random)) throw new TypeError("Generator requires a library Random.");
    config.random = supplied.random;
  }
  return config;
}
