/** Exact integer multiples of 2^-1074, decoded from ORIGINAL binary64 bits.
 * Subtractions/products below are BigInt operations, never rounded floats.
 * The buffer is call-local to decoding; there is no identity-validity cache.
 */
function integer(value: number): bigint {
  const buffer = new ArrayBuffer(8), view = new DataView(buffer);
  view.setFloat64(0, value);
  const bits = view.getBigUint64(0);
  const exponent = Number((bits >> 52n) & 2047n);
  const fraction = bits & ((1n << 52n) - 1n);
  const magnitude = exponent === 0 ? fraction : ((1n << 52n) | fraction) << BigInt(exponent - 1);
  return bits >> 63n ? -magnitude : magnitude;
}
export interface Point { readonly x: number; readonly y: number; readonly X: bigint; readonly Y: bigint }
export function point(x: number, y: number): Point { return { x, y, X: integer(x), Y: integer(y) }; }
export function equal(a: Point, b: Point): boolean { return a.x === b.x && a.y === b.y; }
export function orient(a: Point, b: Point, c: Point): number {
  const determinant = (b.X - a.X) * (c.Y - a.Y) - (b.Y - a.Y) * (c.X - a.X);
  return determinant > 0n ? 1 : determinant < 0n ? -1 : 0;
}
function inBox(a: Point, b: Point, p: Point): boolean {
  return p.x >= Math.min(a.x, b.x) && p.x <= Math.max(a.x, b.x) && p.y >= Math.min(a.y, b.y) && p.y <= Math.max(a.y, b.y);
}
export function onSegment(a: Point, b: Point, p: Point): boolean { return inBox(a, b, p) && orient(a, b, p) === 0; }
export function contact(a: Point, b: Point, c: Point, d: Point): boolean {
  if (Math.max(a.x, b.x) < Math.min(c.x, d.x) || Math.max(c.x, d.x) < Math.min(a.x, b.x) ||
      Math.max(a.y, b.y) < Math.min(c.y, d.y) || Math.max(c.y, d.y) < Math.min(a.y, b.y)) return false;
  const abC = orient(a, b, c), abD = orient(a, b, d), cdA = orient(c, d, a), cdB = orient(c, d, b);
  return (abC === 0 && inBox(a, b, c)) || (abD === 0 && inBox(a, b, d)) ||
    (cdA === 0 && inBox(c, d, a)) || (cdB === 0 && inBox(c, d, b)) ||
    (abC * abD < 0 && cdA * cdB < 0);
}
/** Boundary first; half-open ray crossings, no division. -1 outside, 0 boundary, 1 inside. */
export function classify(ring: readonly Point[], p: Point): -1 | 0 | 1 {
  let inside = false;
  for (let i = 0; i < ring.length - 1; i++) {
    const a = ring[i]!, b = ring[i + 1]!;
    if (onSegment(a, b, p)) return 0;
    if ((a.y > p.y) !== (b.y > p.y) && orient(a, b, p) === (b.y > a.y ? 1 : -1)) inside = !inside;
  }
  return inside ? 1 : -1;
}
