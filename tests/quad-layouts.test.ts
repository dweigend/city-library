import { describe, expect, test } from "bun:test";
import { Grid, Random, geometry, topology, type Layout, type PlanarPolygon, type PlanarXY } from "../index.ts";

type XY = PlanarXY;
const polygon = (corners: readonly XY[]): PlanarPolygon => ({ type: "Polygon", coordinates: [[...corners, corners[0]!]] });
const shapes = (layout: Layout): PlanarPolygon[] => layout.cells.map(cell => layout.polygon({ cell }));
const cross = (a: XY, b: XY, c: XY): number => (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]);
const coordinateKey = (point: XY): string => `${point[0]},${point[1]}`;
const edgeKey = (a: XY, b: XY): string => [coordinateKey(a), coordinateKey(b)].sort().join("/");
function area(layout: Layout): number {
  return shapes(layout).reduce((sum, shape) => sum + geometry.area({ shape }), 0);
}
function edges(layout: Layout): Map<string, { endpoints: readonly [XY, XY]; owners: number[] }> {
  const result = new Map<string, { endpoints: readonly [XY, XY]; owners: number[] }>();
  for (const cell of layout.cells) {
    const ring = layout.polygon({ cell }).coordinates[0]!;
    for (let corner = 0; corner < 4; corner++) {
      const a = ring[corner]!, b = ring[corner + 1]!, key = edgeKey(a, b);
      const entry = result.get(key);
      if (entry) entry.owners.push(cell);
      else result.set(key, { endpoints: [a, b], owners: [cell] });
    }
  }
  return result;
}
function assertConforming(layout: Layout): void {
  const allEdges = edges(layout);
  for (const { owners, endpoints } of allEdges.values()) {
    expect(owners.length).toBeGreaterThanOrEqual(1);
    expect(owners.length).toBeLessThanOrEqual(2);
    if (owners.length === 2) {
      const [first, second] = owners as [number, number];
      expect(layout.neighbors({ cell: first })).toContain(second);
      expect(layout.neighbors({ cell: second })).toContain(first);
      const shared = layout.sharedBoundary({ firstCell: first, secondCell: second });
      expect(shared.some(segment => edgeKey(segment[0], segment[1]) === edgeKey(...endpoints))).toBe(true);
    }
  }
  // The public importer independently verifies crossings, containment, duplicate
  // interiors, complete-edge contacts and ownership of the generated shapes.
  const imported = topology.fromPolygons({ polygons: shapes(layout) });
  for (const cell of layout.cells) expect(imported.neighbors({ cell })).toEqual(layout.neighbors({ cell }));
}
function patchFromPoints(points: readonly XY[]): Layout {
  const faces = [[0, 1, 4, 3], [1, 2, 5, 4], [3, 4, 7, 6], [4, 5, 8, 7]];
  return topology.fromPolygons({ polygons: faces.map(face => polygon(face.map(index => points[index]!))) });
}
const halvingPoints: readonly XY[] = [
  [4.82, 3.07], [.572, 2.896], [-1.303, 1.126],
  [9.004, -2.047], [1.177, 1.739], [-.247, .027],
  [1.172, -1.081], [-.042, -.100], [-1.122, -1.438],
];
function interiorPoint(layout: Layout): XY {
  const first = layout.polygon({ cell: 0 }).coordinates[0]!.slice(0, 4);
  const shared = first.find(point => layout.cells.every(cell => layout.polygon({ cell }).coordinates[0]!.some(other => coordinateKey(other) === coordinateKey(point))));
  if (!shared) throw new Error("Expected one interior vertex shared by all four cells.");
  return shared;
}
function firstStepOracle(layout: Layout, fraction = 1): Map<string, XY> {
  const points = new Map<string, { point: XY; force: [number, number]; valence: number }>();
  const pinned = new Set<string>();
  for (const { endpoints, owners } of edges(layout).values()) if (owners.length === 1) {
    pinned.add(coordinateKey(endpoints[0]));
    pinned.add(coordinateKey(endpoints[1]));
  }
  for (const shape of shapes(layout)) {
    const corners = shape.coordinates[0]!.slice(0, 4);
    const center: XY = [corners.reduce((sum, point) => sum + point[0], 0) / 4, corners.reduce((sum, point) => sum + point[1], 0) / 4];
    for (let index = 0; index < 4; index++) {
      const a = corners[index]!, b = corners[(index + 1) % 4]!, opposite = corners[(index + 2) % 4]!, d = corners[(index + 3) % 4]!;
      // Independent diagonal least-squares projection; no rotation accumulator
      // or target implementation is imported into this oracle.
      const target: XY = [center[0] + (a[0] - opposite[0] + b[1] - d[1]) / 4, center[1] + (a[1] - opposite[1] - b[0] + d[0]) / 4];
      const key = coordinateKey(a), entry = points.get(key) ?? { point: a, force: [0, 0], valence: 0 };
      entry.force[0] += target[0] - a[0];
      entry.force[1] += target[1] - a[1];
      entry.valence++;
      points.set(key, entry);
    }
  }
  const scale = fraction / (2 * Math.max(...[...points.values()].map(entry => entry.valence)));
  return new Map([...points].map(([key, entry]) => [key, pinned.has(key) ? entry.point : [entry.point[0] + scale * entry.force[0], entry.point[1] + scale * entry.force[1]]]));
}
function canonicalVertices(shape: PlanarPolygon): XY[] {
  return shape.coordinates[0]!.slice(0, -1).toSorted((a, b) => a[0] - b[0] || a[1] - b[1]);
}

