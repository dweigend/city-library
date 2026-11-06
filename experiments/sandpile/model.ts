/** Exact NetLogo Sandpile source composition; CC0, see NOTICE.md. */
import { Grid, Random, World } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface SandpileParameters {
  width: number;
  height: number;
  seed: number;
  initial: "random" | "uniform";
  grainsPerPatch: number;
  dropLocation: "center" | "random" | "mouse-click";
  animateAvalanches: boolean;
}
export const inputs: Inputs<SandpileParameters> = {
  width: { kind: "number", default: 101, min: 3, max: 201, integer: true },
  height: { kind: "number", default: 101, min: 3, max: 201, integer: true },
  seed: { kind: "number", default: 1, integer: true },
  initial: {
    kind: "choice",
    default: "random",
    options: ["random", "uniform"],
  },
  grainsPerPatch: { kind: "number", default: 1, min: 0, max: 3, integer: true },
  dropLocation: {
    kind: "choice",
    default: "random",
    options: ["center", "random", "mouse-click"],
  },
  animateAvalanches: { kind: "boolean", default: false },
};
export function create(options: Partial<SandpileParameters> = {}) {
  let settings = parameters(inputs, options);
  if (settings.width % 2 !== 1 || settings.height % 2 !== 1)
    throw new RangeError("Use odd lattice dimensions.");
  const random = Random.add({ seed: settings.seed }),
    world = World.add({ random });
  const grid = Grid.add(
    { x: settings.width, y: settings.height, boundary: "hard" },
    { state: { n: 0 } },
  );
  world.add(grid);
  const fields = grid.fields;
  type Cell = (typeof fields)[number];
  const neighbors = new Map(
    fields.map((f) => [f, grid.neighbors(f, { neighborhood: "faces" })]),
  );
  let totalOnTick = 0;
  const sizes: number[] = [],
    lifetimes: number[] = [],
    history: { tick: number; average: number }[] = [];
  let exploredIds: readonly string[] = [],
    lastAvalancheIds: readonly string[] = [];
  let exploreMode = false;
  function total() {
    return fields.reduce((sum, f) => sum + f.n, 0);
  }
  function at(x: number, y: number) {
    if (!Number.isInteger(x) || !Number.isInteger(y))
      throw new RangeError("Expected patch coordinates.");
    const f = grid.fieldAt({ x, y });
    if (!f) throw new RangeError("Patch outside lattice.");
    return f;
  }
  function updateN(field: Cell, amount: number) {
    field.n += amount;
  }
  function stabilize() {
    let active = fields.filter((f) => f.n > 3),
      lifetime = 0;
    const fired = new Set<Cell>();
    while (active.length) {
      const overloaded = active.filter((f) => f.n > 3);
      if (overloaded.length) lifetime++;
      for (const f of random.sample(overloaded, {
        count: overloaded.length,
        compatibility: "legacy-shuffle",
      })) {
        updateN(f, -4);
        for (const neighbor of neighbors.get(f)!) updateN(neighbor, 1);
        fired.add(f);
      }
      active = [...new Set(overloaded.flatMap((f) => neighbors.get(f)!))];
    }
    return Object.freeze({
      size: fired.size,
      lifetime,
      ids: Object.freeze([...fired].map((f) => f.id)),
    });
  }
  function record() {
    history.push({ tick: world.tick.value, average: total() / fields.length });
    if (history.length > 1001) history.splice(1, 1);
  }
  function setup(mode: "random" | "uniform", n = settings.grainsPerPatch) {
    if (!Number.isInteger(n) || n < 0 || n > 3)
      throw new RangeError("Grains per patch must be 0..3.");
    for (const f of random.sample(fields, {
      count: fields.length,
      compatibility: "legacy-shuffle",
    }))
      f.n = mode === "random" ? Math.floor(random.number() * 4) : n;
    stabilize();
    totalOnTick = 0;
    sizes.length = lifetimes.length = history.length = 0;
    exploredIds = [];
    lastAvalancheIds = [];
    world.tick.reset();
    record();
  }
  function drop(field: Cell) {
    updateN(field, 1);
    const result = stabilize();
    lastAvalancheIds = result.ids;
    if (result.size) {
      sizes.push(result.size);
      lifetimes.push(result.lifetime);
    }
    totalOnTick = total();
    world.tick.advance();
    exploredIds = [];
    record();
    return result;
  }
  setup(settings.initial);
  return {
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i++) {
        if (settings.dropLocation === "mouse-click") continue;
        drop(
          settings.dropLocation === "center"
            ? at(0, 0)
            : random.sample(fields)[0]!,
        );
      }
    },
    dropAt(x: number, y: number) {
      return drop(at(x, y));
    },
    exploreAt(x: number, y: number) {
      const field = at(x, y),
        saved = fields.map((f) => f.n);
      try {
        const result = random.local(() => {
          updateN(field, 1);
          return stabilize();
        });
        exploredIds = result.ids;
        return result;
      } finally {
        fields.forEach((f, i) => (f.n = saved[i]!));
      }
    },
    clearExplore() {
      exploredIds = [];
    },
    setExploreMode(value: boolean) {
      if (typeof value !== "boolean") throw new TypeError("Expected boolean.");
      exploreMode = value;
      if (!value) exploredIds = [];
    },
    clearData() {
      sizes.length = lifetimes.length = 0;
    },
    setupUniform(n = settings.grainsPerPatch) {
      setup("uniform", n);
    },
    setupRandom() {
      setup("random");
    },
    setLive(
      value: Partial<
        Pick<
          SandpileParameters,
          "grainsPerPatch" | "dropLocation" | "animateAvalanches"
        >
      >,
    ) {
      settings = parameters(inputs, { ...settings, ...value });
    },
    stabilize,
    read() {
      return Object.freeze({
        tick: world.tick.value,
        width: settings.width,
        height: settings.height,
        parameters: settings,
        exploreMode,
        total: total(),
        totalOnTick,
        average: totalOnTick / fields.length,
        cells: Object.freeze(
          fields.map((f) =>
            Object.freeze({
              id: f.id,
              x: f.x,
              y: f.y,
              n: f.n,
              explored: exploredIds.includes(f.id),
              fired: lastAvalancheIds.includes(f.id),
            }),
          ),
        ),
        sizes: Object.freeze([...sizes]),
        lifetimes: Object.freeze([...lifetimes]),
        history: Object.freeze(history.map((p) => Object.freeze({ ...p }))),
        randomState: random.state,
        done: false,
      });
    },
  };
}
export const model = {
  title: "Sandpile",
  description:
    "Open-boundary sandpile avalanches · Weintrop et al. / Wilensky · CC0",
  inputs,
  create,
} satisfies Definition<SandpileParameters, ReturnType<typeof create>>;
