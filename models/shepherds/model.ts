/** NetLogo Shepherds (Wilensky, 1998), CC BY-NC-SA 3.0; see NOTICE.md. */
import { Agent, Grid, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface Parameters {
  seed: number;
  numSheep: number;
  numShepherds: number;
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
  numSheep: {
    kind: "number",
    default: 150,
    min: 0,
    max: 500,
    integer: true,
  },
  numShepherds: {
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
  let settings = parameters(inputs, options);
  const random = Random.add({
    seed: settings.seed,
  });
  const space = {
    x: 51,
    y: 51,
    boundary: "wrap" as const,
  };
  const world = World.add(space, {
    random,
  });
  const grid = Grid.add(space, {
    state: {
      green: 0,
      sheepNearby: 0,
    },
  });
  world.add(grid);
  for (const f of random.sample(grid.fields, {
    count: grid.fields.length,
    compatibility: "legacy-shuffle",
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
  for (let i = 0; i < settings.numSheep; i++)
    world.add(
      Agent.add(
        {
          kind: "sheep" as const,
          hidden: false,
        },
        location(),
      ),
    );
  for (let i = 0; i < settings.numShepherds; i++)
    world.add(
      Agent.add(
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
    sheeplessNeighborhoods = 0;
  function record() {
    if (world.tick.value % 50 !== 0) return;
    let empty = 0;
    sheeplessNeighborhoods = 0;
    const all = sheep();
    for (const f of grid.fields) {
      f.sheepNearby = grid
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
      if (f.sheepNearby === 0) sheeplessNeighborhoods++;
      if (
        grid.agentsAt(f, {
          source: all,
        }).length === 0
      )
        empty++;
    }
    herdingEfficiency = (sheeplessNeighborhoods / empty) * 100;
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
      count: old.length,
      compatibility: "legacy-shuffle",
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
      count: moving.length,
      compatibility: "legacy-shuffle",
    })) {
      wiggle(a);
      a.move(settings.sheepSpeed);
    }
  }
  record();
  return {
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i++) {
        run(world, rules);
        record();
      }
    },
    setRules(rules: Partial<Pick<Parameters, "sheepSpeed">>) {
      if (Reflect.ownKeys(rules).some((k) => k !== "sheepSpeed"))
        throw new TypeError("Unknown live rule.");
      settings = parameters(inputs, {
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
        sheeplessNeighborhoods,
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
              sheepNearby: f.sheepNearby,
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
