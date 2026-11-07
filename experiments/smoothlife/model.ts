/** NetLogo SmoothLife, Head & Wilensky (2017), CC BY-NC-SA 3.0.
 * See source.nlogox and NOTICE.md. Public Grid owns all live cell values.
 */
import { Grid, Random, World, geometry, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";

export interface SmoothLifeParameters {
  width: number;
  height: number;
  seed: number;
  innerRadius: number;
  outerRadius: number;
  minBirth: number;
  maxBirth: number;
  minSurvive: number;
  maxSurvive: number;
  innerStepWidth: number;
  outerStepWidth: number;
  paintValue: number;
  paintRadius: number;
}
export const inputs: Inputs<SmoothLifeParameters> = {
  width: { kind: "number", default: 128, min: 3, max: 256, integer: true },
  height: { kind: "number", default: 128, min: 3, max: 256, integer: true },
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  innerRadius: { kind: "number", default: 3, min: 0, max: 50, step: 0.5 },
  outerRadius: { kind: "number", default: 9, min: 0.5, max: 50, step: 0.5 },
  minBirth: { kind: "number", default: 0.278, min: 0, max: 1, step: 0.001 },
  maxBirth: { kind: "number", default: 0.365, min: 0, max: 1, step: 0.001 },
  minSurvive: { kind: "number", default: 0.267, min: 0, max: 1, step: 0.001 },
  maxSurvive: { kind: "number", default: 0.445, min: 0, max: 1, step: 0.001 },
  innerStepWidth: {
    kind: "number",
    default: 0.147,
    min: 0.001,
    max: 0.5,
    step: 0.001,
  },
  outerStepWidth: {
    kind: "number",
    default: 0.028,
    min: 0.001,
    max: 0.5,
    step: 0.001,
  },
  paintValue: { kind: "number", default: 1, min: 0, max: 1, step: 0.1 },
  paintRadius: { kind: "number", default: 3, min: 1, max: 10, step: 0.5 },
};
export type TransitionParameters = Pick<
  SmoothLifeParameters,
  | "minBirth"
  | "maxBirth"
  | "minSurvive"
  | "maxSurvive"
  | "innerStepWidth"
  | "outerStepWidth"
>;
/** Source sigmoid, with x and center in filling-fraction units. */
export function sigmoid(x: number, center: number, width: number): number {
  if (![x, center, width].every(Number.isFinite) || width <= 0)
    throw new RangeError("Sigmoid requires finite values and positive width.");
  return 1 / (1 + Math.exp((-(x - center) * 4) / width));
}
/** Source transition: product of outer sigmoids, with inner sigmoid interpolation. */
export function transition(
  outer: number,
  inner: number,
  p: TransitionParameters,
): number {
  if (
    ![outer, inner].every(
      (value) => Number.isFinite(value) && value >= 0 && value <= 1,
    )
  )
    throw new RangeError("Fillings must be fractions in [0,1].");
  const blend = sigmoid(inner, 0.5, p.innerStepWidth);
  const low = p.minBirth * (1 - blend) + p.minSurvive * blend;
  const high = p.maxBirth * (1 - blend) + p.maxSurvive * blend;
  return (
    sigmoid(outer, low, p.outerStepWidth) *
    (1 - sigmoid(outer, high, p.outerStepWidth))
  );
}
export function create(options: Partial<SmoothLifeParameters> = {}) {
  let settings = parameters(inputs, options);
  if (settings.innerRadius >= settings.outerRadius)
    throw new RangeError("Outer radius must exceed inner radius.");
  const random = Random.add({ seed: settings.seed });
  const space = {
    x: settings.width,
    y: settings.height,
    boundary: "wrap" as const,
  };
  const world = World.add(space, { random });
  const grid = Grid.add(space, { state: { value: 0 } });
  world.add(grid);
  const fields = grid.fields;
  type Cell = (typeof fields)[number];
  // Enumerate each periodic displacement once. Public geometry.distance gives
  // the actual toroidal metric; Grid.fieldAt supplies canonical identities.
  const diskOffsets: { x: number; y: number }[] = [];
  const annulusOffsets: { x: number; y: number }[] = [];
  for (
    let dy = -Math.floor(settings.height / 2);
    dy < Math.ceil(settings.height / 2);
    dy++
  )
    for (
      let dx = -Math.floor(settings.width / 2);
      dx < Math.ceil(settings.width / 2);
      dx++
    ) {
      const point = { x: dx, y: dy };
      const distance = geometry.distance({ x: 0, y: 0 }, point, { space });
      if (distance <= settings.innerRadius) diskOffsets.push(point);
      else if (distance <= settings.outerRadius) annulusOffsets.push(point);
    }
  if (!annulusOffsets.length)
    throw new RangeError("The discrete annulus must contain cells.");
  function neighborhood(
    cell: Cell,
    offsets: readonly { x: number; y: number }[],
  ) {
    return offsets.map((offset) =>
      grid.fieldAt({ x: cell.x + offset.x, y: cell.y + offset.y })!,
    );
  }
  const disks = fields.map((field) => neighborhood(field, diskOffsets));
  const annuli = fields.map((field) => neighborhood(field, annulusOffsets));
  let drawing = false;
  function normalizedFilling(neighbors: readonly Cell[]): number {
    // Source excludes values <=1e-4 from accumulation, but not denominators.
    return (
      neighbors.reduce(
        (total, neighbor) =>
          total + (neighbor.value > 1e-4 ? neighbor.value : 0),
        0,
      ) / neighbors.length
    );
  }
  function go() {
    const next = fields.map((_, index) =>
      transition(
        normalizedFilling(annuli[index]!),
        normalizedFilling(disks[index]!),
        settings,
      ),
    );
    fields.forEach((field, index) => {
      field.value = next[index]!;
    });
  }
  function exactField(point: { x: number; y: number }): Cell {
    const field = grid.fieldAt(point);
    if (!field || field.x !== point.x || field.y !== point.y)
      throw new RangeError("Paint at an exact in-bounds cell center.");
    return field;
  }
  function paint(point: { x: number; y: number }) {
    const center = exactField(point);
    for (const field of fields)
      if (geometry.distance(center, field, { space }) <= settings.paintRadius)
        field.value = settings.paintValue;
  }
  for (const field of fields) field.value = random.number() * 0.75;
  return {
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i++) run(world, go);
    },
    setCells(values: readonly number[]) {
      if (!Array.isArray(values) || values.length !== fields.length)
        throw new RangeError("Supply one fraction per cell.");
      const next = Array.from({ length: fields.length }, (_, index) => {
        const descriptor = Object.getOwnPropertyDescriptor(values, index);
        if (
          !descriptor ||
          !("value" in descriptor) ||
          typeof descriptor.value !== "number" ||
          !Number.isFinite(descriptor.value) ||
          descriptor.value < 0 ||
          descriptor.value > 1
        )
          throw new RangeError("Supply dense finite cell fractions in [0,1].");
        return descriptor.value as number;
      });
      fields.forEach((field, index) => {
        field.value = next[index]!;
      });
    },
    setRules(
      field: Partial<
        TransitionParameters &
          Pick<SmoothLifeParameters, "paintValue" | "paintRadius">
      >,
    ) {
      if (
        !field ||
        typeof field !== "object" ||
        ![Object.prototype, null].includes(Object.getPrototypeOf(field)) ||
        Reflect.ownKeys(field).some(
          (key) =>
            typeof key !== "string" ||
            ![
              "minBirth",
              "maxBirth",
              "minSurvive",
              "maxSurvive",
              "innerStepWidth",
              "outerStepWidth",
              "paintValue",
              "paintRadius",
            ].includes(key) ||
            !("value" in Object.getOwnPropertyDescriptor(field, key)!),
        )
      )
        throw new TypeError("Supply only live transition/paint values.");
      settings = parameters(inputs, { ...settings, ...field });
    },
    eraseAll() {
      for (const field of fields) field.value = 0;
    },
    paint,
    setDrawing(enabled: boolean) {
      if (typeof enabled !== "boolean")
        throw new TypeError("Drawing must be boolean.");
      drawing = enabled;
    },
    draw(point: { x: number; y: number }) {
      exactField(point);
      if (drawing) paint(point);
    },
    /** Detached replacement for the desktop transition plot, disabled in NetLogo Web. */
    visualizeTransition(resolution = 20) {
      if (
        !Number.isSafeInteger(resolution) ||
        resolution < 2 ||
        resolution > 100
      )
        throw new RangeError("Transition resolution must be 2..100.");
      return Object.freeze(
        Array.from({ length: resolution * resolution }, (_, index) => {
          const outer = (index % resolution) / (resolution - 1);
          const inner = Math.floor(index / resolution) / (resolution - 1);
          return Object.freeze({
            outer,
            inner,
            value: transition(outer, inner, settings),
          });
        }),
      );
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        width: settings.width,
        height: settings.height,
        parameters: settings,
        drawing,
        done: false,
        innerCount: diskOffsets.length,
        outerCount: annulusOffsets.length,
        cells: Object.freeze(
          fields.map((field) =>
            Object.freeze({
              id: field.id,
              x: field.x,
              y: field.y,
              value: field.value,
            }),
          ),
        ),
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: "SmoothLife",
  description:
    "Normalized disk/annulus SmoothLife. Head & Wilensky (2017), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<SmoothLifeParameters, ReturnType<typeof create>>;
