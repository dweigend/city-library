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
  if (
    typeof options !== "object" ||
    options === null ||
    !Array.isArray(options.edges)
  )
    throw new TypeError("Histogram requires an edges array.");
  if (Reflect.ownKeys(options).some((key) => key !== "edges"))
    throw new TypeError("Unknown histogram option.");
  const edges = [...options.edges];
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
