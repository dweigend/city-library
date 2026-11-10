import { validateOptions } from "../agent/state.ts";

/**
 * Detached, frozen descriptive statistics.
 * Empty input yields valueCount and sum of zero; every other field is undefined.
 * Sample variance and standard deviation are undefined below two values.
 */
export interface Summary {
  readonly valueCount: number;
  readonly sum: number;
  readonly min: number | undefined;
  readonly max: number | undefined;
  readonly mean: number | undefined;
  readonly median: number | undefined;
  readonly variance: number | undefined;
  readonly standardDeviation: number | undefined;
}

type Spread = Pick<Summary, "variance" | "standardDeviation">;

/**
 * Pure population/sample measurements over one finite input iteration.
 * The input is consumed once and never reordered; the median sorts a detached copy.
 * Variance uses the population denominator by default; `sample: true` uses valueCount - 1.
 * @throws TypeError for extra arguments, invalid options, a non-iterable input or non-numbers.
 * @throws RangeError for non-finite values or arithmetic overflow.
 */
export function describe(
  values: Iterable<number>,
  options: { sample?: boolean } = {},
): Summary {
  if (arguments.length > 2) {
    throw new TypeError("Describe accepts values and options.");
  }
  const useSampleVariance = readSampleOption(options);
  const { ownedValues, sum, min, max } = collectValues(values);
  const valueCount = ownedValues.length;
  if (valueCount === 0) {
    return Object.freeze({
      valueCount,
      sum,
      min,
      max,
      mean: undefined,
      median: undefined,
      variance: undefined,
      standardDeviation: undefined,
    });
  }

  const mean = sum / valueCount;
  // Spread precedes sorting: it sums in input order and reports its overflow first.
  const { variance, standardDeviation } = measureSpread(ownedValues, mean, useSampleVariance);
  const median = sortAndTakeMedian(ownedValues);
  if (!Number.isFinite(mean) || !Number.isFinite(median)) {
    throw new RangeError("Describe arithmetic overflow.");
  }
  return Object.freeze({ valueCount, sum, min, max, mean, median, variance, standardDeviation });
}

function readSampleOption(options: unknown): boolean {
  const record = validateOptions(options, ["sample"]);
  if (record.sample !== undefined && typeof record.sample !== "boolean") {
    throw new TypeError("Sample must be boolean.");
  }
  return record.sample ?? false;
}

/** Validates and copies each value while accumulating sum and extremes in input order. */
function collectValues(values: Iterable<number>) {
  if (
    values === null ||
    (typeof values !== "object" && typeof values !== "function") ||
    typeof values[Symbol.iterator] !== "function"
  ) {
    throw new TypeError("Describe values require an iterable of numbers.");
  }
  const ownedValues: number[] = [];
  let sum = 0;
  let min: number | undefined;
  let max: number | undefined;
  for (const value of values) {
    if (typeof value !== "number") throw new TypeError("Describe values must be numbers.");
    if (!Number.isFinite(value)) throw new RangeError("Describe values must be finite.");
    ownedValues.push(value);
    sum += value;
    if (!Number.isFinite(sum)) throw new RangeError("Describe sum overflow.");
    if (min === undefined || value < min) min = value;
    if (max === undefined || value > max) max = value;
  }
  return { ownedValues, sum, min, max };
}

/** A single value has no sample spread, so its sample denominator is zero. */
function measureSpread(
  ownedValues: readonly number[],
  mean: number,
  useSampleVariance: boolean,
): Spread {
  const denominator = useSampleVariance ? ownedValues.length - 1 : ownedValues.length;
  if (denominator === 0) {
    return { variance: undefined, standardDeviation: undefined };
  }
  const variance = sumSquaredDeviations(ownedValues, mean) / denominator;
  return { variance, standardDeviation: Math.sqrt(variance) };
}

/** Centering avoids subtracting two large raw moments. */
function sumSquaredDeviations(ownedValues: readonly number[], mean: number): number {
  let squaredDeviations = 0;
  for (const value of ownedValues) {
    const difference = value - mean;
    squaredDeviations += difference * difference;
    if (!Number.isFinite(squaredDeviations)) {
      throw new RangeError("Describe spread overflow.");
    }
  }
  return squaredDeviations;
}

/** Sorts the owned, non-empty buffer in place; both central indices are therefore in bounds. */
function sortAndTakeMedian(ownedValues: number[]): number {
  ownedValues.sort((left, right) => left - right);
  const middle = Math.floor(ownedValues.length / 2);
  if (ownedValues.length % 2 === 1) {
    return ownedValues[middle]!;
  }
  return (ownedValues[middle - 1]! + ownedValues[middle]!) / 2;
}
