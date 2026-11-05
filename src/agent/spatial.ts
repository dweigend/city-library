import type { Agent } from "./agent.ts";
import { requireAgent, requireLivingAgent } from "./lifecycle.ts";
import { validateOptions } from "./state.ts";
import {
  axes,
  dimension,
  displacement,
  equalSpace,
  finite,
  normalizePosition,
  normalizeSpace,
  position,
  relativePosition,
  type NormalizedSpace,
  type Position,
  type Space,
  type Vector,
} from "../geometry/space.ts";
import { basis, turn } from "./orientation.ts";
export interface SpatialOptions {
  position?: Position;
  orientation?: { heading?: number; pitch?: number; roll?: number };
}
export interface SpatialMethods {
  move(distance?: number, options?: { space?: Space }): void;
  move(
    options: { by: Vector; space?: Space } | { to: Position; space?: Space },
  ): void;
  rotate(angle?: number, options?: { axis?: "x" | "y" | "z" }): void;
  rotate(options: { towards: Position; space?: Space }): void;
  distanceTo(target: Position, options?: { space?: Space }): number;
  directionTo(
    target: Position,
    options?: { space?: Space },
  ): Readonly<{ heading: number; pitch?: number }> | undefined;
  neighbors<T extends Agent>(options: {
    source: Iterable<T>;
    radius?: number;
    angle?: number;
    space?: Space;
  }): readonly T[];
  neighbors(options?: {
    radius?: number;
    angle?: number;
    space?: Space;
  }): readonly Agent[];
}
export function createSpatial(agent: Agent, options: SpatialOptions) {
  let coordinates = position(
    options.position === undefined ? { x: 0, y: 0 } : options.position,
  );
  const dim = dimension(coordinates);
  let orientation = basis(
    validateOptions(
      options.orientation === undefined ? {} : options.orientation,
      ["heading", "pitch", "roll"],
    ),
    dim,
  );
  function context(explicit?: Space): NormalizedSpace | undefined {
    const active = agent.world?.space;
    const supplied =
      explicit === undefined ? undefined : normalizeSpace(explicit);
    if (active && supplied && !equalSpace(active, supplied))
      throw new TypeError("Explicit Space conflicts with World.");
    const result = active ?? supplied;
    if (result && result.dimensions !== dim)
      throw new TypeError("Space dimensions disagree.");
    return result;
  }
  function checkArguments(args: IArguments, min: number, max: number) {
    if (
      args.length < min ||
      args.length > max ||
      Array.from(args).some((value) => value === undefined)
    )
      throw new TypeError(
        "Invalid spatial method arguments or undefined placeholder.",
      );
  }
  function requireLive() {
    requireLivingAgent(agent);
  }
  function delta(target: Position, space?: Space) {
    requireLive();
    return displacement(coordinates, position(target, dim), context(space));
  }
  function direction(target: Position, space?: Space) {
    const d = delta(target, space),
      length = finite(Math.hypot(d.x, d.y, d.z ?? 0));
    if (length === 0) return undefined;
    const heading =
      d.x === 0 && d.y === 0
        ? orientation.read().heading
        : turn((Math.atan2(d.x, d.y) * 180) / Math.PI);
    return Object.freeze(
      dim === 2
        ? { heading }
        : {
            heading,
            pitch: (Math.atan2(d.z!, Math.hypot(d.x, d.y)) * 180) / Math.PI,
          },
    );
  }
  const move: SpatialMethods["move"] = function move(
    input: number | { by?: Vector; to?: Position; space?: Space } = 1,
    extra: { space?: Space } = {},
  ) {
    checkArguments(arguments, 0, 2);
    if (typeof input !== "number" && arguments.length > 1)
      throw new TypeError("Options-form move accepts one argument.");
    requireLive();
    let by: Position | undefined;
    let to: Position | undefined;
    let space: NormalizedSpace | undefined;
    if (typeof input === "number") {
      const opts = validateOptions(extra, ["space"]);
      space = context(opts.space as Space | undefined);
      const distance = finite(input);
      const f = orientation.forward();
      by = {
        x: f.x * distance,
        y: f.y * distance,
        ...(dim === 3 ? { z: f.z! * distance } : {}),
      };
    } else {
      const opts = validateOptions(input, ["by", "to", "space"]);
      if ((opts.by === undefined) === (opts.to === undefined))
        throw new TypeError("Choose exactly one move mode.");
      space = context(opts.space as Space | undefined);
      if (opts.to !== undefined) to = position(opts.to as Position, dim);
      else {
        const vector = validateOptions(opts.by, axes.slice(0, dim));
        by = {
          x: finite(vector.x ?? 0),
          y: finite(vector.y ?? 0),
          ...(dim === 3 ? { z: finite(vector.z ?? 0) } : {}),
        };
      }
    }
    const next = to
      ? space
        ? normalizePosition(to, space)!
        : to
      : relativePosition(coordinates, by!, space);
    coordinates = next;
  } as SpatialMethods["move"];
  const methods: SpatialMethods = {
    move,
    rotate: function rotate(
      input: number | { towards: Position; space?: Space } = 0,
      extra: { axis?: "x" | "y" | "z" } = {},
    ) {
      checkArguments(arguments, 0, 2);
      if (typeof input !== "number" && arguments.length > 1)
        throw new TypeError("Options-form rotate accepts one argument.");
      requireLive();
      if (typeof input === "number") {
        const opts = validateOptions(extra, ["axis"]);
        const axis = opts.axis ?? "z";
        if (!["x", "y", "z"].includes(axis as string))
          throw new TypeError("Invalid axis.");
        orientation.rotate(finite(input), axis as "x" | "y" | "z");
      } else {
        const opts = validateOptions(input, ["towards", "space"]);
        const facing = direction(
          opts.towards as Position,
          opts.space as Space | undefined,
        );
        if (facing) orientation = basis(facing, dim);
      }
    } as SpatialMethods["rotate"],
    distanceTo(target, opts = {}) {
      checkArguments(arguments, 1, 2);
      const values = validateOptions(opts, ["space"]);
      const d = delta(target, values.space as Space | undefined);
      return finite(Math.hypot(d.x, d.y, d.z ?? 0));
    },
    directionTo(target, opts = {}) {
      checkArguments(arguments, 1, 2);
      const values = validateOptions(opts, ["space"]);
      return direction(target, values.space as Space | undefined);
    },
    neighbors: function neighbors(opts = {}) {
      checkArguments(arguments, 0, 1);
      requireLive();
      const values = validateOptions(opts, [
        "source",
        "radius",
        "angle",
        "space",
      ]);
      const space = context(values.space as Space | undefined);
      const radius = finite(values.radius ?? 1),
        angle = finite(values.angle ?? 360);
      if (radius < 0 || angle < 0 || angle > 360)
        throw new RangeError("Invalid perception bounds.");
      const source =
        values.source === undefined ? agent.world?.agents : values.source;
      if (source === undefined)
        throw new TypeError("Detached agent requires a source.");
      if (
        (typeof source !== "object" && typeof source !== "function") ||
        source === null ||
        typeof (source as Iterable<Agent>)[Symbol.iterator] !== "function"
      )
        throw new TypeError("Expected an iterable Agent source.");
      const population = [...new Set(source as Iterable<Agent>)];
      for (const candidate of population) {
        requireAgent(candidate);
        position(candidate, dim);
      }
      const forward = orientation.forward();
      return Object.freeze(
        population.filter((candidate) => {
          if (candidate === agent || !candidate.alive) return false;
          const d = displacement(coordinates, candidate, space),
            length = finite(Math.hypot(d.x, d.y, d.z ?? 0));
          if (length > radius) return false;
          return (
            length === 0 ||
            angle === 360 ||
            (d.x * forward.x +
              d.y * forward.y +
              (d.z ?? 0) * (forward.z ?? 0)) /
              length >=
              Math.cos((angle * Math.PI) / 360) - 1e-12
          );
        }),
      );
    } as SpatialMethods["neighbors"],
  };
  return {
    methods,
    position: () => ({ ...coordinates }),
    orientation: () => orientation.read(),
    dimension: dim,
  };
}
