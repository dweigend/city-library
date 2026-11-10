import { validateOptions } from "../agent/state.ts";
import { displacement, finite, normalizeSpace, position, type Position, type Space } from "./space.ts";

/**
 * Measure a finite Euclidean displacement; hard-boundary measurements do not clip their endpoints.
 * Wrap axes use the shortest wrapped displacement unless `wrap` is false (default true).
 */
export function distance(
  from: Position,
  to: Position,
  options: { space: Space; wrap?: boolean },
): number {
  if (arguments.length !== 3) throw new TypeError("Distance requires two positions and spatial options.");
  const values = validateOptions(options, ["space", "wrap"]);
  const wrap = values.wrap === undefined ? true : values.wrap;
  if (typeof wrap !== "boolean") throw new TypeError("Wrap must be boolean.");
  const space = normalizeSpace(values.space);
  const a = position(from, space.dimensions);
  const b = position(to, space.dimensions);
  const delta = displacement(a, b, wrap ? space : undefined);
  const length = space.dimensions === 3 ? Math.hypot(delta.x, delta.y, delta.z!) : Math.hypot(delta.x, delta.y);
  return finite(length, "Distance");
}
