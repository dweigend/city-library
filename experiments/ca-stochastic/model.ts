/** Adapted from Wilensky (2003), CC BY-NC-SA 3.0; exact source/notices adjacent. */
import { Grid, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export const patterns = [
  "OOO",
  "OOI",
  "OIO",
  "OII",
  "IOO",
  "IOI",
  "IIO",
  "III",
] as const;
export type Pattern = (typeof patterns)[number];
export interface StochasticParameters {
  width: number;
  height: number;
  seed: number;
  density: number;
  OOO: number;
  OOI: number;
  OIO: number;
  OII: number;
  IOO: number;
  IOI: number;
  IIO: number;
  III: number;
  autoContinue: boolean;
  autoClear: boolean;
  plot: boolean;
  onColor: number;
  offColor: number;
  example: number;
}
export const inputs: Inputs<StochasticParameters> = {
  width: { kind: "number", default: 161, min: 5, max: 501, integer: true },
  height: { kind: "number", default: 161, min: 3, max: 501, integer: true },
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  density: { kind: "number", default: 25, min: 0, max: 100 },
  OOO: { kind: "number", default: 0, min: 0, max: 100 },
  OOI: { kind: "number", default: 50, min: 0, max: 100 },
  OIO: { kind: "number", default: 50, min: 0, max: 100 },
  OII: { kind: "number", default: 50, min: 0, max: 100 },
  IOO: { kind: "number", default: 50, min: 0, max: 100 },
  IOI: { kind: "number", default: 50, min: 0, max: 100 },
  IIO: { kind: "number", default: 50, min: 0, max: 100 },
  III: { kind: "number", default: 0, min: 0, max: 100 },
  autoContinue: { kind: "boolean", default: false },
  autoClear: { kind: "boolean", default: true },
  plot: { kind: "boolean", default: true },
  onColor: { kind: "number", default: 95, min: 0, max: 139.9 },
  offColor: { kind: "number", default: 0, min: 0, max: 139.9 },
  example: { kind: "number", default: 1, min: 1, max: 5, integer: true },
};
export function binaryListToIndex(values: readonly number[]) {
  if (!Array.isArray(values) || values.some((x) => !Number.isSafeInteger(x)))
    throw new TypeError("Expected integer binary digits.");
  return values.reduce((n, x) => 2 * n + (x % 2), 0);
}
export function entropy(probabilities: readonly number[]) {
  if (probabilities.some((p) => !Number.isFinite(p) || p < 0 || p > 1))
    throw new RangeError("Invalid probabilities.");
  const nonzero = probabilities.filter((p) => p > 0);
  return Object.freeze({
    topological: Math.log2(nonzero.length) / 4,
    metric: -nonzero.reduce((s, p) => s + p * Math.log2(p), 0) / 4,
  });
}
export function create(options: Partial<StochasticParameters> = {}) {
  let settings = parameters(inputs, options);
  if (settings.width % 2 !== 1 || settings.height % 2 !== 1)
    throw new RangeError("Use odd centered dimensions.");
  const { width, height } = settings,
    top = (height - 1) / 2,
    bottom = -top;
  const random = Random.add({ seed: settings.seed }),
    space = {
      x: width,
      y: height,
      boundary: { x: "wrap", y: "hard" } as const,
    };
  const world = World.add(space, { random }),
    grid = Grid.add(space, { state: { on: false, colorNumber: 0 } });
  world.add(grid);
  let row = top,
    done = false,
    absorbing = false;
  const history: { tick: number; topological: number; metric: number }[] = [];
  const rowFields = (y: number) => grid.fields.filter((f) => f.y === y);
  function colorPatch(f: (typeof grid.fields)[number]) {
    f.colorNumber = f.on ? settings.onColor : settings.offColor;
  }
  function setupGeneral() {
    for (const f of grid.fields) {
      f.on = false;
      f.colorNumber = 0;
    }
    row = top;
    done = false;
    absorbing = false;
  }
  function buildProbList() {
    const counters = Array<number>(16).fill(0);
    for (let x = -(width - 1) / 2; x < (width - 1) / 2; x++) {
      const index = binaryListToIndex(
        [0, 1, 2, 3].map((dx) =>
          Number(grid.fieldAt({ x: x + dx, y: row })!.on),
        ),
      );
      counters[index] = counters[index]! + 1;
    }
    return counters.map((n) => n / (width - 1));
  }
  function record() {
    if (!settings.plot) return;
    history.push({ tick: world.tick.value, ...entropy(buildProbList()) });
    if (history.length > 1001) history.shift();
  }
  function initialize() {
    setupGeneral();
    for (const f of rowFields(top)) {
      f.on = random.number() * 100 < settings.density;
      colorPatch(f);
    }
  }
  function setupContinue() {
    if (!done) return;
    const values = rowFields(row).map((f) => f.on);
    if (settings.autoClear) history.length = 0;
    setupGeneral();
    rowFields(top).forEach((f, i) => {
      f.on = values[i]!;
      colorPatch(f);
    });
  }
  function doRule() {
    const next = rowFields(row).map((f) => {
      const index =
        4 * Number(grid.fieldAt({ x: f.x - 1, y: row })!.on) +
        2 * Number(f.on) +
        Number(grid.fieldAt({ x: f.x + 1, y: row })!.on);
      const probability = settings[patterns[index]!];
      return probability !== 0 && random.number() * 100 < probability;
    });
    row--;
    rowFields(row).forEach((f, i) => {
      f.on = next[i]!;
      colorPatch(f);
    });
  }
  initialize();
  record();
  return {
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i++) {
        if (row === bottom) {
          if (settings.autoContinue) {
            const active = rowFields(row).filter((f) => f.on).length;
            if (
              (active === 0 && settings.OOO === 0) ||
              (active === width && settings.III === 100)
            ) {
              absorbing = true;
              done = true;
              break;
            }
            done = true;
            setupContinue();
          } else if (done) setupContinue();
          else {
            done = true;
            break;
          }
        }
        run(world, doRule);
        record();
      }
    },
    setupRandom() {
      initialize();
      world.tick.reset();
      history.length = 0;
      record();
    },
    continueRun() {
      done = true;
      setupContinue();
    },
    setRules(
      patch: Partial<Omit<StochasticParameters, "width" | "height" | "seed">>,
    ) {
      parameters(inputs, patch);
      const allowed = [
        ...patterns,
        "autoContinue",
        "autoClear",
        "plot",
        "onColor",
        "offColor",
        "density",
        "example",
      ];
      if (
        Reflect.ownKeys(patch).some(
          (k) => typeof k !== "string" || !allowed.includes(k),
        )
      )
        throw new TypeError("Unknown live rule.");
      settings = parameters(inputs, { ...settings, ...patch });
    },
    setupExample() {
      const table = [
        [0, 50, 50, 50, 50, 50, 50, 0],
        [100, 50, 100, 50, 50, 0, 50, 0],
        [0, 100, 50, 50, 66, 50, 50, 0],
        [0, 50, 50, 50, 66, 50, 50, 0],
        [0, 66, 0, 100, 66, 0, 100, 0],
      ];
      const values = table[settings.example - 1]!;
      settings = parameters(inputs, {
        ...settings,
        ...Object.fromEntries(patterns.map((p, i) => [p, values[i]])),
        density: 25,
      });
      initialize();
      world.tick.reset();
      history.length = 0;
      record();
    },
    read() {
      const probabilities = Object.freeze(buildProbList());
      return Object.freeze({
        width,
        height,
        tick: world.tick.value,
        row,
        done,
        absorbing,
        parameters: settings,
        randomState: random.state,
        probabilities,
        entropy: entropy(probabilities),
        history: Object.freeze(history.map((p) => Object.freeze({ ...p }))),
        cells: Object.freeze(
          grid.fields.map((f) =>
            Object.freeze({
              id: f.id,
              x: f.x,
              y: f.y,
              on: f.on,
              colorNumber: f.colorNumber,
            }),
          ),
        ),
      });
    },
  };
}
export const model = {
  title: "CA Stochastic",
  description:
    "Conditional Bernoulli neighborhood rules and four-cell entropy. Wilensky (2003), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<StochasticParameters, ReturnType<typeof create>>;
