import type { Bounds } from "../mapping.ts";
import type { PlanarDataset, PlanarFeature } from "./types.ts";
import type { Point } from "./predicates.ts";
import { array, field, polygon, record, xy } from "./validation.ts";

/**
 * Pure geometry observation. Metadata and codec/containment budgets are outside this query.
 * Returns undefined when no feature has a position, including null geometries.
 */
export function bounds(input: PlanarDataset | readonly PlanarFeature[]): Bounds | undefined {
  const features = array(Array.isArray(input) ? input : field(record(input), "features"));
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  function include(position: Point): void {
    minX = Math.min(minX, position.x);
    maxX = Math.max(maxX, position.x);
    minY = Math.min(minY, position.y);
    maxY = Math.max(maxY, position.y);
  }
  // Active paths detect cycles; completed objects allow acyclic shared subgraphs.
  // Both sets are per-call: caller mutations are revalidated on subsequent calls.
  const active = new Set<object>();
  const completed = new Set<object>();
  type Frame = { value: unknown; leave?: boolean };
  const stack: Frame[] = [];
  for (const item of features) {
    const feature = record(item);
    if (field(feature, "type") !== "Feature") throw new TypeError("Expected a Feature.");
    const geometry = field(feature, "geometry");
    if (geometry !== null) stack.push({ value: geometry });
  }
  // Depth-first traversal in feature and child order without recursion.
  while (stack.length) {
    const frame = stack.pop()!;
    const value = record(frame.value);
    if (frame.leave) {
      active.delete(value);
      completed.add(value);
      continue;
    }
    if (active.has(value)) throw new TypeError("Cyclic GeometryCollection.");
    if (completed.has(value)) continue;
    const type = field(value, "type");
    if (type === "GeometryCollection") {
      const children = array(field(value, "geometries"));
      active.add(value);
      stack.push({ value, leave: true });
      for (let i = children.length - 1; i >= 0; i--) stack.push({ value: children[i] });
      continue;
    }
    visitPositions(type, field(value, "coordinates"), include);
    completed.add(value);
  }
  return minX === Infinity ? undefined : Object.freeze([minX, maxX, minY, maxY] as const);
}

/** Validates the coordinates of one non-collection geometry and visits each position. */
function visitPositions(type: unknown, coordinates: unknown, visit: (position: Point) => void): void {
  switch (type) {
    case "Point":
      visit(xy(coordinates));
      return;
    case "MultiPoint":
    case "LineString":
      for (const pair of array(coordinates, type === "LineString" ? 2 : 0)) visit(xy(pair));
      return;
    case "MultiLineString":
      for (const line of array(coordinates)) {
        for (const pair of array(line, 2)) visit(xy(pair));
      }
      return;
    case "Polygon":
      visitPolygon(coordinates, visit);
      return;
    case "MultiPolygon":
      for (const member of array(coordinates)) visitPolygon(member, visit);
      return;
    default:
      throw new TypeError("Unsupported planar geometry type.");
  }
}

function visitPolygon(coordinates: unknown, visit: (position: Point) => void): void {
  for (const ring of polygon(coordinates)) {
    for (const position of ring) visit(position);
  }
}
