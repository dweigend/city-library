import { direction } from "./direction.ts";
import { normalize } from "./normalization.ts";
import { distance } from "./distance.ts";

/** Delivered pure spatial operations; broader geometry contracts remain separate slices. */
export const geometry = Object.freeze({ direction, normalize, distance });
