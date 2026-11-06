import { validateOptions } from "../agent/state.ts";
import { finite, position } from "./space.ts";

/** Axis-aligned envelope in minX, maxX, minY, maxY order. */
export type Bounds = readonly [number, number, number, number];

function bounds(value: unknown): Bounds {
  if (!Array.isArray(value) || value.length !== 4 || Reflect.ownKeys(value).length !== 5)
    throw new TypeError("Bounds must be a dense four-number array.");
  const values: number[] = [];
  for (let index = 0; index < 4; index++) {
    const descriptor = Object.getOwnPropertyDescriptor(value, String(index));
    if (!descriptor || !("value" in descriptor)) throw new TypeError("Bounds require own data coordinates.");
    values.push(finite(descriptor.value, "Bounds coordinate"));
  }
  return [values[0]!, values[1]!, values[2]!, values[3]!];
}
function positive(value: number): number {
  finite(value, "Affine extent or scale");
  if (value <= 0) throw new RangeError("Affine extents and scales must be strictly positive and representable.");
  return value;
}
function product(a: number, b: number): number {
  const result = finite(a * b, "Affine product");
  if (a !== 0 && b !== 0 && result === 0) throw new RangeError("Affine product is not representable.");
  return result;
}

/** Pure affine XY mapping, with optional aspect-preserving centered padding. */
export function map(
  point: { x: number; y: number },
  options: { from: Bounds; to: Bounds; mode?: "uniform-centered" | "independent-axes" },
): { readonly x: number; readonly y: number } {
  if (arguments.length !== 2) throw new TypeError("Map requires a point and affine options.");
  const values = validateOptions(options, ["from", "to", "mode"]);
  const mode = values.mode === undefined ? "uniform-centered" : values.mode;
  if (mode !== "uniform-centered" && mode !== "independent-axes") throw new TypeError("Invalid affine mode.");
  const from = bounds(values.from), to = bounds(values.to);
  const sourceWidth = positive(from[1] - from[0]), sourceHeight = positive(from[3] - from[2]);
  const targetWidth = positive(to[1] - to[0]), targetHeight = positive(to[3] - to[2]);
  let scaleX = positive(targetWidth / sourceWidth), scaleY = positive(targetHeight / sourceHeight);
  let paddingX = 0, paddingY = 0;
  if (mode === "uniform-centered") {
    scaleX = scaleY = Math.min(scaleX, scaleY);
    paddingX = product(finite(targetWidth - product(sourceWidth, scaleX)), 0.5);
    paddingY = product(finite(targetHeight - product(sourceHeight, scaleY)), 0.5);
  }
  const input = position(point, 2);
  const deltaX = finite(input.x - from[0], "Affine displacement");
  const deltaY = finite(input.y - from[2], "Affine displacement");
  const originX = finite(to[0] + paddingX, "Affine origin"), originY = finite(to[2] + paddingY, "Affine origin");
  return Object.freeze({
    x: finite(originX + product(deltaX, scaleX), "Mapped x"),
    y: finite(originY + product(deltaY, scaleY), "Mapped y"),
  });
}
