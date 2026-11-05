import { validateOptions } from "../agent/state.ts";

export interface SampleOptions<T> {
  count?: number;
  replace?: boolean;
  weight?: (value: T) => number;
  order?: "draw" | "source";
  compatibility?: "legacy-shuffle";
}

function synchronousWeight(value: unknown): asserts value is ((item: unknown) => number) | undefined {
  if (value === undefined) return;
  if (typeof value !== "function" || ["[object AsyncFunction]", "[object GeneratorFunction]", "[object AsyncGeneratorFunction]"].includes(Object.prototype.toString.call(value))) {
    throw new TypeError("Weight must be a pure synchronous function.");
  }
}

export function sample<T>(source: Iterable<T>, options: unknown, draw: () => number): T[] {
  const values = validateOptions(options, ["count", "replace", "weight", "order", "compatibility"]);
  const count = values.count === undefined ? 1 : values.count;
  const replace = values.replace === undefined ? false : values.replace;
  const order = values.order === undefined ? "draw" : values.order;
  if (typeof count !== "number" || typeof replace !== "boolean") throw new TypeError("Invalid sampling option types.");
  if (!Number.isSafeInteger(count) || count < 0) throw new RangeError("Count must be a nonnegative safe integer.");
  if (order !== "draw" && order !== "source") throw new TypeError("Invalid sample ordering.");
  if (values.compatibility !== undefined && values.compatibility !== "legacy-shuffle") throw new TypeError("Unknown sampling compatibility.");
  synchronousWeight(values.weight);
  if (source == null) throw new TypeError("Expected an iterable population.");
  const iterator = (source as { [Symbol.iterator]?: unknown })[Symbol.iterator];
  if (typeof iterator !== "function") throw new TypeError("Expected an iterable population.");
  const items = Array.from<T>({
    [Symbol.iterator]() { return Reflect.apply(iterator, source, []) as Iterator<T>; },
  });
  if (values.compatibility === "legacy-shuffle") {
    if (count !== items.length || replace || Object.hasOwn(values, "weight") || Object.hasOwn(values, "order")) throw new TypeError("Legacy shuffle requires the complete source without weights or order.");
    for (let index = items.length - 1; index > 0; index -= 1) {
      const chosen = Math.floor(draw() * (index + 1));
      [items[index], items[chosen]] = [items[chosen]!, items[index]!];
    }
    return items;
  }

  const eligible: { value: T; position: number; weight: number }[] = [];
  let total = 0;
  for (let position = 0; position < items.length; position += 1) {
    const value = items[position]!;
    const weight = values.weight === undefined ? 1 : values.weight(value);
    if (typeof weight !== "number") throw new TypeError("Weights must be numeric.");
    if (!Number.isFinite(weight) || weight < 0) throw new RangeError("Weights must be finite and nonnegative.");
    total += weight;
    if (!Number.isFinite(total)) throw new RangeError("Total sample weight must be finite.");
    if (weight > 0) eligible.push({ value, position, weight });
  }
  const selected: { value: T; position: number }[] = [];
  const length = replace ? count : Math.min(count, eligible.length);
  for (let index = 0; index < length && eligible.length > 0; index += 1) {
    // Recompute from remaining positions rather than subtracting a dominant
    // weight: subtraction could erase a tiny but still eligible remainder.
    total = eligible.reduce((sum, entry) => sum + entry.weight, 0);
    const threshold = draw() * total;
    let cumulative = 0;
    let chosen = eligible.length - 1;
    for (let candidate = 0; candidate < eligible.length; candidate += 1) {
      cumulative += eligible[candidate]!.weight;
      if (threshold < cumulative) { chosen = candidate; break; }
    }
    const entry = eligible[chosen]!;
    selected.push({ value: entry.value, position: entry.position });
    if (!replace) eligible.splice(chosen, 1);
  }
  if (order === "source") selected.sort((first, second) => first.position - second.position);
  return selected.map((entry) => entry.value);
}
