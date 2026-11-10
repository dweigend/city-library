import type { Agent } from "./agent.ts";
import { notifyMovement, requireAgent, requireLivingAgent } from "./lifecycle.ts";
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
import { basis, degrees, normalizeDegrees } from "./orientation.ts";

/** Absorbs rounding at the edge of a perception cone. */
const perceptionConeTolerance = 1e-12;
/** Construction-only Agent placement; position defaults to the XY origin. */
export interface SpatialOptions {
  position?: Position;
  orientation?: { heading?: number; pitch?: number; roll?: number };
}
/** Spatial Agent methods; all reject deleted Agents and undefined placeholders. */
export interface SpatialMethods {
  /** Moves forward by `distance` (default 1), by a vector or to a position. */
  move(distance?: number, options?: { space?: Space }): void;
  move(
    options: { by: Vector; space?: Space } | { to: Position; space?: Space },
  ): void;
  /** Rotates by degrees about a local axis (default "z"), or faces `towards`. */
  rotate(angle?: number, options?: { axis?: "x" | "y" | "z" }): void;
  rotate(options: { towards: Position; space?: Space }): void;
  distanceTo(target: Position, options?: { space?: Space }): number;
  /** Heading (and pitch in XYZ) towards target; undefined at zero distance. */
  directionTo(
    target: Position,
    options?: { space?: Space },
  ): Readonly<{ heading: number; pitch?: number }> | undefined;
  /**
   * Living Agents within `radius` (default 1) and the forward perception
   * cone of `angle` degrees (default 360), excluding this Agent. Without
   * `source`, an attached Agent searches its World's agents.
   */
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
/** Owns one Agent's coordinates and orientation frame. */
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
  /** World Space wins; an explicit Space must agree with it. */
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
    const offset = delta(target, space);
    const length = finite(Math.hypot(offset.x, offset.y, offset.z ?? 0));
    if (length === 0) return undefined;
    // A purely vertical target keeps the current heading.
    const heading =
      offset.x === 0 && offset.y === 0
        ? orientation.read().heading
        : normalizeDegrees(degrees(Math.atan2(offset.x, offset.y)));
    if (dim === 2) return Object.freeze({ heading });
    // XYZ positions always carry z.
    const pitch = degrees(Math.atan2(offset.z!, Math.hypot(offset.x, offset.y)));
    return Object.freeze({ heading, pitch });
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
      const settings = validateOptions(extra, ["space"]);
      space = context(settings.space as Space | undefined);
      const distance = finite(input);
      const forward = orientation.forward();
      by = {
        x: forward.x * distance,
        y: forward.y * distance,
        ...(dim === 3 ? { z: forward.z! * distance } : {}),
      };
    } else {
      const settings = validateOptions(input, ["by", "to", "space"]);
      if ((settings.by === undefined) === (settings.to === undefined))
        throw new TypeError("Choose exactly one move mode.");
      space = context(settings.space as Space | undefined);
      if (settings.to !== undefined) to = position(settings.to as Position, dim);
      else {
        const vector = validateOptions(settings.by, axes.slice(0, dim));
        by = {
          x: finite(vector.x ?? 0),
          y: finite(vector.y ?? 0),
          ...(dim === 3 ? { z: finite(vector.z ?? 0) } : {}),
        };
      }
    }
    if (to === undefined) {
      // Every branch without a target position computes `by`.
      coordinates = relativePosition(coordinates, by!, space);
    } else if (space) {
      // Rejecting normalization throws instead of returning undefined.
      coordinates = normalizePosition(to, space)!;
    } else {
      coordinates = to;
    }
    notifyMovement(agent);
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
        const settings = validateOptions(extra, ["axis"]);
        const axis = settings.axis ?? "z";
        if (!["x", "y", "z"].includes(axis as string))
          throw new TypeError("Invalid axis.");
        orientation.rotate(finite(input), axis as "x" | "y" | "z");
      } else {
        const settings = validateOptions(input, ["towards", "space"]);
        const facing = direction(
          settings.towards as Position,
          settings.space as Space | undefined,
        );
        if (facing) orientation = basis(facing, dim);
      }
    } as SpatialMethods["rotate"],
    distanceTo(target, opts = {}) {
      checkArguments(arguments, 1, 2);
      const values = validateOptions(opts, ["space"]);
      const offset = delta(target, values.space as Space | undefined);
      return finite(Math.hypot(offset.x, offset.y, offset.z ?? 0));
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
      const radius = finite(values.radius ?? 1);
      const angle = finite(values.angle ?? 360);
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
      // `angle` spans the whole cone, so its edge lies at half the angle from forward.
      const halfAngleRadians = (angle * Math.PI) / 360;
      const minimumCosine = Math.cos(halfAngleRadians) - perceptionConeTolerance;
      function perceives(candidate: Agent): boolean {
        if (candidate === agent || !candidate.alive) return false;
        const offset = displacement(coordinates, candidate, space);
        const length = finite(Math.hypot(offset.x, offset.y, offset.z ?? 0));
        if (length > radius) return false;
        if (length === 0 || angle === 360) return true;
        const forwardProjection =
          offset.x * forward.x + offset.y * forward.y + (offset.z ?? 0) * (forward.z ?? 0);
        return forwardProjection / length >= minimumCosine;
      }
      return Object.freeze(population.filter(perceives));
    } as SpatialMethods["neighbors"],
  };
  return {
    methods,
    position: () => ({ ...coordinates }),
    orientation: () => orientation.read(),
    dimension: dim,
  };
}
