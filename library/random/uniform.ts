import { validateOptions } from "../agent/state.ts";

export interface UniformOptions {
  distribution?: "uniform";
  min?: number;
  max?: number;
  integer?: boolean;
}

/** The largest binary64 value below `value`. */
function nextDown(value: number): number {
  if (value === 0) return -Number.MIN_VALUE;
  const view = new DataView(new ArrayBuffer(8));
  view.setFloat64(0, value);
  view.setBigUint64(0, view.getBigUint64(0) + (value > 0 ? -1n : 1n));
  return view.getFloat64(0);
}

/** Uniform [min, max) or integer min <= n < max from exactly one draw. */
export function uniformDraw(options: unknown, draw: () => number): number {
  const values = validateOptions(options, ["distribution", "min", "max", "integer"]);
  if (values.distribution !== undefined && values.distribution !== "uniform") throw new TypeError("This slice supports uniform draws only.");
  const min = values.min === undefined ? 0 : values.min;
  const max = values.max === undefined ? 1 : values.max;
  const integer = values.integer === undefined ? false : values.integer;
  if (typeof min !== "number" || typeof max !== "number" || typeof integer !== "boolean") throw new TypeError("Invalid uniform option types.");
  if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) throw new RangeError("Uniform bounds must be finite with max greater than min.");
  const span = max - min;
  if (integer && (!Number.isSafeInteger(min) || !Number.isSafeInteger(max) || !Number.isSafeInteger(span))) {
    throw new RangeError("Integer bounds and range must be safe integers.");
  }
  const unit = draw();
  let value = scaleUnit(unit, min, max, span, integer);
  if (!Number.isFinite(value)) throw new RangeError("Uniform result is not finite.");
  // IEEE rounding must not publish the excluded upper endpoint.
  if (value >= max) value = integer ? max - 1 : nextDown(max);
  return Math.max(min, value);
}

function scaleUnit(unit: number, min: number, max: number, span: number, integer: boolean): number {
  if (integer) return min + Math.floor(unit * span);
  if (Number.isFinite(span)) return min + unit * span;
  // Finite opposite extremes can have an infinite difference. Interpolate
  // their finite weighted endpoints without changing the stream schedule.
  return (1 - unit) * min + unit * max;
}
