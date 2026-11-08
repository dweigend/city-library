/** Internal graph costs in integer multiples of the least positive binary64. */
export const unitCost = 1n << 1074n;
const fractionMask = (1n << 52n) - 1n;
const signBit = 1n << 63n;
const maximum = ((1n << 53n) - 1n) << 2045n;
// At this midpoint ties-to-even carries MAX_VALUE's odd significand to infinity.
const overflowThreshold = maximum + (1n << 2044n);
const bits = new DataView(new ArrayBuffer(8));

/** Decode original captured bits, never a rounded intermediate path sum. */
export function dyadic(value: number): bigint {
  if (!Number.isFinite(value)) throw new RangeError("Graph cost must be finite.");
  bits.setFloat64(0, value);
  const encoded = bits.getBigUint64(0);
  const exponent = Number((encoded >> 52n) & 2047n);
  const fraction = encoded & fractionMask;
  const magnitude = exponent === 0 ? fraction : ((1n << 52n) | fraction) << BigInt(exponent - 1);
  return encoded & signBit ? -magnitude : magnitude;
}

/** Check every examined candidate, including ones that cannot improve a path. */
export function addCosts(a: bigint, b: bigint): bigint {
  const result = a + b;
  if (result >= overflowThreshold || result <= -overflowThreshold)
    throw new RangeError("Accumulated distance must round to a finite number.");
  return result;
}

/** Round once to nearest binary64, ties to even, without enormous Number casts. */
export function roundedCost(value: bigint): number {
  const negative = value < 0n;
  const magnitude = negative ? -value : value;
  if (magnitude >= overflowThreshold) throw new RangeError("Accumulated distance must round to a finite number.");
  let encoded: bigint;
  if (magnitude < (1n << 52n)) {
    // Subnormal values are already exact integer units, including zero.
    encoded = magnitude;
  } else {
    let shift = BigInt(Math.max(0, magnitude.toString(2).length - 53));
    let significand = magnitude >> shift;
    if (shift > 0n) {
      const remainder = magnitude - (significand << shift);
      const midpoint = 1n << (shift - 1n);
      if (remainder > midpoint || (remainder === midpoint && (significand & 1n) !== 0n)) significand++;
    }
    if (significand === (1n << 53n)) {
      significand >>= 1n;
      shift++;
    }
    encoded = ((shift + 1n) << 52n) | (significand & fractionMask);
  }
  bits.setBigUint64(0, encoded | (negative ? signBit : 0n));
  return bits.getFloat64(0);
}
