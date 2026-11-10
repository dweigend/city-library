import { finite } from "../../geometry/space.ts";

/**
 * One explicit diffusion step over values in a fixed field order.
 * Each value keeps `value * (1 - rate)` and sends an equal share of
 * `value * rate` to every neighborhood slot returned by `slotTargets`;
 * repeated targets receive repeated shares. Accumulation follows source
 * order, then slot order, so floating-point results are reproducible.
 * @returns A new array; `values` is not changed.
 * @throws RangeError when any intermediate value is not finite.
 */
export function diffuseValues(
  values: readonly number[],
  rate: number,
  slotTargets: (source: number) => readonly number[],
): number[] {
  const next = values.map((value) => finite(value * (1 - rate)));
  for (let source = 0; source < values.length; source++) {
    const targets = slotTargets(source);
    const share = finite((values[source]! * rate) / targets.length);
    for (const target of targets) next[target] = finite(next[target]! + share);
  }
  return next;
}
