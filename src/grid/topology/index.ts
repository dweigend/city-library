import { validateOptions } from "../../agent/state.ts";
import { array } from "../../geometry/planar/validation.ts";
import type { PlanarPolygon, PlanarXY } from "../../geometry/planar/types.ts";
import { createLayout, generationOptions, type Layout } from "./layout.ts";
import { quadrilaterals } from "./quadrilaterals.ts";
import { relax } from "./relax.ts";
export type { Layout, BoundarySegment } from "./layout.ts";

/** Row-major square cells from the origin; cellSize defaults to 1. */
function square(options: { columns: number; rows: number; cellSize?: number }): Layout {
  const { columns, rows, size } = generationOptions(options, "cellSize");
  const polygons: PlanarPolygon[] = [];
  for (let row = 0; row < rows; row++) for (let column = 0; column < columns; column++) {
    const x = column * size, y = row * size;
    const right = (column + 1) * size, top = (row + 1) * size;
    polygons.push({ type: "Polygon", coordinates: [[[x, y], [right, y], [right, top], [x, top], [x, y]]] });
  }
  return createLayout(polygons, false);
}
/** Row-major hexagonal cells; cellRadius defaults to 1 and orientation to "pointy". */
function hex(options: { columns: number; rows: number; cellRadius?: number; orientation?: "pointy" | "flat" }): Layout {
  const { columns, rows, size, orientation } = generationOptions(options, "cellRadius");
  const polygons: PlanarPolygon[] = [];
  // Integer lattice vertices are evaluated identically for every incident cell;
  // no independent trig, rounded endpoint keys or epsilon snapping is involved.
  const offsets = [[1, 1], [0, 2], [-1, 1], [-1, -1], [0, -2], [1, -1]] as const;
  const vertices = new Map<string, PlanarXY>();
  function vertex(x: number, y: number): PlanarXY {
    const key = `${x},${y}`;
    let result = vertices.get(key);
    if (!result) {
      result = orientation === "pointy" ? [x * (Math.sqrt(3) * size / 2), y * (size / 2)] : [y * (size / 2), x * (Math.sqrt(3) * size / 2)];
      vertices.set(key, result);
    }
    return result;
  }
  for (let row = 0; row < rows; row++) for (let column = 0; column < columns; column++) {
    const horizontal = orientation === "pointy" ? 2 * column + row : 2 * row + column;
    const vertical = orientation === "pointy" ? 3 * row : 3 * column;
    const ring = offsets.map(([x, y]) => vertex(horizontal + x, vertical + y));
    ring.push(ring[0]!);
    polygons.push({ type: "Polygon", coordinates: [ring] });
  }
  return createLayout(polygons, false);
}
/** Authored conforming polygons; overlaps and nonconforming contacts are rejected. */
function fromPolygons(options: { polygons: readonly PlanarPolygon[] }): Layout {
  const values = validateOptions(options, ["polygons"]);
  return createLayout(array(values.polygons, 1) as PlanarPolygon[], true);
}
/** Immutable topology generation and authored conforming polygon import. */
export const topology = Object.freeze({ square, hex, fromPolygons, quadrilaterals, relax });
