import assert from "node:assert/strict";
import { geometry, Random, topology, type Layout, type PlanarXY } from "city-library";

// Lengths use local XY units. Generation and scaling use independent streams.
const small = topology.quadrilaterals({ rings: 1, random: Random.create({ seed: 7 }) });
const large = topology.quadrilaterals({ rings: 3, random: Random.create({ seed: 7 }) });
const scaled = topology.quadrilaterals({ rings: 3, edgeLength: 2, random: Random.create({ seed: 7 }) });

console.log({ smallCells: small.cells.length, largeCells: large.cells.length });

// Acceptance assertions follow the author workflow. Independent source counts:
// radius1: six triangles, two pairs, two leftovers => 4*2+3*2=14;
// radius3: 54 triangles, twenty pairs, fourteen leftovers => 4*20+3*14=122.
assert.equal(small.cells.length, 14);
assert.equal(large.cells.length, 122);
assertConformingHex(small, 1);
assertConformingHex(large, 3);
for (const cell of large.cells) {
  assert.deepEqual(scaled.polygon({ cell }).coordinates[0], large.polygon({ cell }).coordinates[0]!.map(([x, y]) => [2 * x, 2 * y]));
}

// Independent small refinement oracles: a remaining triangle makes three cells;
// the rhombus from source triangles 1 and 2 makes four. No geometry is rounded.
const height = Math.sqrt(3) / 2;
const triangle: PlanarXY[] = [[-1, 0], [-0.5, -height], [0, 0]];
const rhombus: PlanarXY[] = [[-0.5, -height], [0.5, -height], [1, 0], [0, 0]];
for (const corners of [triangle, rhombus]) {
  const center: PlanarXY = [corners.reduce((sum, [x]) => sum + x, 0) / corners.length, corners.reduce((sum, [, y]) => sum + y, 0) / corners.length];
  for (let index = 0; index < corners.length; index++) {
    const corner = corners[index]!;
    const next = corners[(index + 1) % corners.length]!;
    const previous = corners[(index + corners.length - 1) % corners.length]!;
    const expected: PlanarXY[] = [corner, [(corner[0] + next[0]) / 2, (corner[1] + next[1]) / 2], center, [(previous[0] + corner[0]) / 2, (previous[1] + corner[1]) / 2]];
    const signature = vertices(expected);
    assert.ok(small.cells.some(cell => vertices(small.polygon({ cell }).coordinates[0]!.slice(0, -1)) === signature));
  }
}

function vertices(points: readonly PlanarXY[]): string {
  return JSON.stringify([...points].sort(([ax, ay], [bx, by]) => ax - bx || ay - by));
}
function assertConformingHex(layout: Layout, rings: number): void {
  const edges = new Map<string, number[]>();
  const points = new Set<string>();
  let area = 0;
  for (const cell of layout.cells) {
    const ring = layout.polygon({ cell }).coordinates[0]!;
    assert.equal(ring.length, 5);
    assert.deepEqual(ring[0], ring[4]);
    assert.equal(new Set(ring.slice(0, -1).map(point => JSON.stringify(point))).size, 4);
    area += geometry.area({ shape: layout.polygon({ cell }) });
    for (let index = 0; index < 4; index++) {
      points.add(JSON.stringify(ring[index]));
      const key = vertices([ring[index]!, ring[index + 1]!]);
      const owners = edges.get(key) ?? [];
      owners.push(cell);
      edges.set(key, owners);
    }
  }
  assert.ok(Math.abs(area - 3 * Math.sqrt(3) * rings ** 2 / 2) < 1e-10);
  assert.equal([...edges.values()].filter(owners => owners.length === 1).length, 12 * rings);
  assert.equal(points.size - edges.size + layout.cells.length, 1);
  for (const owners of edges.values()) {
    assert.ok(owners.length === 1 || owners.length === 2);
    if (owners.length === 2) {
      assert.ok(layout.neighbors({ cell: owners[0]! }).includes(owners[1]!));
      assert.equal(layout.sharedBoundary({ firstCell: owners[0]!, secondCell: owners[1]! }).length, 1);
    }
  }
  // A second, public exact-predicate admission checks global overlap/conformity.
  const admitted = topology.fromPolygons({ polygons: layout.cells.map(cell => layout.polygon({ cell })) });
  assert.deepEqual(admitted.cells, layout.cells);
}
