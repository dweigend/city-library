import { frameworkRecord } from "./lifecycle.ts";
/** Framework member names that Agent model state must not define. */
export const reservedAgentKeys = new Set([
  "id", "alive", "world", "x", "y", "z", "heading", "pitch", "roll", "copy", "delete",
  "move", "rotate", "distanceTo", "directionTo", "neighbors", "canMove", "gradient",
]);
/** Own string-keyed data descriptors; symbol keys and accessors reject. */
function dataEntries(value: object): [string, PropertyDescriptor][] {
  return Reflect.ownKeys(value).map((key) => {
    if (typeof key !== "string") throw new TypeError("Symbol keys are unsupported.");
    // The key was just reported by Reflect.ownKeys on the same object.
    const descriptor = Object.getOwnPropertyDescriptor(value, key)!;
    if (!("value" in descriptor)) throw new TypeError("Accessors are unsupported.");
    return [key, descriptor];
  });
}
/** True for objects whose prototype is Object.prototype or null. */
export function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
/**
 * Copies the own data properties of a plain options record into a
 * null-prototype record, so later reads cannot reach caller getters.
 * @throws TypeError for non-plain records, symbol keys, accessors or keys outside `keys`.
 */
export function validateOptions(value: unknown, keys: readonly string[]): Record<string, unknown> {
  if (!isPlainRecord(value)) throw new TypeError("Expected a plain options record.");
  const result = Object.create(null) as Record<string, unknown>;
  for (const [key, descriptor] of dataEntries(value)) {
    if (!keys.includes(key)) throw new TypeError(`Unknown option: ${key}`);
    result[key] = descriptor.value;
  }
  return result;
}
/** Detached copy of Agent model state; rejects reserved Agent member names. */
export function cloneState<S extends object>(state: S): S {
  return cloneModelState(state, reservedAgentKeys, "Agent");
}
/** Shared supported-value copying; each domain supplies its own reserved root names. */
export function cloneModelState<S extends object>(state: S, reserved: ReadonlySet<string>, domain: string): S {
  if (!isPlainRecord(state) || frameworkRecord(state)) throw new TypeError(`${domain} state must be a plain data record.`);
  for (const [key] of dataEntries(state)) {
    if (reserved.has(key)) throw new TypeError(`Reserved ${domain} property: ${key}`);
  }
  return cloneSupported(state) as S;
}
const typedConstructors = [
  Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array, Int32Array, Uint32Array,
  Float32Array, Float64Array, BigInt64Array, BigUint64Array,
  ...(typeof Float16Array === "undefined" ? [] : [Float16Array]),
];
function isArrayIndexKey(key: string, length: number): boolean {
  const index = Number(key);
  return Number.isInteger(index) && index >= 0 && index < length && String(index) === key;
}
/**
 * Deep-copies supported model values: finite primitives, plain records,
 * arrays, Map, Set, Date, RegExp, ArrayBuffer, DataView and typed arrays.
 * Living framework objects are kept by identity; shared and cyclic
 * references stay shared in the copy.
 * @throws TypeError for unsupported values, extra properties or deleted framework references.
 * @throws RangeError for nonfinite numbers, invalid Dates or invalid RegExp lastIndex.
 */
export function cloneSupported(root: unknown): unknown {
  const seen = new Map<object, unknown>();
  function clone(value: unknown): unknown {
    if (typeof value === "number" && !Number.isFinite(value)) throw new RangeError("Model numbers must be finite.");
    if (typeof value === "function" || typeof value === "symbol") throw new TypeError("Unsupported model value.");
    if (typeof value !== "object" || value === null) return value;
    const framework = frameworkRecord(value);
    if (framework) {
      if (!framework.alive) throw new TypeError("Deleted framework reference.");
      return value;
    }
    if (seen.has(value)) return seen.get(value);
    const entries = dataEntries(value);
    const prototype = Object.getPrototypeOf(value);
    if (isPlainRecord(value)) {
      const result = Object.create(prototype) as Record<string, unknown>;
      seen.set(value, result);
      for (const [key, descriptor] of entries) {
        Object.defineProperty(result, key, { value: clone(descriptor.value), writable: true, enumerable: descriptor.enumerable, configurable: true });
      }
      return result;
    }
    if (Array.isArray(value) && prototype === Array.prototype) {
      const result = new Array(value.length);
      seen.set(value, result);
      for (const [key, descriptor] of entries) {
        if (key === "length") continue;
        if (!isArrayIndexKey(key, value.length)) throw new TypeError("Named array properties are unsupported.");
        Object.defineProperty(result, key, { value: clone(descriptor.value), writable: true, enumerable: descriptor.enumerable, configurable: true });
      }
      return result;
    }
    if (prototype === Map.prototype) {
      if (entries.length) throw new TypeError("Extra Map properties are unsupported.");
      const result = new Map();
      seen.set(value, result);
      for (const [key, item] of value as Map<unknown, unknown>) result.set(clone(key), clone(item));
      return result;
    }
    if (prototype === Set.prototype) {
      if (entries.length) throw new TypeError("Extra Set properties are unsupported.");
      const result = new Set();
      seen.set(value, result);
      for (const item of value as Set<unknown>) result.add(clone(item));
      return result;
    }
    if (prototype === Date.prototype) {
      if (entries.length) throw new TypeError("Extra Date properties are unsupported.");
      const time = Date.prototype.getTime.call(value);
      if (!Number.isFinite(time)) throw new RangeError("Invalid Date.");
      const result = new Date(time);
      seen.set(value, result);
      return result;
    }
    if (prototype === RegExp.prototype) {
      if (entries.some(([key]) => key !== "lastIndex")) throw new TypeError("Extra RegExp properties are unsupported.");
      const expression = value as RegExp;
      if (!Number.isSafeInteger(expression.lastIndex) || expression.lastIndex < 0) throw new RangeError("Invalid RegExp lastIndex.");
      const result = new RegExp(expression.source, expression.flags);
      result.lastIndex = expression.lastIndex;
      seen.set(value, result);
      return result;
    }
    if (prototype === ArrayBuffer.prototype) {
      if (entries.length) throw new TypeError("Extra buffer properties are unsupported.");
      const result = ArrayBuffer.prototype.slice.call(value, 0) as ArrayBuffer;
      seen.set(value, result);
      return result;
    }
    if (prototype === DataView.prototype) {
      if (entries.length) throw new TypeError("Extra DataView properties are unsupported.");
      const view = value as DataView;
      const result = new DataView(clone(view.buffer) as ArrayBuffer, view.byteOffset, view.byteLength);
      seen.set(value, result);
      return result;
    }
    const typedArrayConstructor = typedConstructors.find((candidate) => prototype === candidate.prototype);
    if (typedArrayConstructor) {
      const view = value as Uint8Array;
      if (entries.some(([key]) => !isArrayIndexKey(key, view.length)))
        throw new TypeError("Extra typed-array properties are unsupported.");
      const result = new typedArrayConstructor(clone(view.buffer) as ArrayBuffer, view.byteOffset, view.length);
      seen.set(value, result);
      return result;
    }
    throw new TypeError("Unsupported model object prototype.");
  }
  return clone(root);
}
