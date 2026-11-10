import { isRandom, type Random } from "../../random/random.ts";

/** Shared closed-data readers and budgets for generic and explicit topology profiles. */
export const edgeLimit = 1_000_000;
const nodeLimit = 100_000;

/** One planned edge as indices into the generator's node selection. */
export type Connection = readonly [number, number];

export function readDenseArray(value: unknown, maximum: number): unknown[] {
  if (!Array.isArray(value)) throw new TypeError("Expected a dense array.");
  if (value.length > maximum) throw new RangeError("Generator array exceeds its size limit.");
  if (Reflect.ownKeys(value).length !== value.length + 1) throw new TypeError("Array has foreign or missing data properties.");
  const copy: unknown[] = [];
  for (let index = 0; index < value.length; index++) {
    const descriptor = Object.getOwnPropertyDescriptor(value, String(index));
    if (!descriptor || !("value" in descriptor)) throw new TypeError("Array requires own data indices.");
    copy.push(descriptor.value);
  }
  return copy;
}

/** Detached, duplicate-free node selection in supplied order. */
export function readNodes<N>(value: unknown): N[] {
  const nodes = readDenseArray(value, nodeLimit) as N[];
  if (new Set(nodes).size !== nodes.length) throw new TypeError("Generator nodes must be unique.");
  return nodes;
}

export function readFiniteNumber(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new TypeError("Generator parameter must be a finite number.");
  return value;
}

export function readPositiveInteger(value: unknown): number {
  const result = readFiniteNumber(value);
  if (!Number.isInteger(result) || result <= 0) throw new RangeError("Generator integer must be positive.");
  return result;
}

export function readFlag(value: unknown): boolean {
  if (value !== undefined && typeof value !== "boolean") throw new TypeError("Generator flag must be boolean.");
  return value ?? false;
}

export function readProbability(value: unknown): number {
  const probability = readFiniteNumber(value);
  if (probability < 0 || probability > 1) throw new RangeError("Probability must lie in [0,1].");
  return probability;
}

export function readRandom(value: unknown): Random {
  if (!isRandom(value)) throw new TypeError("Generator requires a library Random.");
  return value;
}

/** Wheel generators need a hub and a rim cycle of at least three nodes. */
export function requireWheelSize(count: number): void {
  if (count < 4) throw new RangeError("Wheel requires at least four nodes.");
}

/** Preferential attachment links each new node to `links` earlier nodes. */
export function readPreferentialLinks(value: unknown, count: number): number {
  const links = readPositiveInteger(value);
  if (links >= count) throw new RangeError("Preferential links must be less than node count.");
  return links;
}

/** Seed clique over links + 1 nodes, then `links` edges for every later node. */
export function preferentialEdgeCount(links: number, count: number): number {
  return links * (links + 1) / 2 + (count - links - 1) * links;
}

/** Rejects a known planned edge count before any planning callback or draw. */
export function requireEdgeBudget(knownEdges: number): void {
  if (knownEdges > edgeLimit) throw new RangeError("Generated edge count exceeds limit.");
}

/** Appends one planned connection while enforcing the same edge budget. */
export function addConnection(connections: Connection[], from: number, to: number): void {
  if (connections.length === edgeLimit) throw new RangeError("Generated edge count exceeds limit.");
  connections.push([from, to]);
}
