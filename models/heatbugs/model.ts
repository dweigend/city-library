/** NetLogo Heatbugs, Wilensky (2004), CC BY-NC-SA 3.0. See source.nlogox/NOTICE.md. */
import { Agent, Grid, Random, World, run, stats } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";
export interface HeatbugsParameters {
  seed: number;
  bugCount: number;
  minIdealTemp: number;
  maxIdealTemp: number;
  minOutputHeat: number;
  maxOutputHeat: number;
  evaporationRate: number;
  diffusionRate: number;
  randomMoveChance: number;
}
export const inputs: Inputs<HeatbugsParameters> = {
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  bugCount: { kind: "number", default: 100, min: 0, max: 500, integer: true },
  minIdealTemp: {
    kind: "number",
    default: 10,
    min: 0,
    max: 200,
    integer: true,
  },
  maxIdealTemp: {
    kind: "number",
    default: 40,
    min: 0,
    max: 200,
    integer: true,
  },
  minOutputHeat: {
    kind: "number",
    default: 5,
    min: 0,
    max: 100,
    integer: true,
  },
  maxOutputHeat: {
    kind: "number",
    default: 25,
    min: 0,
    max: 100,
    integer: true,
  },
  evaporationRate: {
    kind: "number",
    default: 0.01,
    min: 0,
    max: 1,
    step: 0.01,
  },
  diffusionRate: { kind: "number", default: 0.9, min: 0, max: 1, step: 0.1 },
  randomMoveChance: {
    kind: "number",
    default: 0,
    min: 0,
    max: 100,
    integer: true,
  },
};
type Bug = Agent<{
  idealTemp: number;
  outputHeat: number;
  unhappiness: number;
}>;
export function create(options: Partial<HeatbugsParameters> = {}) {
  let settings = parseParameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const width = 100,
    height = 100;
  const world = World.create(
    { x: width, y: height, boundary: "wrap" },
    { random },
  );
  const grid = Grid.create(
    { x: width, y: height, boundary: "wrap" },
    { state: { temp: 0 } },
  );
  world.add(grid);
  const bugs = () => world.agents as readonly Bug[];
  let colorByUnhappiness = false;
  let watched: string | null = null;
  const history: Readonly<{ tick: number; unhappiness: number | null }>[] = [];
  const integer = (n: number) =>
    Math.sign(n) * Math.floor(random.number() * Math.abs(n));
  const pick = <T>(a: readonly T[]) =>
    random.sample(a, { sampleCount: Math.min(1, a.length) })[0];
  function meanUnhappiness() {
    const values = bugs().map((b) => b.unhappiness);
    return values.length ? stats.describe(values).mean! : null;
  }
  function record() {
    history.push(
      Object.freeze({ tick: world.tick.value, unhappiness: meanUnhappiness() }),
    );
    if (history.length > 1001) history.splice(1, 1);
  }
  for (const field of random.sample(grid.fields, {
    sampleCount: settings.bugCount,
  })) {
    const bug = Agent.create(
      {
        idealTemp:
          settings.minIdealTemp +
          integer(settings.maxIdealTemp - settings.minIdealTemp),
        outputHeat:
          settings.minOutputHeat +
          integer(settings.maxOutputHeat - settings.minOutputHeat),
        unhappiness: 0,
      },
      { position: { x: field.x, y: field.y } },
    );
    world.add(bug);
    bug.unhappiness = Math.abs(bug.idealTemp - field.temp);
    bug.rotate({
      towards: pick(grid.neighbors(field, { neighborhood: "moore" }))!,
    });
  }
  function step(bug: Bug) {
    const current = grid.fieldAt(bug)!;
    bug.unhappiness = Math.abs(bug.idealTemp - current.temp);
    if (bug.unhappiness > 0) {
      const adjacent = grid.neighbors(current, { neighborhood: "moore" });
      let target: typeof current;
      if (random.number() * 100 < settings.randomMoveChance)
        target = pick(adjacent)!;
      else {
        const extreme =
          bug.idealTemp > current.temp
            ? Math.max(...adjacent.map((f) => f.temp))
            : Math.min(...adjacent.map((f) => f.temp));
        const winner = pick(adjacent.filter((f) => f.temp === extreme))!;
        target = (
          bug.idealTemp > current.temp
            ? winner.temp > current.temp
            : winner.temp < current.temp
        )
          ? winner
          : current;
      }
      if (target !== current) {
        if (grid.agentsAt(target).length === 0) {
          bug.rotate({ towards: target });
          bug.move({ to: target });
        } else {
          const free = pick(
            adjacent.filter((f) => grid.agentsAt(f).length === 0),
          );
          if (free) bug.move({ to: free });
        }
      }
    }
    grid.fieldAt(bug)!.temp += bug.outputHeat;
  }
  record();
  return {
    advance(stepCount = 1) {
      validateStepCount(stepCount);
      for (let i = 0; i < stepCount && bugs().length; i++) {
        run(world, () => {
          grid.diffuse("temp", {
            rate: settings.diffusionRate,
            neighborhood: "moore",
          });
          for (const f of grid.fields) f.temp *= 1 - settings.evaporationRate;
          for (const b of random.sample(bugs(), {
            sampleCount: bugs().length,
            algorithm: "fisher-yates-descending",
          }))
            step(b);
        });
        record();
      }
    },
    setRules(rules: Partial<Omit<HeatbugsParameters, "seed" | "bugCount">>) {
      if (
        typeof rules !== "object" ||
        rules === null ||
        ![Object.prototype, null].includes(Object.getPrototypeOf(rules)) ||
        Reflect.ownKeys(rules).some(
          (key) =>
            typeof key !== "string" ||
            ![
              "minIdealTemp",
              "maxIdealTemp",
              "minOutputHeat",
              "maxOutputHeat",
              "evaporationRate",
              "diffusionRate",
              "randomMoveChance",
            ].includes(key) ||
            !("value" in Object.getOwnPropertyDescriptor(rules, key)!),
        )
      )
        throw new TypeError("Supply only live rule data.");
      settings = parseParameters(inputs, { ...settings, ...rules });
    },
    deepFreeze() {
      for (const f of grid.fields) f.temp = 0;
    },
    heatUp() {
      for (const f of grid.fields) f.temp += settings.maxOutputHeat;
    },
    setColorMode(mode: "ideal" | "unhappiness") {
      if (!["ideal", "unhappiness"].includes(mode))
        throw new RangeError("Unknown color mode.");
      colorByUnhappiness = mode === "unhappiness";
    },
    watch(which: "happiest" | "saddest" | "reset") {
      if (!["happiest", "saddest", "reset"].includes(which))
        throw new RangeError("Unknown perspective.");
      if (which === "reset") {
        watched = null;
        return;
      }
      const population = bugs();
      const extreme = (which === "happiest" ? Math.min : Math.max)(
        ...population.map((b) => b.unhappiness),
      );
      watched =
        pick(population.filter((b) => b.unhappiness === extreme))?.id ?? null;
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        width,
        height,
        parameters: settings,
        colorByUnhappiness,
        watched,
        done: bugs().length === 0,
        meanUnhappiness: meanUnhappiness(),
        maxUnhappiness: Math.max(0, ...bugs().map((b) => b.unhappiness)),
        bugs: Object.freeze(
          bugs().map((b) =>
            Object.freeze({
              id: b.id,
              x: b.x,
              y: b.y,
              heading: b.heading,
              idealTemp: b.idealTemp,
              outputHeat: b.outputHeat,
              unhappiness: b.unhappiness,
            }),
          ),
        ),
        cells: Object.freeze(
          grid.fields.map((f) =>
            Object.freeze({ id: f.id, x: f.x, y: f.y, temp: f.temp }),
          ),
        ),
        history: Object.freeze([...history]),
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: "Heatbugs",
  description:
    "Heat-seeking agents with exclusion, emission and diffusion. Wilensky (2004), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<HeatbugsParameters, ReturnType<typeof create>>;
