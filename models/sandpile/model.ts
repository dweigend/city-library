/** Exact NetLogo Sandpile source composition; CC0, see NOTICE.md. */
import { Grid, Random, World, stats } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";
export interface SandpileParameters {
  width: number;
  height: number;
  seed: number;
  initial: "random" | "uniform";
  grainsPerField: number;
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
  grainsPerField: { kind: "number", default: 1, min: 0, max: 3, integer: true },
  dropLocation: {
    kind: "choice",
    default: "random",
    options: ["center", "random", "mouse-click"],
  },
  animateAvalanches: { kind: "boolean", default: false },
};
export function create(options: Partial<SandpileParameters> = {}) {
  let settings = parseParameters(inputs, options);
  if (settings.width % 2 !== 1 || settings.height % 2 !== 1)
    throw new RangeError("Use odd lattice dimensions.");
  const random = Random.create({ seed: settings.seed }),
    world = World.create({ random });
  const grid = Grid.create(
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
  type PlotPoint = Readonly<{ x: number; y: number }>;
  let sizePlot: readonly PlotPoint[] = [],
    lifetimePlot: readonly PlotPoint[] = [];
  // Source plot pens refresh only every hundred ticks. These are detached
  // observation buffers; canonical grain state remains exclusively on Fields.
  function updateAvalanchePlots() {
    const distributions = [sizes, lifetimes].map((values) => {
      if (!values.length) return Object.freeze([]) as readonly PlotPoint[];
      const maximum = Math.max(...values);
      const counts = stats.histogram(values, {
        edges: Array.from({ length: maximum + 2 }, (_, i) => i),
      }).counts;
      return Object.freeze(
        counts.flatMap((count, n) =>
          n > 0 && count > 0
            ? [Object.freeze({ x: Math.log10(n), y: Math.log10(count) })]
            : [],
        ),
      );
    });
    [sizePlot, lifetimePlot] = [distributions[0]!, distributions[1]!];
  }
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
      throw new RangeError("Expected field coordinates.");
    const f = grid.fieldAt({ x, y });
    if (!f) throw new RangeError("Field outside lattice.");
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
        sampleCount: overloaded.length,
        algorithm: "fisher-yates-descending",
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
    if (world.tick.value % 100 === 0) updateAvalanchePlots();
    history.push({ tick: world.tick.value, average: total() / fields.length });
    if (history.length > 1001) history.splice(1, 1);
  }
  function setup(mode: "random" | "uniform", n = settings.grainsPerField) {
    if (!Number.isInteger(n) || n < 0 || n > 3)
      throw new RangeError("Grains per field must be 0..3.");
    for (const f of random.sample(fields, {
      sampleCount: fields.length,
      algorithm: "fisher-yates-descending",
    }))
      f.n = mode === "random" ? Math.floor(random.number() * 4) : n;
    stabilize();
    totalOnTick = 0;
    sizes.length = lifetimes.length = history.length = 0;
    sizePlot = lifetimePlot = Object.freeze([]);
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
    advance(stepCount = 1) {
      validateStepCount(stepCount);
      for (let i = 0; i < stepCount; i++) {
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
      sizePlot = lifetimePlot = Object.freeze([]);
    },
    setupUniform(n = settings.grainsPerField) {
      setup("uniform", n);
    },
    setupRandom() {
      setup("random");
    },
    setLive(
      value: Partial<
        Pick<
          SandpileParameters,
          "grainsPerField" | "dropLocation" | "animateAvalanches"
        >
      >,
    ) {
      settings = parseParameters(inputs, { ...settings, ...value });
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
        sizePlot,
        lifetimePlot,
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
