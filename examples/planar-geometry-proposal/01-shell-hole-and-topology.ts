// PROPOSAL ONLY: root acceptance and contract resolution must precede runtime work.
import assert from "node:assert/strict";
import { geometry, type PlanarPolygon, type PlanarXY } from "city-library";

const exterior: readonly PlanarXY[] = Object.freeze([
  [0, 0], [12, 0], [12, 10], [0, 10], [0, 0],
].map(point => Object.freeze(point) as PlanarXY));
const hole: readonly PlanarXY[] = Object.freeze([
  [3, 3], [7, 3], [7, 7], [3, 7], [3, 3],
].map(point => Object.freeze(point) as PlanarXY));
const polygon: PlanarPolygon = Object.freeze({
  type: "Polygon", coordinates: Object.freeze([exterior, hole]),
});
const before = JSON.stringify(polygon);
for (const [point, expected] of [
  [{ x: 1, y: 1 }, true], [{ x: 10, y: 8 }, true],
  [{ x: 5, y: 5 }, false], [{ x: -1, y: 4 }, false],
] as const) {
  assert.equal(geometry.contains(polygon, point, { boundary: "include" }), expected);
  assert.equal(geometry.contains(polygon, point, { boundary: "exclude" }), expected);
}
// Hole edges and vertices are polygon boundary, not hole interior.
for (const point of [{ x: 0, y: 5 }, { x: 12, y: 10 }, { x: 3, y: 5 }, { x: 7, y: 7 }]) {
  assert.equal(geometry.contains(polygon, point, { boundary: "include" }), true);
  assert.equal(geometry.contains(polygon, point, { boundary: "exclude" }), false);
}
const reversed: PlanarPolygon = {
  type: "Polygon", coordinates: [exterior.toReversed(), hole.toReversed()],
};
for (const point of [{ x: 1, y: 1 }, { x: 5, y: 5 }, { x: 3, y: 5 }]) {
  for (const boundary of ["include", "exclude"] as const) {
    assert.equal(geometry.contains(reversed, point, { boundary }), geometry.contains(polygon, point, { boundary }));
  }
}
// Invalid topology must fail even if the queried point is far outside the envelope.
const invalid: readonly PlanarPolygon[] = [
  { type: "Polygon", coordinates: [[[0, 0], [8, 8], [0, 8], [8, 0], [0, 0]]] }, // self-crossing
  { type: "Polygon", coordinates: [exterior, [[0, 2], [2, 2], [2, 4], [0, 4], [0, 2]]] }, // shell touch
  { type: "Polygon", coordinates: [exterior, hole, [[7, 4], [9, 4], [9, 6], [7, 6], [7, 4]]] }, // holes touch
  { type: "Polygon", coordinates: [exterior, hole, [[4, 4], [6, 4], [6, 6], [4, 6], [4, 4]]] }, // nested holes
  { type: "Polygon", coordinates: [exterior, hole, [[6, 4], [9, 4], [9, 8], [6, 8], [6, 4]]] }, // overlap
  { type: "Polygon", coordinates: [exterior, [[13, 2], [15, 2], [15, 4], [13, 4], [13, 2]]] }, // exterior hole
  { type: "Polygon", coordinates: [[[0, 0], [3, 0], [3, 0], [0, 3], [0, 0]]] }, // zero-length edge
  { type: "Polygon", coordinates: [[[0, 0], [1, 0], [2, 0], [0, 0]]] }, // collinear
  { type: "Polygon", coordinates: [[[0, 0], [2, 0], [0, 2], [1, 1]]] }, // unclosed
];
for (const candidate of invalid) {
  const unchanged = JSON.stringify(candidate);
  assert.throws(() => geometry.contains(candidate, { x: 100, y: 100 }, { boundary: "exclude" }));
  assert.throws(() => geometry.bounds([{ type: "Feature", geometry: candidate, properties: null }]));
  assert.equal(JSON.stringify(candidate), unchanged);
}
assert.equal(JSON.stringify(polygon), before);
console.log("planar proposal 01: shell/hole membership, boundaries, winding and topology");
