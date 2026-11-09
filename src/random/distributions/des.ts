import { validateOptions } from "../../agent/state.ts";

export interface BernoulliOptions { distribution: "bernoulli"; probability: number }
export interface TriangularOptions { distribution: "triangular"; min: number; mode: number; max: number }
export interface GammaOptions { distribution: "gamma"; shape: number; rate: number }
export type DesDistributionOptions = BernoulliOptions | TriangularOptions | GammaOptions;

function finiteNumber(value: unknown, name: string): number {
  if (typeof value !== "number") throw new TypeError(`${name} must be numeric.`);
  if (!Number.isFinite(value)) throw new RangeError(`${name} must be finite.`);
  return value;
}

export function bernoulliDraw(options: unknown, draw: () => number): number {
  const values = validateOptions(options, ["distribution", "probability"]);
  const probability = finiteNumber(values.probability, "Probability");
  if (probability < 0 || probability > 1) throw new RangeError("Probability must be in [0, 1].");
  if (probability === 0 || probability === 1) return probability;
  return draw() < probability ? 1 : 0;
}

export function triangularDraw(options: unknown, draw: () => number): number {
  const values = validateOptions(options, ["distribution", "min", "mode", "max"]);
  const min = finiteNumber(values.min, "Minimum");
  const mode = finiteNumber(values.mode, "Mode");
  const max = finiteNumber(values.max, "Maximum");
  if (min > mode || mode > max) throw new RangeError("Triangular bounds require min <= mode <= max.");
  if (min === max) return min;
  const width = max - min;
  if (!Number.isFinite(width)) throw new RangeError("Triangular range must be finite.");
  const split = (mode - min) / width;
  const uniform = draw();
  // Normalize the radicand so finite ranges do not overflow through width squared.
  const result = uniform < split
    ? min + width * Math.sqrt(uniform * split)
    : max - width * Math.sqrt((1 - uniform) * (1 - split));
  if (!Number.isFinite(result)) throw new RangeError("Triangular result must be finite.");
  return result;
}

const rejectionLimit = 1_000_000;
// Fast acceptance bound from the Marsaglia–Tsang gamma sampler.
const squeezeCoefficient = 0.0331;

/** Marsaglia and Tsang (2000); standard-profile shape boosting below one. */
export function gammaDraw(options: unknown, draw: () => number, gaussian: () => number): number {
  const values = validateOptions(options, ["distribution", "shape", "rate"]);
  const shape = finiteNumber(values.shape, "Shape");
  const rate = finiteNumber(values.rate, "Rate");
  if (shape <= 0 || rate <= 0) throw new RangeError("Gamma shape and rate must be positive.");
  const boostedShape = shape < 1 ? shape + 1 : shape;
  const d = boostedShape - 1 / 3;
  const c = 1 / (3 * Math.sqrt(d));
  for (let attempt = 0; attempt < rejectionLimit; attempt++) {
    const normal = gaussian();
    const base = 1 + c * normal;
    if (base <= 0) continue;
    const volume = base * base * base;
    const uniform = draw();
    const square = normal * normal;
    if (uniform >= 1 - squeezeCoefficient * square * square &&
        Math.log(uniform) >= square / 2 + d * (1 - volume + Math.log(volume))) continue;
    let result = d * volume / rate;
    if (shape < 1) result *= Math.pow(draw(), 1 / shape);
    if (!Number.isFinite(result)) throw new RangeError("Gamma result must be finite.");
    return result;
  }
  throw new RangeError("Gamma rejection limit exhausted.");
}
