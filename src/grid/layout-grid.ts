import type { Agent } from "../agent/agent.ts";
import { frameworkRecord, registerFramework } from "../agent/lifecycle.ts";
import { cloneModelState, validateOptions } from "../agent/state.ts";
import { position, type Position } from "../geometry/space.ts";
import type { PlanarPolygon } from "../geometry/planar/types.ts";
import { createField, reservedFieldKeys, type Field } from "./field.ts";
import { gridIdentity, type GridMembership } from "./membership.ts";
import { createOccupancyIndex, readAgentSource } from "./occupancy.ts";
import type { Layout } from "./topology/index.ts";
import { requireLayout } from "./topology/layout.ts";

export type LayoutField<F extends object = {}> = Field<F, LayoutGrid<F>>;

/** Immutable topology with canonical mutable Fields; no regular diffusion contract. */
export interface LayoutGrid<F extends object = {}> extends GridMembership {
  readonly layout: Layout;
  /** Detached array with one Field per layout cell, in cell order. */
  readonly fields: readonly LayoutField<F>[];
  /** The Field whose cell contains the XY position, or undefined outside the layout. */
  fieldAt(position: Position): LayoutField<F> | undefined;
  /** Fields of cells that share a boundary edge, in ascending cell order. */
  neighbors(field: LayoutField<F>): readonly LayoutField<F>[];
  /** Living Agents of an explicit source located in the Field, in first-seen order. */
  agentsAt<T extends Agent>(field: LayoutField<F>, options: { source: Iterable<T> }): readonly T[];
  /** Agents of the attached World located in the Field, in admission order. */
  agentsAt(field: LayoutField<F>): readonly Agent[];
}

/** Area centroid is an embedded position, not an address or interior-point guarantee. */
function centroid(shape: PlanarPolygon): Position {
  const ring = shape.coordinates[0]!;
  const origin = ring[0]!;
  let twiceArea = 0;
  let weightedX = 0;
  let weightedY = 0;
  for (let index = 0; index < ring.length - 1; index++) {
    const first = ring[index]!;
    const second = ring[index + 1]!;
    const firstX = first[0] - origin[0];
    const firstY = first[1] - origin[1];
    const secondX = second[0] - origin[0];
    const secondY = second[1] - origin[1];
    const cross = firstX * secondY - secondX * firstY;
    twiceArea += cross;
    weightedX += (firstX + secondX) * cross;
    weightedY += (firstY + secondY) * cross;
  }
  const x = origin[0] + weightedX / (3 * twiceArea);
  const y = origin[1] + weightedY / (3 * twiceArea);
  if (!Number.isFinite(x) || !Number.isFinite(y))
    throw new RangeError("Layout cell centroid is numerically unresolved.");
  return { x, y };
}

function checkArguments(args: IArguments, minimum: number, maximum: number) {
  if (args.length < minimum || args.length > maximum || Array.from(args).some(value => value === undefined))
    throw new TypeError("Invalid layout Grid arguments or undefined placeholder.");
}

export function createLayoutGrid<F extends object>(input: { layout: Layout; state: F }): LayoutGrid<F> {
  const options = validateOptions(input, ["layout", "state"]);
  const layout = requireLayout(options.layout);
  const initial = options.state as F;
  // Validate the initial state once before any geometry work; every Field clones it again.
  cloneModelState(initial, reservedFieldKeys, "Field");
  // Resolve all geometry before publishing/registering any canonical identities.
  const positions = layout.cells.map(cell => centroid(layout.polygon({ cell })));
  const fields: LayoutField<F>[] = [];
  const cellByField = new Map<LayoutField<F>, number>();
  const fieldByCell = new Map<number, LayoutField<F>>();
  let occupancy: ReturnType<typeof createOccupancyIndex<LayoutField<F>>> | undefined;
  function requireField(field: LayoutField<F>): number {
    const cell = cellByField.get(field);
    if (cell === undefined) throw new TypeError("Expected a Field of this layout Grid.");
    return cell;
  }
  function fieldAt(value: Position): LayoutField<F> | undefined {
    const cell = layout.cellAt({ position: position(value, 2) });
    return cell === undefined ? undefined : fieldByCell.get(cell);
  }
  const grid: LayoutGrid<F> = {
    [gridIdentity]: true,
    layout,
    get fields() { return Object.freeze([...fields]); },
    fieldAt(value) {
      checkArguments(arguments, 1, 1);
      return fieldAt(value);
    },
    neighbors(field) {
      checkArguments(arguments, 1, 1);
      const cell = requireField(field);
      return Object.freeze(layout.neighbors({ cell }).map(neighbor => fieldByCell.get(neighbor)!));
    },
    agentsAt: function agentsAt(field: LayoutField<F>, options?: { source: Iterable<Agent> }) {
      checkArguments(arguments, 1, 2);
      requireField(field);
      const values = validateOptions(arguments.length === 1 ? {} : options, ["source"]);
      if (values.source === undefined) {
        const world = frameworkRecord(grid)?.world;
        if (!world) throw new TypeError("Detached Grid requires an explicit source.");
        if (!occupancy?.matches(world))
          occupancy = createOccupancyIndex(world, grid, 2, fieldAt);
        return occupancy.query(field);
      }
      const candidates = readAgentSource(values.source, 2);
      return Object.freeze(candidates.filter(agent => agent.alive && fieldAt(agent) === field));
    } as LayoutGrid<F>["agentsAt"],
  };
  registerFramework(grid, "grid");
  for (const [index, cell] of layout.cells.entries()) {
    const field = createField(initial, grid, positions[index]!);
    fields.push(field);
    cellByField.set(field, cell);
    fieldByCell.set(cell, field);
  }
  return Object.freeze(grid);
}
