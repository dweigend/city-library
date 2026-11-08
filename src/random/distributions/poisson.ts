import { distributionMean } from "./mean-options.ts";

const logFactorials = [0];
for (let value = 1; value <= 255; value++) logFactorials.push(logFactorials[value - 1]! + Math.log(value));

/** Contract-pinned binary64 approximation, not an exact real factorial identity. */
export function logFactorial(value: number): number {
  if (value < logFactorials.length) return logFactorials[value]!;
  const z = 1 / value;
  const z2 = z * z;
  return (value + 0.5) * Math.log(value) - value + 0.9189385332046727
    + z * (1 / 12 + z2 * (-1 / 360 + z2 * (1 / 1260 + z2 * (-1 / 1680))));
}

function accepted(value: number): number {
  if (!Number.isSafeInteger(value) || value < 0) throw new RangeError("Poisson result must be a nonnegative finite safe integer.");
  return value;
}

/** Independently written from the accepted mathematical PTRS/product contract. */
export function poissonDraw(options: unknown, draw: () => number): number {
  const mean = distributionMean(options, "poisson", 100000);
  if (mean === 0) return 0;
  if (mean < 30) {
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
    if (Math.log(v * invAlpha / (a / (us * us) + b)) <= -mean + k * logMean - logFactorial(k))
      return accepted(k);
  }
}