describe("finite quadrilateral public contract", () => {
  test("ring-one primitives match independent triangle-to-three and quad-to-four constructions", () => {
    const height = Math.sqrt(3) / 2;
    // With seed 1, source triangles 1+2 and 3+4 pair; 0 and 5 remain.
    // These four explicit faces are independent of lattice/edge enumeration code.
    const sourceFaces: readonly (readonly XY[])[] = [
      [[-.5, -height], [0, 0], [-1, 0]],
      [[-.5, -height], [.5, -height], [1, 0], [0, 0]],
      [[-1, 0], [0, 0], [.5, height], [-.5, height]],
      [[0, 0], [1, 0], [.5, height]],
    ];
    const expected: PlanarPolygon[] = [];
    for (const face of sourceFaces) {
      const center: XY = [face.reduce((sum, p) => sum + p[0], 0) / face.length, face.reduce((sum, p) => sum + p[1], 0) / face.length];
      const midpoint = (a: XY, b: XY): XY => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      face.forEach((corner, index) => expected.push(polygon([corner, midpoint(corner, face[(index + 1) % face.length]!), center, midpoint(face[(index + face.length - 1) % face.length]!, corner)])));
    }
    const layout = topology.quadrilaterals({ ringCount: 1, random: Random.create({ seed: 1 }) });
    expect(layout.cells).toHaveLength(14);
    const remaining = expected.map(canonicalVertices);
    for (const shape of shapes(layout)) {
      const actual = canonicalVertices(shape);
      const index = remaining.findIndex(candidate => candidate.every((p, i) => Math.abs(p[0] - actual[i]![0]) < 1e-14 && Math.abs(p[1] - actual[i]![1]) < 1e-14));
      expect(index).toBeGreaterThanOrEqual(0);
      remaining.splice(index, 1);
    }
    expect(remaining).toHaveLength(0);
    expect(topology.quadrilaterals({ ringCount: 1, random: Random.create({ seed: 0 }) }).cells).toHaveLength(12);
  });

  test("every supported radius preserves analytic hex area, exact edge ownership and budgets", () => {
    for (let ringCount = 1; ringCount <= 7; ringCount++) {
      const random = Random.create({ seed: ringCount }), continuation = random.copy();
      const layout = topology.quadrilaterals({ ringCount, edgeLength: .7, random });
      for (let draw = 0; draw < 9 * ringCount ** 2 - 3 * ringCount - 1; draw++) continuation.raw({ kind: "double" });
      expect(random.state).toEqual(continuation.state);
      expect(layout.cells.length).toBeLessThanOrEqual(18 * ringCount ** 2);
      expect(layout.cells.length * 5).toBeLessThanOrEqual(8192);
      expect(area(layout)).toBeCloseTo(3 * Math.sqrt(3) / 2 * (ringCount * .7) ** 2, 10);
      expect([...edges(layout).values()].filter(edge => edge.owners.length === 1)).toHaveLength(12 * ringCount);
      for (const shape of shapes(layout)) {
        const ring = shape.coordinates[0]!;
        expect(ring).toHaveLength(5);
        expect(ring[4]).toEqual(ring[0]);
        for (let i = 0; i < 4; i++) expect(cross(ring[i]!, ring[(i + 1) % 4]!, ring[(i + 2) % 4]!)).toBeGreaterThan(0);
      }
      assertConforming(layout);
    }
  });

  test("malformed options and unsupported magnitudes do not inspect accessors or consume RNG", () => {
    const random = Random.create({ seed: 37 }), before = random.state;
    const invalid: unknown[] = [
      { ringCount: 0, random }, { ringCount: 8, random }, { ringCount: 1.5, random }, { ringCount: NaN, random },
      { ringCount: 1, edgeLength: 0, random }, { ringCount: 1, edgeLength: Infinity, random },
      { ringCount: 1, edgeLength: 2 ** -401, random }, { ringCount: 7, edgeLength: 1e6, random },
      { ringCount: 1, random, boundary: {} }, { ringCount: 1, random, relaxationIterationCount: 1 },
      { ringCount: 1, random, pointSpacing: 1 }, { ringCount: 1, random: {} },
      { ringCount: 1, random, edgeLength: undefined }, { ringCount: undefined, random },
      { ringCount: 1, random, [Symbol("unknown")]: 1 },
    ];
    let inspected = 0;
    invalid.push(Object.defineProperty({ random }, "ringCount", { get() { inspected++; return 1; } }));
    invalid.push(Object.defineProperty({ ringCount: 1, random }, "edgeLength", { get() { inspected++; return 1; } }));
    for (const options of invalid) {
      expect(() => topology.quadrilaterals(options as Parameters<typeof topology.quadrilaterals>[0])).toThrow();
      expect(random.state).toEqual(before);
    }
    expect(inspected).toBe(0);
    expect(() => Reflect.apply(topology.quadrilaterals, undefined, [{ ringCount: 1, random }, {}])).toThrow(TypeError);
    expect(random.state).toEqual(before);
  });

  test("admitted length extremes preserve units without display normalization or underflow", () => {
    for (const edgeLength of [2 ** -400, 1e6]) {
      const layout = topology.quadrilaterals({ ringCount: 1, edgeLength, random: Random.create({ seed: 7 }) });
      expect(layout.cells).toHaveLength(14);
      expect(area(layout) / edgeLength ** 2).toBeCloseTo(3 * Math.sqrt(3) / 2, 12);
      expect(topology.relax({ layout, method: "square-target", iterationCount: 0 }).cells).toEqual(layout.cells);
      assertConforming(layout);
    }
  });

  test("rounded source coordinates beyond the existing magnitude cap reject before pairing", () => {
    const random = Random.create({ seed: 7 }), before = random.state;
    expect(7 * (1e6 / 7)).toBeGreaterThan(1e6);
    expect(() => topology.quadrilaterals({ ringCount: 7, edgeLength: 1e6 / 7, random })).toThrow(RangeError);
    expect(random.state).toEqual(before);
  });

  test("continuation includes advanced streams and cached Gaussian state; relaxation draws nothing", () => {
    const random = Random.create({ seed: 11 });
    random.number({ distribution: "normal" });
    const saved = random.state, twin = random.copy();
    const first = topology.quadrilaterals({ ringCount: 3, random });
    expect(shapes(first)).toEqual(shapes(topology.quadrilaterals({ ringCount: 3, random: twin })));
    expect(random.state).toEqual(twin.state);
    const afterGeneration = random.state;
    topology.relax({ layout: first, method: "square-target", iterationCount: 2 });
    expect(random.state).toEqual(afterGeneration);
    random.state = saved;
    random.raw({ kind: "double" });
    const advanced = topology.quadrilaterals({ ringCount: 3, random });
    expect(shapes(advanced)).not.toEqual(shapes(first));
    const replay = Random.create();
    replay.state = saved;
    expect(shapes(topology.quadrilaterals({ ringCount: 3, random: replay }))).toEqual(shapes(first));
  });
});

