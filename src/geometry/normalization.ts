import { validateOptions } from "../agent/state.ts";
import { axes, normalizePosition, normalizeSpace, type Position, type Space } from "./space.ts";

/** Normalize supplied coordinates without moving an owner or clipping hard-boundary escapes. */
export function normalize(
  point: Position,
  options: { space: Space; endpoints?: "closed" | "half-open" },
): Position | undefined {
  if (arguments.length !== 2) throw new TypeError("Normalize requires a point and spatial options.");
  const values = validateOptions(options, ["space", "endpoints"]);
  const endpoints = values.endpoints === undefined ? "closed" : values.endpoints;
  if (endpoints !== "closed" && endpoints !== "half-open") throw new TypeError("Invalid endpoint policy.");
  const space = normalizeSpace(values.space as Space);
  const normalized = normalizePosition(point, space, false);
  if (normalized === undefined) return undefined;
  if (endpoints === "half-open") {
    for (const axis of axes.slice(0, space.dimensions))
      if (space.boundary[axis] === "hard" && normalized[axis] === space[axis]! / 2)
        return undefined;
  }
  return Object.freeze(normalized);
}
