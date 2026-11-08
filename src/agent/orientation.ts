import { finite, type Orientation, type Position } from "../geometry/space.ts";
type V = [number, number, number];
const dot = (a: V, b: V) =>
  a.reduce((sum, value, index) => sum + value * b[index]!, 0);
const cross = (a: V, b: V): V => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const unit = (v: V): V => {
  const n = Math.hypot(...v);
  return v.map((x) => x / n) as V;
};
const radians = (a: number) => (a * Math.PI) / 180;
const degrees = (a: number) => (a * 180) / Math.PI;
export const turn = (a: number) => ((a % 360) + 360) % 360;
export function basis(orientation: Partial<Orientation>, dim: 2 | 3) {
  let right: V = [1, 0, 0],
    forward: V = [0, 1, 0],
    up: V = [0, 0, 1];
  function rotate(angle: number, axis: "x" | "y" | "z") {
    finite(angle);
    if (dim === 2 && axis !== "z")
      throw new TypeError("XY supports only z rotation.");
    if (angle % 360 === 0) return;
    const a = radians(angle % 360),
      c = Math.cos(a),
      s = Math.sin(a);
    const mix = (v: V, w: V, k: number): V =>
      v.map((x, i) => x * c + w[i]! * s * k) as V;
    if (axis === "z") {
      const r = right;
      right = mix(right, forward, -1);
      forward = mix(forward, r, 1);
    } else if (axis === "x") {
      const f = forward;
      forward = mix(forward, up, 1);
      up = mix(up, f, -1);
    } else {
      const r = right;
      right = mix(right, up, -1);
      up = mix(up, r, 1);
    }
    forward = unit(forward);
    right = unit(right);
    up = unit(cross(right, forward));
    right = unit(cross(forward, up));
  }
  rotate(orientation.heading ?? 0, "z");
  if (dim === 3) {
    rotate(orientation.pitch ?? 0, "x");
    rotate(orientation.roll ?? 0, "y");
  } else if (orientation.pitch !== undefined || orientation.roll !== undefined)
    throw new TypeError("XY has no pitch or roll.");
  function read(): Orientation {
    const pitch = Math.asin(Math.max(-1, Math.min(1, forward[2])));
    const heading = turn(
      degrees(
        Math.abs(Math.cos(pitch)) <= 1e-12
          ? Math.atan2(-right[1], right[0])
          : Math.atan2(forward[0], forward[1]),
      ),
    );
    const h = radians(heading),
      r0: V = [Math.cos(h), -Math.sin(h), 0],
      u0 = cross(r0, forward);
    const roll =
      Math.abs(Math.cos(pitch)) <= 1e-12
        ? 0
        : ((((degrees(Math.atan2(-dot(right, u0), dot(right, r0))) + 180) %
            360) +
            360) %
            360) -
          180;
    return dim === 2 ? { heading } : { heading, pitch: degrees(pitch), roll };
  }
  return {
    rotate,
    read,
    forward: (): Position =>
      dim === 2
        ? { x: forward[0], y: forward[1] }
        : { x: forward[0], y: forward[1], z: forward[2] },
  };
}
