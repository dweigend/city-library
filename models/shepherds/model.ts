/** NetLogo Shepherds (Wilensky, 1998), CC BY-NC-SA 3.0; see NOTICE.md. */
import { Agent, Grid, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";
export interface Parameters {
  seed: number;
  sheepCount: number;
  shepherdCount: number;
  sheepSpeed: number;
}
export const inputs: Inputs<Parameters> = {
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  sheepCount: {
    kind: "number",
    default: 150,
    min: 0,
    max: 500,
    integer: true,
  },
  shepherdCount: {
    kind: "number",
    default: 30,
    min: 0,
    max: 100,
    integer: true,
  },
  sheepSpeed: {
    kind: "number",
    default: 0.02,
    min: 0,
    max: 0.2,
    step: 0.01,
  },
};
type Sheep = Agent<{
  kind: "sheep";
  hidden: boolean;
}>;
type Shepherd = Agent<{
  kind: "shepherd";
  carriedSheep: Sheep | null;
  foundHerd: boolean;
}>;
export function create(options: Partial<Parameters> = {}) {
  let settings = parseParameters(inputs, options);
  const random = Random.create({
    seed: settings.seed,
  });
  const space = {
    x: 51,
    y: 51,
    boundary: "wrap" as const,
  };
  const world = World.create(space, {
    random,
  });
  const grid = Grid.create(space, {
    state: {
      green: 0,
      nearbySheepCount: 0,
    },
  });
  world.add(grid);
  for (const f of random.sample(grid.fields, {
    sampleCount: grid.fields.length,
    algorithm: "fisher-yates-descending",
  }))
    f.green = 55 + random.number() * 0.8 - 0.4;
  const sheep = () =>
    (world.agents as readonly (Sheep | Shepherd)[]).filter(
      (a): a is Sheep => a.kind === "sheep",
    );
  const shepherds = () =>
    (world.agents as readonly (Sheep | Shepherd)[]).filter(
      (a): a is Shepherd => a.kind === "shepherd",
    );
  function location() {
    return {
      position: {
        x: random.number() * 51 - 25.5,
        y: random.number() * 51 - 25.5,
      },
      orientation: {
        heading: Math.floor(random.number() * 360),
      },
    };
  }
  for (let i = 0; i < settings.sheepCount; i++)
    world.add(
      Agent.create(
        {
          kind: "sheep" as const,
          hidden: false,
        },
        location(),
      ),
    );
  for (let i = 0; i < settings.shepherdCount; i++)
    world.add(
      Agent.create(
        {
          kind: "shepherd" as const,
          carriedSheep: null as Sheep | null,
          foundHerd: false,
        },
        location(),
      ),
    );
  const history: {
    tick: number;
    efficiency: number;
  }[] = [];
  let herdingEfficiency = 0,
    sheeplessNeighborhoodCount = 0;
  function record() {
    if (world.tick.value % 50 !== 0) return;
    let empty = 0;
    sheeplessNeighborhoodCount = 0;
    const all = sheep();
    for (const f of grid.fields) {
      f.nearbySheepCount = grid
        .neighbors(f, {
          neighborhood: "moore",
        })
        .reduce(
          (sum, n) =>
            sum +
            grid.agentsAt(n, {
              source: all,
            }).length,
          0,
        );
      if (f.nearbySheepCount === 0) sheeplessNeighborhoodCount++;
      if (
        grid.agentsAt(f, {
          source: all,
        }).length === 0
      )
        empty++;
    }
    herdingEfficiency = (sheeplessNeighborhoodCount / empty) * 100;
    history.push(
      Object.freeze({
        tick: world.tick.value,
        efficiency: herdingEfficiency,
      }),
    );
    if (history.length > 1001) history.splice(1, 1);
  }
  function wiggle(a: Sheep | Shepherd) {
    a.rotate(
      Math.floor(random.number() * 50) - Math.floor(random.number() * 50),
    );
  }
  function rules() {
    const old = shepherds();
    for (const s of random.sample(old, {
      sampleCount: old.length,
      algorithm: "fisher-yates-descending",
    })) {
      const here = () =>
        grid.agentsAt(grid.fieldAt(s)!, {
          source: sheep(),
        });
      if (s.carriedSheep === null) {
        const selected = random.sample(here().filter((a) => !a.hidden))[0];
        if (selected) {
          s.carriedSheep = selected;
          selected.hidden = true;
          s.move(1);
        }
      } else if (s.foundHerd) {
        if (here().every((a) => a.hidden)) {
          s.carriedSheep.hidden = false;
          s.carriedSheep = null;
          s.foundHerd = false;
          s.rotate(Math.floor(random.number() * 360));
          s.move(20);
        }
      } else if (here().some((a) => !a.hidden)) s.foundHerd = true;
      wiggle(s);
      s.move(1);
      if (s.carriedSheep)
        s.carriedSheep.move({
          to: {
            x: s.x,
            y: s.y,
          },
        });
    }
    const moving = sheep().filter((a) => !a.hidden);
    for (const a of random.sample(moving, {
      sampleCount: moving.length,
      algorithm: "fisher-yates-descending",
    })) {
      wiggle(a);
      a.move(settings.sheepSpeed);
    }
  }
  record();
  return {
    advance(stepCount = 1) {
      validateStepCount(stepCount);
      for (let i = 0; i < stepCount; i++) {
        run(world, rules);
        record();
      }
    },
    setRules(rules: Partial<Pick<Parameters, "sheepSpeed">>) {
      if (Reflect.ownKeys(rules).some((k) => k !== "sheepSpeed"))
        throw new TypeError("Unknown live rule.");
      settings = parseParameters(inputs, {
        ...settings,
        ...rules,
      });
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        width: 51,
        height: 51,
        parameters: settings,
        herdingEfficiency,
        sheeplessNeighborhoods: sheeplessNeighborhoodCount,
        sheep: Object.freeze(
          sheep().map((a) =>
            Object.freeze({
              id: a.id,
              x: a.x,
              y: a.y,
              heading: a.heading,
              hidden: a.hidden,
            }),
          ),
        ),
        shepherds: Object.freeze(
          shepherds().map((a) =>
            Object.freeze({
              id: a.id,
              x: a.x,
              y: a.y,
              heading: a.heading,
              carriedSheep: a.carriedSheep?.id ?? null,
              foundHerd: a.foundHerd,
            }),
          ),
        ),
        cells: Object.freeze(
          grid.fields.map((f) =>
            Object.freeze({
              id: f.id,
              x: f.x,
              y: f.y,
              green: f.green,
              nearbySheepCount: f.nearbySheepCount,
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
  title: "Shepherds",
  description:
    "Canonical sheep pickup, herd search and delayed release. Wilensky (1998), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<Parameters, ReturnType<typeof create>>;
