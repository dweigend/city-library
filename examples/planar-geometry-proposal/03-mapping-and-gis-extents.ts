// PROPOSAL ONLY. Exact small source facts are documented in source-fixtures.json.
import assert from "node:assert/strict";
import { geometry, type Bounds, type PlanarDataset } from "city-library";

const close = (actual: number, expected: number) => assert.ok(Math.abs(actual - expected) <= 1e-12, `${actual} != ${expected}`);
const from: Bounds = Object.freeze([0, 10, 0, 20]);
const to: Bounds = Object.freeze([-20, 20, -20, 20]);
const point = Object.freeze({ x: 0, y: 0 });
// Uniform scale=2, horizontal padding=10; independent scales=4 and2.
assert.deepEqual(geometry.map(point, { from, to }), { x: -10, y: -20 });
assert.deepEqual(geometry.map({ x: 5, y: 10 }, { from, to }), { x: 0, y: 0 });
assert.deepEqual(geometry.map({ x: 10, y: 20 }, { from, to, mode: "uniform-centered" }), { x: 10, y: 20 });
assert.deepEqual(geometry.map(point, { from, to, mode: "independent-axes" }), { x: -20, y: -20 });
assert.deepEqual(geometry.map({ x: 10, y: 20 }, { from, to, mode: "independent-axes" }), { x: 20, y: 20 });
assert.deepEqual(geometry.map({ x: 20, y: 30 }, { from, to }), { x: 30, y: 40 });
assert.deepEqual(geometry.map({ x: 20, y: 30 }, { from, to, mode: "independent-axes" }), { x: 60, y: 40 });
const mapped = geometry.map(point, { from, to });
assert.notEqual(mapped, point);
assert.deepEqual(point, { x: 0, y: 0 });
assert.deepEqual(from, [0, 10, 0, 20]);
assert.deepEqual(to, [-20, 20, -20, 20]);
for (const invalid of [[0, 0, 0, 1], [0, 1, 3, 3], [2, 1, 0, 1]] as const) {
  assert.throws(() => geometry.map(point, { from: invalid, to }), RangeError);
  assert.throws(() => geometry.map(point, { from, to: invalid }), RangeError);
}
// Real retained world raster header: lower-left(-180,-90),360x180,1degree cells.
// These two explicit corner points are an audited envelope fixture, not decoded SHP/ASC.
const world: PlanarDataset = {
  coordinateSystem: { crs: "source:WGS_84_Geographic", units: "degree" },
  features: [{ type: "Feature", properties: null, geometry: {
    type: "MultiPoint", coordinates: [[-180, -90], [180, 90]],
  } }],
};
const worldBounds = geometry.bounds(world);
assert.deepEqual(worldBounds, [-180, 180, -90, 90]);
assert.ok(worldBounds);
// NetLogo patch-center range is ±72/±36; whole-cell outer extent is ±72.5/±36.5.
const patchOuter: Bounds = [-72.5, 72.5, -36.5, 36.5];
assert.deepEqual(geometry.map({ x: 0, y: 0 }, { from: worldBounds, to: patchOuter }), { x: 0, y: 0 });
const north = geometry.map({ x: 0, y: 90 }, { from: worldBounds, to: patchOuter });
close(north.x, 0); close(north.y, 36.25); // uniform fit leaves .25 margin vertically
assert.deepEqual(geometry.map({ x: 180, y: 90 }, { from: worldBounds, to: patchOuter, mode: "independent-axes" }), { x: 72.5, y: 36.5 });
// Exact retained point record1: Murmansk; geometry is directly sourced, not runtime-decoded.
const city: PlanarDataset = {
  coordinateSystem: world.coordinateSystem,
  features: [{ type: "Feature", properties: { NAME: "Murmansk" }, geometry: {
    type: "Point", coordinates: [33.08604049682617, 68.96354675292969],
  } }],
};
assert.deepEqual(geometry.bounds(city), [33.08604049682617, 33.08604049682617, 68.96354675292969, 68.96354675292969]);
const cityPosition = geometry.map({ x: 33.08604049682617, y: 68.96354675292969 }, { from: worldBounds, to: patchOuter, mode: "independent-axes" });
close(cityPosition.x, 13.326321866777208); close(cityPosition.y, 27.968549516465927);
assert.deepEqual(world.coordinateSystem, { crs: "source:WGS_84_Geographic", units: "degree" });
console.log("planar proposal 03: affine map, outside points and exact source envelope");
