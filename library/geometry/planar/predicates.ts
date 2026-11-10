/** Exact integer multiples of 2^-1074, decoded from ORIGINAL binary64 bits.
 * Subtractions/products below are BigInt operations, never rounded floats.
 * The buffer is call-local to decoding; there is no identity-validity cache.
 */
function exactInteger(value: number): bigint {
  const view = new DataView(new ArrayBuffer(8));
  view.setFloat64(0, value);
  const bits = view.getBigUint64(0);
  const exponent = Number((bits >> 52n) & 2047n);
  const fraction = bits & ((1n << 52n) - 1n);
  const magnitude = exponent === 0 ? fraction : ((1n << 52n) | fraction) << BigInt(exponent - 1);
  return bits >> 63n ? -magnitude : magnitude;
}
/** A binary64 position with its exact scaled integer coordinates exactX and exactY. */
export interface Point { readonly x: number; readonly y: number; readonly exactX: bigint; readonly exactY: bigint }
export function point(x: number, y: number): Point { return { x, y, exactX: exactInteger(x), exactY: exactInteger(y) }; }
export function isEqualPoint(a: Point, b: Point): boolean { return a.x === b.x && a.y === b.y; }
/** Exact orientation of c relative to a→b: 1 counterclockwise, -1 clockwise, 0 collinear. */
export function orient(a: Point, b: Point, c: Point): number {
  const determinant = (b.exactX - a.exactX) * (c.exactY - a.exactY) - (b.exactY - a.exactY) * (c.exactX - a.exactX);
  if (determinant > 0n) return 1;
  if (determinant < 0n) return -1;
  return 0;
}
function isInBox(a: Point, b: Point, p: Point): boolean {
  return p.x >= Math.min(a.x, b.x) && p.x <= Math.max(a.x, b.x) && p.y >= Math.min(a.y, b.y) && p.y <= Math.max(a.y, b.y);
}
export function isOnSegment(a: Point, b: Point, p: Point): boolean { return isInBox(a, b, p) && orient(a, b, p) === 0; }
/** Whether closed segments a–b and c–d share at least one point. */
export function hasSegmentContact(a: Point, b: Point, c: Point, d: Point): boolean {
  const boxesDisjoint =
    Math.max(a.x, b.x) < Math.min(c.x, d.x) || Math.max(c.x, d.x) < Math.min(a.x, b.x) ||
    Math.max(a.y, b.y) < Math.min(c.y, d.y) || Math.max(c.y, d.y) < Math.min(a.y, b.y);
  if (boxesDisjoint) return false;
  const abC = orient(a, b, c), abD = orient(a, b, d), cdA = orient(c, d, a), cdB = orient(c, d, b);
  return (abC === 0 && isInBox(a, b, c)) || (abD === 0 && isInBox(a, b, d)) ||
    (cdA === 0 && isInBox(c, d, a)) || (cdB === 0 && isInBox(c, d, b)) ||
    (abC * abD < 0 && cdA * cdB < 0);
}
/** Boundary first; half-open ray crossings, no division. -1 outside, 0 boundary, 1 inside. */
export function classify(ring: readonly Point[], p: Point): -1 | 0 | 1 {
  let inside = false;
  for (let i = 0; i < ring.length - 1; i++) {
    const a = ring[i]!;
    const b = ring[i + 1]!;
    if (isOnSegment(a, b, p)) return 0;
    if ((a.y > p.y) !== (b.y > p.y) && orient(a, b, p) === (b.y > a.y ? 1 : -1)) inside = !inside;
  }
  return inside ? 1 : -1;
}
