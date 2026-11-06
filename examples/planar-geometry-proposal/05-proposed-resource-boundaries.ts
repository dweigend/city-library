// PROPOSAL ONLY: U1/U3/U4/U5 decisions in the proposal must precede acceptance.
// Constants are the existing limits.geojson values; this slice does not add a limits API.
// Proposed accounting: complete bounds inputs use the planar budgets; closing pairs count;
// polygonPositions sums all rings of one Polygon; property nodes count occurrences incl.root;
// property depth counts nested containers, root=1; aliases consume each occurrence.
import assert from "node:assert/strict";
import { geometry, type PlanarFeature, type PlanarGeometry, type PlanarJson, type PlanarPolygon, type PlanarXY } from "city-library";

const feature = (shape: PlanarGeometry | null, properties: Readonly<Record<string, PlanarJson>> | null = null): PlanarFeature => ({
  type: "Feature", geometry: shape, properties,
});
const regular = (positions: number): PlanarPolygon => {
  const ring: PlanarXY[] = Array.from({ length: positions - 1 }, (_, index) => {
    const angle = index * 2 * Math.PI / (positions - 1);
    return [10 * Math.cos(angle), 10 * Math.sin(angle)];
  });
  ring.push(ring[0]!);
  return { type: "Polygon", coordinates: [ring] };
};
assert.equal(geometry.contains(regular(2048), { x: 0, y: 0 }, { boundary: "exclude" }), true);
assert.throws(() => geometry.contains(regular(2049), { x: 0, y: 0 }, { boundary: "exclude" }), RangeError);
// U4: polygonPositions includes exterior and hole closure positions together.
const tinyHole: readonly PlanarXY[] = [[-1, -1], [1, -1], [1, 1], [-1, 1], [-1, -1]];
const atPolygonCap: PlanarPolygon = { type: "Polygon", coordinates: [regular(2043).coordinates[0]!, tinyHole] };
assert.equal(geometry.contains(atPolygonCap, { x: 3, y: 0 }, { boundary: "exclude" }), true);
const beyondPolygonCap: PlanarPolygon = { type: "Polygon", coordinates: [regular(2044).coordinates[0]!, tinyHole] };
assert.throws(() => geometry.contains(beyondPolygonCap, { x: 3, y: 0 }, { boundary: "exclude" }), RangeError);
// Distinct Polygon members each have their own 2048-position budget.
const secondPolygon = regular(2048).coordinates.map((ring: readonly PlanarXY[]) => ring.map(([x, y]: PlanarXY): PlanarXY => [x + 30, y]));
assert.deepEqual(geometry.bounds([feature({ type: "MultiPolygon", coordinates: [regular(2048).coordinates, secondPolygon] })]), [
  Math.min(...regular(2048).coordinates[0]!.map(([x]: PlanarXY) => x)), 40,
  Math.min(...regular(2048).coordinates[0]!.map(([, y]: PlanarXY) => y)),
  Math.max(...regular(2048).coordinates[0]!.map(([, y]: PlanarXY) => y)),
]);
// Positive geometric witness at coordinateMagnitude, not only rejection preflight.
const edgeSquare: PlanarPolygon = { type: "Polygon", coordinates: [[
  [999999998, 0], [1000000000, 0], [1000000000, 2], [999999998, 2], [999999998, 0],
]] };
assert.equal(geometry.contains(edgeSquare, { x: 999999999, y: 1 }, { boundary: "exclude" }), true);
assert.deepEqual(geometry.bounds([feature({ type: "Point", coordinates: [-1000000000, 1000000000] })]), [-1000000000, -1000000000, 1000000000, 1000000000]);
assert.throws(() => geometry.bounds([feature({ type: "Point", coordinates: [1000000001, 0] })]), RangeError);
// U1/U3: proposed aggregation across every geometry and feature in one bounds call.
const positions: PlanarXY[] = Array.from({ length: 100000 }, (_, index) => [index % 2, 2]);
assert.deepEqual(geometry.bounds([feature({ type: "MultiPoint", coordinates: positions })]), [0, 1, 2, 2]);
assert.throws(() => geometry.bounds([feature({ type: "MultiPoint", coordinates: positions }), feature({ type: "Point", coordinates: [0, 2] })]), RangeError);
assert.throws(() => geometry.bounds([feature({ type: "GeometryCollection", geometries: [
  { type: "MultiPoint", coordinates: positions }, { type: "Point", coordinates: [0, 2] },
] })]), RangeError);
const nulls = Array.from({ length: 10000 }, () => feature(null));
assert.equal(geometry.bounds(nulls), undefined);
assert.throws(() => geometry.bounds([...nulls, feature(null)]), RangeError);
const depth = (containers: number): Readonly<Record<string, PlanarJson>> => {
  let result: Readonly<Record<string, PlanarJson>> = { value: null };
  for (let index = 1; index < containers; index++) result = { value: result };
  return result;
};
assert.equal(geometry.bounds([feature(null, depth(32))]), undefined);
assert.throws(() => geometry.bounds([feature(null, depth(33))]), RangeError);
// root record(1) + array(1) + 99998 scalar leaves =100000 nodes.
assert.equal(geometry.bounds([feature(null, { values: Array.from({ length: 99998 }, () => 0) })]), undefined);
assert.throws(() => geometry.bounds([feature(null, { values: Array.from({ length: 99999 }, () => 0) })]), RangeError);
// U5 proposed occurrence accounting: same acyclic alias twice still costs two traversals.
const smallAlias = { note: "shared" };
assert.equal(geometry.bounds([feature(null, { first: smallAlias, second: smallAlias })]), undefined);
const largeAlias = Array.from({ length: 49999 }, () => 0);
// root(1) + 2*(array(1)+49999 numbers)=100001 occurrences.
assert.throws(() => geometry.bounds([feature(null, { first: largeAlias, second: largeAlias })]), RangeError);
assert.equal(largeAlias.length, 49999);
// Separate calls have separate budgets, and failed validation never poisons later queries.
assert.deepEqual(geometry.bounds([feature({ type: "Point", coordinates: [3, 4] })]), [3, 3, 4, 4]);
assert.equal(geometry.contains(regular(5), { x: 0, y: 0 }, { boundary: "exclude" }), true);
console.log("planar proposal 05: proposed exact planar budget accounting and positive witnesses");
