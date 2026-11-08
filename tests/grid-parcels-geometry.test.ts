import { describe, expect, test } from "bun:test";
import { geometry, topology, type PlanarPolygon, type PlanarXY } from "city-library";

function polygon(vertices: readonly PlanarXY[]): PlanarPolygon {
  return { type: "Polygon", coordinates: [[...vertices, vertices[0]!]] };
}
function rectangle(x: number, y: number, width: number, height: number): PlanarPolygon {
  return polygon([[x, y], [x + width, y], [x + width, y + height], [x, y + height]]);
}
const area = (shape: PlanarPolygon) => geometry.area({ shape });

describe("bounded parcel geometry", () => {
  test("net area is stable under translation and winding, and includes holes", () => {
    const translated = rectangle(999_999, 999_999, 0.001, 0.002);
    const width = translated.coordinates[0]![1]![0] - translated.coordinates[0]![0]![0];
    const height = translated.coordinates[0]![2]![1] - translated.coordinates[0]![0]![1];
    expect(area(translated)).toBe(width * height);
    expect(area({ ...translated, coordinates: [[...translated.coordinates[0]!].reverse()] })).toBe(area(translated));
    const holed: PlanarPolygon = { type: "Polygon", coordinates: [rectangle(0, 0, 4, 4).coordinates[0]!, rectangle(1, 1, 1, 1).coordinates[0]!] };
    expect(area(holed)).toBe(15);
    expect(area(rectangle(0, 0, 1e-50, 1e-50))).toBeCloseTo(1e-100, 110);
    expect(() => area(rectangle(1e6, 0, 1, 1))).toThrow(RangeError);
    expect(() => area(polygon([[0, 0], [2, 2], [0, 2], [2, 0]]))).toThrow(RangeError);
  });

  test("both windings merge with provenance and without modifying source geometry", () => {
    const first = rectangle(0, 0, 1, 1), rawSecond = rectangle(1, 0, 1, 1);
    const second: PlanarPolygon = { ...rawSecond, coordinates: [[...rawSecond.coordinates[0]!].reverse()] };
    const snapshot = structuredClone([first, second]);
    const result = geometry.merge({ shapes: [first, second] });
    expect(result.status).toBe("ok");
    if (result.status !== "ok") throw new Error("Expected conforming union.");
    expect(area(result.shape)).toBe(2);
    expect(result.sourceCells).toEqual([]);
    expect([first, second]).toEqual(snapshot);
    expect(Object.isFrozen(result.shape.coordinates[0]![0])).toBe(true);
    const layout = topology.square({ columns: 2, rows: 1 });
    const selected = geometry.merge({ layout, cells: [1, 0] });
    expect(selected.sourceCells).toEqual([1, 0]);
    expect(() => geometry.merge({ layout, cells: [] })).toThrow(TypeError);
    expect(() => geometry.merge({ layout, cells: [2] })).toThrow(RangeError);
  });

  test("unsupported merges retain all disconnected, crossing, partial and holed inputs", () => {
    const first = rectangle(0, 0, 2, 2);
    for (const second of [rectangle(3, 0, 1, 1), rectangle(1, 1, 2, 2), rectangle(2, 0, 1, 1), first]) {
      const result = geometry.merge({ shapes: [first, second] });
      expect(result.status).toBe("unsupported");
      if (result.status === "ok") throw new Error("Unexpected union.");
      expect(result.remainingShapes).toEqual([first, second]);
      expect(result.remainingShapes[0]).not.toBe(first);
      expect(result.remainingShapes.map(area).reduce((sum, value) => sum + value, 0)).toBe(area(first) + area(second));
      expect(result.diagnostics.length).toBeGreaterThan(0);
    }
    const holed: PlanarPolygon = { type: "Polygon", coordinates: [rectangle(0, 0, 4, 4).coordinates[0]!, rectangle(1, 1, 1, 1).coordinates[0]!] };
    const unsupported = geometry.merge({ shapes: [holed] });
    expect(unsupported.status).toBe("unsupported");
    expect(() => geometry.merge({ shapes: [holed, polygon([[0, 0], [1, 1], [0, 1], [1, 0]])] })).toThrow(RangeError);
    const ringLayout = topology.square({ columns: 3, rows: 3 });
    const holeUnion = geometry.merge({ layout: ringLayout, cells: [0, 1, 2, 3, 5, 6, 7, 8] });
    expect(holeUnion.status).toBe("unsupported");
    if (holeUnion.status === "ok") throw new Error("A holed union is unsupported.");
    expect(holeUnion.remainingShapes.map(area).reduce((sum, value) => sum + value, 0)).toBe(8);
  });

  test("merged output budgets reject honestly instead of throwing away input", () => {
    const layout = topology.square({ columns: 64, rows: 1 });
    const result = geometry.merge({ layout, cells: layout.cells });
    expect(result.status).toBe("unsupported");
    if (result.status === "ok") throw new Error("Unreduced boundary exceeds phase support.");
    expect(result.remainingShapes.length).toBe(64);
    expect(result.remainingShapes.map(area).reduce((sum, value) => sum + value, 0)).toBe(64);
    expect(result.diagnostics[0]).toContain("128");
  });

  test("convex cuts through vertices conserve area and accept either winding", () => {
    for (const shape of [rectangle(0, 0, 2, 2), { type: "Polygon", coordinates: [[...rectangle(0, 0, 2, 2).coordinates[0]!].reverse()] } as PlanarPolygon]) {
      const snapshot = structuredClone(shape);
      for (const direction of [{ x: 1, y: 1 }, { x: 1e308, y: 1e308 }, { x: 1e-300, y: 1e-300 }]) {
        const result = geometry.split({ shape, point: { x: 0, y: 0 }, direction });
        expect(result.status).toBe("ok");
        expect(result.parts.map(area)).toEqual([2, 2]);
        expect(result.parts[0]).not.toBe(shape);
      }
      expect(shape).toEqual(snapshot);
    }
    const translated = rectangle(999_999, 999_999, 0.5, 0.5);
    const result = geometry.split({ shape: translated, point: { x: 999_999.25, y: 999_999 }, direction: { y: 1 } });
    expect(result.status).toBe("ok");
    expect(result.parts.map(area)).toEqual([0.125, 0.125]);
    const tiny = rectangle(0, 0, 1e-50, 1e-50);
    const tinyResult = geometry.split({ shape: tiny, point: { x: 0.5e-50, y: 0 }, direction: { y: 1 } });
    expect(tinyResult.status).toBe("ok");
    expect(tinyResult.parts.map(area).reduce((sum, value) => sum + value, 0)).toBe(area(tiny));
  });

  test("guard, tangent and no-crossing outcomes retain fresh whole input", () => {
    const shape = rectangle(0, 0, 2, 2);
    for (const options of [
      { point: { x: 0, y: 0 }, direction: { x: 1 } },
      { point: { x: 0, y: 0 }, direction: { x: 1, y: -1 } },
      { point: { x: 3, y: 0 }, direction: { y: 1 } },
      { point: { x: 0.5, y: 0 }, direction: { y: 1 }, minimumArea: 2 },
    ]) {
      const result = geometry.split({ shape, ...options });
      expect(result.status).toBe("unchanged");
      expect(result.parts).toEqual([shape]);
      expect(result.parts[0]).not.toBe(shape);
      expect(result.diagnostics.length).toBeGreaterThan(0);
    }
    expect(() => geometry.split({ shape, point: { x: 0, y: 0 }, direction: {} })).toThrow(RangeError);
    expect(() => geometry.split({ shape, point: { x: 0, y: 0 }, direction: { y: NaN } })).toThrow(RangeError);
    expect(() => geometry.split({ shape, point: { x: 0, y: 0 }, direction: { y: 1 }, minimumArea: -1 })).toThrow(RangeError);
  });
});
