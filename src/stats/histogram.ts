import { validateOptions } from "../agent/state.ts";

export interface Histogram {
  readonly edges: readonly number[];
  readonly counts: readonly number[];
  readonly underflow: number;
  readonly overflow: number;
}
/** Explicit bins: left-inclusive, final upper endpoint included. */
export function histogram(
  values: Iterable<number>,
  options: { edges: readonly number[] },
): Histogram {
  if (arguments.length > 2)
    throw new TypeError("Histogram accepts values and options.");
  const record = validateOptions(options, ["edges"]);
  const supplied = record.edges;
  if (
    !Array.isArray(supplied) ||
    Object.getPrototypeOf(supplied) !== Array.prototype
  )
    throw new TypeError("Histogram requires an edges array.");
  for (const key of Reflect.ownKeys(supplied)) {
    if (key === "length") continue;
    if (
      typeof key !== "string" ||
      !/^(0|[1-9]\d*)$/.test(key) ||
      Number(key) >= supplied.length
    )
      throw new TypeError("Histogram edges cannot contain extra properties.");
  }
  const edges: number[] = [];
  for (let index = 0; index < supplied.length; index += 1) {
    const descriptor = Object.getOwnPropertyDescriptor(supplied, String(index));
    if (!descriptor || !("value" in descriptor))
      throw new TypeError("Histogram edges require own data values.");
    edges.push(descriptor.value);
  }
  if (
    (typeof values !== "object" && typeof values !== "function") ||
    values === null ||
    typeof values[Symbol.iterator] !== "function"
  )
    throw new TypeError("Histogram values require an iterable of numbers.");
  if (edges.length < 2)
    throw new RangeError("At least two histogram edges are required.");
  for (let i = 0; i < edges.length; i += 1) {
    if (typeof edges[i] !== "number")
      throw new TypeError("Histogram edges must be numbers.");
    if (!Number.isFinite(edges[i]) || (i > 0 && edges[i]! <= edges[i - 1]!))
      throw new RangeError("Histogram edges must be finite and increasing.");
  }
  const counts = Array<number>(edges.length - 1).fill(0);
  let underflow = 0;
  let overflow = 0;
  for (const value of values) {
    if (typeof value !== "number")
      throw new TypeError("Histogram values must be numbers.");
    if (!Number.isFinite(value))
      throw new RangeError("Histogram values must be finite.");
    if (value < edges[0]!) {
      underflow += 1;
      continue;
    }
    if (value > edges[edges.length - 1]!) {
      overflow += 1;
      continue;
    }
    let low = 0;
    let high = edges.length - 1;
    while (low + 1 < high) {
      const mid = Math.floor((low + high) / 2);
      if (value < edges[mid]!) high = mid;
      else low = mid;
    }
    const index = Math.min(low, counts.length - 1);
    counts[index] = counts[index]! + 1;
  }
  return Object.freeze({
    edges: Object.freeze(edges),
    counts: Object.freeze(counts),
    underflow,
    overflow,
  });
}
