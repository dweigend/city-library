/** Adapted from Wilensky (2003), CC BY-NC-SA 3.0; exact source/notices adjacent. */
import { Grid, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface ContinuousParameters {
  width: number;
  height: number;
  seed: number;
  initialization: "single" | "random";
  maxValue: number;
  addConstant: number;
  precisionLevel: number;
  autoContinue: boolean;
}
export const inputs: Inputs<ContinuousParameters> = {
  width: { kind: "number", default: 201, min: 3, max: 501, integer: true },
  height: { kind: "number", default: 201, min: 3, max: 501, integer: true },
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  initialization: {
    kind: "choice",
    default: "single",
    options: ["single", "random"],
  },
  maxValue: { kind: "number", default: 0.5, min: 0, max: 1 },
  addConstant: { kind: "number", default: 0.47, min: 0, max: 1 },
  precisionLevel: {
    kind: "number",
    default: 16,
    min: 1,
    max: 16,
    integer: true,
  },
  autoContinue: { kind: "boolean", default: false },
};
export function fractionalPart(x: number) {
  if (!Number.isFinite(x)) throw new RangeError("Expected a finite value.");
  return x - Math.trunc(x);
}
export function iteratedMap(
  x: number,
  addConstant: number,
  precisionLevel: number,
) {
  if (
    !Number.isFinite(x) ||
    !Number.isFinite(addConstant) ||
    !Number.isSafeInteger(precisionLevel) ||
    precisionLevel < 1 ||
    precisionLevel > 16
  )
    throw new RangeError("Invalid iterated-map inputs.");
  const scale = 10 ** precisionLevel;
  return Math.round(fractionalPart(x + addConstant) * scale) / scale;
}
export function create(options: Partial<ContinuousParameters> = {}) {
  let settings = parameters(inputs, options);
  if (settings.width % 2 !== 1 || settings.height % 2 !== 1)
    throw new RangeError("Use odd centered dimensions.");
  const { width, height } = settings,
    top = (height - 1) / 2,
    bottom = -top;
  const random = Random.create({ seed: settings.seed });
  const space = {
    x: width,
    y: height,
    boundary: { x: "wrap", y: "hard" } as const,
  };
  const world = World.create(space, { random });
  const grid = Grid.create(space, { state: { value: 0, colorNumber: 0 } });
  world.add(grid);
  let row = top,
    done = false;
  const rowFields = (y: number) => grid.fields.filter((f) => f.y === y);
  function colorField(f: (typeof grid.fields)[number]) {
    f.colorNumber = Math.min(59.9999, 50 + 5 * f.value);
  }
  function setupGeneral() {
    row = top;
    done = false;
    for (const f of grid.fields) {
      f.value = 0;
      f.colorNumber = 0;
    }
  }
  function initialize(kind: "single" | "random") {
    setupGeneral();
    for (const f of rowFields(top)) {
      f.value =
        kind === "single"
          ? Number(f.x === 0)
          : random.number() * settings.maxValue;
      colorField(f);
    }
  }
  function setupContinue() {
    if (!done) return;
    const values = rowFields(row).map((f) => f.value);
    setupGeneral();
    rowFields(top).forEach((f, i) => {
      f.value = values[i]!;
      colorField(f);
    });
  }
  function calculateValue(f: (typeof grid.fields)[number]) {
    const parents = grid
      .neighbors(f, { neighborhood: "moore" })
      .filter((n) => n.y === f.y + 1);
    return iteratedMap(
      parents.reduce((sum, p) => sum + p.value, 0) / parents.length,
      settings.addConstant,
      settings.precisionLevel,
    );
  }
  initialize(settings.initialization);
  return {
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i++) {
        if (row === bottom) {
          if (settings.autoContinue || done) {
            done = true;
            setupContinue();
          } else {
            done = true;
            break;
          }
        }
        run(world, () => {
          row--;
          for (const f of rowFields(row)) {
            f.value = calculateValue(f);
            colorField(f);
          }
        });
      }
    },
    setupSingle() {
      settings = parameters(inputs, { ...settings, initialization: "single" });
      initialize("single");
      world.tick.reset();
    },
    setupRandom() {
      settings = parameters(inputs, { ...settings, initialization: "random" });
      initialize("random");
      world.tick.reset();
    },
    continueRun() {
      done = true;
      setupContinue();
    },
    setRules(
      field: Partial<
        Pick<
          ContinuousParameters,
          "maxValue" | "addConstant" | "precisionLevel" | "autoContinue"
        >
      >,
    ) {
      parameters(inputs, field);
      const allowed = [
        "maxValue",
        "addConstant",
        "precisionLevel",
        "autoContinue",
      ];
      if (
        Reflect.ownKeys(field).some(
          (k) => typeof k !== "string" || !allowed.includes(k),
        )
      )
        throw new TypeError("Unknown live rule.");
      settings = parameters(inputs, { ...settings, ...field });
    },
    read() {
      return Object.freeze({
        width,
        height,
        tick: world.tick.value,
        row,
        done,
        parameters: settings,
        randomState: random.state,
        cells: Object.freeze(
          grid.fields.map((f) =>
            Object.freeze({
              id: f.id,
              x: f.x,
              y: f.y,
              value: f.value,
              colorNumber: f.colorNumber,
            }),
          ),
        ),
      });
    },
  };
}
export const model = {
  title: "CA Continuous",
  description:
    "Three-parent mean, additive fractional map and source precision. Wilensky (2003), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<ContinuousParameters, ReturnType<typeof create>>;
