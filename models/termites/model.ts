/** NetLogo Termites (Wilensky, 1997), CC BY-NC-SA 3.0; see NOTICE.md. */
import { Agent, Grid, Random, World } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface Parameters {
  seed: number;
  number: number;
  density: number;
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
    default: 400,
    min: 1,
    max: 2000,
    integer: true,
  },
  density: {
    kind: "number",
    default: 20,
    min: 0,
    max: 100,
    integer: true,
  },
};
type Termite = Agent<{
  phase: "search" | "find-pile" | "drop" | "escape";
  carrying: boolean;
  cycles: number;
}>;
export function create(options: Partial<Parameters> = {}) {
  const settings = parameters(inputs, options);
  const random = Random.add({
    seed: settings.seed,
  });
  const space = {
    x: 201,
    y: 201,
    boundary: "wrap" as const,
  };
  const world = World.add(space, {
    random,
  });
  const grid = Grid.add(space, {
    state: {
      chip: false,
    },
  });
  world.add(grid);
  for (const f of random.sample(grid.fields, {
    count: grid.fields.length,
    compatibility: "legacy-shuffle",
  }))
    f.chip = random.number() * 100 < settings.density;
  for (let i = 0; i < settings.number; i++)
    world.add(
      Agent.add(
        {
          phase: "search" as const,
          carrying: false,
          cycles: 0,
        },
        {
          position: {
            x: random.number() * 201 - 100.5,
            y: random.number() * 201 - 100.5,
          },
          orientation: {
            heading: Math.floor(random.number() * 360),
          },
        },
      ),
    );
  const population = () => world.agents as readonly Termite[];
  let work = 0;
  function wiggle(a: Termite) {
    a.move(1);
    a.rotate(Math.floor(random.number() * 50));
    a.rotate(-Math.floor(random.number() * 50));
  }
  // One resumable recursive-procedure activation per agent per sweep. No artificial ticks.
  function activate(a: Termite) {
    const f = grid.fieldAt(a)!;
    switch (a.phase) {
      case "search":
        if (f.chip) {
          f.chip = false;
          a.carrying = true;
          a.move(20);
          a.phase = "find-pile";
        } else wiggle(a);
        break;
      case "find-pile":
        if (f.chip) a.phase = "drop";
        else wiggle(a);
        break;
      case "drop":
        if (!f.chip) {
          f.chip = true;
          a.carrying = false;
          a.phase = "escape";
          a.rotate(Math.floor(random.number() * 360));
          a.move(20);
        } else {
          a.rotate(Math.floor(random.number() * 360));
          a.move(1);
        }
        break;
      case "escape":
        if (f.chip) {
          a.rotate(Math.floor(random.number() * 360));
          a.move(20);
        } else {
          a.cycles++;
          a.phase = "search";
        }
        break;
    }
  }
  return {
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i++) {
        const old = population();
        for (const a of random.sample(old, {
          count: old.length,
          compatibility: "legacy-shuffle",
        }))
          activate(a);
        work++;
      }
    },
    read() {
      return Object.freeze({
        tick: null,
        width: 201,
        height: 201,
        parameters: settings,
        work,
        chipCount: grid.fields.filter((f) => f.chip).length,
        carryingCount: population().filter((a) => a.carrying).length,
        termites: Object.freeze(
          population().map((a) =>
            Object.freeze({
              id: a.id,
              x: a.x,
              y: a.y,
              heading: a.heading,
              carrying: a.carrying,
              phase: a.phase,
              cycles: a.cycles,
            }),
          ),
        ),
        cells: Object.freeze(
          grid.fields.map((f) =>
            Object.freeze({
              id: f.id,
              x: f.x,
              y: f.y,
              chip: f.chip,
            }),
          ),
        ),
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: "Termites",
  description:
    "Resumable wood-chip aggregation searches; work sweeps are not source ticks. Wilensky (1997), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<Parameters, ReturnType<typeof create>>;
