import type { Inputs } from "./definition.ts";

/** Validate factory setup against the same canonical descriptors used by forms. */
export function parseParameters<P extends object>(
  inputs: Inputs<P>,
  options: Partial<P> = {},
): P {
  if (
    typeof options !== "object" ||
    options === null ||
    ![Object.prototype, null].includes(Object.getPrototypeOf(options))
  )
    throw new TypeError("Options must be a plain record.");
  for (const key of Reflect.ownKeys(options)) {
    if (typeof key !== "string" || !Object.hasOwn(inputs, key))
      throw new TypeError("Unknown model option.");
    if (!("value" in Object.getOwnPropertyDescriptor(options, key)!))
      throw new TypeError("Options must contain data values.");
  }
  const result: Record<string, unknown> = {};
  for (const [key, raw] of Object.entries(inputs)) {
    const input = raw as {
      kind: string;
      default: unknown;
      min?: number;
      max?: number;
      step?: number;
      integer?: boolean;
      options?: readonly unknown[];
    };
    const provided = (options as Record<string, unknown>)[key];
    const value = provided === undefined ? input.default : provided;
    if (input.kind === "number") {
      if (typeof value !== "number")
        throw new TypeError(`${key} must be numeric.`);
      if (
        !Number.isFinite(value) ||
        (input.integer && !Number.isSafeInteger(value)) ||
        (input.min !== undefined && value < input.min) ||
        (input.max !== undefined && value > input.max)
      )
        throw new RangeError(`${key} is outside its allowed range.`);
      if (input.step !== undefined) {
        const quotient = (value - (input.min ?? 0)) / input.step;
        if (
          Math.abs(quotient - Math.round(quotient)) >
          1e-9 * Math.max(1, Math.abs(quotient))
        )
          throw new RangeError(`${key} does not match its step.`);
      }
    } else if (input.kind === "boolean") {
      if (typeof value !== "boolean")
        throw new TypeError(`${key} must be boolean.`);
    } else {
      if (typeof value !== "string")
        throw new TypeError(`${key} must be text.`);
      if (input.kind === "choice" && !input.options!.includes(value))
        throw new RangeError(`${key} is not a supported choice.`);
    }
    result[key] = value;
  }
  return Object.freeze(result) as P;
}

export function validateStepCount(value: number): void {
  if (!Number.isSafeInteger(value) || value < 0 || value > 1_000_000)
    throw new RangeError("Steps must be an integer from 0 to 1,000,000.");
}

/**
 * Validate a live change record against canonical descriptors before any mutation.
 * Omitted keys keep their current values; an explicitly supplied `undefined` is rejected.
 * Returns a new frozen parameter record; the caller assigns it only after success.
 */
export function updateParameters<P extends object, K extends keyof P & string>(
  inputs: Inputs<P>,
  current: P,
  changes: Partial<Pick<P, K>>,
  allowedKeys: readonly K[],
): P {
  if (
    typeof changes !== "object" ||
    changes === null ||
    ![Object.prototype, null].includes(Object.getPrototypeOf(changes))
  )
    throw new TypeError("Changes must be a plain record.");
  for (const key of Reflect.ownKeys(changes)) {
    if (typeof key !== "string" || !(allowedKeys as readonly string[]).includes(key))
      throw new TypeError("Unknown or setup-only change.");
    const descriptor = Object.getOwnPropertyDescriptor(changes, key)!;
    if (!("value" in descriptor))
      throw new TypeError("Changes must contain data values.");
    if (descriptor.value === undefined)
      throw new TypeError(`${key} must not be undefined.`);
  }
  return parseParameters<P>(inputs, { ...current, ...changes });
}
