import assert from "node:assert/strict";
import { topology, type PlanarPolygon, type PlanarXY } from "city-library";

const center: PlanarXY = [1.25, 0.75];
const polygons = squarePatch(center);
const original = topology.fromPolygons({ polygons });

const relaxed = topology.relax({
  layout: original,
  method: "square-target",
  iterationCount: 1,
});

console.log(relaxed.polygon({ cell: 0 }));

// Each face contributes -(centerOffset)/2 at the shared vertex. Summing four
// faces gives (-1/2,+1/2). Maximum valence=4, scale=1/(2*4), so the first
// simultaneous update is (1.25,.75)+(-.5,.5)/8=(1.1875,.8125).
const expected = squarePatch([1.1875, 0.8125]);
for (const cell of original.cells) {
  assert.deepEqual(vertexSet(relaxed.polygon({ cell })), vertexSet(expected[cell]!));
  assert.deepEqual(original.polygon({ cell }), polygons[cell]);
  assert.deepEqual(relaxed.neighbors({ cell }), original.neighbors({ cell }));
}

// Reverse winding and rotate the start: the same geometry must move identically.
const alternate = polygons.map(shape => {
  const points = shape.coordinates[0]!;
  return close([points[2]!, points[1]!, points[0]!, points[3]!]);
});
const equivalent = topology.relax({ layout: topology.fromPolygons({ polygons: alternate }), method: "square-target", iterationCount: 1 });
for (const cell of relaxed.cells) assert.deepEqual(vertexSet(equivalent.polygon({ cell })), vertexSet(relaxed.polygon({ cell })));

// Four rotated squares have a movable shared interior vertex. Their fixed point
// is nonvacuous: unlike a lone square, not every vertex is pinned by boundary.
const rotatedSquares = squarePatch([1, 1]).map(rotate);
const stationary = topology.relax({ layout: topology.fromPolygons({ polygons: rotatedSquares }), method: "square-target", iterationCount: 8 });
for (const cell of stationary.cells) assert.deepEqual(vertexSet(stationary.polygon({ cell })), vertexSet(rotatedSquares[cell]!));
assert.deepEqual(relaxed.cells, original.cells);
assert.notEqual(relaxed, original);

function squarePatch(center: PlanarXY): PlanarPolygon[] {
  return [
    close([[0, 0], [1, 0], center, [0, 1]]),
    close([[1, 0], [2, 0], [2, 1], center]),
    close([[0, 1], center, [1, 2], [0, 2]]),
    close([center, [2, 1], [2, 2], [1, 2]]),
  ];
}
function close(points: readonly PlanarXY[]): PlanarPolygon {
  return { type: "Polygon", coordinates: [[...points, points[0]!]] };
}
function rotate(shape: PlanarPolygon): PlanarPolygon {
  return { type: "Polygon", coordinates: shape.coordinates.map(ring => ring.map(([x, y]) => [x - y, x + y] as const)) };
}
function vertexSet(shape: PlanarPolygon): string {
  return JSON.stringify([...shape.coordinates[0]!.slice(0, -1)].sort(([ax, ay], [bx, by]) => ax - bx || ay - by));
}
