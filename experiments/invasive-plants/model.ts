/** NetLogo Invasive Plants, Wilensky (2025), CC BY-NC-SA 3.0. Exact source and notices retained. */
import { Agent, Grid, Random, World, run, stats, geometry } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface InvasivePlantsParameters {
  seed: number;
  initialDensity: number;
  initialResistanceShape: "none" | "plus" | "circle";
  seedProductionRate: number;
  spreadDistance: number;
  weedKillerThreshold: number;
  weedKillerEffectiveness: number;
  weedKillerRate: number;
  drawMode: "infestation" | "resistance";
  drawValue: number;
  showSeeds: boolean;
}
export const inputs: Inputs<InvasivePlantsParameters> = {
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  initialDensity: { kind: "number", default: 0.01, min: 0, max: 1, step: 0.01 },
  initialResistanceShape: {
    kind: "choice",
    default: "plus",
    options: ["none", "plus", "circle"],
  },
  seedProductionRate: {
    kind: "number",
    default: 0.05,
    min: 0,
    max: 1,
    step: 0.01,
  },
  spreadDistance: { kind: "number", default: 1, min: 0, max: 10, step: 0.5 },
  weedKillerThreshold: {
    kind: "number",
    default: 66,
    min: 0,
    max: 100,
    integer: true,
  },
  weedKillerEffectiveness: {
    kind: "number",
    default: 0.95,
    min: 0,
    max: 1,
    step: 0.01,
  },
  weedKillerRate: {
    kind: "number",
    default: 5,
    min: 0,
    max: 30,
    integer: true,
  },
  drawMode: {
    kind: "choice",
    default: "resistance",
    options: ["infestation", "resistance"],
  },
  drawValue: { kind: "number", default: 100, min: 0, max: 100, integer: true },
  showSeeds: { kind: "boolean", default: true },
};
type Seed = Agent<{ kind: "seed"; hidden: boolean }>;
export function create(options: Partial<InvasivePlantsParameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.add({ seed: settings.seed });
  const width = 33,
    height = 33;
  const world = World.add(
    { x: width, y: height, boundary: "hard" },
    { random },
  );
  const grid = Grid.add(
    { x: width, y: height, boundary: "hard" },
    { state: { infestation: 0, resistance: 0, hasResistanceBlock: true } },
  );
  world.add(grid);
  const seeds = () => world.agents as readonly Seed[];
  const history: Readonly<{ tick: number; infestation: number }>[] = [];
  function aggregate() {
    return grid.fields.reduce((sum, f) => sum + f.infestation, 0);
  }
  function record() {
    history.push(
      Object.freeze({ tick: world.tick.value, infestation: aggregate() }),
    );
    if (history.length > 1001) history.splice(1, 1);
  }
  for (const f of grid.fields) {
    if (Math.floor(random.number() * 100) < settings.initialDensity * 100)
      f.infestation = 100;
    const resistant =
      settings.initialResistanceShape === "plus"
        ? Math.abs(f.x) < 3 || Math.abs(f.y) < 3
        : settings.initialResistanceShape === "circle"
          ? f.x * f.x + f.y * f.y < 49
          : false;
    if (resistant) {
      f.resistance = settings.drawValue;
      f.infestation = 0;
    }
  }
  function germinate() {
    for (const seed of random.sample(seeds(), {
      count: seeds().length,
      compatibility: "legacy-shuffle",
    })) {
      const field = grid.fieldAt(seed)!;
      if (Math.floor(random.number() * 100) > field.resistance)
        field.infestation = Math.min(100, field.infestation + 1);
      seed.delete();
    }
  }
  function weedKiller() {
    const targets = grid.fields.filter(
      (f) => f.infestation > settings.weedKillerThreshold,
    );
    for (const target of random.sample(targets, {
      count: Math.min(settings.weedKillerRate, targets.length),
    })) {
      target.infestation = Math.max(
        0,
        target.infestation -
          settings.weedKillerEffectiveness * target.infestation,
      );
      for (const n of grid.neighbors(target, { neighborhood: "moore" }))
        n.infestation = Math.max(
          0,
          n.infestation -
            (settings.weedKillerEffectiveness / 2) * n.infestation,
        );
    }
  }
  function generate() {
    for (const field of random.sample(grid.fields, {
      count: grid.fields.length,
      compatibility: "legacy-shuffle",
    })) {
      const mean = settings.seedProductionRate * field.infestation;
      if (mean > 0) {
        const n = Math.round(
          Math.max(
            0,
            random.number({ distribution: "normal", mean, deviation: 1 }),
          ),
        );
        for (let i = 0; i < n; i++)
          world.add(
            Agent.add(
              { kind: "seed" as const, hidden: false },
              {
                position: { x: field.x, y: field.y },
                orientation: { heading: Math.floor(random.number() * 360) },
              },
            ),
          );
      }
    }
  }
  function spread() {
    for (const seed of random.sample(seeds(), {
      count: seeds().length,
      compatibility: "legacy-shuffle",
    })) {
      seed.hidden = !settings.showSeeds;
      let remaining = random.number() * settings.spreadDistance;
      const direction = geometry.direction({ heading: seed.heading });
      // NetLogo forward performs full unit moves followed by a fractional
      // remainder. A blocked unit stops this seed, retaining prior progress.
      while (remaining > 0) {
        const distance = Math.min(1, remaining);
        const target = {
          x: seed.x + direction.x * distance,
          y: seed.y + direction.y * distance,
        };
        const position = geometry.normalize(target, {
          space: world.space!,
          endpoints: "half-open",
        });
        if (!position) break;
        seed.move({ to: position });
        remaining -= distance;
      }
    }
  }
  function paint(
    x: number,
    y: number,
    mode: "infestation" | "resistance" = settings.drawMode,
    value: number = settings.drawValue,
  ) {
    if (
      ![x, y, value].every(Number.isFinite) ||
      value < 0 ||
      value > 100 ||
      !["infestation", "resistance"].includes(mode)
    )
      throw new RangeError("Invalid drawing data.");
    const position = geometry.normalize(
      { x, y },
      {
        space: world.space!,
        endpoints: "half-open",
      },
    );
    const field = position ? grid.fieldAt(position) : undefined;
    if (!field) throw new RangeError("Drawing outside the world.");
    if (mode === "infestation") field.infestation = value;
    else {
      field.infestation = 0;
      field.resistance = value;
    }
  }
  record();
  return {
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i++) {
        run(world, () => {
          germinate();
          weedKiller();
          generate();
          spread();
        });
        record();
      }
    },
    paint,
    draw(x: number, y: number) {
      run(world, () => paint(x, y));
      record();
    },
    drawingTick() {
      run(world, () => {});
      record();
    },
    clearFields() {
      for (const f of grid.fields) {
        f.infestation = 0;
        f.resistance = 0;
        f.hasResistanceBlock = false;
      }
    },
    clearPlots() {
      history.length = 0;
    },
    setRules(
      rules: Partial<
        Omit<
          InvasivePlantsParameters,
          "seed" | "initialDensity" | "initialResistanceShape"
        >
      >,
    ) {
      if (
        typeof rules !== "object" ||
        rules === null ||
        ![Object.prototype, null].includes(Object.getPrototypeOf(rules)) ||
        Reflect.ownKeys(rules).some(
          (key) =>
            typeof key !== "string" ||
            ![
              "seedProductionRate",
              "spreadDistance",
              "weedKillerThreshold",
              "weedKillerEffectiveness",
              "weedKillerRate",
              "drawMode",
              "drawValue",
              "showSeeds",
            ].includes(key) ||
            !("value" in Object.getOwnPropertyDescriptor(rules, key)!),
        )
      )
        throw new TypeError("Supply only live rule data.");
      settings = parameters(inputs, { ...settings, ...rules });
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        width,
        height,
        parameters: settings,
        aggregateInfestation: aggregate(),
        seeds: Object.freeze(
          seeds().map((s) =>
            Object.freeze({
              id: s.id,
              x: s.x,
              y: s.y,
              heading: s.heading,
              hidden: s.hidden,
            }),
          ),
        ),
        cells: Object.freeze(
          grid.fields.map((f) =>
            Object.freeze({
              id: f.id,
              x: f.x,
              y: f.y,
              infestation: f.infestation,
              resistance: f.resistance,
              hasResistanceBlock: f.hasResistanceBlock,
            }),
          ),
        ),
        histogram: stats.histogram(
          grid.fields.map((f) => Math.min(99, f.infestation)),
          { edges: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] },
        ),
        history: Object.freeze([...history]),
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: "Invasive Plants",
  description:
    "Seed dispersal, resistance and targeted herbicide runoff. Wilensky (2025), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<InvasivePlantsParameters, ReturnType<typeof create>>;
