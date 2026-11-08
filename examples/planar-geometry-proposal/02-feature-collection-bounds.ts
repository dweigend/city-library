// UNFROZEN POST-ADVISORY PROPOSAL. Planar types and bounds are missing; map is delivered.
import assert from "node:assert/strict";
import { geometry, type Bounds, type PlanarDataset, type PlanarFeature, type PlanarGeometry, type PlanarJson } from "city-library";

const feature = (shape: PlanarGeometry | null, id: string): PlanarFeature => ({
  type: "Feature", id, geometry: shape, properties: { provenance: "synthetic exact XY fixture" },
});
const shapes: readonly PlanarGeometry[] = [
  { type: "Point", coordinates: [-4, 5] },
  { type: "MultiPoint", coordinates: [[7, -9], [8, 2]] },
  { type: "LineString", coordinates: [[-8, 3], [2, 4]] },
  { type: "MultiLineString", coordinates: [[[1, 6], [2, 7]], [[3, -2], [4, -1]]] },
  { type: "Polygon", coordinates: [[[0, 0], [2, 0], [2, 2], [0, 2], [0, 0]]] },
  { type: "MultiPolygon", coordinates: [
    [[[10, 10], [12, 10], [12, 12], [10, 12], [10, 10]]],
    [[[14, 0], [16, 0], [16, 2], [14, 2], [14, 0]]],
  ] },
  { type: "GeometryCollection", geometries: [
    { type: "Point", coordinates: [0, 20] },
    { type: "GeometryCollection", geometries: [{ type: "MultiPoint", coordinates: [[-20, 0], [0, -12]] }] },
  ] },
];
const expected: readonly Bounds[] = [
  [-4, -4, 5, 5], [7, 8, -9, 2], [-8, 2, 3, 4], [1, 4, -2, 7],
  [0, 2, 0, 2], [10, 16, 0, 12], [-20, 0, -12, 20],
];
for (const [index, shape] of shapes.entries()) {
  assert.deepEqual(geometry.bounds([feature(shape, String(index))]), expected[index]);
}
const features: readonly PlanarFeature[] = shapes.map((shape, i) => feature(shape, String(i)));
const dataset: PlanarDataset = {
  features, coordinateSystem: { crs: "model:synthetic-plane", units: "abstract-unit" },
};
const before = JSON.stringify(dataset);
assert.deepEqual(geometry.bounds(dataset), [-20, 16, -12, 20]);
assert.deepEqual(geometry.bounds(features), [-20, 16, -12, 20]);
assert.equal(JSON.stringify(dataset), before);
for (const shape of [
  { type: "MultiPoint", coordinates: [] },
  { type: "MultiLineString", coordinates: [] },
  { type: "MultiPolygon", coordinates: [] },
  { type: "GeometryCollection", geometries: [] },
] as const satisfies readonly PlanarGeometry[]) {
  assert.equal(geometry.bounds([feature(shape, "empty")]), undefined);
}
assert.equal(geometry.bounds([]), undefined);
assert.equal(geometry.bounds([feature(null, "null")]), undefined);
assert.equal(geometry.bounds({ features: [], coordinateSystem: { crs: "model:empty", units: "m" } }), undefined);
// Ordinary JSON properties are data; they do not enlarge the coordinate envelope.
const properties: Readonly<Record<string, PlanarJson>> = { coordinates: [999, -999], nested: { x: 300, y: 400 }, valid: true, missing: null };
assert.deepEqual(geometry.bounds([{ type: "Feature", geometry: { type: "Point", coordinates: [2, 3] }, properties }]), [2, 2, 3, 3]);
for (const malformed of [
  { type: "Point", coordinates: [1, 2, 0] },
  { type: "Point", coordinates: ["1", 2] },
  { type: "LineString", coordinates: [[0, 0]] },
] as unknown as readonly PlanarGeometry[]) {
  assert.throws(() => geometry.bounds([feature(malformed, "bad-shape")]), TypeError);
}
for (const value of [NaN, Infinity, -Infinity]) {
  assert.throws(() => geometry.bounds([feature({ type: "Point", coordinates: [0, value] }, "nonfinite")]));
}
// Returned data are detached; caller edits after observation cannot rewrite that result.
const point: [number, number] = [4, 6];
const observed = geometry.bounds([feature({ type: "Point", coordinates: point }, "detached")]);
assert.deepEqual(observed, [4, 4, 6, 6]);
point[0] = 50;
assert.deepEqual(observed, [4, 4, 6, 6]);
assert.deepEqual(geometry.bounds([feature({ type: "Point", coordinates: point }, "fresh")]), [50, 50, 6, 6]);
console.log("planar proposal 02: every geometry family, empty/null and detached bounds");

// Pure bounds does not inherit codec/containment cardinality or magnitude caps.
assert.deepEqual(geometry.bounds([feature({ type: "Point", coordinates: [-Number.MAX_VALUE, Number.MAX_VALUE] }, "finite-extreme")]), [-Number.MAX_VALUE, -Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE]);
assert.equal(geometry.bounds(Array.from({ length: 10001 }, () => feature(null, "no-positions"))), undefined);
const repeated = Array.from({ length: 100001 }, () => [2, 3] as const);
assert.deepEqual(geometry.bounds([feature({ type: "MultiPoint", coordinates: repeated }, "uncapped-query")]), [2, 2, 3, 3]);
// Members may overlap: per-Polygon topology does not invent a global partition rule.
const square = shapes[4]!;
assert.equal(square.type, "Polygon");
if (square.type === "Polygon") assert.deepEqual(geometry.bounds([feature({ type: "MultiPolygon", coordinates: [square.coordinates, square.coordinates] }, "overlapping-members")]), [0, 2, 0, 2]);
