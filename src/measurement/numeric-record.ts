import { plainRecord } from "../agent/state.ts";

/** Copy own numeric data without invoking getters or carrying model references. */
export function numericRecord(value: unknown): Readonly<Record<string, number>> {
  if (!plainRecord(value)) throw new TypeError("Measurements must be a plain numeric record.");
  const entries: [string, number][] = [];
  for (const key of Reflect.ownKeys(value)) {
    if (typeof key !== "string") throw new TypeError("Measurement keys must be strings.");
    const descriptor = Object.getOwnPropertyDescriptor(value, key)!;
    if (!("value" in descriptor) || typeof descriptor.value !== "number")
      throw new TypeError("Measurements must contain own numeric data properties.");
    if (!Number.isFinite(descriptor.value)) throw new RangeError("Measurements must be finite.");
    entries.push([key, descriptor.value]);
  }
  return Object.freeze(Object.fromEntries(entries));
}
