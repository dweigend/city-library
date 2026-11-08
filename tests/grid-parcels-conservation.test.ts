import { expect, test } from "bun:test";
import { geometry, topology, type PlanarPolygon, type PlanarXY } from "city-library";

test("varied convex cuts retain whole input or publish two conserved valid parts", () => {
  // An independent family of convex fixtures, rather than the clipping algorithm.
  for (const vertexCount of [3, 5, 8, 17, 31]) {
    for (const scale of [1e-30, 1, 1000]) {
      const vertices: PlanarXY[] = Array.from({ length: vertexCount }, (_, index) => {
        const angle = 2 * Math.PI * index / vertexCount;
        return [scale * Math.cos(angle), scale * 0.7 * Math.sin(angle)];
      });
      for (const ring of [vertices, vertices.toReversed()]) {
        const shape: PlanarPolygon = { type: "Polygon", coordinates: [[...ring, ring[0]!]] };
        const snapshot = structuredClone(shape);
        const originalArea = geometry.area({ shape });
        for (const angle of [0.13, 0.61, 1.7, 2.81]) {
          const result = geometry.split({ shape, point: { x: 0, y: 0 }, direction: { x: Math.cos(angle), y: Math.sin(angle) } });
          expect(result.status).toBe("ok");
          expect(result.parts).toHaveLength(2);
          const areas = result.parts.map(part => geometry.area({ shape: part }));
          expect(areas.every(area => area > 0)).toBe(true);
          expect(Math.abs(areas[0]! + areas[1]! - originalArea) / originalArea).toBeLessThan(1e-9);
          // Rounded intersections share one identical child boundary; an exact
          // binary64 point on the requested line may fall on either side of it.
          expect(result.parts.some(part => geometry.contains(part, { x: 0, y: 0 }))).toBe(true);
        }
        expect(shape).toEqual(snapshot);
      }
    }
  }
});

test("concave conforming unions and hex unions conserve all selected source area", () => {
  for (const layout of [topology.square({ columns: 4, rows: 3 }), topology.hex({ columns: 4, rows: 3, cellRadius: 0.3 })]) {
    for (const cells of [[0, 1, 4], [0, 1, 2, 4, 5, 6], [...layout.cells]]) {
      const expected = cells.reduce((sum, cell) => sum + geometry.area({ shape: layout.polygon({ cell }) }), 0);
      const result = geometry.merge({ layout, cells });
      expect(result.status).toBe("ok");
      if (result.status !== "ok") throw new Error(result.diagnostics.join(" "));
      expect(result.sourceCells).toEqual(cells);
      expect(Math.abs(geometry.area({ shape: result.shape }) - expected) / expected).toBeLessThan(1e-9);
    }
  }
});
