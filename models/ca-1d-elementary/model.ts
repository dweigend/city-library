/** Adapted from Wilensky (1998), CC BY-NC-SA 3.0; exact source/notices adjacent. */
import { Grid, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";
export interface ElementaryParameters {
  width: number;
  height: number;
  seed: number;
  initialization: "single" | "random";
  density: number;
  rule: number;
  autoContinue: boolean;
  foreground: number;
  background: number;
}
export const inputs: Inputs<ElementaryParameters> = {
  width: { kind: "number", default: 257, min: 3, max: 501, integer: true },
  height: { kind: "number", default: 129, min: 3, max: 501, integer: true },
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
  density: { kind: "number", default: 10, min: 0, max: 100 },
  rule: { kind: "number", default: 105, min: 0, max: 255, integer: true },
  autoContinue: { kind: "boolean", default: false },
  foreground: { kind: "number", default: 55, min: 0, max: 139.9 },
  background: { kind: "number", default: 0, min: 0, max: 139.9 },
};
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
export function elementaryTransition(
  rule: number,
  left: boolean,
  center: boolean,
  right: boolean,
) {
  if (!Number.isSafeInteger(rule) || rule < 0 || rule > 255)
    throw new RangeError("Invalid elementary rule.");
  return Boolean(
    (rule >> (4 * Number(left) + 2 * Number(center) + Number(right))) & 1,
  );
}
export function listRules(rule: number) {
  if (!Number.isSafeInteger(rule) || rule < 0 || rule > 255)
    throw new RangeError("Invalid rule.");
  return Object.freeze(
    patterns.map((pattern, i) =>
      Object.freeze({
        pattern,
        left: Boolean(i & 4),
        center: Boolean(i & 2),
        right: Boolean(i & 1),
        next: Boolean((rule >> i) & 1),
      }),
    ),
  );
}
export function create(options: Partial<ElementaryParameters> = {}) {
  let settings = parseParameters(inputs, options);
  if (settings.width % 2 !== 1 || settings.height % 2 !== 1)
    throw new RangeError("Use odd centered dimensions.");
  const { width, height } = settings,
    top = (height - 1) / 2,
    bottom = -top;
  const random = Random.create({ seed: settings.seed }),
    space = {
      x: width,
      y: height,
      boundary: { x: "wrap", y: "hard" } as const,
    };
  const world = World.create(space, { random }),
    grid = Grid.create(space, { state: { on: false, colorNumber: 0 } });
  world.add(grid);
  let row = top,
    gone = false,
    rulesShown = false,
    done = false;
  const rowFields = (y: number) => grid.fields.filter((f) => f.y === y);
  function colorField(f: (typeof grid.fields)[number]) {
    f.colorNumber = f.on ? settings.foreground : settings.background;
  }
  function setupGeneral() {
    for (const f of grid.fields) {
      f.on = false;
      f.colorNumber = 0;
    }
    row = top;
    gone = false;
    rulesShown = false;
    done = false;
  }
  function initialize() {
    setupGeneral();
    for (const f of rowFields(top)) {
      f.on =
        settings.initialization === "single"
          ? f.x === 0
          : random.number() * 100 < settings.density;
      colorField(f);
    }
  }
  function setupContinue() {
    if (!gone) return;
    const values = rowFields(row).map((f) => f.on);
    setupGeneral();
    rowFields(top).forEach((f, i) => {
      f.on = values[i]!;
      colorField(f);
    });
  }
  function doRule() {
    const parents = rowFields(row);
    const next = parents.map((f) =>
      elementaryTransition(
        settings.rule,
        grid.fieldAt({ x: f.x - 1, y: row })!.on,
        f.on,
        grid.fieldAt({ x: f.x + 1, y: row })!.on,
      ),
    );
    row--;
    rowFields(row).forEach((f, i) => {
      f.on = next[i]!;
      colorField(f);
    });
  }
  initialize();
  return {
    advance(stepCount = 1) {
      validateStepCount(stepCount);
      for (let i = 0; i < stepCount; i++) {
        if (rulesShown) {
          done = true;
          break;
        }
        if (row === bottom) {
          if (settings.autoContinue) {
            gone = true;
            setupContinue();
          } else if (gone) setupContinue();
          else {
            gone = true;
            done = true;
            break;
          }
        }
        run(world, doRule);
      }
    },
    setupSingle() {
      settings = parseParameters(inputs, { ...settings, initialization: "single" });
      initialize();
      world.tick.reset();
    },
    setupRandom() {
      settings = parseParameters(inputs, { ...settings, initialization: "random" });
      initialize();
      world.tick.reset();
    },
    continueRun() {
      if (rulesShown) return;
      gone = true;
      setupContinue();
    },
    setRules(
      field: Partial<
        Pick<
          ElementaryParameters,
          "rule" | "autoContinue" | "foreground" | "background" | "density"
        >
      >,
    ) {
      parseParameters(inputs, field);
      const allowed = [
        "rule",
        "autoContinue",
        "foreground",
        "background",
        "density",
      ];
      if (
        Reflect.ownKeys(field).some(
          (k) => typeof k !== "string" || !allowed.includes(k),
        )
      )
        throw new TypeError("Unknown live rule.");
      settings = parseParameters(inputs, { ...settings, ...field });
    },
    setRuleBit(pattern: Pattern, on: boolean) {
      const bit = patterns.indexOf(pattern);
      if (bit < 0 || typeof on !== "boolean")
        throw new TypeError("Expected a rule pattern and boolean.");
      settings = parseParameters(inputs, {
        ...settings,
        rule: on ? settings.rule | (1 << bit) : settings.rule & ~(1 << bit),
      });
    },
    showRules() {
      setupGeneral();
      rulesShown = true;
      done = true;
      for (const f of grid.fields) if (f.y > top - 12) f.colorNumber = 4;
      listRules(settings.rule).forEach((r, i) => {
        const x =
          -(width - 1) / 2 +
          i * Math.floor(width / 8) +
          Math.floor(width / 16) -
          4;
        for (const [dx, dy, on] of [
          [-3, 0, r.left],
          [0, 0, r.center],
          [3, 0, r.right],
          [0, -3, r.next],
        ] as const) {
          for (const f of grid.fields)
            if (Math.hypot(f.x - (x + dx), f.y - (top - 4 + dy)) <= 1.5) {
              f.on = on;
              colorField(f);
            }
        }
      });
    },
    read() {
      return Object.freeze({
        width,
        height,
        tick: world.tick.value,
        row,
        done,
        rulesShown,
        parameters: settings,
        rules: listRules(settings.rule),
        randomState: random.state,
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
  title: "Elementary Cellular Automaton",
  description: "A row of on/off cells follows one of 256 rules; each new row shows the next generation. Wilensky (1998), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<ElementaryParameters, ReturnType<typeof create>>;
