/** NetLogo Honeycomb, Wilensky (2003), rules by David Little. See NOTICE.md. */
import { Agent, Grid, Random, World, stats, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";

export interface HoneycombParameters {
  seed: number;
  numBees: number;
}
export const inputs: Inputs<HoneycombParameters> = {
  seed: { kind: "number", default: 1, integer: true },
  numBees: { kind: "number", default: 250, min: 1, max: 500, integer: true },
};
type Bee = Agent<{ who: number; shade: number; hidden: boolean }>;
export function create(options: Partial<HoneycombParameters> = {}) {
  const settings = parameters(inputs, options);
  const random = Random.add({ seed: settings.seed });
  const space = { x: 81, y: 81, boundary: "wrap" } as const;
  const world = World.add(space, { random });
  const grid = Grid.add(space, { state: { chemical: 0 } });
  world.add(grid);
  const bees = () => world.agents as readonly Bee[];

  function setup() {
    world.delete(bees());
    for (const field of grid.fields) field.chemical = 0;
    for (let who = 0; who < settings.numBees; who++) {
      world.add(
        Agent.add(
          {
            who,
            shade: random.number({ min: 0, max: 7, integer: true }),
            hidden: false,
          },
          {
            position: {
              x: -40.5 + random.number() * 81,
              y: -40.5 + random.number() * 81,
            },
            orientation: {
              heading: random.number({ min: 0, max: 360, integer: true }),
            },
          },
        ),
      );
    }
    world.tick.reset();
  }

  function go() {
    for (const bee of random.sample(bees(), {
      count: bees().length,
      compatibility: "legacy-shuffle",
    })) {
      const chemical = grid.fieldAt(bee)!.chemical;
      bee.rotate(4 * chemical);
      bee.move(1 + chemical ** 2 / 60);
      grid.fieldAt(bee)!.chemical += 2;
    }
    if (world.tick.value % 10 === 0) {
      grid.diffuse("chemical", { rate: 0.1, neighborhood: "moore" });
      for (const field of grid.fields) field.chemical *= 0.9;
    }
  }

  function advance(count = 1) {
    stepCount(count);
    for (let index = 0; index < count; index++) run(world, go);
  }
  function hideBees() {
    for (const bee of bees()) bee.hidden = true;
  }
  function showBees() {
    for (const bee of bees()) bee.hidden = false;
  }
  function read() {
    return {
      tick: world.tick.value,
      width: 81,
      height: 81,
      parameters: { ...settings },
      chemicalTotal: stats.describe(grid.fields.map((field) => field.chemical))
        .sum,
      cells: grid.fields.map((field) => ({
        id: field.id,
        x: field.x,
        y: field.y,
        chemical: field.chemical,
        color: `rgb(${Math.round(Math.min(1, field.chemical / 20) * 255)} ${Math.round(Math.min(1, field.chemical / 20) * 255)} ${Math.round(Math.min(1, field.chemical / 20) * 255)})`,
      })),
      agents: bees().map((bee) => ({
        id: bee.id,
        who: bee.who,
        x: bee.x,
        y: bee.y,
        heading: bee.heading,
        hidden: bee.hidden,
        color: `hsl(52 85% ${25 + bee.shade * 8}%)`,
      })),
    };
  }
  setup();
  return { advance, read, setup, go, hideBees, showBees };
}
export const model = {
  title: "Honeycomb",
  inputs,
  create,
} satisfies Definition<HoneycombParameters, ReturnType<typeof create>>;
