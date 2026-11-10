import { validateOptions } from "../agent/state.ts";

/** Frozen histogram with detached edges; counts[i] covers edges[i] to edges[i + 1]. */
export interface Histogram {
  readonly edges: readonly number[];
  readonly counts: readonly number[];
  readonly underflow: number;
  readonly overflow: number;
}

/**
 * Explicit bins: left-inclusive, final upper endpoint included.
 * Values below the first or above the last edge count as underflow or overflow.
 * Edges are copied from a plain array before the values are iterated once.
 * @throws TypeError for extra arguments, invalid options, a malformed edges array,
 * a non-iterable input or non-numbers.
 * @throws RangeError for fewer than two edges, non-finite or non-increasing edges,
 * or non-finite values.
 */
export function histogram(
  values: Iterable<number>,
  options: { edges: readonly number[] },
): Histogram {
  if (arguments.length > 2) {
    throw new TypeError("Histogram accepts values and options.");
  }
  const record = validateOptions(options, ["edges"]);
  const edges = copyEdgeArray(record.edges);
  if (
    (typeof values !== "object" && typeof values !== "function") ||
    values === null ||
    typeof values[Symbol.iterator] !== "function"
  ) {
    throw new TypeError("Histogram values require an iterable of numbers.");
  }
  requireIncreasingEdges(edges);

  const counts = Array<number>(edges.length - 1).fill(0);
  let underflow = 0;
  let overflow = 0;
  for (const value of values) {
    if (typeof value !== "number") throw new TypeError("Histogram values must be numbers.");
    if (!Number.isFinite(value)) throw new RangeError("Histogram values must be finite.");
    if (value < edges[0]!) {
      underflow += 1;
      continue;
    }
    if (value > edges[edges.length - 1]!) {
      overflow += 1;
      continue;
    }
    const index = binIndex(edges, value);
    counts[index] = counts[index]! + 1;
  }
  return Object.freeze({
    edges: Object.freeze(edges),
    counts: Object.freeze(counts),
    underflow,
    overflow,
  });
}

/** Copies a plain array's own indexed data values; accessors, holes and extra keys are rejected. */
function copyEdgeArray(supplied: unknown): unknown[] {
  if (!Array.isArray(supplied) || Object.getPrototypeOf(supplied) !== Array.prototype) {
    throw new TypeError("Histogram requires an edges array.");
  }
  for (const key of Reflect.ownKeys(supplied)) {
    if (key === "length") continue;
    if (!isArrayIndexKey(key, supplied.length)) {
      throw new TypeError("Histogram edges cannot contain extra properties.");
    }
  }
  const edges: unknown[] = [];
  for (let index = 0; index < supplied.length; index += 1) {
    const descriptor = Object.getOwnPropertyDescriptor(supplied, String(index));
    if (!descriptor || !("value" in descriptor)) {
      throw new TypeError("Histogram edges require own data values.");
    }
    edges.push(descriptor.value);
  }
  return edges;
}

function isArrayIndexKey(key: string | symbol, length: number): boolean {
  return typeof key === "string" && /^(0|[1-9]\d*)$/.test(key) && Number(key) < length;
}

function requireIncreasingEdges(edges: unknown[]): asserts edges is number[] {
  if (edges.length < 2) {
    throw new RangeError("At least two histogram edges are required.");
  }
  for (let i = 0; i < edges.length; i += 1) {
    const edge = edges[i];
    if (typeof edge !== "number") {
      throw new TypeError("Histogram edges must be numbers.");
    }
    if (!Number.isFinite(edge) || (i > 0 && edge <= (edges[i - 1] as number))) {
      throw new RangeError("Histogram edges must be finite and increasing.");
    }
  }
}

/** Binary search for an in-range value; the final upper endpoint joins the last bin. */
function binIndex(edges: readonly number[], value: number): number {
  let low = 0;
  let high = edges.length - 1;
  while (low + 1 < high) {
    const mid = Math.floor((low + high) / 2);
    if (value < edges[mid]!) high = mid;
    else low = mid;
  }
  return Math.min(low, edges.length - 2);
}
