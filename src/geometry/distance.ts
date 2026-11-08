import { validateOptions } from "../agent/state.ts";
import { displacement, finite, normalizeSpace, position, type Position, type Space } from "./space.ts";

/** Measure a finite displacement; hard-boundary measurements do not clip their endpoints. */
export function distance(
  from: Position,
  to: Position,
  options: { space: Space; wrap?: boolean },
): number {
  if (arguments.length !== 3) throw new TypeError("Distance requires two positions and spatial options.");
  const values = validateOptions(options, ["space", "wrap"]);
  const wrap = values.wrap === undefined ? true : values.wrap;
  if (typeof wrap !== "boolean") throw new TypeError("Wrap must be boolean.");
  const space = normalizeSpace(values.space as Space);
  const a = position(from, space.dimensions);
  const b = position(to, space.dimensions);
  const delta = displacement(a, b, wrap ? space : undefined);
  return finite(Math.hypot(delta.x, delta.y, ...(space.dimensions === 3 ? [delta.z!] : [])), "Distance");
}
