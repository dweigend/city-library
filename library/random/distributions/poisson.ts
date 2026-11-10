import { distributionMean } from "./mean-options.ts";

const maximumPoissonMean = 100000;
/** Below this mean, multiply uniforms (Knuth); at or above it use Hörmann's PTRS. */
const productMethodMeanLimit = 30;
const largestTabulatedFactorial = 255;
const logSqrtTwoPi = 0.9189385332046727;

const logFactorials = [0];
for (let value = 1; value <= largestTabulatedFactorial; value++) {
  logFactorials.push(logFactorials[value - 1]! + Math.log(value));
}

/**
 * Contract-pinned binary64 approximation, not an exact real factorial identity.
 * Tabulated sums up to 255, then Stirling's series.
 */
export function logFactorial(value: number): number {
  if (value < logFactorials.length) return logFactorials[value]!;
  const z = 1 / value;
  const z2 = z * z;
  return (value + 0.5) * Math.log(value) - value + logSqrtTwoPi
    + z * (1 / 12 + z2 * (-1 / 360 + z2 * (1 / 1260 + z2 * (-1 / 1680))));
}

function accepted(value: number): number {
  if (!Number.isSafeInteger(value) || value < 0) throw new RangeError("Poisson result must be a nonnegative finite safe integer.");
  return value;
}

/** Independently written from the accepted mathematical PTRS/product contract. */
export function poissonDraw(options: unknown, draw: () => number): number {
  const mean = distributionMean(options, "poisson", maximumPoissonMean);
  if (mean === 0) return 0;
  if (mean < productMethodMeanLimit) {
    const threshold = Math.exp(-mean);
    let product = 1;
    let count = 0;
    do {
      count++;
      product *= draw();
    } while (product > threshold);
    return accepted(count - 1);
  }

  // Hörmann's printed PTRS p7 offset is .43, deliberately not Table1/PTRD's .445.
  const b = 0.931 + 2.53 * Math.sqrt(mean);
  const a = -0.059 + 0.02483 * b;
  const vr = 0.9277 - 3.6224 / (b - 2);
  const invAlpha = 1.1239 + 1.1328 / (b - 3.4);
  const logMean = Math.log(mean);
  for (;;) {
    const u = draw() - 0.5;
    const v = draw();
    const us = 0.5 - Math.abs(u);
    if (us === 0) continue;
    const k = Math.floor((2 * a / us + b) * u + mean + 0.43);
    if (us >= 0.07 && v <= vr) return accepted(k);
    if (k < 0) continue;
    if (us < 0.013 && v > us) continue;
    if (Math.log(v * invAlpha / (a / (us * us) + b)) <= -mean + k * logMean - logFactorial(k)) {
      return accepted(k);
    }
  }
}
