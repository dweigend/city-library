import { describe, expect, test } from "bun:test";
import type { SpatialAgent, SpatialData } from "../ui/definition.ts";
import { canvasPoint, hitSceneSymbol, symbolDimensions, symbolRotation, validateBufferDimensions, validateCanvasGeometry } from "../ui/views/spatial-geometry.ts";

// Fixed geometry fixtures specify actual painted bounds, not a second renderer.
const scene = { width: 100, height: 50 };
const buffer = { width: 400, height: 200 };
const rectangle: SpatialAgent = { id: "slot", x: 0, y: 0, shape: "rectangle", extent: { width: 10, height: 4 } };

describe("flat scene geometry", () => {
  test("normal projections retain original canvas coordinates and CSS sizing", () => {
    expect(canvasPoint({ x: -25, y: 10 }, scene, buffer)).toEqual({ x: 100, y: 60 });
    expect(symbolDimensions(rectangle, scene, buffer, 2)).toEqual({ width: 40, height: 16 });
    expect(symbolDimensions({ id: "person", x: 0, y: 0 }, scene, buffer, 1)).toEqual({ width: 8, height: 8 });
    expect(symbolDimensions({ id: "person", x: 0, y: 0 }, scene, buffer, 2)).toEqual({ width: 16, height: 16 });
  });
  test("subpixel CSS symbols use the painted two-buffer-pixel minimum", () => {
    const dot: SpatialAgent = { id: "dot", x: 0, y: 0, size: 0.1 };
    for (const ratio of [1, 2]) {
      expect(hitSceneSymbol(dot, 0.24, 0, scene, buffer, ratio)).toBe(true);
      expect(hitSceneSymbol(dot, 0.26, 0, scene, buffer, ratio)).toBe(false);
    }
  });
  test("rectangle rotation and nonuniform rounded buffers match painted axes", () => {
    const rotated = { ...rectangle, heading: 90 };
    expect(hitSceneSymbol(rotated, 0, 4.9, scene, buffer, 1)).toBe(true);
    expect(hitSceneSymbol(rotated, 0, 5.1, scene, buffer, 1)).toBe(false);
    const rounded = { width: 401, height: 199 };
    expect(hitSceneSymbol(rectangle, 4.99, 1.99, scene, rounded, 1)).toBe(true);
    expect(hitSceneSymbol(rectangle, 5.01, 0, scene, rounded, 1)).toBe(false);
  });
  test("triangle and diamond picking exclude unpainted bounding-box corners", () => {
    const marker: SpatialAgent = { id: "direction", x: 0, y: 0, size: 20, shape: "triangle" };
    expect(hitSceneSymbol(marker, 0, 2.4, scene, buffer, 1)).toBe(true);
    expect(hitSceneSymbol(marker, 1.7, 2.4, scene, buffer, 1)).toBe(false);
    expect(hitSceneSymbol({ ...marker, shape: "diamond" }, 2, 2, scene, buffer, 1)).toBe(false);
  });
  test("finite scene inputs cannot publish overflowing canvas transformations", () => {
    const data: SpatialData = { width: 1, height: 1, agents: [{ id: "far", x: Number.MAX_VALUE, y: 0 }] };
    expect(() => validateCanvasGeometry(data, buffer, 1)).toThrow(RangeError);
    expect(() => symbolRotation({ id: "spin", x: 0, y: 0, heading: Number.MAX_VALUE })).toThrow(RangeError);
    expect(() => symbolDimensions({ ...rectangle, extent: { width: Number.MAX_VALUE, height: 1 } }, { width: 0.1, height: 1 }, buffer, 1)).toThrow(RangeError);
  });
  test("buffer dimensions reject DOM unsigned-long wrapping before publication", () => {
    for (const dimension of [0, -1, 0.5, 2 ** 32, 400 * 2 ** 32, Number.MAX_VALUE, Infinity, NaN]) {
      expect(() => validateBufferDimensions({ width: dimension, height: 1 })).toThrow(RangeError);
      expect(() => validateBufferDimensions({ width: 1, height: dimension })).toThrow(RangeError);
    }
    validateBufferDimensions({ width: 1, height: 0xffffffff });
    validateBufferDimensions(buffer);
  });
  test("geometry validation leaves the detached projection untouched", () => {
    const data: SpatialData = { ...scene, agents: [rectangle], labels: [{ x: 0, y: 0, text: "Slots" }] };
    const before = structuredClone(data);
    validateCanvasGeometry(data, buffer, 2);
    expect(data).toEqual(before);
  });
});
