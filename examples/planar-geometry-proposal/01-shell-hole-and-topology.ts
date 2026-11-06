// UNFROZEN POST-ADVISORY PROPOSAL. Root owns U1–U10; no runtime is authorized.
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
for (const point of [{ x: 0, y: 5 }, { x: 6, y: 0 }, { x: 12, y: 10 }, { x: 3, y: 5 }, { x: 5, y: 3 }, { x: 7, y: 7 }]) {
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
  { type: "Polygon", coordinates: [[[0, 0], [4, 0], [2, 0], [2, 3], [0, 3], [0, 0]]] }, // adjacent backtrack
  { type: "Polygon", coordinates: [[[2, 0], [4, 0], [4, 4], [0, 4], [0, 0], [3, 0], [2, 0]]] }, // closure-adjacent backtrack
  // All three hole vertices are inside this U shell; its edges cross the notch.
  { type: "Polygon", coordinates: [
    [[0, 0], [8, 0], [8, 8], [6, 8], [6, 2], [2, 2], [2, 8], [0, 8], [0, 0]],
    [[1, 7], [7, 7], [4, 1], [1, 7]],
  ] },
];
for (const candidate of invalid) {
  const unchanged = JSON.stringify(candidate);
  assert.throws(() => geometry.contains(candidate, { x: 100, y: 100 }, { boundary: "exclude" }));
  assert.throws(() => geometry.bounds([{ type: "Feature", geometry: candidate, properties: null }]));
  assert.equal(JSON.stringify(candidate), unchanged);
}
assert.equal(JSON.stringify(polygon), before);
// Forward collinear adjacent edges are allowed; backtracking is not.
const forward: PlanarPolygon = { type: "Polygon", coordinates: [
  [[0, 0], [2, 0], [4, 0], [4, 4], [0, 4], [0, 0]],
] };
assert.equal(geometry.contains(forward, { x: 2, y: 2 }, { boundary: "exclude" }), true);
assert.deepEqual(geometry.bounds([{ type: "Feature", geometry: forward, properties: null }]), [0, 4, 0, 4]);
console.log("planar proposal 01: shell/hole membership, boundaries, winding and topology");
