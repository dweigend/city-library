import { issueId, registerFramework } from "../agent/lifecycle.ts";
import { cloneModelState } from "../agent/state.ts";
import type { Position } from "../geometry/space.ts";
import type { Grid } from "./grid.ts";

/** Canonical Grid-owned state, with its actual owning Grid type. */
export type Field<F extends object = {}, Owner extends object = Grid<F>> = F & {
  readonly id: string;
  readonly grid: Owner;
  readonly x: number;
  readonly y: number;
  readonly z: number | undefined;
};

export const reservedFieldKeys = new Set(["id", "grid", "x", "y", "z"]);

export function createField<F extends object, Owner extends object>(
  initial: F,
  grid: Owner,
  position: Position,
): Field<F, Owner> {
  const field = cloneModelState(initial, reservedFieldKeys, "Field") as Field<F, Owner>;
  Object.defineProperties(field, {
    id: { value: issueId(), enumerable: true },
    grid: { value: grid, enumerable: true },
    x: { value: position.x, enumerable: true },
    y: { value: position.y, enumerable: true },
    z: { value: position.z, enumerable: true },
  });
  registerFramework(field, "field");
  return field;
}
