import { describe, expect, test } from "bun:test";
import { topology, type PlanarPolygon } from "../index.ts";
const rectangle = (x: number, y: number, width = 1, height = 1): PlanarPolygon => ({ type: "Polygon", coordinates: [[[x,y],[x+width,y],[x+width,y+height],[x,y+height],[x,y]]] });

describe("detached conforming topology", () => {
  test("square keys, sizes, ties, adjacency and deep immutability", () => {
    const layout = topology.square({columnCount:3,rowCount:2,cellSize:2});
    expect(layout.cells).toEqual([0,1,2,3,4,5]);
    expect(layout.neighbors({cell:1})).toEqual([0,2,4]);
    expect(layout.cellAt({position:{x:2,y:2}})).toBe(0);
    expect(layout.cellAt({position:{x:6,y:4}})).toBe(5);
    expect(layout.cellAt({position:{x:6.001,y:4}})).toBeUndefined();
    expect(layout.sharedBoundary({firstCell:1,secondCell:0})).toEqual([[[2,2],[2,0]]]);
    expect(Object.isFrozen(layout)).toBe(true);
    expect(Object.isFrozen(layout.cells)).toBe(true);
    expect(Object.isFrozen(layout.neighbors({cell:0}))).toBe(true);
    expect(Object.isFrozen(layout.sharedBoundary({firstCell:0,secondCell:1})[0]![0])).toBe(true);
  });
  test("both hex orientations have complete exact reciprocal edges", () => {
    for (const orientation of ["pointy","flat"] as const) {
      const layout = topology.hex({columnCount:4,rowCount:4,cellRadius:0.7,orientation});
      expect(layout.neighbors({cell:0})).toEqual([1,4]);
      expect(layout.neighbors({cell:5})).toHaveLength(6);
      for (const cell of layout.cells) for (const neighbor of layout.neighbors({cell})) {
        expect(layout.neighbors({cell:neighbor})).toContain(cell);
        expect(layout.sharedBoundary({firstCell:cell,secondCell:neighbor})).toHaveLength(1);
        const edge = layout.sharedBoundary({firstCell:cell,secondCell:neighbor})[0]!;
        expect(layout.polygon({cell}).coordinates[0]).toContainEqual(edge[0]);
        expect(layout.polygon({cell:neighbor}).coordinates[0]).toContainEqual(edge[0]);
      }
      // Authored re-import validates the exact generated geometry too.
      const imported = topology.fromPolygons({polygons:layout.cells.map(cell => layout.polygon({cell}))});
      expect(imported.cells.map(cell => imported.neighbors({cell}))).toEqual(layout.cells.map(cell => layout.neighbors({cell})));
    }
  });
  test("caller winding and subsequent mutation do not alter snapshots", () => {
    const first = rectangle(0,0), second = rectangle(1,0);
    const reversed: PlanarPolygon = {type:"Polygon",coordinates:[second.coordinates[0]!.toReversed()]};
    const before = structuredClone([first,reversed]);
    const input = [first,reversed];
    const layout = topology.fromPolygons({polygons:input});
    expect(input).toEqual(before);
    input[0] = rectangle(99,99);
    expect(layout.polygon({cell:0})).toEqual(before[0]!);
    expect(layout.neighbors({cell:0})).toEqual([1]);
    expect(layout.sharedBoundary({firstCell:0,secondCell:1})).toEqual([[[1,0],[1,1]]]);
    expect(layout.sharedBoundary({firstCell:1,secondCell:0})).toEqual([[[1,0],[1,1]]]);
  });
  test("corner-only contact and exact narrow gaps are distinct from shared edges", () => {
    const layout = topology.fromPolygons({polygons:[rectangle(0,0),rectangle(1,1)]});
    const gap = topology.fromPolygons({polygons:[rectangle(0,0),rectangle(1+1e-12,0)]});
    expect(gap.neighbors({cell:0})).toEqual([]);
    expect(layout.neighbors({cell:0})).toEqual([]);
    expect(layout.cellAt({position:{x:1,y:1}})).toBe(0);
  });
  test("overlap, crossing, duplicates and incomplete shared edges reject", () => {
    for (const polygons of [
      [rectangle(0,0),rectangle(0,0)],
      [rectangle(0,0),rectangle(0.5,0.5)],
      [rectangle(0,0,3,3),rectangle(1,1)],
      [rectangle(0,0),rectangle(1,0,1,0.5)],
      [rectangle(0,0,3,1),rectangle(1,-1,1,3)],
    ]) expect(() => topology.fromPolygons({polygons})).toThrow(RangeError);
  });
  test("concave authored shapes preserve real lookup and reject intersecting bridges", () => {
    const shape:PlanarPolygon={type:"Polygon",coordinates:[[[0,0],[3,0],[3,1],[1,1],[1,3],[0,3],[0,0]]]};
    const layout=topology.fromPolygons({polygons:[shape,rectangle(1,1,2,2)]});
    expect(layout.cellAt({position:{x:2,y:2}})).toBe(1);
    expect(layout.cellAt({position:{x:0.5,y:2}})).toBe(0);
    expect(layout.neighbors({cell:0})).toEqual([1]);
    expect(layout.sharedBoundary({firstCell:0,secondCell:1})).toHaveLength(2);
  });
  test("bounds and malformed arguments reject without coercion", () => {
    expect(() => topology.square({columnCount:1025,rowCount:1})).toThrow(RangeError);
    expect(topology.square({columnCount:32,rowCount:32}).cells).toHaveLength(1024);
    expect(() => topology.square({columnCount:1.5,rowCount:1})).toThrow(RangeError);
    expect(() => topology.hex({columnCount:1,rowCount:1,orientation:"invalid" as "flat"})).toThrow(TypeError);
    expect(() => topology.fromPolygons({polygons:[rectangle(1e6,0)]})).toThrow(RangeError);
    const layout=topology.square({columnCount:1,rowCount:1});
    expect(() => layout.polygon({cell:-1})).toThrow(RangeError);
    expect(() => layout.cellAt({position:{x:0,y:0,z:1}})).toThrow(TypeError);
  });
});
