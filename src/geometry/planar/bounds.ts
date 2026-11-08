import type { Bounds } from "../mapping.ts";
import type { PlanarDataset, PlanarFeature } from "./types.ts";
import type { Point } from "./predicates.ts";
import { array, field, polygon, record, xy } from "./validation.ts";

/** Pure geometry observation. Metadata and codec/containment budgets are outside this query. */
export function bounds(input: PlanarDataset | readonly PlanarFeature[]): Bounds | undefined {
  const features = array(Array.isArray(input) ? input : field(record(input), "features"));
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  function include(p: Point): void {
    minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
  }
  // Active paths detect cycles; completed objects allow acyclic shared subgraphs.
  // Both sets are per-call: caller mutations are revalidated on subsequent calls.
  const active = new Set<object>(), completed = new Set<object>();
  type Frame = { value: unknown; leave?: boolean };
  const stack: Frame[] = [];
  for (const item of features) {
    const feature = record(item);
    if (field(feature, "type") !== "Feature") throw new TypeError("Expected a Feature.");
    const geometry = field(feature, "geometry");
    if (geometry !== null) stack.push({ value: geometry });
  }
  while (stack.length) {
    const frame = stack.pop()!, value = record(frame.value);
    if (frame.leave) { active.delete(value); completed.add(value); continue; }
    if (active.has(value)) throw new TypeError("Cyclic GeometryCollection.");
    if (completed.has(value)) continue;
    const type = field(value, "type");
    if (type === "GeometryCollection") {
      const children = array(field(value, "geometries"));
      active.add(value); stack.push({ value, leave: true });
      for (let i = children.length - 1; i >= 0; i--) stack.push({ value: children[i] });
      continue;
    }
    const coordinates = field(value, "coordinates");
    switch (type) {
      case "Point": include(xy(coordinates)); break;
      case "MultiPoint": case "LineString":
        for (const pair of array(coordinates, type === "LineString" ? 2 : 0)) include(xy(pair));
        break;
      case "MultiLineString":
        for (const line of array(coordinates)) for (const pair of array(line, 2)) include(xy(pair));
        break;
      case "Polygon":
        for (const ring of polygon(coordinates)) for (const p of ring) include(p);
        break;
      case "MultiPolygon":
        for (const member of array(coordinates)) for (const ring of polygon(member)) for (const p of ring) include(p);
        break;
      default: throw new TypeError("Unsupported planar geometry type.");
    }
    completed.add(value);
  }
  return minX === Infinity ? undefined : Object.freeze([minX, maxX, minY, maxY] as const);
}
