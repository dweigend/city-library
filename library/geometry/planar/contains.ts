import { validateOptions } from "../../agent/state.ts";
import { position } from "../space.ts";
import { classify, point } from "./predicates.ts";
import { containmentLimits, containmentPolygon, field, record } from "./validation.ts";
import type { PlanarPolygon } from "./types.ts";

/**
 * Exact planar membership; validates the complete Polygon on every call.
 * Boundary points count as inside unless `boundary` is "exclude"; points in holes are outside.
 */
export function contains(
  shape: PlanarPolygon,
  query: { x: number; y: number },
  options?: { boundary?: "include" | "exclude" },
): boolean {
  const values = options === undefined ? {} : validateOptions(options, ["boundary"]);
  const boundary = values.boundary === undefined ? "include" : values.boundary;
  if (boundary !== "include" && boundary !== "exclude") throw new TypeError("Invalid containment boundary policy.");
  const input = position(query, 2);
  if (Math.abs(input.x) > containmentLimits.magnitude || Math.abs(input.y) > containmentLimits.magnitude) {
    throw new RangeError("Containment query magnitude exceeded.");
  }
  const value = record(shape);
  if (field(value, "type") !== "Polygon") throw new TypeError("Contains requires a Polygon.");
  const rings = containmentPolygon(field(value, "coordinates"));
  const p = point(input.x, input.y);
  const exterior = classify(rings[0]!, p);
  if (exterior === 0) return boundary === "include";
  if (exterior === -1) return false;
  for (let i = 1; i < rings.length; i++) {
    const location = classify(rings[i]!, p);
    if (location === 0) return boundary === "include";
    if (location === 1) return false;
  }
  return true;
}
