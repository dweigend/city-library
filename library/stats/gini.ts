/**
 * Population Gini over finite nonnegative holdings; no sampling correction.
 * Returns a value clamped to [0, 1]; empty or all-zero input returns 0.
 * The input is copied once and never reordered.
 */
export function gini(values: Iterable<number>): number {
  if (arguments.length > 1) throw new TypeError("Gini accepts one iterable.");
  if (
    values == null ||
    (typeof values !== "object" && typeof values !== "function") ||
    typeof (values as { [Symbol.iterator]?: unknown })[Symbol.iterator] !== "function"
  ) {
    throw new TypeError("Gini requires an iterable.");
  }
  const sorted = Array.from(values);
  let total = 0;
  for (const value of sorted) {
    if (typeof value !== "number") throw new TypeError("Gini values must be numbers.");
    if (!Number.isFinite(value) || value < 0) throw new RangeError("Gini values must be finite and nonnegative.");
    total += value;
    if (!Number.isFinite(total)) throw new RangeError("Gini total overflow.");
  }
  if (total === 0 || sorted.length === 0) return 0;
  sorted.sort((a, b) => a - b);
  // Shares relative to the total keep the rank-weighted sum finite.
  let weighted = 0;
  for (let i = 0; i < sorted.length; i += 1) {
    weighted += (2 * (i + 1) - sorted.length - 1) * (sorted[i]! / total);
  }
  const result = weighted / sorted.length;
  if (!Number.isFinite(result)) throw new RangeError("Gini arithmetic overflow.");
  return Math.max(0, Math.min(1, result));
}
