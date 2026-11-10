/** Adapted from NetLogo Life, Uri Wilensky (1998), CC BY-NC-SA 3.0.
 * Exact NetLogo 7.0.4 source, attribution and adaptations: source.nlogox / NOTICE.md.
 * Readable headless composition of public City Library operations.
 */
import { Grid, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";
export interface LifeParameters {
  width: number;
  height: number;
  seed: number;
  initialDensity: number;
  initialization: "random" | "blank";
  foreground: string;
  background: string;
}
export const inputs: Inputs<LifeParameters> = {
  width: { kind: "number", default: 101, min: 3, max: 301, integer: true },
  height: { kind: "number", default: 101, min: 3, max: 301, integer: true },
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  initialDensity: { kind: "number", default: 35, min: 0, max: 100, step: 0.1 },
  initialization: {
    kind: "choice",
    default: "random",
    options: ["random", "blank"],
  },
  foreground: { kind: "text", default: "#660f40" },
  background: { kind: "text", default: "#d2ece4" },
};
export function create(options: Partial<LifeParameters> = {}) {
  let settings = parseParameters(inputs, options);
  function validateColors(colors: { foreground: string; background: string }) {
    if (
      ![colors.foreground, colors.background].every((color) =>
        /^#[0-9a-f]{6}$/i.test(color),
      )
    )
      throw new RangeError("Use six-digit hex colors.");
  }
  validateColors(settings);
  const random = Random.create({ seed: settings.seed });
  const world = World.create({ random });
  const grid = Grid.create(
    { x: settings.width, y: settings.height, boundary: "wrap" },
    { state: { living: false, color: settings.background } },
  );
  world.add(grid);
  const fields = grid.fields;
  const neighbors = fields.map((field) => grid.neighbors(field));
  let drawing = false;
  let brush: boolean | null = null;
  const history: Readonly<{ tick: number; livingFieldCount: number; density: number }>[] =
    [];
  function livingCount() {
    return fields.reduce((sum, field) => sum + Number(field.living), 0);
  }
  function record() {
    const livingFieldCount = livingCount();
    const point = Object.freeze({
      tick: world.tick.value,
      livingFieldCount: livingFieldCount,
      density: livingFieldCount / fields.length,
    });
    if (history.at(-1)?.tick === point.tick)
      history[history.length - 1] = point;
    else history.push(point);
    if (history.length > 1001) history.splice(1, 1);
  }
  function setLiving(field: (typeof fields)[number], living: boolean) {
    field.living = living;
    field.color = living ? settings.foreground : settings.background;
  }
  function exactField(position: { x: number; y: number }) {
    if (
      !position ||
      typeof position !== "object" ||
      Reflect.ownKeys(position).some(
        (key) =>
          !["x", "y"].includes(String(key)) ||
          !("value" in Object.getOwnPropertyDescriptor(position, key)!),
      )
    )
      throw new TypeError("Supply x and y data coordinates.");
    const field = grid.fieldAt(position);
    if (!field || field.x !== position.x || field.y !== position.y)
      throw new RangeError("Drawing requires an exact in-bounds field center.");
    return field;
  }
  function nextGeneration() {
    const totals = neighbors.map((group) =>
      group.reduce((sum, field) => sum + Number(field.living), 0),
    );
    fields.forEach((field, i) => {
      if (totals[i] === 3) setLiving(field, true);
      else if (totals[i] !== 2) setLiving(field, false);
    });
  }

  function flags(values: readonly boolean[]) {
    if (!Array.isArray(values) || values.length !== fields.length)
      throw new RangeError("Supply one boolean data value per field.");
    return Array.from({ length: fields.length }, (_, index) => {
      const entry = Object.getOwnPropertyDescriptor(values, index);
      if (!entry || !("value" in entry) || typeof entry.value !== "boolean")
        throw new TypeError("Supply dense boolean data values.");
      return entry.value as boolean;
    });
  }

  for (const field of fields)
    setLiving(
      field,
      settings.initialization === "random" &&
        random.number() * 100 < settings.initialDensity,
    );
  record();
  return {
    advance(stepCount = 1) {
      validateStepCount(stepCount);
      for (let i = 0; i < stepCount; i++) {
        run(world, nextGeneration);
        record();
      }
    },
    setCells(values: readonly boolean[]) {
      const next = flags(values);
      fields.forEach((field, i) => setLiving(field, next[i]!));
      record();
    },
    setCell(position: { x: number; y: number }, living: boolean) {
      if (typeof living !== "boolean")
        throw new TypeError("Living must be boolean.");
      setLiving(exactField(position), living);
      record();
    },
    setDrawing(enabled: boolean) {
      if (typeof enabled !== "boolean")
        throw new TypeError("Drawing must be boolean.");
      drawing = enabled;
      brush = null;
    },
    beginBrush(position: { x: number; y: number }) {
      const field = exactField(position);
      if (!drawing) return;
      brush = !field.living;
      setLiving(field, brush);
      record();
    },
    moveBrush(position: { x: number; y: number }) {
      const field = exactField(position);
      if (drawing && brush !== null) {
        setLiving(field, brush);
        record();
      }
    },
    endBrush() {
      brush = null;
    },
    setColors(
      colors: Partial<Pick<LifeParameters, "foreground" | "background">>,
    ) {
      if (
        !colors ||
        typeof colors !== "object" ||
        ![Object.prototype, null].includes(Object.getPrototypeOf(colors)) ||
        Reflect.ownKeys(colors).some(
          (key) =>
            !["foreground", "background"].includes(String(key)) ||
            !("value" in Object.getOwnPropertyDescriptor(colors, key)!),
        )
      )
        throw new TypeError("Supply foreground/background data values.");
      const next = parseParameters(inputs, { ...settings, ...colors });
      validateColors(next);
      settings = next;
    },
    recolor() {
      for (const field of fields) setLiving(field, field.living);
    },
    read() {
      const livingFieldCount = livingCount();
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
              living: field.living,
              color: field.color,
            }),
          ),
        ),
        counts: Object.freeze({ livingFieldCount: livingFieldCount, deadFieldCount: fields.length - livingFieldCount }),
        density: livingFieldCount / fields.length,
        done: false,
        drawing,
        brush,
        history: Object.freeze([...history]),
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: "Life",
  description:
    "Synchronous toroidal Game of Life. Uri Wilensky (1998), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<LifeParameters, ReturnType<typeof create>>;
