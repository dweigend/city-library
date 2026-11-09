/** NetLogo Rabbits Grass Weeds (Wilensky, 2001), CC BY-NC-SA 3.0; see NOTICE.md. */
import { Agent, Grid, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface Parameters {
  seed: number;
  number: number;
  birthThreshold: number;
  weedEnergy: number;
  weedsGrowRate: number;
  grassEnergy: number;
  grassGrowRate: number;
}
export const inputs: Inputs<Parameters> = {
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  number: {
    kind: "number",
    default: 150,
    min: 0,
    max: 500,
    integer: true,
  },
  birthThreshold: {
    kind: "number",
    default: 15,
    min: 0,
    max: 20,
    integer: true,
  },
  weedEnergy: {
    kind: "number",
    default: 0,
    min: 0,
    max: 10,
    step: 0.5,
  },
  weedsGrowRate: {
    kind: "number",
    default: 0,
    min: 0,
    max: 20,
    integer: true,
  },
  grassEnergy: {
    kind: "number",
    default: 5,
    min: 0,
    max: 10,
    step: 0.5,
  },
  grassGrowRate: {
    kind: "number",
    default: 15,
    min: 0,
    max: 20,
    integer: true,
  },
};
type Rabbit = Agent<{
  energy: number;
}>;
export function create(options: Partial<Parameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.add({
    seed: settings.seed,
  });
  const space = {
    x: 41,
    y: 41,
    boundary: "wrap" as const,
  };
  const world = World.add(space, {
    random,
  });
  const grid = Grid.add(space, {
    state: {
      cover: "empty" as "empty" | "grass" | "weeds",
    },
  });
  world.add(grid);
  const population = () => world.agents as readonly Rabbit[];
  const history: {
    tick: number;
    rabbits: number;
    grass: number;
    weeds: number;
  }[] = [];
  function grow() {
    for (const f of random.sample(grid.fields, {
      count: grid.fields.length,
      compatibility: "legacy-shuffle",
    }))
      if (f.cover === "empty") {
        if (random.number() * 1000 < settings.weedsGrowRate) f.cover = "weeds";
        if (random.number() * 1000 < settings.grassGrowRate) f.cover = "grass";
      }
  }
  function record() {
    history.push(
      Object.freeze({
        tick: world.tick.value,
        rabbits: population().length,
        grass: grid.fields.filter((f) => f.cover === "grass").length / 4,
        weeds: grid.fields.filter((f) => f.cover === "weeds").length / 4,
      }),
    );
    if (history.length > 1001) history.splice(1, 1);
  }
  grow();
  for (let i = 0; i < settings.number; i++)
    world.add(
      Agent.add(
        {
          energy: Math.floor(random.number() * 10),
        },
        {
          position: {
            x: random.number() * 41 - 20.5,
            y: random.number() * 41 - 20.5,
          },
          orientation: {
            heading: Math.floor(random.number() * 360),
          },
        },
      ),
    );
  record();
  function rules() {
    grow();
    const old = population();
    for (const a of random.sample(old, {
      count: old.length,
      compatibility: "legacy-shuffle",
    })) {
      a.rotate(Math.floor(random.number() * 50));
      a.rotate(-Math.floor(random.number() * 50));
      a.move(1);
      a.energy -= 0.5;
      const f = grid.fieldAt(a)!;
      if (f.cover === "grass") {
        f.cover = "empty";
        a.energy += settings.grassEnergy;
      }
      if (f.cover === "weeds") {
        f.cover = "empty";
        a.energy += settings.weedEnergy;
      }
      if (a.energy > settings.birthThreshold) {
        a.energy /= 2;
        const child = a.copy();
        world.add(child);
        child.move(1);
      }
      if (a.energy < 0) a.delete();
    }
  }
  return {
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i++) {
        if (population().length === 0) break;
        run(world, rules);
        record();
      }
    },
    setRules(rules: Partial<Omit<Parameters, "seed" | "number">>) {
      if (
        Reflect.ownKeys(rules).some(
          (k) =>
            ![
              "birthThreshold",
              "weedEnergy",
              "weedsGrowRate",
              "grassEnergy",
              "grassGrowRate",
            ].includes(String(k)),
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
        width: 41,
        height: 41,
        parameters: settings,
        done: population().length === 0,
        rabbits: Object.freeze(
          population().map((a) =>
            Object.freeze({
              id: a.id,
              x: a.x,
              y: a.y,
              heading: a.heading,
              energy: a.energy,
            }),
          ),
        ),
        cells: Object.freeze(
          grid.fields.map((f) =>
            Object.freeze({
              id: f.id,
              x: f.x,
              y: f.y,
              cover: f.cover,
            }),
          ),
        ),
        history: Object.freeze([...history]),
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: "Rabbits Grass Weeds",
  description:
    "Sequential resource growth, consumption and energy-limited reproduction. Wilensky (2001), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<Parameters, ReturnType<typeof create>>;
