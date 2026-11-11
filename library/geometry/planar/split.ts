import { validateOptions } from "../../agent/state.ts";
import { finite, position, type Position, type Vector } from "../space.ts";
import { orient, point } from "./predicates.ts";
import { freezePolygon, polygonArea, readPolygon } from "./polygon-input.ts";
import type { PlanarPolygon, PlanarXY } from "./types.ts";

export interface SplitResult {
  readonly status: "ok" | "unchanged" | "unsupported" | "failed";
  readonly parts: readonly PlanarPolygon[];
  readonly diagnostics: readonly string[];
}

const maximumSplitPointMagnitude = 1e6;
const relativeAreaTolerance = 1e-9;

/**
 * One bounded infinite-line cut of a convex, hole-free polygon.
 * "ok" returns the two parts, left of `direction` first; every other status returns the
 * original shape with one diagnostic. Parts must conserve area and meet `minimumArea` (default 0).
 */
export function split(options: { shape: PlanarPolygon; point: Position; direction: Vector; minimumArea?: number }): SplitResult {
  const input = validateOptions(options, ["shape", "point", "direction", "minimumArea"]);
  const shape = readPolygon(input.shape);
  const origin = position(input.point as Position, 2);
  if (Math.abs(origin.x) > maximumSplitPointMagnitude || Math.abs(origin.y) > maximumSplitPointMagnitude) {
    throw new RangeError("Split point magnitude exceeds 1e6.");
  }
  const { dx, dy } = readDirection(input.direction);
  const minimumArea = finite(input.minimumArea ?? 0);
  if (minimumArea < 0) throw new RangeError("Minimum area must be nonnegative.");
  const originalArea = polygonArea(shape);

  if (shape.coordinates.length !== 1) return splitResult("unsupported", [shape], "Split supports hole-free polygons only.");
  const vertices = shape.coordinates[0]!.slice(0, -1);
  if (!isConvex(vertices)) return splitResult("unsupported", [shape], "Split supports convex polygons only.");
  // Signed cross product: positive left of the directed line, negative right of it.
  const distances = vertices.map(pair => dx * (pair[1] - origin.y) - dy * (pair[0] - origin.x));
  if (!distances.some(value => value > 0) || !distances.some(value => value < 0)) {
    return splitResult("unchanged", [shape], "Line does not cross the polygon interior.");
  }
  const sides = cutRing(vertices, distances);

  // Computed intersections can become unrepresentable or invalid; preserve the
  // original rather than silently publishing only the accepted half.
  let parts: PlanarPolygon[];
  let areas: number[];
  try {
    parts = sides.map(side => {
      if (side.length < 3) throw new RangeError("Degenerate split part.");
      return readPolygon(freezePolygon([[...side, side[0]!]]));
    });
    areas = parts.map(polygonArea);
  } catch (error) {
    if (!(error instanceof RangeError || error instanceof TypeError)) throw error;
    return splitResult("failed", [shape], "Computed split parts exceed support bounds or are numerically degenerate.");
  }
  const tolerance = originalArea * relativeAreaTolerance;
  if (Math.abs(areas[0]! + areas[1]! - originalArea) > tolerance) {
    return splitResult("failed", [shape], "Computed split did not conserve area within relative 1e-9.");
  }
  if (areas.some(area => area <= tolerance || area < minimumArea)) {
    return splitResult("unchanged", [shape], "A split part is below the positive-area or minimum-area guard.");
  }
  return splitResult("ok", parts);
}

function splitResult(status: SplitResult["status"], parts: readonly PlanarPolygon[], diagnostic?: string): SplitResult {
  return Object.freeze({
    status,
    parts: Object.freeze([...parts]),
    diagnostics: Object.freeze(diagnostic ? [diagnostic] : []),
  });
}

/** Scales a nonzero direction so its largest component has magnitude one. */
function readDirection(value: unknown): { dx: number; dy: number } {
  const direction = validateOptions(value, ["x", "y"]);
  const x = finite(direction.x ?? 0);
  const y = finite(direction.y ?? 0);
  const scale = Math.max(Math.abs(x), Math.abs(y));
  if (scale === 0) throw new RangeError("Split direction must be nonzero.");
  return { dx: x / scale, dy: y / scale };
}

/** Exact orientation of every vertex triple; collinear vertices are ignored. */
function isConvex(vertices: readonly PlanarXY[]): boolean {
  let winding = 0;
  for (let index = 0; index < vertices.length; index++) {
    const first = vertices[index]!;
    const second = vertices[(index + 1) % vertices.length]!;
    const third = vertices[(index + 2) % vertices.length]!;
    const turn = orient(point(...first), point(...second), point(...third));
    if (turn === 0) continue;
    if (winding !== 0 && turn !== winding) return false;
    winding = turn;
  }
  return true;
}

/** Assigns vertices to the left [0] and right [1] side; on-line vertices and crossings join both. */
function cutRing(vertices: readonly PlanarXY[], distances: readonly number[]): PlanarXY[][] {
  const sides: PlanarXY[][] = [[], []];
  for (let index = 0; index < vertices.length; index++) {
    const first = vertices[index]!;
    const second = vertices[(index + 1) % vertices.length]!;
    const a = distances[index]!;
    const b = distances[(index + 1) % vertices.length]!;
    if (a >= 0) appendDistinct(sides[0]!, first);
    if (a <= 0) appendDistinct(sides[1]!, first);
    if ((a < 0 && b > 0) || (a > 0 && b < 0)) {
      const t = a / (a - b);
      const intersection: PlanarXY = [first[0] + t * (second[0] - first[0]), first[1] + t * (second[1] - first[1])];
      appendDistinct(sides[0]!, intersection);
      appendDistinct(sides[1]!, intersection);
    }
  }
  return sides;
}

function appendDistinct(target: PlanarXY[], pair: PlanarXY): void {
  const last = target[target.length - 1];
  if (!last || last[0] !== pair[0] || last[1] !== pair[1]) target.push(pair);
}
