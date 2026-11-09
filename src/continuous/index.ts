import { validateOptions } from "../agent/state.ts";

export type CrossingDirection = "rising" | "falling";
export interface ThresholdCrossing {
  readonly elapsed: number;
  readonly value: number;
  readonly direction: CrossingDirection;
}
function finite(value: unknown): number {
  if (typeof value !== "number") throw new TypeError("Expected a number.");
  if (!Number.isFinite(value)) throw new RangeError("Expected a finite number.");
  return value;
}
function durationValue(input: unknown): number {
  const value = finite(input);
  if (value < 0) throw new RangeError("Duration must be nonnegative.");
  return value;
}
function linear(input: { value: number; rate: number; duration: number }): number {
  const values = validateOptions(input, ["value", "rate", "duration"]);
  return finite(finite(values.value) + finite(values.rate) * durationValue(values.duration));
}
function crossing(input: {
  from: number; to: number; threshold: number; duration: number;
  direction?: CrossingDirection | "either";
}): ThresholdCrossing | undefined {
  const values = validateOptions(input, ["from", "to", "threshold", "duration", "direction"]);
  const from = finite(values.from);
  const to = finite(values.to);
  const threshold = finite(values.threshold);
  const duration = durationValue(values.duration);
  const selected = values.direction ?? "either";
  if (selected !== "rising" && selected !== "falling" && selected !== "either")
    throw new TypeError("Unknown crossing direction.");
  if (duration === 0) return undefined;
  const direction = from < threshold && to >= threshold ? "rising"
    : from > threshold && to <= threshold ? "falling" : undefined;
  if (direction === undefined || (selected !== "either" && selected !== direction)) return undefined;
  // Scale before subtraction so finite endpoints near opposite extremes do not overflow.
  const scale = Math.max(Math.abs(from), Math.abs(to), Math.abs(threshold), 1);
  const difference = to - from;
  const fraction = Number.isFinite(difference)
    ? (threshold - from) / difference
    : (threshold / scale - from / scale) / (to / scale - from / scale);
  const elapsed = threshold === to ? duration : Math.min(duration, Math.max(0, finite(duration * fraction)));
  return Object.freeze({ elapsed, value: threshold, direction });
}
export const continuous = Object.freeze({ linear, crossing });
