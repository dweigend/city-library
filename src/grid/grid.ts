import type { Agent } from "../agent/agent.ts";
import { createOccupancyIndex, readAgentSource } from "./occupancy.ts";
import { createField, reservedFieldKeys, type Field } from "./field.ts";
import { gridIdentity, type GridMembership } from "./membership.ts";
import { createLayoutGrid, type LayoutGrid } from "./layout-grid.ts";
import { diffuseValues } from "./algorithms/diffusion.ts";
import type { Layout } from "./topology/index.ts";
import { frameworkRecord, registerFramework } from "../agent/lifecycle.ts";
import { cloneModelState, validateOptions } from "../agent/state.ts";
import {
  axes,
  finite,
  normalizeSpace,
  position,
  wrap,
  type NormalizedSpace,
  type Position,
  type Space,
} from "../geometry/space.ts";
export type { Field } from "./field.ts";
export type { GridMembership } from "./membership.ts";
export type { LayoutGrid, LayoutField } from "./layout-grid.ts";

type NumericKey<F> = Extract<
  { [K in keyof F]-?: F[K] extends number ? K : never }[keyof F],
  string
>;
/** Regular centered 2D or 3D cells over a Space; Fields are canonical identities. */
export interface Grid<F extends object = {}> extends GridMembership {
  readonly space: NormalizedSpace;
  readonly cellSize: number;
  /** Detached array of all Fields, x fastest, then y, then z. */
  readonly fields: readonly Field<F>[];
  /**
   * The Field containing the position. Wrapped axes wrap the position;
   * hard axes return undefined outside the Space. Upper bounds belong to the last cell.
   */
  fieldAt(position: Position): Field<F> | undefined;
  /** Distinct adjacent Fields, wrapping across wrapped axes; neighborhood defaults to "moore". */
  neighbors(
    field: Field<F>,
    options?: { neighborhood?: "faces" | "moore" },
  ): readonly Field<F>[];
  /** Living Agents of an explicit source located in the Field, in first-seen order. */
  agentsAt<T extends Agent>(
    field: Field<F>,
    options: { source: Iterable<T> },
  ): readonly T[];
  /** Agents of the attached World located in the Field, in admission order. */
  agentsAt(field: Field<F>): readonly Agent[];
  /**
   * One explicit diffusion step for an own writable numeric Field property.
   * Each Field keeps (1 - rate) of its value and shares the rest equally among
   * its neighborhood slots; a slot beyond a hard boundary returns its share.
   * Defaults: rate 0.25, neighborhood "faces". Every value is validated before
   * any Field changes.
   */
  diffuse(
    property: NumericKey<F>,
    options?: { rate?: number; neighborhood?: "faces" | "moore" },
  ): void;
}
const defaultSpace: Space = Object.freeze({ x: 40, y: 40 });
const maximumFields = 1_000_000;
const defaultDiffusionRate = 0.25;

/**
 * Adds a detached Grid. A `{ layout, state }` record creates a LayoutGrid;
 * otherwise the Space (default 40 by 40) must contain whole cells of
 * `cellSize` (default 1), with at most one million Fields.
 */
