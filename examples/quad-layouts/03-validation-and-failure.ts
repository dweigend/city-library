import assert from "node:assert/strict";
import { Random, topology, type PlanarPolygon, type PlanarXY } from "city-library";

const layout = distortedPatch([1.177, 1.739]);

const safeStep = topology.relax({
  layout,
  method: "squareTarget",
  iterations: 1,
});

console.log(safeStep.polygon({ cell: 0 }));

// The full step and its first halving would invert a corner. Attempt2 (base/4)
// is valid: summed center force * base is (.2861875,-.38625), so the accepted
// interior position is (1.248546875,1.6424375). Boundary vertices stay fixed.
const expectedCenter: PlanarXY = [1.248546875, 1.6424375];
const oldRing = layout.polygon({ cell: 0 }).coordinates[0]!;
const movedRing = safeStep.polygon({ cell: 0 }).coordinates[0]!;
assert.ok(movedRing.some(([x, y]) => Math.abs(x - expectedCenter[0]) < 1e-12 && Math.abs(y - expectedCenter[1]) < 1e-12));
for (const point of oldRing) {
  if (point[0] === 1.177 && point[1] === 1.739) continue;
  assert.ok(movedRing.some(([x, y]) => x === point[0] && y === point[1]));
}

// All 17 bounded candidates invert a corner in this admissible source fixture.
// Failure must not publish a partial result or change old polygon snapshots.
const exhausted = distortedPatch([1.304019824210452, 1.5675690077264486]);
const beforeFailure = exhausted.cells.map(cell => exhausted.polygon({ cell }));
assert.throws(() => topology.relax({ layout: exhausted, method: "squareTarget", iterations: 1 }), RangeError);
assert.deepEqual(exhausted.cells.map(cell => exhausted.polygon({ cell })), beforeFailure);

const random = Random.create({ seed: 7 });
const initial = random.state;
for (const options of [
  { rings: 0, random }, { rings: 8, random }, { rings: 1.5, random },
  { rings: 1, edgeLength: 0, random }, { rings: 1, edgeLength: 2 ** -401, random },
  { rings: 3, edgeLength: 1e6, random }, { rings: 1, edgeLength: Infinity, random },
  { rings: 1, edgeLength: undefined, random }, { rings: 1, random: {} },
  { rings: 1, boundary: {}, random }, { rings: 1, pointSpacing: 1, random },
  { rings: 1, relaxationIterations: 2, random },
]) {
  assert.throws(() => topology.quadrilaterals(options as never));
  assert.deepEqual(random.state, initial);
}
const source = topology.square({ columns: 2, rows: 2 });
for (const options of [
  { layout: source, method: "squareTarget", iterations: -1 },
  { layout: source, method: "squareTarget", iterations: 257 },
  { layout: source, method: "squareTarget", iterations: 0.5 },
  { layout: source, method: "lloyd", iterations: 1 },
  { layout: source, method: "squareTarget", iterations: 1, random },
  { layout: source, method: "squareTarget", iterations: 1, strength: 0.5 },
]) assert.throws(() => topology.relax(options as never));

const triangle = shape([[0, 0], [2, 0], [0, 2]]);
const concave = shape([[0, 0], [2, 0], [0.5, 0.5], [0, 2]]);
const nearDegenerate = shape([[0, 0], [1, 0], [1, 1e-14], [0, 1e-14]]);
for (const polygon of [triangle, concave, nearDegenerate]) {
  const unsupported = topology.fromPolygons({ polygons: [polygon] });
  const before = unsupported.polygon({ cell: 0 });
  assert.throws(() => topology.relax({ layout: unsupported, method: "squareTarget", iterations: 0 }), RangeError);
  assert.deepEqual(unsupported.polygon({ cell: 0 }), before);
}
// Importer constraints are separate from square-target constraints.
assert.throws(() => topology.fromPolygons({ polygons: [
  shape([[0, 0], [2, 0], [2, 2], [0, 2]]),
  shape([[2, 0], [3, 0], [3, 1], [2, 1]]),
] }), RangeError); // Partial edge/T-junction.
assert.throws(() => topology.fromPolygons({ polygons: [
  shape([[0, 0], [1, 0], [1, 1], [0, 1]]),
  shape([[1, 0], [2, 0], [2, 1], [1, 1]]),
  shape([[1, 0], [2, -1], [2, 2], [1, 1]]),
] }), RangeError); // Three owners of one edge cannot be admitted.
assert.deepEqual(random.state, initial);

function distortedPatch(center: PlanarXY) {
  const points: PlanarXY[] = [
    [4.82, 3.07], [0.572, 2.896], [-1.303, 1.126],
    [9.004, -2.047], center, [-0.247, 0.027],
    [1.172, -1.081], [-0.042, -0.100], [-1.122, -1.438],
  ];
  const faces = [[0, 1, 4, 3], [1, 2, 5, 4], [3, 4, 7, 6], [4, 5, 8, 7]];
  const polygons = faces.map(face => shape(face.map(index => points[index]!)));
  return topology.fromPolygons({ polygons });
}
function shape(points: readonly PlanarXY[]): PlanarPolygon {
  return { type: "Polygon", coordinates: [[...points, points[0]!]] };
}
