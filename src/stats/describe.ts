import { validateOptions } from "../agent/state.ts";

export interface Summary {
  readonly count: number;
  readonly sum: number;
  readonly min: number | undefined;
  readonly max: number | undefined;
  readonly mean: number | undefined;
  readonly median: number | undefined;
  readonly variance: number | undefined;
  readonly standardDeviation: number | undefined;
}

/** Pure population/sample measurements over one finite input iteration. */
export function describe(
  values: Iterable<number>,
  options: { sample?: boolean } = {},
): Summary {
  if (arguments.length > 2) throw new TypeError("Describe accepts values and options.");
  const record = validateOptions(options, ["sample"]);
  if (record.sample !== undefined && typeof record.sample !== "boolean")
    throw new TypeError("Sample must be boolean.");
  const sample = record.sample ?? false;
  if (
    values === null ||
    (typeof values !== "object" && typeof values !== "function") ||
    typeof values[Symbol.iterator] !== "function"
  ) throw new TypeError("Describe values require an iterable of numbers.");

  const copied: number[] = [];
  let sum = 0;
  let min: number | undefined;
  let max: number | undefined;
  for (const value of values) {
    if (typeof value !== "number") throw new TypeError("Describe values must be numbers.");
    if (!Number.isFinite(value)) throw new RangeError("Describe values must be finite.");
    copied.push(value);
    sum += value;
    if (!Number.isFinite(sum)) throw new RangeError("Describe sum overflow.");
    if (min === undefined || value < min) min = value;
    if (max === undefined || value > max) max = value;
  }

  const count = copied.length;
  let mean: number | undefined;
  let median: number | undefined;
  let variance: number | undefined;
  let standardDeviation: number | undefined;
  if (count > 0) {
    mean = sum / count;
    // A centered second pass avoids subtracting two large raw moments.
    if (!sample || count > 1) {
      let squaredDeviations = 0;
      for (const value of copied) {
        const difference = value - mean;
        squaredDeviations += difference * difference;
        if (!Number.isFinite(squaredDeviations))
          throw new RangeError("Describe spread overflow.");
      }
      variance = squaredDeviations / (sample ? count - 1 : count);
      standardDeviation = Math.sqrt(variance);
    }
    copied.sort((a, b) => a - b);
    const middle = Math.floor(count / 2);
    median = count % 2 === 1
      ? copied[middle]!
      : (copied[middle - 1]! + copied[middle]!) / 2;
    if (!Number.isFinite(mean) || !Number.isFinite(median))
      throw new RangeError("Describe arithmetic overflow.");
  }
  return Object.freeze({ count, sum, min, max, mean, median, variance, standardDeviation });
}
