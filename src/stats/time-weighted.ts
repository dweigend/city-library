import { validateOptions } from "../agent/state.ts";

export interface TimeWeightedSummary {
  readonly duration: number;
  readonly integral: number;
  readonly mean: number | undefined;
}
export interface TimeWeighted {
  set(sample: { at: number; value: number }): void;
  read(options: { until: number }): TimeWeightedSummary;
}

function finiteNumber(value: unknown, name: string): number {
  if (typeof value !== "number") throw new TypeError(`${name} must be a number.`);
  if (!Number.isFinite(value)) throw new RangeError(`${name} must be finite.`);
  return value;
}
function timeValue(value: unknown, earliest: number): number {
  const time = finiteNumber(value, "TimeWeighted time");
  if (time < earliest) throw new RangeError("TimeWeighted time must be nonnegative and nondecreasing.");
  return time;
}
function accumulated(integral: number, elapsed: number, value: number): number {
  const result = integral + elapsed * value;
  if (!Number.isFinite(result)) throw new RangeError("TimeWeighted integral must remain finite.");
  return result;
}

function create(options: { at?: number; value: number }): TimeWeighted {
  if (arguments.length !== 1) throw new TypeError("TimeWeighted.create requires one options record.");
  const values = validateOptions(options, ["at", "value"]);
  const start = timeValue(values.at === undefined ? 0 : values.at, 0);
  let at = start;
  let value = finiteNumber(values.value, "TimeWeighted value");
  let integral = 0;
  return Object.freeze({
    set(sample: { at: number; value: number }): void {
      if (arguments.length !== 1) throw new TypeError("TimeWeighted.set requires one sample record.");
      const values = validateOptions(sample, ["at", "value"]);
      const nextTime = timeValue(values.at, at);
      const nextValue = finiteNumber(values.value, "TimeWeighted value");
      const nextIntegral = accumulated(integral, nextTime - at, value);
      integral = nextIntegral;
      at = nextTime;
      value = nextValue;
    },
    read(options: { until: number }): TimeWeightedSummary {
      if (arguments.length !== 1) throw new TypeError("TimeWeighted.read requires one options record.");
      const values = validateOptions(options, ["until"]);
      const until = timeValue(values.until, at);
      const total = accumulated(integral, until - at, value);
      const duration = until - start;
      const mean = duration === 0 ? undefined : total / duration;
      if (mean !== undefined && !Number.isFinite(mean)) throw new RangeError("TimeWeighted mean must remain finite.");
      return Object.freeze({ duration, integral: total, mean });
    },
  });
}

export const TimeWeighted = Object.freeze({ create });
