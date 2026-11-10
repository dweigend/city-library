import { validateOptions } from "../agent/state.ts";
import { finite, position } from "./space.ts";

/** Axis-aligned envelope in minX, maxX, minY, maxY order. */
export type Bounds = readonly [number, number, number, number];

/**
 * Pure affine XY mapping, with optional aspect-preserving centered padding.
 * "uniform-centered" (default) scales both axes by the smaller ratio and centers the result;
 * "independent-axes" stretches each axis separately. Every intermediate value must stay finite.
 */
export function map(
  point: { x: number; y: number },
  options: { from: Bounds; to: Bounds; mode?: "uniform-centered" | "independent-axes" },
): { readonly x: number; readonly y: number } {
  if (arguments.length !== 2) throw new TypeError("Map requires a point and affine options.");
  const values = validateOptions(options, ["from", "to", "mode"]);
  const mode = values.mode === undefined ? "uniform-centered" : values.mode;
  if (mode !== "uniform-centered" && mode !== "independent-axes") throw new TypeError("Invalid affine mode.");
  const from = readBounds(values.from);
  const to = readBounds(values.to);
  const sourceWidth = requirePositive(from[1] - from[0]);
  const sourceHeight = requirePositive(from[3] - from[2]);
  const targetWidth = requirePositive(to[1] - to[0]);
  const targetHeight = requirePositive(to[3] - to[2]);
  let scaleX = requirePositive(targetWidth / sourceWidth);
  let scaleY = requirePositive(targetHeight / sourceHeight);
  let paddingX = 0;
  let paddingY = 0;
  if (mode === "uniform-centered") {
    const scale = Math.min(scaleX, scaleY);
    scaleX = scale;
    scaleY = scale;
    paddingX = centeredPadding(targetWidth, sourceWidth, scale);
    paddingY = centeredPadding(targetHeight, sourceHeight, scale);
  }
  const input = position(point, 2);
  const deltaX = finite(input.x - from[0], "Affine displacement");
  const deltaY = finite(input.y - from[2], "Affine displacement");
  const originX = finite(to[0] + paddingX, "Affine origin");
  const originY = finite(to[2] + paddingY, "Affine origin");
  return Object.freeze({
    x: finite(originX + representableProduct(deltaX, scaleX), "Mapped x"),
    y: finite(originY + representableProduct(deltaY, scaleY), "Mapped y"),
  });
}

function readBounds(value: unknown): Bounds {
  // Four indices plus length: no holes and no extra own properties.
  if (!Array.isArray(value) || value.length !== 4 || Reflect.ownKeys(value).length !== 5) {
    throw new TypeError("Bounds must be a dense four-number array.");
  }
  const values: number[] = [];
  for (let index = 0; index < 4; index++) {
    const descriptor = Object.getOwnPropertyDescriptor(value, String(index));
    if (!descriptor || !("value" in descriptor)) throw new TypeError("Bounds require own data coordinates.");
    values.push(finite(descriptor.value, "Bounds coordinate"));
  }
  return [values[0]!, values[1]!, values[2]!, values[3]!];
}

function requirePositive(value: number): number {
  finite(value, "Affine extent or scale");
  if (value <= 0) throw new RangeError("Affine extents and scales must be strictly positive and representable.");
  return value;
}

/** Rejects overflow and underflow of a product of two nonzero factors. */
function representableProduct(a: number, b: number): number {
  const result = finite(a * b, "Affine product");
  if (a !== 0 && b !== 0 && result === 0) throw new RangeError("Affine product is not representable.");
  return result;
}

/** Half of the target extent left over after uniform scaling. */
function centeredPadding(targetExtent: number, sourceExtent: number, scale: number): number {
  return representableProduct(finite(targetExtent - representableProduct(sourceExtent, scale)), 0.5);
}
