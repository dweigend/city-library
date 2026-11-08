import { expect, test } from "bun:test";
import { geometry, type PlanarPolygon, type PlanarXY } from "../index.ts";

// Independent small-integer oracle. Intersections solve rational segment parameters;
// classification uses signed winding, not the production parity implementation.
// All arithmetic here is exact integer arithmetic within the safe Number range.
type P = readonly [number, number];
const cross = (a: P, b: P) => a[0] * b[1] - a[1] * b[0];
const sub = (a: P, b: P): P => [a[0] - b[0], a[1] - b[1]];
const dot = (a: P, b: P) => a[0] * b[0] + a[1] * b[1];
function segmentIntersection(a: P, b: P, c: P, d: P): boolean {
  const r = sub(b, a), s = sub(d, c), offset = sub(c, a), denominator = cross(r, s);
  if (denominator !== 0) {
    const t = cross(offset, s) * Math.sign(denominator), u = cross(offset, r) * Math.sign(denominator);
    return t >= 0 && t <= Math.abs(denominator) && u >= 0 && u <= Math.abs(denominator);
  }
  if (cross(offset, r) !== 0) return false;
  const length = dot(r, r), t0 = dot(offset, r), t1 = dot(sub(d, a), r);
  return Math.max(0, Math.min(t0, t1)) <= Math.min(length, Math.max(t0, t1));
}
function simple(vertices: readonly P[]): boolean {
  let area2 = 0;
  for (let i = 0; i < vertices.length; i++) {
    const a = vertices[i]!, b = vertices[(i + 1) % vertices.length]!, c = vertices[(i + 2) % vertices.length]!;
    if (a[0] === b[0] && a[1] === b[1]) return false;
    area2 += cross(a, b);
    if (cross(sub(b, a), sub(c, b)) === 0 && dot(sub(b, a), sub(c, b)) <= 0) return false;
    for (let j = i + 2; j < vertices.length; j++) {
      if (i === 0 && j === vertices.length - 1) continue;
      if (segmentIntersection(a, b, vertices[j]!, vertices[(j + 1) % vertices.length]!)) return false;
    }
  }
  return area2 !== 0;
}
function winding(vertices: readonly P[], query: P): "boundary" | "inside" | "outside" {
  let turns = 0;
  for (let i = 0; i < vertices.length; i++) {
    const a = vertices[i]!, b = vertices[(i + 1) % vertices.length]!;
    const determinant = cross(sub(b, a), sub(query, a));
    if (determinant === 0 && dot(sub(query, a), sub(query, b)) <= 0) return "boundary";
    if (a[1] <= query[1] && b[1] > query[1] && determinant > 0) turns++;
    if (a[1] > query[1] && b[1] <= query[1] && determinant < 0) turns--;
  }
  return turns === 0 ? "outside" : "inside";
}
function exercise(vertices: readonly P[], queries: readonly P[]): void {
  const polygon: PlanarPolygon = { type: "Polygon", coordinates: [[...vertices, vertices[0]!]] };
  const valid = simple(vertices);
  if (!valid) {
    expect(() => geometry.bounds([{ type: "Feature", geometry: polygon, properties: null }])).toThrow(RangeError);
    expect(() => geometry.contains(polygon, { x: -100, y: -100 })).toThrow(RangeError);
    return;
  }
  expect(geometry.bounds([{ type: "Feature", geometry: polygon, properties: null }])).toEqual([
    Math.min(...vertices.map(p => p[0])), Math.max(...vertices.map(p => p[0])),
    Math.min(...vertices.map(p => p[1])), Math.max(...vertices.map(p => p[1])),
  ]);
  for (const q of queries) {
    const expected = winding(vertices, q);
    expect(geometry.contains(polygon, { x: q[0], y: q[1] })).toBe(expected !== "outside");
    expect(geometry.contains(polygon, { x: q[0], y: q[1] }, { boundary: "exclude" })).toBe(expected === "inside");
  }
}
test("exhaustive ordered distinct triangles and quadrilaterals on a 3x3 integer lattice", () => {
  const lattice: P[] = Array.from({ length: 9 }, (_, i) => [i % 3, Math.floor(i / 3)]);
  const queries: P[] = Array.from({ length: 25 }, (_, i) => [(i % 5) / 2, Math.floor(i / 5) / 2]);
  let triangles = 0, quadrilaterals = 0;
  for (let a = 0; a < 9; a++) for (let b = 0; b < 9; b++) for (let c = 0; c < 9; c++) {
    if (new Set([a, b, c]).size !== 3) continue;
    exercise([lattice[a]!, lattice[b]!, lattice[c]!], queries); triangles++;
    for (let d = 0; d < 9; d++) {
      if (new Set([a, b, c, d]).size !== 4) continue;
      exercise([lattice[a]!, lattice[b]!, lattice[c]!, lattice[d]!], queries); quadrilaterals++;
    }
  }
  expect(triangles).toBe(504); expect(quadrilaterals).toBe(3024);
}, 30000);
test("deterministic adversarial small-integer polygons and rational query fixtures", () => {
  let seed = 0x517cc1b7;
  const next = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed; };
  for (let sample = 0; sample < 600; sample++) {
    const vertices: PlanarXY[] = Array.from({ length: 3 + next() % 6 }, () => [Number(next() % 17) - 8, Number(next() % 19) - 9]);
    const queries: P[] = [...vertices, ...Array.from({ length: 12 }, (): P => [(Number(next() % 37) - 18) / 2, (Number(next() % 39) - 19) / 2])];
    exercise(vertices, queries);
  }
  // Explicit rational points and analytic winding regions in a concave L.
  exercise([[0, 0], [6, 0], [6, 2], [2, 2], [2, 6], [0, 6]], [[1 / 2, 11 / 2], [11 / 2, 1 / 2], [5 / 2, 5 / 2], [2, 3 / 2], [2, 7 / 2]]);
}, 30000);
test("hole pairs agree with an independent closed-rectangle interval oracle in both orders", () => {
  const box = (x: number, y: number, width: number, height: number): readonly PlanarXY[] => [[x, y], [x + width, y], [x + width, y + height], [x, y + height], [x, y]];
  const exterior = box(0, 0, 20, 20);
  for (let x = 1; x <= 12; x++) for (let y = 1; y <= 12; y++) {
    const first = box(3, 3, 5, 5), second = box(x, y, 2, 3);
    const overlapOrContact = x <= 8 && x + 2 >= 3 && y <= 8 && y + 3 >= 3;
    for (const holes of [[first, second], [second, first]]) {
      const polygon: PlanarPolygon = { type: "Polygon", coordinates: [exterior, ...holes] };
      if (overlapOrContact) {
        expect(() => geometry.bounds([{ type: "Feature", geometry: polygon, properties: null }])).toThrow(RangeError);
        expect(() => geometry.contains(polygon, { x: -1, y: -1 })).toThrow(RangeError);
      } else {
        for (const q of [[1 / 2, 1 / 2], [7 / 2, 7 / 2], [x + 1, y + 1], [8, 5], [x, y]] as const) {
          const locations = holes.map(hole => winding(hole.slice(0, -1), q));
          const include = !locations.includes("inside"), exclude = locations.every(location => location === "outside");
          expect(geometry.contains(polygon, { x: q[0], y: q[1] })).toBe(include);
          expect(geometry.contains(polygon, { x: q[0], y: q[1] }, { boundary: "exclude" })).toBe(exclude);
        }
      }
    }
  }
});
