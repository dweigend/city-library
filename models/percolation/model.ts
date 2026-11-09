/** Adapted from NetLogo Percolation, Uri Wilensky (1998), CC BY-NC-SA 3.0.
 * Exact NetLogo 7.0.4 source, attribution and adaptations: source.nlogox / NOTICE.md.
 * Readable headless composition of public City Library operations.
 */
import { Grid, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface PercolationParameters {
  width: number;
  height: number;
  seed: number;
  porosity: number;
}
export const inputs: Inputs<PercolationParameters> = {
  width: { kind: "number", default: 150, min: 3, max: 300, integer: true },
  height: {
    kind: "number",
    default: 221,
    min: 3,
    max: 301,
    integer: true,
    step: 2,
  },
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  porosity: { kind: "number", default: 60.5, min: 0, max: 99, step: 0.5 },
};
type Kind = "soil" | "rock" | "oil" | "saturated";
export function create(options: Partial<PercolationParameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.add({ seed: settings.seed });
  const world = World.add({ random });
  const grid = Grid.add(
    {
      x: settings.width,
      y: settings.height,
      boundary: { x: "hard", y: "wrap" },
    },
    { state: { kind: "soil" as Kind } },
  );
  world.add(grid);
  const fields = grid.fields;
  const origin = fields[0]!;
  const column = (field: typeof origin) => field.x - origin.x;
  const row = (field: typeof origin) => field.y - origin.y;
  let currentRow = settings.height - 1,
    totalOil = 0;
  const history: Readonly<{ tick: number; totalOil: number; front: number }>[] =
    [];
  function front() {
    return fields.filter(
      (field) => row(field) === currentRow && field.kind === "oil",
    );
  }
  function resetColor(field: typeof origin) {
    field.kind = (column(field) + row(field)) % 2 === 1 ? "soil" : "rock";
  }
  function record() {
    history.push(
      Object.freeze({
        tick: world.tick.value,
        totalOil,
        front: front().length,
      }),
    );
    if (history.length > 1001) history.splice(1, 1);
  }
  function setup(columns: readonly number[]) {
    for (const field of fields) resetColor(field);
    currentRow = settings.height - 1;
    for (const c of columns)
      fields[currentRow * settings.width + c]!.kind = "oil";
    totalOil = 0;
    world.tick.reset();
    history.length = 0;
    record();
  }
  function percolate() {
    const parents = front();
    for (const parent of random.sample(parents, { count: parents.length })) {
      // Public Grid owns hard-edge lookup. Canonical fields are updated immediately,
      // so a failed first trial leaves soil available for the next parent to retry.
      const targets = [-1, 1]
        .map((dx) => grid.fieldAt({ x: parent.x + dx, y: parent.y - 1 }))
        .filter((field): field is typeof origin => field !== undefined);
      for (const target of random.sample(targets, { count: targets.length }))
        if (target.kind === "soil" && random.number() * 100 < settings.porosity)
          target.kind = "oil";
      parent.kind = "saturated";
      totalOil++;
    }
    currentRow--;
  }
  function wrapOil() {
    if (currentRow !== 0) return;
    for (const bottom of fields.filter((field) => row(field) === 0))
      grid.fieldAt({ x: bottom.x, y: bottom.y - 1 })!.kind = bottom.kind;
    for (const field of fields)
      if (row(field) < settings.height - 1) resetColor(field);
    currentRow = settings.height - 1;
  }
  setup(
    Array.from({ length: settings.width }, (_, c) => c).filter(
      (c) => c % 2 === 1,
    ),
  );
  return {
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i++) {
        if (front().length === 0) break;
        run(world, () => {
          percolate();
          wrapOil();
        });
        record();
      }
    },
    setRules(rules: Partial<Pick<PercolationParameters, "porosity">>) {
      if (
        !rules ||
        typeof rules !== "object" ||
        ![Object.prototype, null].includes(Object.getPrototypeOf(rules)) ||
        Reflect.ownKeys(rules).some(
          (key) =>
            key !== "porosity" ||
            !("value" in Object.getOwnPropertyDescriptor(rules, key)!),
        )
      )
        throw new TypeError("Supply only porosity data.");
      settings = parameters(inputs, { ...settings, ...rules });
    },
    setFront(columns: readonly number[]) {
      if (!Array.isArray(columns))
        throw new TypeError("Supply a dense array of odd columns.");
      const copied = Array.from({ length: columns.length }, (_, i) => {
        const entry = Object.getOwnPropertyDescriptor(columns, i);
        if (
          !entry ||
          !("value" in entry) ||
          !Number.isSafeInteger(entry.value) ||
          entry.value < 0 ||
          entry.value >= settings.width ||
          entry.value % 2 !== 1
        )
          throw new RangeError("Supply odd in-range column data.");
        return entry.value as number;
      });
      if (new Set(copied).size !== copied.length)
        throw new RangeError("Columns must be unique.");
      setup(copied);
    },
    read() {
      const count = front().length;
      return Object.freeze({
        tick: world.tick.value,
        width: settings.width,
        height: settings.height,
        parameters: settings,
        cells: Object.freeze(
          fields.map((field) =>
            Object.freeze({
              id: field.id,
              x: field.x,
              y: field.y,
              column: column(field),
              row: row(field),
              kind: field.kind,
            }),
          ),
        ),
        currentRow,
        totalOil,
        counts: Object.freeze({ front: count }),
        done: count === 0,
        history: Object.freeze([...history]),
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: "Percolation",
  description:
    "Sequential oil entry and scrolling soil. Uri Wilensky (1998), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<PercolationParameters, ReturnType<typeof create>>;
