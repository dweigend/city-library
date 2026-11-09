/** NetLogo Hex Cell Aggregation, Wilensky (2007), CC BY-NC-SA 3.0.
 * Source-specific offset-column hex cells compose the public bounded Grid.
 */
import { Grid, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";

export interface HexParameters {
  width: number;
  height: number;
  seed: number;
  oneNeighbor: boolean;
  twoNeighbors: boolean;
  threeNeighbors: boolean;
  fourNeighbors: boolean;
  fiveNeighbors: boolean;
  sixNeighbors: boolean;
}
const switchKeys = [
  "oneNeighbor",
  "twoNeighbors",
  "threeNeighbors",
  "fourNeighbors",
  "fiveNeighbors",
  "sixNeighbors",
] as const;
export const inputs: Inputs<HexParameters> = {
  width: { kind: "number", default: 101, min: 3, max: 201, integer: true },
  height: { kind: "number", default: 101, min: 3, max: 201, integer: true },
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  oneNeighbor: { kind: "boolean", default: true },
  twoNeighbors: { kind: "boolean", default: true },
  threeNeighbors: { kind: "boolean", default: true },
  fourNeighbors: { kind: "boolean", default: true },
  fiveNeighbors: { kind: "boolean", default: true },
  sixNeighbors: { kind: "boolean", default: true },
};
export function create(options: Partial<HexParameters> = {}) {
  let settings = parameters(inputs, options);
  if (settings.width % 2 !== 1 || settings.height % 2 !== 1)
    throw new RangeError("Hex source coordinates require odd dimensions.");
  const random = Random.add({ seed: settings.seed });
  const space = {
    x: settings.width,
    y: settings.height,
    boundary: "hard" as const,
  };
  const world = World.add(space, { random });
  const grid = Grid.add(space, {
    state: { alive: false, liveNeighborCount: 0, eligible: false },
  });
  world.add(grid);
  const fields = grid.fields;
  type Cell = (typeof fields)[number];
  function hexNeighbors(cell: Cell): readonly Cell[] {
    // Even-column cells are half a row lower in source display coordinates.
    const offsets =
      cell.x % 2 === 0
        ? [
            [0, 1],
            [1, 0],
            [1, -1],
            [0, -1],
            [-1, -1],
            [-1, 0],
          ]
        : [
            [0, 1],
            [1, 1],
            [1, 0],
            [0, -1],
            [-1, 0],
            [-1, 1],
          ];
    return offsets.flatMap(([dx, dy]) => {
      const field = grid.fieldAt({ x: cell.x + dx!, y: cell.y + dy! });
      return field ? [field] : [];
    });
  }
  const adjacency = new Map(
    fields.map((field) => [field, hexNeighbors(field)]),
  );
  let switches: readonly number[] = Object.freeze(
    switchKeys.flatMap((key, index) => (settings[key] ? [index + 1] : [])),
  );
  const eligibles = new Set<Cell>();
  function updateEligibility(cell: Cell) {
    cell.eligible = !cell.alive && switches.includes(cell.liveNeighborCount);
    if (cell.eligible) eligibles.add(cell);
    else eligibles.delete(cell);
  }
  function becomeAlive(cell: Cell) {
    cell.alive = true;
    cell.eligible = false;
    eligibles.delete(cell);
    for (const neighbor of adjacency.get(cell)!) {
      neighbor.liveNeighborCount++;
      updateEligibility(neighbor);
    }
  }
  function readSwitches(values?: readonly number[]) {
    let next: readonly number[];
    if (values === undefined)
      next = switchKeys.flatMap((key, index) =>
        settings[key] ? [index + 1] : [],
      );
    else {
      if (!Array.isArray(values))
        throw new TypeError(
          "Supply an array of accepted live-neighbor counts.",
        );
      const checked = Array.from({ length: values.length }, (_, index) => {
        const descriptor = Object.getOwnPropertyDescriptor(values, index);
        if (
          !descriptor ||
          !("value" in descriptor) ||
          !Number.isSafeInteger(descriptor.value) ||
          descriptor.value < 1 ||
          descriptor.value > 6
        )
          throw new RangeError(
            "Accepted neighbor counts must be dense integers 1..6.",
          );
        return descriptor.value as number;
      });
      next = [...new Set(checked)].sort((a, b) => a - b);
    }
    switches = Object.freeze([...next]);
    for (const field of fields) updateEligibility(field);
  }
  for (const field of fields) updateEligibility(field);
  becomeAlive(grid.fieldAt({ x: 0, y: 0 })!);
  return {
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count && eligibles.size; i++)
        run(world, () => {
          // Source one-of eligibles: uniform over eligible identities, one activation.
          becomeAlive(random.sample(eligibles)[0]!);
        });
    },
    readSwitches,
    setSwitches(
      field: Partial<Pick<HexParameters, (typeof switchKeys)[number]>>,
    ) {
      if (
        !field ||
        typeof field !== "object" ||
        ![Object.prototype, null].includes(Object.getPrototypeOf(field)) ||
        Reflect.ownKeys(field).some(
          (key) =>
            typeof key !== "string" ||
            !(switchKeys as readonly string[]).includes(key) ||
            !("value" in Object.getOwnPropertyDescriptor(field, key)!),
        )
      )
        throw new TypeError("Supply only pending neighbor switches.");
      settings = parameters(inputs, { ...settings, ...field });
      // Source edits do not apply until read-switches or setup.
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        width: settings.width,
        height: settings.height,
        parameters: settings,
        switches,
        eligibleCount: eligibles.size,
        done: eligibles.size === 0,
        cells: Object.freeze(
          fields.map((field) =>
            Object.freeze({
              id: field.id,
              x: field.x,
              y: field.y,
              displayY: field.y - (field.x % 2 === 0 ? 0.5 : 0),
              alive: field.alive,
              liveNeighborCount: field.liveNeighborCount,
              eligible: field.eligible,
              neighborIds: Object.freeze(
                adjacency.get(field)!.map((neighbor) => neighbor.id),
              ),
            }),
          ),
        ),
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: "Hex Cell Aggregation",
  description:
    "Single-cell growth on a bounded six-neighbor hex lattice. Wilensky (2007), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<HexParameters, ReturnType<typeof create>>;
