import { direction } from "./direction.ts";
import { normalize } from "./normalization.ts";
import { distance } from "./distance.ts";
import { map } from "./mapping.ts";
import { contains } from "./planar/contains.ts";
import { bounds } from "./planar/bounds.ts";
export type { PlanarXY, PlanarPolygon, PlanarGeometry, PlanarJson, PlanarFeature, PlanarDataset } from "./planar/types.ts";
export type { Bounds } from "./mapping.ts";

/** Delivered pure spatial operations; broader geometry contracts remain separate slices. */
export const geometry = Object.freeze({ direction, normalize, distance, map, contains, bounds });
