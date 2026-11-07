/** Private nominal admission marker shared by regular and layout grids. */
export const gridIdentity: unique symbol = Symbol("Grid membership");

/** State-independent admission type without invented geometric capabilities. */
export interface GridMembership {
  readonly [gridIdentity]: true;
}
