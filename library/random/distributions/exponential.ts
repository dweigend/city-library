import { distributionMean } from "./mean-options.ts";

/** Literal standard-profile transform; finite underflow/signed zero are intentional. */
export function exponentialDraw(options: unknown, draw: () => number): number {
  const mean = distributionMean(options, "exponential");
  if (mean === 0) return 0;
  const result = (-mean) * Math.log(1 - draw());
  if (!Number.isFinite(result)) throw new RangeError("Exponential result is not finite.");
  return result;
}
