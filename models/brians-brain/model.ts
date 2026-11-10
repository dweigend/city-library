/** Adapted from Wilensky (2002), CC BY-NC-SA 3.0; exact source/notices adjacent. */
import { Grid, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";
export interface BrainParameters {
  width: number;
  height: number;
  seed: number;
  initialization: "blank" | "random";
  initialDensity: number;
}
export const inputs: Inputs<BrainParameters> = {
  width: { kind: "number", default: 87, min: 3, max: 501, integer: true },
  height: { kind: "number", default: 115, min: 3, max: 501, integer: true },
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  initialization: {
    kind: "choice",
    default: "random",
    options: ["blank", "random"],
  },
  initialDensity: { kind: "number", default: 0.3, min: 0, max: 1 },
};
export function brainTransition(state: number, firingNeighbors: number) {
  if (
    !Number.isSafeInteger(state) ||
    state < 0 ||
    state > 2 ||
    !Number.isSafeInteger(firingNeighbors) ||
    firingNeighbors < 0 ||
    firingNeighbors > 8
  )
    throw new RangeError("Invalid Brian's Brain transition.");
  return state === 1 ? 2 : state === 2 ? 0 : firingNeighbors === 2 ? 1 : 0;
}
export function create(options: Partial<BrainParameters> = {}) {
  let settings = parseParameters(inputs, options);
  if (settings.width % 2 !== 1 || settings.height % 2 !== 1)
    throw new RangeError("Use odd centered dimensions.");
  const { width, height } = settings,
    random = Random.create({ seed: settings.seed }),
    space = { x: width, y: height, boundary: "wrap" as const };
  const world = World.create(space, { random }),
    grid = Grid.create(space, { state: { state: 0 } });
  world.add(grid);
  let drawing = false,
    brush: 1 | 2 = 1,
    erasing: boolean | null = null;
  function setup(kind: "blank" | "random") {
    for (const f of grid.fields)
      f.state =
        kind === "random" && random.number() < settings.initialDensity ? 1 : 0;
    world.tick.reset();
    erasing = null;
  }
  function go() {
    const next = grid.fields.map((f) =>
      brainTransition(
        f.state,
        grid.neighbors(f).filter((n) => n.state === 1).length,
      ),
    );
    grid.fields.forEach((f, i) => {
      f.state = next[i]!;
    });
  }
  function paint(p: { x: number; y: number }, begin: boolean) {
    if (!p || !Number.isFinite(p.x) || !Number.isFinite(p.y))
      throw new RangeError("Expected a finite brush position.");
    const f = grid.fieldAt(p);
    if (!f) return;
    if (begin || erasing === null) erasing = f.state === brush;
    f.state = erasing ? 0 : brush;
  }
  setup(settings.initialization);
  return {
    advance(stepCount = 1) {
      validateStepCount(stepCount);
      run(world, go, stepCount);
    },
    setupBlank() {
      setup("blank");
    },
    setupRandom() {
      setup("random");
    },
    setInitialDensity(initialDensity: number) {
      settings = parseParameters(inputs, { ...settings, initialDensity });
    },
    setCells(values: readonly number[]) {
      if (
        !Array.isArray(values) ||
        values.length !== grid.fields.length ||
        Reflect.ownKeys(values).length !== values.length + 1 ||
        Array.from({ length: values.length }, (_, i) =>
          Object.getOwnPropertyDescriptor(values, String(i)),
        ).some(
          (d) =>
            !d ||
            !("value" in d) ||
            !Number.isSafeInteger(d.value) ||
            d.value < 0 ||
            d.value > 2,
        )
      )
        throw new RangeError("Provide one state (0,1,2) per cell.");
      grid.fields.forEach((f, i) => {
        f.state = values[i]!;
      });
    },
    setDrawing(value: boolean, target: 1 | 2 = brush) {
      if (typeof value !== "boolean" || ![1, 2].includes(target))
        throw new TypeError(
          "Expected drawing boolean and firing/refractory brush.",
        );
      drawing = value;
      brush = target;
      erasing = null;
    },
    beginBrush(p: { x: number; y: number }) {
      paint(p, true);
    },
    moveBrush(p: { x: number; y: number }) {
      if (erasing !== null) paint(p, false);
    },
    endBrush() {
      erasing = null;
    },
    read() {
      return Object.freeze({
        width,
        height,
        tick: world.tick.value,
        done: false,
        drawing,
        brush,
        parameters: settings,
        randomState: random.state,
        counts: Object.freeze({
          firingFieldCount: grid.fields.filter((f) => f.state === 1).length,
          refractoryFieldCount: grid.fields.filter((f) => f.state === 2).length,
          inactiveFieldCount: grid.fields.filter((f) => f.state === 0).length,
        }),
        cells: Object.freeze(
          grid.fields.map((f) =>
            Object.freeze({ id: f.id, x: f.x, y: f.y, state: f.state }),
          ),
        ),
      });
    },
  };
}
export const model = {
  title: "Brian's Brain",
  description: "Cells cycle through firing, refractory and resting states, creating moving sparks. Wilensky (2002), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<BrainParameters, ReturnType<typeof create>>;
