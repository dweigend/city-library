import { validateOptions } from "../agent/state.ts";
import { numericRecord } from "../measurement/numeric-record.ts";

export interface Sample {
  readonly tick: number;
  readonly values: Readonly<Record<string, number>>;
}
export interface History {
  /**
   * Accepts a strictly increasing nonnegative tick and finite numeric values. The first
   * sample fixes the metric keys and their order; later samples must use the same keys.
   * When full, the oldest sample is dropped.
   */
  add(sample: Sample): void;
  /** Detached frozen copies, oldest first. */
  readonly samples: readonly Sample[];
  /** Clears samples, the metric schema and the tick order. */
  delete(): void;
}

const defaultCapacity = 300;
const maximumCapacity = 1_000_000;

/** A bounded in-memory sample buffer; capacity defaults to 300. */
export function history(options: { capacity?: number } = {}): History {
  const settings = validateOptions(options, ["capacity"]);
  const capacity = settings.capacity ?? defaultCapacity;
  if (typeof capacity !== "number") throw new TypeError("History capacity must be numeric.");
  if (!Number.isSafeInteger(capacity) || capacity < 1 || capacity > maximumCapacity) {
    throw new RangeError("History capacity must be a positive safe integer at most 1000000.");
  }
  let keys: readonly string[] | undefined;
  let lastTick: number | undefined;
  // A ring buffer bounds storage without shifting every accepted sample.
  const buffer: Sample[] = [];
  let start = 0;
  return Object.freeze({
    add(sample: Sample): void {
      const input = validateOptions(sample, ["tick", "values"]);
      if (typeof input.tick !== "number") throw new TypeError("History tick must be numeric.");
      if (!Number.isFinite(input.tick) || input.tick < 0 || (lastTick !== undefined && input.tick <= lastTick)) {
        throw new RangeError("History ticks must be finite, nonnegative and strictly increasing.");
      }
      const values = numericRecord(input.values);
      const nextKeys = Object.keys(values);
      if (keys && (nextKeys.length !== keys.length || keys.some(key => !Object.hasOwn(values, key)))) {
        throw new TypeError("History metric keys must match the established schema.");
      }
      const orderedValues = Object.fromEntries((keys ?? nextKeys).map(key => [key, values[key]!]));
      const accepted = Object.freeze({ tick: input.tick, values: Object.freeze(orderedValues) });
      if (buffer.length < capacity) {
        buffer.push(accepted);
      } else {
        buffer[start] = accepted;
        start = (start + 1) % capacity;
      }
      keys ??= nextKeys;
      lastTick = input.tick;
    },
    get samples(): readonly Sample[] {
      return Object.freeze(Array.from({ length: buffer.length }, (_, index) => {
        const sample = buffer[(start + index) % buffer.length]!;
        return Object.freeze({ tick: sample.tick, values: Object.freeze({ ...sample.values }) });
      }));
    },
    delete(): void {
      buffer.length = 0;
      start = 0;
      keys = undefined;
      lastTick = undefined;
    },
  });
}
