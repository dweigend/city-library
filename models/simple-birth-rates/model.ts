/** NetLogo Simple Birth Rates (Wilensky, 1997), CC BY-NC-SA 3.0; see NOTICE.md. */
import { Agent, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface Parameters {
  seed: number;
  carryingCapacity: number;
  redFertility: number;
  blueFertility: number;
}
export const inputs: Inputs<Parameters> = {
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  carryingCapacity: {
    kind: "number",
    default: 1000,
    min: 1,
    max: 4000,
    integer: true,
  },
  redFertility: {
    kind: "number",
    default: 2,
    min: 0,
    max: 10,
    step: 0.1,
  },
  blueFertility: {
    kind: "number",
    default: 2,
    min: 0,
    max: 10,
    step: 0.1,
  },
};
type ModelAgent = Agent<{
  color: "red" | "blue";
}>;
export function create(options: Partial<Parameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.create({
    seed: settings.seed,
  });
  const world = World.create(
    {
      x: 101,
      y: 101,
      boundary: "wrap",
    },
    {
      random,
    },
  );
  const population = () => world.agents as readonly ModelAgent[];
  const history: {
    tick: number;
    red: number;
    blue: number;
    total: number;
  }[] = [];
  const output: string[] = [];
  const counts = () => ({
    redCount: population().filter((a) => a.color === "red").length,
    blueCount: population().filter((a) => a.color === "blue").length,
  });
  function record() {
    const c = counts();
    history.push(
      Object.freeze({
        tick: world.tick.value,
        red: c.redCount,
        blue: c.blueCount,
        total: population().length,
      }),
    );
    if (history.length > 1001) history.splice(1, 1);
  }
  function setupExperiment() {
    for (const a of [...population()]) a.delete();
    for (let i = 0; i < settings.carryingCapacity; i++)
      world.add(
        Agent.create(
          {
            color:
              i < settings.carryingCapacity / 2
                ? ("blue" as const)
                : ("red" as const),
          },
          {
            position: {
              x: random.number() * 101 - 50.5,
              y: random.number() * 101 - 50.5,
            },
            orientation: {
              heading: Math.floor(random.number() * 360),
            },
          },
        ),
      );
    world.tick.reset();
    history.length = 0;
    record();
  }
  function reproduce() {
    const old = population();
    for (const parent of random.sample(old, {
      count: old.length,
      algorithm: "fisher-yates-descending",
    })) {
      const fertility =
        parent.color === "red" ? settings.redFertility : settings.blueFertility;
      const n =
        Math.floor(fertility) + (random.number() < fertility % 1 ? 1 : 0);
      for (let i = 0; i < n; i++) {
        const child = parent.copy();
        world.add(child);
        child.rotate(random.number() * 30 - random.number() * 30);
        child.move(1);
      }
    }
  }
  function grimReaper() {
    const old = population();
    if (old.length <= settings.carryingCapacity) return;
    const chance = (old.length - settings.carryingCapacity) / old.length;
    for (const a of random.sample(old, {
      count: old.length,
      algorithm: "fisher-yates-descending",
    }))
      if (random.number() < chance) a.delete();
  }
  function advance(count = 1) {
    stepCount(count);
    for (let i = 0; i < count; i++) {
      run(world, () => {
        reproduce();
        grimReaper();
      });
      record();
    }
  }
  function experimentStep() {
    advance();
    if (counts().redCount === 0) {
      output.push(`red extinct after ${world.tick.value} generations`);
      setupExperiment();
    }
    if (counts().blueCount === 0) {
      output.push(`blue extinct after ${world.tick.value} generations`);
      setupExperiment();
    }
  }
  setupExperiment();
  return {
    advance,
    experimentStep,
    setupExperiment,
    setRules(rules: Partial<Omit<Parameters, "seed">>) {
      if (
        Reflect.ownKeys(rules).some(
          (k) =>
            !["carryingCapacity", "redFertility", "blueFertility"].includes(
              String(k),
            ),
        )
      )
        throw new TypeError("Unknown live rule.");
      settings = parameters(inputs, {
        ...settings,
        ...rules,
      });
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        width: 101,
        height: 101,
        parameters: settings,
        ...counts(),
        agents: Object.freeze(
          population().map((a) =>
            Object.freeze({
              id: a.id,
              x: a.x,
              y: a.y,
              heading: a.heading,
              color: a.color,
            }),
          ),
        ),
        history: Object.freeze([...history]),
        output: Object.freeze([...output]),
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: "Simple Birth Rates",
  description:
    "Fertility, demographic sampling and extinction studies. Wilensky (1997), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<Parameters, ReturnType<typeof create>>;
