/** Adapted from NetLogo Wolf Sheep Predation, Uri Wilensky (1997).
 * CC BY-NC-SA 3.0, https://ccl.northwestern.edu/netlogo/models/WolfSheepPredation
 * Source commit bf0626a89358b48494066862843a91f36f2556cf.
 * Changes: typed headless composition, Mulberry RNG, explicit snapshot activation,
 * detached observations and bounded successful-step history. No appearance-owned rules.
 */
import { Agent, Grid, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";

export interface WolfSheepParameters {
  seed: number;
  mode: "sheep-wolves" | "sheep-wolves-grass";
  initialSheep: number;
  initialWolves: number;
  sheepGain: number;
  wolfGain: number;
  sheepReproduce: number;
  wolfReproduce: number;
  grassRegrowth: number;
}
export const inputs: Inputs<WolfSheepParameters> = {
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  mode: {
    kind: "choice",
    default: "sheep-wolves",
    options: ["sheep-wolves", "sheep-wolves-grass"],
  },
  initialSheep: {
    kind: "number",
    default: 100,
    min: 0,
    max: 250,
    integer: true,
  },
  initialWolves: {
    kind: "number",
    default: 50,
    min: 0,
    max: 250,
    integer: true,
  },
  sheepGain: { kind: "number", default: 4, min: 0, max: 50, integer: true },
  wolfGain: { kind: "number", default: 20, min: 0, max: 100, integer: true },
  sheepReproduce: {
    kind: "number",
    default: 4,
    min: 1,
    max: 20,
    integer: true,
  },
  wolfReproduce: { kind: "number", default: 5, min: 0, max: 20, integer: true },
  grassRegrowth: {
    kind: "number",
    default: 30,
    min: 0,
    max: 100,
    integer: true,
  },
};
type Animal = Agent<{ species: "sheep" | "wolf"; energy: number }>;
export function create(options: Partial<WolfSheepParameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const space = { x: 51, y: 51, boundary: "wrap" as const };
  const world = World.create(space, { random });
  const grid = Grid.create(space, { state: { grass: true, countdown: 0 } });
  world.add(grid);
  const fields = grid.fields;
  const integer = (upper: number) =>
    upper === 0 ? 0 : Math.floor(random.number() * upper);
  if (settings.mode === "sheep-wolves-grass")
    for (const field of fields) {
      field.grass = random.number() < 0.5;
      field.countdown = field.grass
        ? settings.grassRegrowth
        : integer(settings.grassRegrowth);
    }
  function population(species?: Animal["species"]): Animal[] {
    return (world.agents as readonly Animal[]).filter(
      (agent) => species === undefined || agent.species === species,
    );
  }
  for (const species of ["sheep", "wolf"] as const) {
    const count =
      species === "sheep" ? settings.initialSheep : settings.initialWolves;
    const gain = species === "sheep" ? settings.sheepGain : settings.wolfGain;
    for (let i = 0; i < count; i += 1)
      world.add(
        Agent.create(
          { species, energy: integer(2 * gain) },
          {
            position: {
              x: random.number() * 51 - 25.5,
              y: random.number() * 51 - 25.5,
            },
            orientation: { heading: integer(360) },
          },
        ),
      );
  }
  const history: {
    tick: number;
    sheep: number;
    wolves: number;
    grass: number;
    grassAvailable: boolean;
  }[] = [];
  function counts() {
    return {
      sheep: population("sheep").length,
      wolves: population("wolf").length,
      grass:
        settings.mode === "sheep-wolves-grass"
          ? fields.filter((field) => field.grass).length
          : 0,
    };
  }
  function record() {
    history.push(Object.freeze({
      tick: world.tick.value,
      ...counts(),
      grassAvailable: settings.mode === "sheep-wolves-grass",
    }));
    if (history.length > 1001) history.splice(1, 1);
  }
  function stopReason(): string | null {
    const current = counts();
    return current.sheep + current.wolves === 0
      ? "No animals remain."
      : current.wolves === 0 && current.sheep > 10000
        ? "The sheep have inherited the earth (Web population limit)."
        : null;
  }
  function move(animal: Animal) {
    animal.rotate(integer(50));
    animal.rotate(-integer(50));
    animal.move(1);
  }
  function reproduce(animal: Animal, percent: number) {
    if (random.number() * 100 >= percent) return;
    animal.energy /= 2;
    const child = animal.copy();
    world.add(child);
    child.rotate(random.number() * 360);
    child.move(1);
  }
  function rules() {
    // Each source ask has its own captured population and random visitation order.
    for (const sheep of random.sample(population("sheep"), {
      count: population("sheep").length,
    })) {
      if (!sheep.alive) continue;
      move(sheep);
      if (settings.mode === "sheep-wolves-grass") {
        sheep.energy -= 1;
        const field = grid.fieldAt(sheep)!;
        if (field.grass) {
          field.grass = false;
          sheep.energy += settings.sheepGain;
        }
        if (sheep.energy < 0) {
          sheep.delete();
          continue;
        }
      }
      reproduce(sheep, settings.sheepReproduce);
    }
    const wolves = population("wolf");
    for (const wolf of random.sample(wolves, { count: wolves.length })) {
      if (!wolf.alive) continue;
      move(wolf);
      wolf.energy -= 1;
      const prey = random.sample(
        grid.agentsAt(grid.fieldAt(wolf)!, { source: population("sheep") }),
      )[0];
      if (prey) {
        prey.delete();
        wolf.energy += settings.wolfGain;
      }
      if (wolf.energy < 0) {
        wolf.delete();
        continue;
      }
      reproduce(wolf, settings.wolfReproduce);
    }
    if (settings.mode === "sheep-wolves-grass")
      for (const field of fields)
        if (!field.grass) {
          if (field.countdown <= 0) {
            field.grass = true;
            field.countdown = settings.grassRegrowth;
          } else field.countdown -= 1;
        }
  }
  record();
  return {
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i += 1) {
        if (stopReason()) break;
        run(world, rules);
        record();
      }
    },
    setRules(
      rules: Partial<
        Omit<WolfSheepParameters, "seed" | "initialSheep" | "initialWolves">
      >,
    ) {
      if (
        typeof rules !== "object" ||
        rules === null ||
        Reflect.ownKeys(rules).some(
          (key) =>
            ![
              "mode",
              "sheepGain",
              "wolfGain",
              "sheepReproduce",
              "wolfReproduce",
              "grassRegrowth",
            ].includes(String(key)),
        )
      )
        throw new TypeError("Unknown live rule.");
      settings = parameters(inputs, { ...settings, ...rules });
    },
    read() {
      const reason = stopReason();
      return Object.freeze({
        tick: world.tick.value,
        width: 51,
        height: 51,
        parameters: settings,
        counts: Object.freeze(counts()),
        agents: Object.freeze(
          population().map((animal) =>
            Object.freeze({
              id: animal.id,
              species: animal.species,
              x: animal.x,
              y: animal.y,
              heading: animal.heading,
              energy: animal.energy,
            }),
          ),
        ),
        cells: Object.freeze(
          fields.map((field) =>
            Object.freeze({
              id: field.id,
              x: field.x,
              y: field.y,
              grass: field.grass,
              countdown: field.countdown,
            }),
          ),
        ),
        history: Object.freeze([...history]),
        done: reason !== null,
        stopReason: reason,
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: "Wolf Sheep Predation",
  description:
    "Predation, reproduction and optional regrowing grass. Adapted from Uri Wilensky (1997), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<WolfSheepParameters, ReturnType<typeof create>>;
