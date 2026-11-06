// UNFROZEN CANDIDATE U3/U4: closure-inclusive polygonPositions across shell+holes.
// Root must choose this counting policy before freezing. No bounds/map adapter caps
// or property-node/depth arithmetic are asserted by this script.
import assert from "node:assert/strict";
import { geometry, type PlanarPolygon, type PlanarXY } from "city-library";

// Exact integer rectangle with collinear forward subdivisions, not trig-generated data.
const rectangle = (positions: number): PlanarPolygon => {
  const bottom: PlanarXY[] = Array.from({ length: positions - 3 }, (_, x) => [x, 0]);
  return { type: "Polygon", coordinates: [[...bottom, [positions - 4, 4], [0, 4], [0, 0]]] };
};
const atCap = rectangle(2048);
assert.equal(atCap.coordinates[0]!.length, 2048);
assert.equal(geometry.contains(atCap, { x: 1, y: 1 }, { boundary: "exclude" }), true);
assert.equal(geometry.contains(atCap, { x: 0, y: 2 }, { boundary: "include" }), true);
const tooMany = rectangle(2049);
assert.throws(() => geometry.contains(tooMany, { x: -1, y: -1 }, { boundary: "exclude" }), RangeError);

// Candidate U4 aggregates all rings, including each closing tuple, for one Polygon.
const hole: readonly PlanarXY[] = [[2, 1], [3, 1], [3, 2], [2, 2], [2, 1]];
const combined: PlanarPolygon = { type: "Polygon", coordinates: [rectangle(2043).coordinates[0]!, hole] };
assert.equal(combined.coordinates.reduce((sum: number, ring: readonly PlanarXY[]) => sum + ring.length, 0), 2048);
assert.equal(geometry.contains(combined, { x: 1, y: 1 }, { boundary: "exclude" }), true);
assert.equal(geometry.contains(combined, { x: 2.5, y: 1.5 }, { boundary: "exclude" }), false);
const combinedOver: PlanarPolygon = { type: "Polygon", coordinates: [rectangle(2044).coordinates[0]!, hole] };
assert.throws(() => geometry.contains(combinedOver, { x: -1, y: -1 }, { boundary: "exclude" }), RangeError);

// Existing coordinateMagnitude applies to containment; no extension to bounds/map.
const edge: PlanarPolygon = { type: "Polygon", coordinates: [[
  [999999998, 0], [1000000000, 0], [1000000000, 2], [999999998, 2], [999999998, 0],
]] };
assert.equal(geometry.contains(edge, { x: 999999999, y: 1 }, { boundary: "exclude" }), true);
const beyond: PlanarPolygon = { type: "Polygon", coordinates: [[
  [999999999, 0], [1000000001, 0], [1000000001, 2], [999999999, 2], [999999999, 0],
]] };
assert.throws(() => geometry.contains(beyond, { x: 0, y: 0 }, { boundary: "exclude" }), RangeError);
// Limits and failure bookkeeping must not poison a later unrelated call.
assert.equal(geometry.contains(rectangle(5), { x: 0.5, y: 1 }, { boundary: "exclude" }), true);
console.log("planar proposal 05: candidate containment-only count accounting; no inferred bounds/map caps");
