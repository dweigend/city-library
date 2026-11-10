/** Exact dependency arithmetic private to graph algorithms. */
export interface Rational { readonly numerator: bigint; readonly denominator: bigint }
export const zero: Rational = { numerator: 0n, denominator: 1n };
export const one: Rational = { numerator: 1n, denominator: 1n };
// binary64 exponent range and the 2^-1074 subnormal unit.
const maximumExponent = 1023;
const minimumNormalExponent = -1022;
const fractionBits = 52;
const subnormalUnitShift = 1074n;

function gcd(a: bigint, b: bigint): bigint {
  while (b !== 0n) { const remainder = a % b; a = b; b = remainder; }
  return a < 0n ? -a : a;
}
function rational(numerator: bigint, denominator = 1n): Rational {
  if (numerator === 0n) return zero;
  const divisor = gcd(numerator, denominator);
  return { numerator: numerator / divisor, denominator: denominator / divisor };
}
export function plus(a: Rational, b: Rational): Rational {
  if (a.numerator === 0n) return b;
  if (b.numerator === 0n) return a;
  if (a.denominator === b.denominator) return rational(a.numerator + b.numerator, a.denominator);
  const common = gcd(a.denominator, b.denominator);
  const aScale = b.denominator / common, bScale = a.denominator / common;
  return rational(a.numerator * aScale + b.numerator * bScale, a.denominator * aScale);
}
export function timesRatio(value: Rational, numerator: bigint, denominator: bigint): Rational {
  if (value.numerator === 0n || numerator === 0n) return zero;
  // Cancel before multiplication, including large parallel-path counts.
  const ratioDivisor = gcd(numerator, denominator);
  numerator /= ratioDivisor; denominator /= ratioDivisor;
  const left = gcd(value.numerator, denominator), right = gcd(numerator, value.denominator);
  return { numerator: (value.numerator / left) * (numerator / right),
    denominator: (value.denominator / right) * (denominator / left) };
}
function nearest(numerator: bigint, denominator: bigint): bigint {
  let quotient = numerator / denominator;
  const twiceRemainder = (numerator % denominator) * 2n;
  if (twiceRemainder > denominator || (twiceRemainder === denominator && (quotient & 1n) !== 0n)) quotient++;
  return quotient;
}
/** Correct binary64 quotient rounding, including true final underflow and ties.
 * Never separately cast a huge path numerator/denominator to Number. */
export function quotient(numerator: bigint, denominator: bigint): number {
  if (denominator <= 0n) throw new RangeError("Expected a positive graph denominator.");
  if (numerator === 0n) return 0;
  const negative = numerator < 0n;
  const magnitude = negative ? -numerator : numerator;
  let exponent = magnitude.toString(2).length - denominator.toString(2).length;
  if (exponent >= 0 ? magnitude < (denominator << BigInt(exponent)) : (magnitude << BigInt(-exponent)) < denominator) exponent--;
  if (exponent > maximumExponent) throw new RangeError("Graph score must round to a finite number.");
  let result: number;
  if (exponent < minimumNormalExponent) {
    result = Number(nearest(magnitude << subnormalUnitShift, denominator)) * Number.MIN_VALUE;
  } else {
    const shift = fractionBits - exponent;
    const significand = shift >= 0 ? nearest(magnitude << BigInt(shift), denominator) : nearest(magnitude, denominator << BigInt(-shift));
    result = Number(significand) * 2 ** (exponent - fractionBits);
  }
  if (!Number.isFinite(result)) throw new RangeError("Graph score must round to a finite number.");
  return negative ? -result : result;
}