function create<F extends object>(options: { layout: Layout; state: F }): LayoutGrid<F>;
function create<F extends object>(
  space: Space,
  options: { state: F; cellSize?: number; boundary?: Space["boundary"] },
): Grid<F>;
function create(
  space?: Space,
  options?: { cellSize?: number; boundary?: Space["boundary"] },
): Grid<{}>;
function create<F extends object>(
  input: Space | { layout: Layout; state: F } = defaultSpace,
  options: { state?: F; cellSize?: number; boundary?: Space["boundary"] } = {},
): Grid<F> | LayoutGrid<F> {
  if (
    arguments.length > 2 ||
    (arguments.length > 0 && arguments[0] === undefined) ||
    (arguments.length > 1 && arguments[1] === undefined)
  )
    throw new TypeError(
      "Grid.create accepts Space and options without placeholders.",
    );
  if (typeof input === "object" && input !== null && Object.hasOwn(input, "layout")) {
    if (arguments.length !== 1) throw new TypeError("Layout Grid.create accepts one options record.");
    return createLayoutGrid<F>(input as { layout: Layout; state: F });
  }
  const opts = validateOptions(options, ["state", "cellSize", "boundary"]);
  const space = normalizeSpace(input as Space, opts.boundary as Space["boundary"]);
  const cellSize = finite(opts.cellSize ?? 1);
  if (cellSize <= 0) throw new RangeError("Cell size must be positive.");
  const counts = axes
    .slice(0, space.dimensions)
    .map((axis) => space[axis]! / cellSize);
  if (counts.some((count) => !Number.isSafeInteger(count) || count <= 0))
    throw new RangeError("Space must contain whole cells.");
  const size = counts.reduce((a, b) => a * b, 1);
  if (!Number.isSafeInteger(size) || size > maximumFields)
    throw new RangeError("Too many fields.");
  const initial = (Object.hasOwn(opts, "state") ? opts.state : {}) as F;
  // Validate the initial state once before allocation; every Field clones it again.
  cloneModelState(initial, reservedFieldKeys, "Field");
  const fields: Field<F>[] = [];
  const indices = new Map<Field<F>, number>();
  let occupancy: ReturnType<typeof createOccupancyIndex<Field<F>>> | undefined;
  function checkArguments(args: IArguments, min: number, max: number) {
    if (
      args.length < min ||
      args.length > max ||
      Array.from(args).some((value) => value === undefined)
    )
      throw new TypeError(
        "Invalid Grid method arguments or undefined placeholder.",
      );
  }
  function requireField(field: Field<F>): number {
    const index = indices.get(field);
    if (index === undefined)
      throw new TypeError("Expected a field of this Grid.");
    return index;
  }
  function coordinates(index: number): number[] {
    const x = index % counts[0]!,
      y = Math.floor(index / counts[0]!) % counts[1]!;
    return space.dimensions === 2
      ? [x, y]
      : [x, y, Math.floor(index / (counts[0]! * counts[1]!))];
  }
  function at(index: readonly number[]): Field<F> | undefined {
    const actual: number[] = [];
    for (let axis = 0; axis < space.dimensions; axis++) {
      const count = counts[axis]!,
        value = index[axis]!;
      if (value < 0 || value >= count) {
        if (space.boundary[axes[axis]!] !== "wrap") return undefined;
        actual.push(((value % count) + count) % count);
      } else actual.push(value);
    }
    return fields[
      actual[0]! + counts[0]! * (actual[1]! + (actual[2] ?? 0) * counts[1]!)
    ];
  }
  // Inputs have already been checked by position() or are canonical Agent
  // coordinates. Avoid allocating position/index arrays for every occupancy
  // candidate; the Grid still queries current positions and owns no index/cache.
  function cellIndex(value: number, axis: 0 | 1 | 2): number | undefined {
    const name = axes[axis];
    const extent = space[name]!;
    if (space.boundary[name] === "wrap") value = wrap(value, extent);
    else if (value < -extent / 2 || value > extent / 2) return undefined;
    return Math.min(counts[axis]! - 1, Math.floor((value + extent / 2) / cellSize));
  }
  function fieldAtCoordinates(x: number, y: number, z?: number): Field<F> | undefined {
    const ix = cellIndex(x, 0);
    const iy = cellIndex(y, 1);
    if (ix === undefined || iy === undefined) return undefined;
    if (space.dimensions === 2) return fields[ix + counts[0]! * iy];
    const iz = cellIndex(z!, 2);
    return iz === undefined ? undefined : fields[ix + counts[0]! * (iy + counts[1]! * iz)];
  }
  // Diffusion uses directional slots, including repeated/self targets on tiny wraps.
  // Neighbor queries separately deduplicate canonical identities.
  function slots(neighborhood: "faces" | "moore"): number[][] {
    const result: number[][] = [];
    const zReach = space.dimensions === 3 ? 1 : 0;
    for (let z = -zReach; z <= zReach; z++)
      for (let y = -1; y <= 1; y++)
        for (let x = -1; x <= 1; x++) {
          if (x === 0 && y === 0 && z === 0) continue;
          if (
            neighborhood === "faces" &&
            Math.abs(x) + Math.abs(y) + Math.abs(z) !== 1
          )
            continue;
          result.push(space.dimensions === 2 ? [x, y] : [x, y, z]);
        }
    return result;
  }
  function neighborhood(value: unknown, defaultValue: "faces" | "moore") {
    const result = value ?? defaultValue;
    if (result !== "faces" && result !== "moore")
      throw new TypeError("Invalid neighborhood.");
    return result;
  }
  const grid: Grid<F> = {
    [gridIdentity]: true,
    space,
    cellSize,
    get fields() {
      return Object.freeze([...fields]);
    },
    fieldAt(value) {
      checkArguments(arguments, 1, 1);
      const point = position(value, space.dimensions);
      return fieldAtCoordinates(point.x, point.y, point.z);
    },
    neighbors(field, options = {}) {
      checkArguments(arguments, 1, 2);
      const index = coordinates(requireField(field));
      const opts = validateOptions(options, ["neighborhood"]);
      const result = new Set<Field<F>>();
      for (const offset of slots(neighborhood(opts.neighborhood, "moore"))) {
        const found = at(index.map((value, i) => value + offset[i]!));
        if (found && found !== field) result.add(found);
      }
      return Object.freeze([...result]);
    },
    agentsAt: function agentsAt(
      field: Field<F>,
      options?: { source: Iterable<Agent> },
    ) {
      checkArguments(arguments, 1, 2);
      const target = coordinates(requireField(field));
      const opts = validateOptions(arguments.length === 1 ? {} : options, [
        "source",
      ]);
      if (opts.source === undefined) {
        const world = frameworkRecord(grid)?.world;
        if (!world) throw new TypeError("Detached Grid requires an explicit source.");
        if (!occupancy?.matches(world))
          occupancy = createOccupancyIndex(world, grid, space.dimensions,
            (agent) => fieldAtCoordinates(agent.x, agent.y, agent.z));
        return occupancy.query(field);
      }
      const candidates = readAgentSource(opts.source, space.dimensions);
      return Object.freeze(
        candidates.filter(
          (agent) => agent.alive &&
            cellIndex(agent.x, 0) === target[0] &&
            cellIndex(agent.y, 1) === target[1] &&
            (space.dimensions === 2 || cellIndex(agent.z!, 2) === target[2]),
        ),
      );
    } as Grid<F>["agentsAt"],
    diffuse(property, options = {}) {
      checkArguments(arguments, 1, 2);
      const opts = validateOptions(options, ["rate", "neighborhood"]);
      const rate = finite(opts.rate ?? defaultDiffusionRate);
      if (rate < 0 || rate > 1)
        throw new RangeError("Diffusion rate must be in [0,1].");
      const offsets = slots(neighborhood(opts.neighborhood, "faces"));
      // Validate all sources and outputs before committing any field.
      const old = fields.map((field) => {
        const descriptor = Object.getOwnPropertyDescriptor(field, property);
        if (!descriptor || !("value" in descriptor) || !descriptor.writable)
          throw new TypeError(
            "Diffusion needs an own writable numeric property.",
          );
        return finite(descriptor.value);
      });
      if (rate === 0) return;
      const next = diffuseValues(old, rate, (source) => {
        const index = coordinates(source);
        return offsets.map((offset) => {
          const target = at(index.map((value, i) => value + offset[i]!));
          return target ? indices.get(target)! : source;
        });
      });
      for (let index = 0; index < fields.length; index++)
        Object.defineProperty(fields[index]!, property, { value: next[index] });
    },
  };
  registerFramework(grid, "grid");
  for (let index = 0; index < size; index++) {
    const indicesValue = coordinates(index);
    const field = createField(initial, grid, {
      x: -space.x / 2 + (indicesValue[0]! + 0.5) * cellSize,
      y: -space.y / 2 + (indicesValue[1]! + 0.5) * cellSize,
      ...(space.dimensions === 3
        ? { z: -space.z! / 2 + (indicesValue[2]! + 0.5) * cellSize }
        : {}),
    });
    fields.push(field);
    indices.set(field, index);
  }
  return Object.freeze(grid);
}
export const Grid = Object.freeze({ create });
