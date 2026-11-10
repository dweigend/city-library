import { validateOptions } from "../agent/state.ts";
import { finite, type Orientation, type Position } from "./space.ts";

/** A detached forward vector; pitch explicitly selects XYZ, and roll never changes forward. */
export function direction(orientation: Orientation): Position {
  if (arguments.length !== 1) throw new TypeError("Direction requires one orientation.");
  const values = validateOptions(orientation, ["heading", "pitch", "roll"]);
  const heading = finite(values.heading, "Heading");
  const xyz = values.pitch !== undefined;
  const pitch = xyz ? finite(values.pitch, "Pitch") : 0;
  if (values.roll !== undefined) {
    finite(values.roll, "Roll");
    if (!xyz) throw new TypeError("A rolled XYZ direction requires explicit pitch.");
  }
  const h = (heading % 360) * Math.PI / 180;
  const p = (pitch % 360) * Math.PI / 180;
  const cosPitch = Math.cos(p);
  return Object.freeze({
    x: Math.sin(h) * cosPitch,
    y: Math.cos(h) * cosPitch,
    ...(xyz ? { z: Math.sin(p) } : {}),
  });
}
