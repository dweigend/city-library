import { validateOptions } from "../../agent/state.ts";

export interface MeanOptions {
  distribution: "exponential" | "poisson";
  mean?: number;
}

/** Validate the closed branch before requesting a uniform draw. */
export function distributionMean(options: unknown, distribution: MeanOptions["distribution"], maximum = Infinity): number {
  const values = validateOptions(options, ["distribution", "mean"]);
  if (values.distribution !== distribution) throw new TypeError(`Expected ${distribution} distribution options.`);
  const mean = values.mean === undefined ? 1 : values.mean;
  if (typeof mean !== "number") throw new TypeError("Distribution mean must be a number.");
  if (!Number.isFinite(mean) || mean < 0 || mean > maximum)
    throw new RangeError(`${distribution} mean must be finite and in [0, ${maximum}].`);
  return mean;
}
