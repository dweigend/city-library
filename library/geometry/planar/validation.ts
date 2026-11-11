import { finite } from "../space.ts";
import { classify, hasSegmentContact, isEqualPoint, isOnSegment, orient, point, type Point } from "./predicates.ts";

/** Containment accepts larger coordinates than polygon operations but bounds its exact work. */
export const containmentLimits = Object.freeze({ positions: 2048, magnitude: 1e9 });

/** Requires a plain object or null-prototype record. */
export function record(value: unknown): object {
  if (typeof value !== "object" || value === null) throw new TypeError("Expected a planar record.");
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) throw new TypeError("Expected a plain planar record.");
  return value;
}
/** Only recognized own data fields are inspected; foreign values are never read. */
export function field(value: object, key: string): unknown {
  const descriptor = Object.getOwnPropertyDescriptor(value, key);
  if (!descriptor || !("value" in descriptor)) throw new TypeError(`Expected own data field: ${key}.`);
  return descriptor.value;
}
/** Copies a dense array of own data elements with at least `minimum` entries. */
export function array(value: unknown, minimum = 0): unknown[] {
  if (!Array.isArray(value) || value.length < minimum || Reflect.ownKeys(value).length !== value.length + 1)
    throw new TypeError("Expected a dense planar array without extra keys.");
  const result: unknown[] = [];
  for (let i = 0; i < value.length; i++) result.push(field(value, String(i)));
  return result;
}
/** Reads an exact finite [x, y] pair whose coordinates do not exceed `magnitude`. */
export function xy(value: unknown, magnitude = Infinity): Point {
  const pair = array(value);
  if (pair.length !== 2) throw new TypeError("Expected an exact XY pair.");
  const x = finite(pair[0]), y = finite(pair[1]);
  if (Math.abs(x) > magnitude || Math.abs(y) > magnitude) throw new RangeError("Containment coordinate magnitude exceeded.");
  return point(x, y);
}
function rejectTopology(): never {
  throw new RangeError("Invalid planar Polygon topology.");
}
function validateRing(ring: readonly Point[]): void {
  const n = ring.length - 1;
  if (!isEqualPoint(ring[0]!, ring[n]!)) rejectTopology();
  let noncollinear = false;
  for (let i = 0; i < n; i++) {
    const a = ring[i]!, b = ring[i + 1]!, c = ring[(i + 2) % n]!;
    if (isEqualPoint(a, b)) rejectTopology();
    const turn = orient(a, b, c);
    if (turn !== 0) noncollinear = true;
    // Adjacent edges may share only b, including at the closure seam.
    else if (isOnSegment(a, b, c) || isOnSegment(b, c, a)) rejectTopology();
  }
  if (!noncollinear) rejectTopology();
  // Nonadjacent edges must not touch; the first and last edges are adjacent at the seam.
  for (let i = 0; i < n; i++) {
    for (let j = i + 2; j < n; j++) {
      if (i === 0 && j === n - 1) continue;
      if (hasSegmentContact(ring[i]!, ring[i + 1]!, ring[j]!, ring[j + 1]!)) rejectTopology();
    }
  }
}
function haveRingContact(a: readonly Point[], b: readonly Point[]): boolean {
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < b.length - 1; j++) {
      if (hasSegmentContact(a[i]!, a[i + 1]!, b[j]!, b[j + 1]!)) return true;
    }
  }
  return false;
}
/** Reads and validates simple Polygon rings: an exterior shell followed by disjoint holes. */
export function polygon(value: unknown): readonly (readonly Point[])[] {
  const raw = array(value, 1).map(ring => array(ring, 4));
  return validatePolygon(raw.map(ring => ring.map(pair => xy(pair))));
}

/** Polygon reading for containment queries, within containmentLimits. */
export function containmentPolygon(value: unknown): readonly (readonly Point[])[] {
  const raw = array(value, 1).map(ring => array(ring, 4));
  if (raw.reduce((count, ring) => count + ring.length, 0) > containmentLimits.positions) {
    throw new RangeError("Containment Polygon exceeds 2048 closure-inclusive positions.");
  }
  return validatePolygon(raw.map(ring => ring.map(pair => xy(pair, containmentLimits.magnitude))));
}

function validatePolygon(rings: readonly (readonly Point[])[]): readonly (readonly Point[])[] {
  for (const ring of rings) validateRing(ring);
  const shell = rings[0]!;
  // Check complete edge contact BEFORE strict witnesses (vertices alone miss concave bridges).
  for (let i = 1; i < rings.length; i++) {
    const hole = rings[i]!;
    if (haveRingContact(shell, hole) || classify(shell, hole[0]!) !== 1) rejectTopology();
    for (let j = 1; j < i; j++) {
      const other = rings[j]!;
      if (haveRingContact(hole, other) || classify(hole, other[0]!) !== -1 || classify(other, hole[0]!) !== -1) {
        rejectTopology();
      }
    }
  }
  return rings;
}
