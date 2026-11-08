import { validateOptions } from "../agent/state.ts";

export interface NormalOptions {
  distribution: "normal";
  mean?: number;
  deviation?: number;
}

/** Standard polar pair; the stream owner retains the unscaled companion. */
export function polarGaussian(draw: () => number): { value: number; companion: number } {
  for (let attempt = 0; attempt < 1_000_000; attempt++) {
    const x = 2 * draw() - 1;
    const y = 2 * draw() - 1;
    const radiusSquared = x * x + y * y;
    if (radiusSquared === 0 || radiusSquared >= 1) continue;
    const factor = Math.sqrt(-2 * Math.log(radiusSquared) / radiusSquared);
    return { value: x * factor, companion: y * factor };
  }
  throw new RangeError("Normal sampling exceeded the polar rejection limit.");
}

/** Validate before requesting or consuming any cached standard sample. */
export function normalDraw(options: unknown, gaussian: () => number): number {
  const values = validateOptions(options, ["distribution", "mean", "deviation"]);
  if (values.distribution !== "normal") throw new TypeError("Expected normal distribution options.");
  const mean = values.mean === undefined ? 0 : values.mean;
  const deviation = values.deviation === undefined ? 1 : values.deviation;
  if (typeof mean !== "number" || typeof deviation !== "number") throw new TypeError("Normal mean and deviation must be numbers.");
  if (!Number.isFinite(mean) || !Number.isFinite(deviation) || deviation < 0)
    throw new RangeError("Normal mean must be finite and deviation finite and nonnegative.");
  if (deviation === 0) return mean;
  const value = mean + deviation * gaussian();
  if (!Number.isFinite(value)) throw new RangeError("Normal result is not finite.");
  return value;
}
