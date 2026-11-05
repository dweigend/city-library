/** Population Gini over finite nonnegative holdings; no sampling correction. */
export function gini(values: Iterable<number>): number {
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
  let weighted = 0;
  for (let i = 0; i < sorted.length; i += 1) {
    weighted += (2 * (i + 1) - sorted.length - 1) * (sorted[i]! / total);
  }
  const result = weighted / sorted.length;
  if (!Number.isFinite(result)) throw new RangeError("Gini arithmetic overflow.");
  return Math.max(0, Math.min(1, result));
}
