// PROPOSAL ONLY: own-data validation policy U2 must be explicitly accepted.
import assert from "node:assert/strict";
import { geometry, Random, World, type Bounds, type PlanarDataset, type PlanarFeature, type PlanarGeometry, type PlanarPolygon } from "city-library";

const triangle: PlanarPolygon = { type: "Polygon", coordinates: [[[0, 0], [4, 0], [0, 4], [0, 0]]] };
const from: Bounds = [0, 10, 0, 10];
const features = (shape: PlanarGeometry | null, properties: unknown = null): readonly PlanarFeature[] => [
  { type: "Feature", geometry: shape, properties } as PlanarFeature,
];
const random = Random.add({ seed: 46 }), world = World.add({ random });
const randomBefore = random.state, tickBefore = world.tick.value;
for (let index = 0; index < 10; index++) {
  assert.equal(geometry.contains(triangle, { x: 1, y: 1 }, { boundary: "include" }), true);
  assert.deepEqual(geometry.bounds(features(triangle)), [0, 4, 0, 4]);
  assert.deepEqual(geometry.map({ x: 1, y: 2 }, { from, to: [-5, 5, -5, 5] }), { x: -4, y: -3 });
}
for (const coordinate of [NaN, Infinity, -Infinity]) {
  assert.throws(() => geometry.contains(triangle, { x: coordinate, y: 1 }));
  assert.throws(() => geometry.bounds(features({ type: "Point", coordinates: [0, coordinate] })));
  assert.throws(() => geometry.map({ x: 1, y: coordinate }, { from, to: from }));
}
assert.throws(() => geometry.contains(triangle, { x: 1, y: 1, z: 0 } as { x: number; y: number }), TypeError);
assert.throws(() => geometry.bounds(features({ type: "Point", coordinates: [1, 2, 0] } as unknown as PlanarGeometry)), TypeError);
assert.throws(() => geometry.bounds(features({ type: "LineString", coordinates: [[0, 0]] })), TypeError);
assert.throws(() => geometry.bounds(features({ type: "Point", coordinates: ["1", 2] } as unknown as PlanarGeometry)), TypeError);
assert.throws(() => geometry.contains(triangle, { x: 1, y: 1 }, { boundary: "nearest" } as unknown as { boundary: "include" }), TypeError);
assert.throws(() => geometry.map({ x: 1, y: 2 }, { from, to: from, mode: "clip" } as unknown as { from: Bounds; to: Bounds }), TypeError);
assert.throws(() => geometry.map({ x: 1, y: 2 }, { from: [0, 10, 0], to: from } as unknown as { from: Bounds; to: Bounds }), TypeError);
assert.throws(() => geometry.bounds({ features: [], coordinateSystem: { crs: "", units: "degree" } } as PlanarDataset), TypeError);
assert.throws(() => geometry.bounds(features(null, { score: NaN })));
assert.throws(() => geometry.bounds(features(null, { observed: new Date(0) })), TypeError);
assert.throws(() => geometry.bounds(features(null, { missing: undefined })), TypeError);
const cycle: Record<string, unknown> = {}; cycle.self = cycle;
assert.throws(() => geometry.bounds(features(null, cycle)), TypeError);
const geometricCycle: { type: "GeometryCollection"; geometries: PlanarGeometry[] } = { type: "GeometryCollection", geometries: [] };
geometricCycle.geometries.push(geometricCycle);
assert.throws(() => geometry.bounds(features(geometricCycle)), TypeError);
// PROPOSED U2: reject accessors before executing them, even when no coordinates exist.
let reads = 0;
const badPoint = Object.defineProperty({ y: 1 }, "x", { enumerable: true, get() { reads++; return 1; } });
assert.throws(() => geometry.contains(triangle, badPoint as { x: number; y: number }), TypeError);
const badProperty = Object.defineProperty({}, "value", { enumerable: true, get() { reads++; return 1; } });
assert.throws(() => geometry.bounds(features(null, badProperty)), TypeError);
const badOptions = Object.defineProperty({ from }, "to", { enumerable: true, get() { reads++; return from; } });
assert.throws(() => geometry.map({ x: 1, y: 1 }, badOptions as { from: Bounds; to: Bounds }), TypeError);
assert.equal(reads, 0);
class Coordinates { x = 1; y = 1; }
assert.throws(() => geometry.contains(triangle, new Coordinates()), TypeError);
assert.throws(() => geometry.bounds(features(null, { [Symbol("hidden")]: 1 })), TypeError);
// Proposed own-data records still allow null prototypes and safe JSON data spellings.
const plain = Object.assign(Object.create(null) as { x: number; y: number }, { x: 1, y: 1 });
assert.equal(geometry.contains(triangle, plain, { boundary: "exclude" }), true);
const safe = JSON.parse('{"__proto__":{"polluted":true},"constructor":"metadata"}') as Record<string, unknown>;
assert.equal(geometry.bounds(features(null, safe)), undefined);
assert.equal(Object.hasOwn(Object.prototype, "polluted"), false);
assert.deepEqual(random.state, randomBefore);
assert.equal(world.tick.value, tickBefore);
assert.deepEqual(triangle.coordinates, [[[0, 0], [4, 0], [0, 4], [0, 0]]]);
console.log("planar proposal 04: finite XY, strict data validation and observational purity");
