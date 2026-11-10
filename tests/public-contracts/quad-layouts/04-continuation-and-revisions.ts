import assert from "node:assert/strict";
import { Random, topology, type Layout } from "city-library";

const random = Random.create({ seed: 7 });
const initial = random.state;
const first = topology.quadrilaterals({ rings: 3, random });
const afterPairing = random.state;

random.state = initial;

const replay = topology.quadrilaterals({ rings: 3, random });
const advanced = topology.quadrilaterals({ rings: 3, random });
const beforeRelaxation = random.state;
const zero = topology.relax({ layout: first, method: "squareTarget", iterations: 0 });
const relaxed = topology.relax({ layout: first, method: "squareTarget", iterations: 4 });

console.log({ replayedCells: replay.cells.length, relaxedCells: relaxed.cells.length });

// A separate public stream verifies exact continuation, not merely same seeds.
// 9*r²-3*r internal candidate edges; descending Fisher-Yates uses E-1 draws.
const oracle = Random.create({ seed: 7 });
for (let draw = 0; draw < 71; draw++) oracle.raw({ kind: "double" });
assert.deepEqual(afterPairing, oracle.state);
const resumed = Random.create({ seed: 99 });
resumed.state = afterPairing;
assert.equal(resumed.raw({ kind: "double" }), oracle.raw({ kind: "double" }));
assert.deepEqual(snapshot(replay), snapshot(first));
assert.notDeepEqual(snapshot(advanced), snapshot(first));
assert.deepEqual(random.state, beforeRelaxation);

const oldPolygons = snapshot(first);
const oldNeighbors = first.cells.map(cell => first.neighbors({ cell }));
const neighbor = first.neighbors({ cell: 0 })[0]!;
const oldBoundary = first.sharedBoundary({ firstCell: 0, secondCell: neighbor });
const anotherRevision = topology.relax({ layout: first, method: "squareTarget", iterations: 1 });
assert.notEqual(zero, first);
assert.deepEqual(snapshot(zero), oldPolygons);
assert.notEqual(zero.polygon({ cell: 0 }), first.polygon({ cell: 0 }));
assert.deepEqual(snapshot(first), oldPolygons);
assert.deepEqual(first.cells.map(cell => first.neighbors({ cell })), oldNeighbors);
assert.deepEqual(first.sharedBoundary({ firstCell: 0, secondCell: neighbor }), oldBoundary);
assert.deepEqual(anotherRevision.cells, first.cells);
for (const layout of [first, zero, relaxed, anotherRevision]) {
  assert.deepEqual(layout.cells, first.cells);
  assert.deepEqual(layout.cells.map(cell => layout.neighbors({ cell })), oldNeighbors);
  assert.equal(Object.isFrozen(layout), true);
  assert.equal(Object.isFrozen(layout.cells), true);
  assert.equal(Object.isFrozen(layout.polygon({ cell: 0 }).coordinates[0]![0]), true);
}

function snapshot(layout: Layout) {
  return layout.cells.map(cell => layout.polygon({ cell }));
}
