import { direction } from "./direction.ts";
import { normalize } from "./normalization.ts";
import { distance } from "./distance.ts";
import { map } from "./mapping.ts";
export type { Bounds } from "./mapping.ts";

/** Delivered pure spatial operations; broader geometry contracts remain separate slices. */
export const geometry = Object.freeze({ direction, normalize, distance, map });
