import { indexedPalette } from "./indexed-palette.ts";

/** Convert a finite indexed numeric color using the observed official tenth-color bins. */
export function indexedColor(color: number): string {
  if (typeof color !== "number") throw new TypeError("A numeric color is required.");
  if (!Number.isFinite(color)) throw new RangeError("Numeric color must be finite.");
  const remainder = color % 140;
  const wrapped = remainder < 0 ? remainder + 140 : remainder;
  // Negative subnormals can round up to140 after addition. Preserve the final
  // mathematical bin instead of returning an out-of-range value; target finite guard.
  return indexedPalette[Math.min(1399, Math.floor(10 * wrapped))]!;
}
