/** NetLogo Fur, Wilensky (2003). See source.nlogox and NOTICE.md. */
import { Grid, Random, World, geometry, run } from "city-library";
import type { Field } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";

export interface FurParameters {
  seed: number;
  initialDensity: number;
  innerRadiusX: number;
  innerRadiusY: number;
  outerRadiusX: number;
  outerRadiusY: number;
  ratio: number;
}
export const inputs: Inputs<FurParameters> = {
  seed: { kind: "number", default: 1, integer: true },
  initialDensity: { kind: "number", default: 50, min: 0, max: 100 },
  innerRadiusX: { kind: "number", default: 3, min: 0, max: 10, integer: true },
  innerRadiusY: { kind: "number", default: 3, min: 0, max: 10, integer: true },
  outerRadiusX: { kind: "number", default: 6, min: 0, max: 10, integer: true },
  outerRadiusY: { kind: "number", default: 6, min: 0, max: 10, integer: true },
  ratio: { kind: "number", default: 0.35, min: 0, max: 2 },
};
type Pigment = Field<{ white: boolean; newWhite: boolean }>;
export function create(options: Partial<FurParameters> = {}) {
  let settings = parseParameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const space = { x: 61, y: 61, boundary: "wrap" } as const;
  const world = World.create(space, { random });
  const grid = Grid.create(space, { state: { white: false, newWhite: false } });
  world.add(grid);
  const neighborhoods = new Map<
    Pigment,
    { inner: readonly Pigment[]; outer: readonly Pigment[] }
  >();

  function ellipseIn(field: Pigment, xRadius: number, yRadius: number) {
    if (xRadius === 0 || yRadius === 0)
      throw new RangeError("Source ellipse division by zero.");
    const result: Pigment[] = [];
    const radius = Math.max(xRadius, yRadius);
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        if (
          (dx * dx) / (xRadius * xRadius) + (dy * dy) / (yRadius * yRadius) <=
          1
        ) {
          const point = geometry.normalize(
            { x: field.x + dx, y: field.y + dy },
            { space, endpoints: "half-open" },
          )!;
          result.push(grid.fieldAt(point)!);
        }
      }
    }
    return result;
  }

  function ellipseRing(
    field: Pigment,
    outX: number,
    outY: number,
    inX: number,
    inY: number,
  ) {
    const inner = new Set(ellipseIn(field, inX, inY));
    return ellipseIn(field, outX, outY).filter(
      (candidate) => !inner.has(candidate),
    );
  }

  function restart() {
    for (const field of random.sample(grid.fields, {
      sampleCount: grid.fields.length,
      algorithm: "fisher-yates-descending",
    })) {
      field.white = random.number() * 100 < settings.initialDensity;
    }
    world.tick.reset();
  }

  function setup() {
    neighborhoods.clear();
    for (const field of grid.fields) {
      field.white = false;
      field.newWhite = false;
      const inner = ellipseIn(
        field,
        settings.innerRadiusX,
        settings.innerRadiusY,
      );
      const outer = ellipseRing(
        field,
        settings.outerRadiusX,
        settings.outerRadiusY,
        settings.innerRadiusX,
        settings.innerRadiusY,
      );
      if (outer.length === 0)
        throw new RangeError(
          "Source outer ellipse ring is empty; reset the sliders and press Setup again.",
        );
      neighborhoods.set(field, { inner, outer });
    }
    restart();
  }

  function pickNewColor(field: Pigment) {
    const neighborhood = neighborhoods.get(field)!;
    const activator = neighborhood.inner.filter(
      (candidate) => candidate.white,
    ).length;
    const inhibitor = neighborhood.outer.filter(
      (candidate) => candidate.white,
    ).length;
    const difference = activator - settings.ratio * inhibitor;
    if (difference > 0) field.newWhite = true;
    else if (difference < 0) field.newWhite = false;
    // Source leaves new-color untouched on ties, initially numeric black (0).
  }

  function go() {
    for (const field of grid.fields) pickNewColor(field);
    for (const field of grid.fields) field.white = field.newWhite;
  }
  function advance(stepCount = 1) {
    validateStepCount(stepCount);
    for (let index = 0; index < stepCount; index++) run(world, go);
  }
  function setParameters(
    update: Partial<Pick<FurParameters, "initialDensity" | "ratio">>,
  ) {
    if (
      Object.keys(update).some(
        (key) => !["initialDensity", "ratio"].includes(key),
      )
    )
      throw new TypeError("Only ratio and restart density may change live.");
    settings = parseParameters(inputs, { ...settings, ...update });
  }
  function read() {
    return {
      tick: world.tick.value,
      width: 61,
      height: 61,
      parameters: { ...settings },
      whiteCount: grid.fields.filter((field) => field.white).length,
      cells: grid.fields.map((field) => ({
        id: field.id,
        x: field.x,
        y: field.y,
        white: field.white,
        newWhite: field.newWhite,
        color: field.white ? "#ffffff" : "#000000",
      })),
    };
  }
  setup();
  return {
    advance,
    read,
    setup,
    restart,
    go,
    ellipseIn,
    ellipseRing,
    pickNewColor,
    setParameters,
  };
}
export const model = { title: "Fur Patterns", description: "Pigment cells activate nearby cells and inhibit distant ones, producing spots or stripes.", inputs, create } satisfies Definition<
  FurParameters,
  ReturnType<typeof create>
>;
