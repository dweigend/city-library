import { orient, point } from "../../geometry/planar/predicates.ts";
import type { PlanarPolygon, PlanarXY } from "../../geometry/planar/types.ts";

const coordinateLimit = 1e6;
const minimumRelativeTurn = 1e-12;

export function coordinateKey(position: PlanarXY): string {
  return `${position[0]},${position[1]}`;
}

/** Normalize serialization without changing cell or vertex correspondence. */
export function canonicalQuad(corners: readonly PlanarXY[]): PlanarXY[] {
  if (corners.length !== 4) throw new RangeError("Square-target relaxation requires four-corner quads.");
  for (const [x, y] of corners) {
    if (!Number.isFinite(x) || !Number.isFinite(y) || Math.abs(x) > coordinateLimit || Math.abs(y) > coordinateLimit)
      throw new RangeError("Square-target coordinates must be finite and within 1e6.");
  }
  if (new Set(corners.map(coordinateKey)).size !== 4) throw new RangeError("Square-target corners must be distinct.");
  let ordered = [...corners];
  const exact = ordered.map(([x, y]) => point(x, y));
  if (orient(exact[0]!, exact[1]!, exact[2]!) < 0) ordered.reverse();
  requireQuality(ordered);
  let first = 0;
  for (let index = 1; index < 4; index++) if (before(ordered[index]!, ordered[first]!)) first = index;
  return [...ordered.slice(first), ...ordered.slice(0, first)];
}

function before(first: PlanarXY, second: PlanarXY): boolean {
  return first[0] < second[0] || (first[0] === second[0] && first[1] < second[1]);
}

function requireQuality(corners: readonly PlanarXY[]): void {
  const exact = corners.map(([x, y]) => point(x, y));
  let maximumSquaredEdge = 0;
  for (let index = 0; index < 4; index++) {
    const a = corners[index]!, b = corners[(index + 1) % 4]!;
    maximumSquaredEdge = Math.max(maximumSquaredEdge, (b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2);
  }
  for (let index = 0; index < 4; index++) {
    const next = (index + 1) % 4, following = (index + 2) % 4;
    const a = corners[index]!, b = corners[next]!, c = corners[following]!;
    const cross = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]);
    if (orient(exact[index]!, exact[next]!, exact[following]!) <= 0 || !(cross > minimumRelativeTurn * maximumSquaredEdge))
      throw new RangeError("Square-target relaxation requires numerically resolved strictly convex quads.");
  }
}

export function quadPolygons(vertices: readonly PlanarXY[], faces: readonly (readonly number[])[]): PlanarPolygon[] {
  return faces.map(face => {
    const original = face.map(vertex => vertices[vertex]!);
    const corners = canonicalQuad(original);
    // Incidence starts CCW. A candidate must keep that orientation, rather than
    // repairing a flipped face by reversing its serialization.
    const exact = original.slice(0, 3).map(([x, y]) => point(x, y));
    if (orient(exact[0]!, exact[1]!, exact[2]!) <= 0) throw new RangeError("Square-target candidates must preserve face orientation.");
    return { type: "Polygon", coordinates: [[...corners, corners[0]!]] };
  });
}
