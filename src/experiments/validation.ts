import { cloneModelState, plainRecord, validateOptions } from "../agent/state.ts";
import { frameworkRecord } from "../agent/lifecycle.ts";

export const studyLimits = Object.freeze({ axes: 32, parameters: 128, name: 128, string: 65_536,
  scenarios: 10_000, runs: 10_000, steps: 1_000_000, totalSteps: 10_000_000, totalSamples: 1_000_000 });

export function integer(value: unknown, name: string, maximum: number, minimum = 0): number {
  if (typeof value !== "number") throw new TypeError(`${name} must be numeric.`);
  if (!Number.isSafeInteger(value) || value < minimum || value > maximum)
    throw new RangeError(`${name} must be an integer in [${minimum}, ${maximum}].`);
  return value;
}
export function callback(value: unknown, name: string): void {
  if (typeof value !== "function" || Object.prototype.toString.call(value) !== "[object Function]")
    throw new TypeError(`${name} must be a synchronous non-generator function.`);
}
export function synchronous<Value>(value: Value): Value {
  if (value !== null && (typeof value === "object" || typeof value === "function") &&
    typeof (value as { then?: unknown }).then === "function")
    throw new TypeError("Thenable callback results are unsupported.");
  return value;
}
export function cloneData<Value>(value: Value): Value {
  const seen = new Set<object>();
  function inspect(item: unknown): void {
    if (typeof item !== "object" || item === null || seen.has(item)) return;
    seen.add(item);
    if (frameworkRecord(item)) throw new TypeError("Study data cannot contain live framework components.");
    for (const descriptor of Object.values(Object.getOwnPropertyDescriptors(item))) {
      if (!("value" in descriptor)) throw new TypeError("Study data cannot contain accessors.");
      inspect(descriptor.value);
    }
    if (item instanceof Map) for (const [key, entry] of item) { inspect(key); inspect(entry); }
    if (item instanceof Set) for (const entry of item) inspect(entry);
  }
  inspect(value);
  return cloneModelState({ value }, new Set(), "Study").value;
}
export function scalar(value: unknown): value is number | boolean | string {
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new RangeError("Study scalar numbers must be finite.");
    return true;
  }
  if (typeof value === "string") {
    if (value.length > studyLimits.string) throw new RangeError("Study scalar string is too long.");
    return true;
  }
  return typeof value === "boolean";
}
export function name(value: unknown): asserts value is string {
  if (typeof value !== "string") throw new TypeError("Study names must be strings.");
  if (!value.length || value.length > studyLimits.name) throw new RangeError("Study name length is outside its budget.");
}
export function parameterRecord(value: unknown): Readonly<Record<string, number | boolean | string>> {
  if (!plainRecord(value)) throw new TypeError("Study settings must be a plain scalar record.");
  const keys = Reflect.ownKeys(value);
  if (keys.length > studyLimits.parameters) throw new RangeError("Too many study settings.");
  const entries = keys.map(key => {
    name(key);
    const descriptor = Object.getOwnPropertyDescriptor(value, key)!;
    if (!("value" in descriptor) || !scalar(descriptor.value)) throw new TypeError("Study settings must be scalar data.");
    return [key, descriptor.value] as const;
  });
  return Object.freeze(Object.fromEntries(entries));
}
export function seeds(value: unknown): readonly number[] {
  if (!Array.isArray(value)) throw new TypeError("Seeds must be an explicit array.");
  const seen = new Set<number>();
  for (const seed of value) {
    integer(seed, "Seed", Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);
    if (seen.has(seed)) throw new RangeError("Study seeds must be distinct.");
    seen.add(seed);
  }
  return [...seen];
}
export { validateOptions };
