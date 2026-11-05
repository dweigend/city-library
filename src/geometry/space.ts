import { frameworkRecord } from "../agent/lifecycle.ts";
import { validateOptions } from "../agent/state.ts";
export interface Position {
  readonly x: number;
  readonly y: number;
  readonly z?: number;
}
export interface Vector {
  readonly x?: number;
  readonly y?: number;
  readonly z?: number;
}
export interface Orientation {
  readonly heading: number;
  readonly pitch?: number;
  readonly roll?: number;
}
export type Boundary = "hard" | "wrap";
export interface Space {
  readonly x: number;
  readonly y: number;
  readonly z?: number;
  readonly dimensions?: 2 | 3;
  readonly boundary?:
    | Boundary
    | { readonly x?: Boundary; readonly y?: Boundary; readonly z?: Boundary };
}
export interface NormalizedSpace extends Space {
  readonly dimensions: 2 | 3;
  readonly boundary: Readonly<{ x: Boundary; y: Boundary; z?: Boundary }>;
}
export const axes = ["x", "y", "z"] as const;
export function finite(value: unknown, name = "Value"): number {
  if (typeof value !== "number")
    throw new TypeError(`${name} must be numeric.`);
  if (!Number.isFinite(value)) throw new RangeError(`${name} must be finite.`);
  return value;
}
export function normalizeSpace(
  value: Space,
  boundary?: Space["boundary"],
): NormalizedSpace {
  const input = validateOptions(value, [
    "x",
    "y",
    "z",
    "dimensions",
    "boundary",
  ]);
  const dimensions = input.z === undefined ? 2 : 3;
  if (input.dimensions !== undefined && input.dimensions !== dimensions)
    throw new TypeError("Space dimensions disagree with axes.");
  const result: {
    x: number;
    y: number;
    z?: number;
    dimensions: 2 | 3;
    boundary: { x: Boundary; y: Boundary; z?: Boundary };
  } = {
    x: finite(input.x),
    y: finite(input.y),
    dimensions,
    boundary: { x: "hard", y: "hard" },
  };
  if (dimensions === 3) result.z = finite(input.z);
  for (const axis of axes.slice(0, dimensions))
    if (result[axis]! <= 0)
      throw new RangeError("Space extents must be positive.");
  const rules = boundary === undefined ? input.boundary : boundary;
  if (rules !== undefined) {
    if (typeof rules === "string") {
      if (rules !== "hard" && rules !== "wrap")
        throw new TypeError("Invalid boundary.");
      result.boundary.x = rules;
      result.boundary.y = rules;
      if (dimensions === 3) result.boundary.z = rules;
    } else {
      const record = validateOptions(rules, axes.slice(0, dimensions));
      for (const axis of axes.slice(0, dimensions)) {
        const rule = record[axis] ?? "hard";
        if (rule !== "hard" && rule !== "wrap")
          throw new TypeError("Invalid boundary.");
        result.boundary[axis] = rule;
      }
    }
  } else if (dimensions === 3) result.boundary.z = "hard";
  Object.freeze(result.boundary);
  return Object.freeze(result);
}
function coordinateValues(value: Position): Record<string, unknown> {
  const framework = frameworkRecord(value);
  if (framework) {
    if (framework.kind !== "agent" && framework.kind !== "field") {
      throw new TypeError("Only Agent and Field identities are positions.");
    }
    return { x: value.x, y: value.y, z: value.z };
  }
  return validateOptions(value, ["x", "y", "z"]);
}
export function dimension(value: Position): 2 | 3 {
  return coordinateValues(value).z === undefined ? 2 : 3;
}
export function position(value: Position, dimensions?: 2 | 3): Position {
  const values = coordinateValues(value);
  const dim = values.z === undefined ? 2 : 3;
  if (dimensions !== undefined && dim !== dimensions)
    throw new TypeError("Position dimensions disagree.");
  const result: { x: number; y: number; z?: number } = {
    x: finite(values.x),
    y: finite(values.y),
  };
  if (dim === 3) result.z = finite(values.z);
  return result;
}
export function equalSpace(a: NormalizedSpace, b: NormalizedSpace): boolean {
  return (
    a.dimensions === b.dimensions &&
    axes
      .slice(0, a.dimensions)
      .every(
        (axis) => a[axis] === b[axis] && a.boundary[axis] === b.boundary[axis],
      )
  );
}
export function wrap(value: number, extent: number): number {
  let result = value % extent;
  const half = extent / 2;
  if (result < -half) result += extent;
  else if (result >= half) result -= extent;
  return Object.is(result, -0) ? 0 : result;
}
export function normalizePosition(
  value: Position,
  space: NormalizedSpace,
  reject = true,
): Position | undefined {
  const input = position(value, space.dimensions);
  const output = { ...input };
  for (const axis of axes.slice(0, space.dimensions)) {
    const coordinate = input[axis]!;
    const extent = space[axis]!;
    if (space.boundary[axis] === "wrap")
      output[axis] = finite(wrap(coordinate, extent));
    else if (coordinate < -extent / 2 || coordinate > extent / 2) {
      if (reject) throw new RangeError("Position outside hard boundary.");
      return undefined;
    }
  }
  return output;
}
export function displacement(
  from: Position,
  to: Position,
  space?: NormalizedSpace,
): Position {
  const dim = dimension(from);
  const a = position(from, dim);
  const b = position(to, dim);
  const result = {
    x: b.x - a.x,
    y: b.y - a.y,
    ...(dim === 3 ? { z: b.z! - a.z! } : {}),
  };
  for (const axis of axes.slice(0, dim)) {
    if (space?.boundary[axis] === "wrap")
      result[axis] = wrap(result[axis]!, space[axis]!);
    finite(result[axis]);
  }
  return result;
}
export function relativePosition(
  from: Position,
  by: Position,
  space?: NormalizedSpace,
): Position {
  const start = position(from);
  const dim = dimension(start);
  const delta = position(by, dim);
  let fraction = 1;
  const intersections = new Map<
    (typeof axes)[number],
    { fraction: number; boundary: number }
  >();
  if (space) {
    for (const axis of axes.slice(0, dim)) {
      if (space.boundary[axis] !== "hard") continue;
      const half = space[axis]! / 2;
      if (start[axis]! < -half || start[axis]! > half) {
        throw new RangeError("Relative movement starts outside hard Space.");
      }
      if (delta[axis] === 0) continue;
      const boundary = delta[axis]! > 0 ? half : -half;
      const intersection = (boundary - start[axis]!) / delta[axis]!;
      intersections.set(axis, { fraction: intersection, boundary });
      fraction = Math.min(fraction, intersection);
    }
  }
  const result: { x: number; y: number; z?: number } = {
    x: finite(start.x + delta.x * fraction),
    y: finite(start.y + delta.y * fraction),
    ...(dim === 3 ? { z: finite(start.z! + delta.z! * fraction) } : {}),
  };
  if (space) {
    for (const axis of axes.slice(0, dim)) {
      if (space.boundary[axis] !== "hard") continue;
      const intersection = intersections.get(axis);
      const half = space[axis]! / 2;
      // A limiting coordinate is exact; other coordinates only clamp clip roundoff.
      result[axis] =
        intersection?.fraction === fraction
          ? intersection.boundary
          : Math.max(-half, Math.min(half, result[axis]!));
    }
  }
  return space ? normalizePosition(result, space)! : result;
}