describe("square-target revisions and guarded global steps", () => {
  test("rotated and translated exact square fixed points retain detached revisions", () => {
    const raw = topology.fromPolygons({ polygons: [polygon([[3, 6], [7, 3], [10, 7], [6, 10]])] });
    const snapshot = raw.polygon({ cell: 0 });
    for (const iterationCount of [0, 1, 256]) {
      const revised = topology.relax({ layout: raw, method: "square-target", iterationCount });
      expect(revised).not.toBe(raw);
      expect(revised.polygon({ cell: 0 })).not.toBe(snapshot);
      expect(shapes(revised)).toEqual([snapshot]);
      expect(Object.isFrozen(revised)).toBe(true);
      expect(Object.isFrozen(revised.polygon({ cell: 0 }).coordinates[0]![0])).toBe(true);
    }
  });

  test("independent synchronous diagonal oracle covers multiple shared interior vertices", () => {
    const polygons: PlanarPolygon[] = [];
    const points: XY[] = [];
    for (let row = 0; row <= 3; row++) for (let column = 0; column <= 3; column++) {
      points.push([column + (row === 1 && column === 1 ? .25 : 0), row + (row === 2 && column === 2 ? -.125 : 0)]);
    }
    for (let row = 0; row < 3; row++) for (let column = 0; column < 3; column++) {
      const lower = row * 4 + column;
      polygons.push(polygon([points[lower]!, points[lower + 1]!, points[lower + 5]!, points[lower + 4]!]));
    }
    const raw = topology.fromPolygons({ polygons }), expected = firstStepOracle(raw);
    const revised = topology.relax({ layout: raw, method: "square-target", iterationCount: 1 });
    for (const cell of raw.cells) {
      const expectedCorners = raw.polygon({ cell }).coordinates[0]!.slice(0, 4).map(point => expected.get(coordinateKey(point))!).toSorted((a, b) => a[0] - b[0] || a[1] - b[1]);
      const actualCorners = canonicalVertices(revised.polygon({ cell }));
      expectedCorners.forEach((point, corner) => {
        expect(actualCorners[corner]![0]).toBeCloseTo(point[0], 13);
        expect(actualCorners[corner]![1]).toBeCloseTo(point[1], 13);
      });
      expect(revised.neighbors({ cell })).toEqual(raw.neighbors({ cell }));
    }
    for (const edge of edges(raw).values()) if (edge.owners.length === 1) {
      for (const endpoint of edge.endpoints) {
        const after = revised.polygon({ cell: edge.owners[0]! }).coordinates[0]!;
        expect(after).toContainEqual(endpoint);
      }
    }
    const variants = polygons.map((shape, cell) => {
      const ring = shape.coordinates[0]!.slice(0, 4);
      const start = cell % 4;
      const cyclic = [...ring.slice(start), ...ring.slice(0, start)];
      return polygon(cell % 2 ? cyclic.toReversed() : cyclic);
    });
    const equivalent = topology.fromPolygons({ polygons: variants });
    expect(shapes(topology.relax({ layout: equivalent, method: "square-target", iterationCount: 1 }))).toEqual(shapes(revised));
    assertConforming(revised);
  });

  test("global halving rejects two flipped candidates before accepting the complete third candidate", () => {
    const raw = patchFromPoints(halvingPoints), expected = firstStepOracle(raw, .25).get(coordinateKey(halvingPoints[4]!))!;
    expect(expected[0]).toBeCloseTo(1.248546875, 13);
    expect(expected[1]).toBeCloseTo(1.6424375, 13);
    const revised = topology.relax({ layout: raw, method: "square-target", iterationCount: 1 });
    expect(interiorPoint(revised)[0]).toBeCloseTo(expected[0], 13);
    expect(interiorPoint(revised)[1]).toBeCloseTo(expected[1], 13);
    expect(shapes(raw)).toEqual(shapes(patchFromPoints(halvingPoints)));
    assertConforming(revised);
  });

  test("exhausted global halving throws without publishing a partial revision or changing old queries", () => {
    const points = [...halvingPoints];
    points[4] = [1.304019824210452, 1.5675690077264486];
    const raw = patchFromPoints(points), before = shapes(raw), neighbors = raw.neighbors({ cell: 0 });
    expect(() => topology.relax({ layout: raw, method: "square-target", iterationCount: 1 })).toThrow(RangeError);
    expect(shapes(raw)).toEqual(before);
    expect(raw.neighbors({ cell: 0 })).toBe(neighbors);
  });

  test("nonzero movable forces that round away exhaust rather than masquerade as convergence", () => {
    const points: XY[] = [[1, 1], [2, 1], [3, 1], [1, 2], [2 + 2 ** -51, 2], [3, 2], [1, 3], [2, 3], [3, 3]];
    const polygons = shapes(patchFromPoints(points));
    const radial: readonly XY[] = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
    for (let index = 0; index < radial.length; index++) {
      const a = radial[index]!, b = radial[(index + 1) % radial.length]!;
      polygons.push(polygon([[20, 20], [20 + a[0], 20 + a[1]], [20 + a[0] + b[0], 20 + a[1] + b[1]], [20 + b[0], 20 + b[1]]]));
    }
    const raw = topology.fromPolygons({ polygons }), before = shapes(raw);
    // The valence-eight component makes global scale 1/16. The other interior
    // point has force (-2**-49,0), so the displacement -2**-53 rounds away at x=2.
    // Its force is nonzero; further halving cannot produce representable motion.
    expect(points[4]![0] - 2 ** -53).toBe(points[4]![0]);
    expect(() => topology.relax({ layout: raw, method: "square-target", iterationCount: 1 })).toThrow(RangeError);
    expect(shapes(raw)).toEqual(before);
  });

  test("all zero-iteration capability validation remains active and unsupported research keys reject", () => {
    const triangle = topology.fromPolygons({ polygons: [polygon([[0, 0], [2, 0], [0, 2]])] });
    const concave = topology.fromPolygons({ polygons: [polygon([[0, 0], [2, 0], [.5, .5], [0, 2]])] });
    const narrow = topology.fromPolygons({ polygons: [polygon([[0, 0], [1, 0], [1, 1e-13], [0, 1e-13]])] });
    for (const layout of [triangle, concave, narrow]) expect(() => topology.relax({ layout, method: "square-target", iterationCount: 0 })).toThrow(RangeError);
    const layout = topology.square({ columnCount: 1, rowCount: 1 });
    for (const iterationCount of [-1, .5, 257, Infinity, NaN]) expect(() => topology.relax({ layout, method: "square-target", iterationCount })).toThrow(RangeError);
    for (const options of [
      { layout, method: "lloyd", iterationCount: 0 },
      { layout, method: "square-target", iterationCount: 0, random: Random.create() },
      { layout, method: "square-target", iterationCount: 0, relaxationIterationCount: 1 },
      { layout, method: "square-target", iterationCount: undefined },
      { layout: { ...layout }, method: "square-target", iterationCount: 0 },
    ]) expect(() => topology.relax(options as Parameters<typeof topology.relax>[0])).toThrow(TypeError);
    expect(() => Reflect.apply(topology.relax, undefined, [{ layout, method: "square-target", iterationCount: 0 }, {}])).toThrow(TypeError);
  });

  test("disconnected components, gaps and a hole keep disjoint global geometry after relaxation", () => {
    const original = topology.square({ columnCount: 3, rowCount: 3 });
    const outer = original.cells.filter(cell => cell !== 4).map(cell => original.polygon({ cell }));
    const isolated = polygon([[8, 1], [9, 1], [9, 2], [8, 2]]);
    const raw = topology.fromPolygons({ polygons: [...outer, isolated] });
    const revised = topology.relax({ layout: raw, method: "square-target", iterationCount: 8 });
    expect(revised.cellAt({ position: { x: 1.5, y: 1.5 } })).toBeUndefined();
    expect(revised.cellAt({ position: { x: 5, y: 1.5 } })).toBeUndefined();
    expect(area(revised)).toBe(9);
    assertConforming(revised);
  });

  test("corresponding layouts compose with independent Grid and Field state identities", () => {
    const raw = patchFromPoints(halvingPoints), revised = topology.relax({ layout: raw, method: "square-target", iterationCount: 1 });
    const before = Grid.create({ layout: raw, state: { population: 0, density: 1 } });
    before.fields[1]!.population = 23;
    const after = Grid.create({ layout: revised, state: { population: 0, density: 1 } });
    expect(before).not.toBe(after);
    for (const cell of raw.cells) {
      expect(after.fields[cell]).not.toBe(before.fields[cell]);
      expect(after.fields[cell]!.grid).toBe(after);
      expect(after.fields[cell]!.population).toBe(0);
      after.fields[cell]!.population = before.fields[cell]!.population;
    }
    expect(after.fields[1]!.population).toBe(23);
    after.fields[1]!.population++;
    expect(before.fields[1]!.population).toBe(23);
  });
});
