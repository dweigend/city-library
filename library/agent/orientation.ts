import { finite, type Orientation, type Position } from "../geometry/space.ts";

/** Cartesian [x, y, z] components of a frame vector. */
type Vector3 = [number, number, number];
type RotationAxis = "x" | "y" | "z";

/** At or below this |cos(pitch)| the forward vector counts as vertical. */
const gimbalLockTolerance = 1e-12;

function dot(left: Vector3, right: Vector3): number {
  return left.reduce((sum, value, index) => sum + value * right[index]!, 0);
}
function cross(left: Vector3, right: Vector3): Vector3 {
  return [
    left[1] * right[2] - left[2] * right[1],
    left[2] * right[0] - left[0] * right[2],
    left[0] * right[1] - left[1] * right[0],
  ];
}
function unit(vector: Vector3): Vector3 {
  const length = Math.hypot(...vector);
  return vector.map((component) => component / length) as Vector3;
}
function radians(angle: number): number {
  return (angle * Math.PI) / 180;
}
export function degrees(angle: number): number {
  return (angle * 180) / Math.PI;
}
/** Normalizes degrees into [0, 360). */
export function normalizeDegrees(angle: number): number {
  return ((angle % 360) + 360) % 360;
}
/** Normalizes degrees into [-180, 180). */
function normalizeSignedDegrees(angle: number): number {
  return normalizeDegrees(angle + 180) - 180;
}

/**
 * Orthonormal right/forward/up frame in degrees. Construction applies
 * heading about z, then pitch about x and roll about y; XY frames support
 * only heading. `rotate` turns the current frame about one local axis.
 */
export function basis(orientation: Partial<Orientation>, dimensions: 2 | 3) {
  let right: Vector3 = [1, 0, 0];
  let forward: Vector3 = [0, 1, 0];
  let up: Vector3 = [0, 0, 1];

  function rotate(angle: number, axis: RotationAxis) {
    finite(angle);
    if (dimensions === 2 && axis !== "z")
      throw new TypeError("XY supports only z rotation.");
    if (angle % 360 === 0) return;
    const angleRadians = radians(angle % 360);
    const cosine = Math.cos(angleRadians);
    const sine = Math.sin(angleRadians);
    // Rotates `vector` within its plane with `other`; `sign` selects the turn direction.
    const mix = (vector: Vector3, other: Vector3, sign: number): Vector3 =>
      vector.map((component, index) => component * cosine + other[index]! * sine * sign) as Vector3;
    if (axis === "z") {
      const previousRight = right;
      right = mix(right, forward, -1);
      forward = mix(forward, previousRight, 1);
    } else if (axis === "x") {
      const previousForward = forward;
      forward = mix(forward, up, 1);
      up = mix(up, previousForward, -1);
    } else {
      const previousRight = right;
      right = mix(right, up, -1);
      up = mix(up, previousRight, 1);
    }
    // Re-orthonormalize so rounding cannot accumulate into a skewed frame.
    forward = unit(forward);
    right = unit(right);
    up = unit(cross(right, forward));
    right = unit(cross(forward, up));
  }

  rotate(orientation.heading ?? 0, "z");
  if (dimensions === 3) {
    rotate(orientation.pitch ?? 0, "x");
    rotate(orientation.roll ?? 0, "y");
  } else if (orientation.pitch !== undefined || orientation.roll !== undefined)
    throw new TypeError("XY has no pitch or roll.");

  function read(): Orientation {
    const pitch = Math.asin(Math.max(-1, Math.min(1, forward[2])));
    const vertical = Math.abs(Math.cos(pitch)) <= gimbalLockTolerance;
    // A vertical forward vector has no horizontal heading; derive it from right instead.
    const headingSource = vertical
      ? Math.atan2(-right[1], right[0])
      : Math.atan2(forward[0], forward[1]);
    const heading = normalizeDegrees(degrees(headingSource));
    // Roll is measured against the unrolled frame with the same heading and pitch.
    const headingRadians = radians(heading);
    const unrolledRight: Vector3 = [Math.cos(headingRadians), -Math.sin(headingRadians), 0];
    const unrolledUp = cross(unrolledRight, forward);
    const roll = vertical
      ? 0
      : normalizeSignedDegrees(degrees(Math.atan2(-dot(right, unrolledUp), dot(right, unrolledRight))));
    if (dimensions === 2) return { heading };
    return { heading, pitch: degrees(pitch), roll };
  }

  function forwardDirection(): Position {
    if (dimensions === 2) return { x: forward[0], y: forward[1] };
    return { x: forward[0], y: forward[1], z: forward[2] };
  }

  return { rotate, read, forward: forwardDirection };
}
