import { validateOptions } from "../agent/state.ts";

export interface SampleOptions<T> {
  sampleCount?: number;
  replace?: boolean;
  weight?: (value: T) => number;
  order?: "draw" | "source";
  algorithm?: "fisher-yates-descending";
}

const nonSynchronousFunctionTags = ["[object AsyncFunction]", "[object GeneratorFunction]", "[object AsyncGeneratorFunction]"];

function requireSynchronousWeight(value: unknown): asserts value is ((item: unknown) => number) | undefined {
  if (value === undefined) return;
  if (typeof value !== "function" || nonSynchronousFunctionTags.includes(Object.prototype.toString.call(value))) {
    throw new TypeError("Weight must be a pure synchronous function.");
  }
}

interface Candidate<T> {
  readonly value: T;
  readonly position: number;
  readonly weight: number;
}

/**
 * Validates every option and the population before the first draw.
 * Weighted selection draws once per selected member; "fisher-yates-descending" is a
 * descending Fisher–Yates permutation of the complete source.
 */
export function sample<T>(source: Iterable<T>, options: unknown, draw: () => number): T[] {
  const values = validateOptions(options, ["sampleCount", "replace", "weight", "order", "algorithm"]);
  const sampleCount = values.sampleCount === undefined ? 1 : values.sampleCount;
  const replace = values.replace === undefined ? false : values.replace;
  const order = values.order === undefined ? "draw" : values.order;
  if (typeof sampleCount !== "number" || typeof replace !== "boolean") throw new TypeError("Invalid sampling option types.");
  if (!Number.isSafeInteger(sampleCount) || sampleCount < 0) throw new RangeError("Count must be a nonnegative safe integer.");
  if (order !== "draw" && order !== "source") throw new TypeError("Invalid sample ordering.");
  if (values.algorithm !== undefined && values.algorithm !== "fisher-yates-descending") {
    throw new TypeError("Unknown sampling algorithm.");
  }
  requireSynchronousWeight(values.weight);
  const items = readPopulation(source);
  if (values.algorithm === "fisher-yates-descending") {
    if (sampleCount !== items.length || replace || Object.hasOwn(values, "weight") || Object.hasOwn(values, "order")) {
      throw new TypeError("Descending Fisher-Yates shuffle requires the complete source without weights or order.");
    }
    return descendingFisherYatesShuffle(items, draw);
  }

  const eligible = weighCandidates(items, values as { weight?: (item: unknown) => number });
  const length = replace ? sampleCount : Math.min(sampleCount, eligible.length);
  const selected = drawCandidates(eligible, length, replace, draw);
  if (order === "source") selected.sort((first, second) => first.position - second.position);
  return selected.map((entry) => entry.value);
}

/** Copies the population with its own iterator, called once with the source as receiver. */
function readPopulation<T>(source: Iterable<T>): T[] {
  if (source == null) throw new TypeError("Expected an iterable population.");
  const iterator = (source as { [Symbol.iterator]?: unknown })[Symbol.iterator];
  if (typeof iterator !== "function") throw new TypeError("Expected an iterable population.");
  return Array.from<T>({
    [Symbol.iterator]() { return Reflect.apply(iterator, source, []) as Iterator<T>; },
  });
}

function descendingFisherYatesShuffle<T>(items: T[], draw: () => number): T[] {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const chosen = Math.floor(draw() * (index + 1));
    [items[index], items[chosen]] = [items[chosen]!, items[index]!];
  }
  return items;
}

/**
 * Validates every weight in source order; zero-weight members are ineligible.
 * The weight callback is called as a method of the validated options record.
 */
function weighCandidates<T>(items: readonly T[], options: { weight?: (item: unknown) => number }): Candidate<T>[] {
  const eligible: Candidate<T>[] = [];
  let total = 0;
  for (let position = 0; position < items.length; position += 1) {
    const value = items[position]!;
    const weight = options.weight === undefined ? 1 : options.weight(value);
    if (typeof weight !== "number") throw new TypeError("Weights must be numeric.");
    if (!Number.isFinite(weight) || weight < 0) throw new RangeError("Weights must be finite and nonnegative.");
    total += weight;
    if (!Number.isFinite(total)) throw new RangeError("Total sample weight must be finite.");
    if (weight > 0) eligible.push({ value, position, weight });
  }
  return eligible;
}

/** Draws `length` members by cumulative weight; without replacement each pick leaves the pool. */
function drawCandidates<T>(
  eligible: Candidate<T>[],
  length: number,
  replace: boolean,
  draw: () => number,
): { value: T; position: number }[] {
  const selected: { value: T; position: number }[] = [];
  for (let index = 0; index < length && eligible.length > 0; index += 1) {
    // Recompute from remaining positions rather than subtracting a dominant
    // weight: subtraction could erase a tiny but still eligible remainder.
    const total = eligible.reduce((sum, entry) => sum + entry.weight, 0);
    const threshold = draw() * total;
    let cumulative = 0;
    let chosen = eligible.length - 1;
    for (let candidate = 0; candidate < eligible.length; candidate += 1) {
      cumulative += eligible[candidate]!.weight;
      if (threshold < cumulative) {
        chosen = candidate;
        break;
      }
    }
    const entry = eligible[chosen]!;
    selected.push({ value: entry.value, position: entry.position });
    if (!replace) eligible.splice(chosen, 1);
  }
  return selected;
}
