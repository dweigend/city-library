// UNFROZEN POST-ADVISORY PROPOSAL. Source bytes/grouping are offline fixtures,
// not a delivered SHP/GeoJSON decoder, successful source GIS Setup or CRS transform.
import assert from "node:assert/strict";
import { geometry, type Bounds, type PlanarDataset, type PlanarFeature, type PlanarPolygon, type PlanarXY } from "city-library";
import fixtures from "./post-advisory-source-fixtures.json";

const before = JSON.stringify(fixtures);
for (const source of [fixtures.russiaLargest, fixtures.westBank]) {
  // The retained extraction checks these exact original binary64 XY pairs.
  const polygon: PlanarPolygon = { type: "Polygon", coordinates: source.coordinates as readonly (readonly PlanarXY[])[] };
  const feature: PlanarFeature = { type: "Feature", id: source.record, geometry: polygon, properties: { name: source.historicalName } };
  assert.equal(polygon.coordinates.reduce((sum: number, ring: readonly PlanarXY[]) => sum + ring.length, 0), source.positionsIncludingClosures);
  assert.deepEqual(geometry.bounds([feature]), source.bounds);
  assert.equal(geometry.contains(polygon, source.strictInterior, { boundary: "exclude" }), true);
  const vertex = polygon.coordinates[0]![0]!;
  assert.equal(geometry.contains(polygon, { x: vertex[0], y: vertex[1] }, { boundary: "include" }), true);
  assert.equal(geometry.contains(polygon, { x: vertex[0], y: vertex[1] }, { boundary: "exclude" }), false);
  assert.equal(geometry.contains(polygon, { x: -999, y: -999 }, { boundary: "exclude" }), false);
  if (source.holeInterior !== null) {
    assert.equal(geometry.contains(polygon, source.holeInterior, { boundary: "include" }), false);
    assert.equal(geometry.contains(polygon, source.holeInterior, { boundary: "exclude" }), false);
  }
}
assert.equal(fixtures.russiaLargest.positionsIncludingClosures, 1282);
assert.equal(fixtures.westBank.positionsIncludingClosures, 11); // shell7 + hole4
// A SHP record is not a Polygon: Canada's3316 positions form126 Polygon members.
const canada: PlanarDataset = {
  coordinateSystem: { crs: "source:WGS_84_Geographic", units: "degree" },
  features: [{ type: "Feature", properties: { name: "Canada" }, geometry: {
    type: "MultiPolygon", coordinates: fixtures.canada.coordinates as readonly (readonly (readonly PlanarXY[])[])[],
  } }],
};
assert.equal(fixtures.canada.coordinates.length, 126);
assert.equal(fixtures.canada.coordinates.reduce((sum, polygon) => sum + polygon.reduce((n, ring) => n + ring.length, 0), 0), 3316);
assert.equal(Math.max(...fixtures.canada.coordinates.map(polygon => polygon.reduce((sum, ring) => sum + ring.length, 0))), 932);
assert.deepEqual(geometry.bounds(canada), fixtures.canada.bounds);

// Bounds feeds already-delivered geometry.map; its accepted five scripts are separate.
const world: PlanarDataset = {
  coordinateSystem: canada.coordinateSystem,
  features: [{ type: "Feature", properties: null, geometry: {
    type: "MultiPoint", coordinates: [[-180, -90], [180, 90]],
  } }],
};
// Explicit raster-header outer-envelope fixture, not two stored Point features.
const envelope: Bounds | undefined = geometry.bounds(world);
assert.deepEqual(envelope, [-180, 180, -90, 90]);
assert.ok(envelope);
const patchOuter: Bounds = [-72.5, 72.5, -36.5, 36.5];
assert.deepEqual(geometry.map({ x: 0, y: 0 }, { from: envelope, to: patchOuter }), { x: 0, y: 0 });
const city: PlanarFeature = { type: "Feature", properties: { NAME: "Murmansk" }, geometry: {
  type: "Point", coordinates: [33.08604049682617, 68.96354675292969],
} };
assert.deepEqual(geometry.bounds([city]), [33.08604049682617, 33.08604049682617, 68.96354675292969, 68.96354675292969]);
const mapped = geometry.map({ x: 33.08604049682617, y: 68.96354675292969 }, { from: envelope, to: patchOuter, mode: "independent-axes" });
assert.ok(Math.abs(mapped.x - 13.326321866777208) < 1e-12);
assert.ok(Math.abs(mapped.y - 27.968549516465927) < 1e-12);
assert.deepEqual(world.coordinateSystem, { crs: "source:WGS_84_Geographic", units: "degree" });
assert.equal(JSON.stringify(fixtures), before);
console.log("planar proposal 03: exact source Polygon/MultiPolygon fixtures, bounds and existing-map consumer");
