import { validateOptions } from "../../agent/state.ts";
import { polygonArea, readShape, type ParcelShape } from "./parcel-input.ts";

/** Net area, independent of winding; holes subtract and components add. */
export function area(options: { shape: ParcelShape }): number {
  const input = validateOptions(options, ["shape"]);
  const shape = readShape(input.shape);
  if (shape.type === "Polygon") return polygonArea(shape);
  const result = shape.coordinates.reduce((sum, coordinates) => sum + polygonArea({ type: "Polygon", coordinates }), 0);
  if (!Number.isFinite(result)) throw new RangeError("Area overflow.");
  return result;
}
