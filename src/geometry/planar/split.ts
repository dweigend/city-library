import { validateOptions } from "../../agent/state.ts";
import { finite, position, type Position, type Vector } from "../space.ts";
import { orient, point } from "./predicates.ts";
import { freezePolygon, polygonArea, readPolygon } from "./parcel-input.ts";
import type { PlanarPolygon, PlanarXY } from "./types.ts";

export interface SplitResult {
  readonly status: "ok" | "unchanged" | "unsupported" | "failed";
  readonly parts: readonly PlanarPolygon[];
  readonly diagnostics: readonly string[];
}
/** One bounded infinite-line cut of a convex, hole-free polygon. */
export function split(options: { shape: PlanarPolygon; point: Position; direction: Vector; minimumArea?: number }): SplitResult {
  const input = validateOptions(options, ["shape", "point", "direction", "minimumArea"]);
  const shape = readPolygon(input.shape), origin = position(input.point as Position, 2);
  if (Math.abs(origin.x) > 1e6 || Math.abs(origin.y) > 1e6) throw new RangeError("Split point magnitude exceeds 1e6.");
  const direction = validateOptions(input.direction, ["x", "y"]);
  let dx = finite(direction.x ?? 0), dy = finite(direction.y ?? 0);
  const scale = Math.max(Math.abs(dx), Math.abs(dy));
  if (scale === 0) throw new RangeError("Split direction must be nonzero.");
  dx /= scale; dy /= scale;
  const minimumArea = finite(input.minimumArea ?? 0);
  if (minimumArea < 0) throw new RangeError("Minimum area must be nonnegative.");
  const originalArea = polygonArea(shape);
  const result = (status: SplitResult["status"], parts: readonly PlanarPolygon[], diagnostic?: string): SplitResult =>
    Object.freeze({ status, parts: Object.freeze([...parts]), diagnostics: Object.freeze(diagnostic ? [diagnostic] : []) });
  if (shape.coordinates.length !== 1) return result("unsupported", [shape], "Split supports hole-free polygons only.");
  const ring = shape.coordinates[0]!, vertices = ring.slice(0, -1);
  let winding = 0;
  for (let index = 0; index < vertices.length; index++) {
    const first = vertices[index]!, second = vertices[(index + 1) % vertices.length]!, third = vertices[(index + 2) % vertices.length]!;
    const turn = orient(point(...first), point(...second), point(...third));
    if (turn !== 0 && winding !== 0 && turn !== winding) return result("unsupported", [shape], "Split supports convex polygons only.");
    if (turn !== 0) winding = turn;
  }
  const distance = (pair: PlanarXY) => dx * (pair[1] - origin.y) - dy * (pair[0] - origin.x);
  const distances = vertices.map(distance);
  if (!distances.some(value => value > 0) || !distances.some(value => value < 0))
    return result("unchanged", [shape], "Line does not cross the polygon interior.");
  const sides: PlanarXY[][] = [[], []];
  const push = (target: PlanarXY[], pair: PlanarXY) => {
    const last = target[target.length - 1];
    if (!last || last[0] !== pair[0] || last[1] !== pair[1]) target.push(pair);
  };
  for (let index = 0; index < vertices.length; index++) {
    const first = vertices[index]!, second = vertices[(index + 1) % vertices.length]!;
    const a = distances[index]!, b = distances[(index + 1) % vertices.length]!;
    if (a >= 0) push(sides[0]!, first);
    if (a <= 0) push(sides[1]!, first);
    if ((a < 0 && b > 0) || (a > 0 && b < 0)) {
      const t = a / (a - b);
      const intersection: PlanarXY = [first[0] + t * (second[0] - first[0]), first[1] + t * (second[1] - first[1])];
      push(sides[0]!, intersection); push(sides[1]!, intersection);
    }
  }
  // Computed intersections can become unrepresentable or invalid; preserve the
  // original rather than silently publishing only the accepted half.
  let parts: PlanarPolygon[], areas: number[];
  try {
    parts = sides.map(vertices => {
      if (vertices.length < 3) throw new RangeError("Degenerate split part.");
      return readPolygon(freezePolygon([[...vertices, vertices[0]!]]));
    });
    areas = parts.map(polygonArea);
  } catch (error) {
    if (!(error instanceof RangeError || error instanceof TypeError)) throw error;
    return result("failed", [shape], "Computed split parts exceed support bounds or are numerically degenerate.");
  }
  const tolerance = originalArea * 1e-9;
  if (Math.abs(areas[0]! + areas[1]! - originalArea) > tolerance)
    return result("failed", [shape], "Computed split did not conserve area within relative 1e-9.");
  if (areas.some(area => area <= tolerance || area < minimumArea))
    return result("unchanged", [shape], "A split part is below the positive-area or minimum-area guard.");
  return result("ok", parts);
}
