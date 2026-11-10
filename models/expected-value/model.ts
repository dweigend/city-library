/** Expected Value, Abrahamson & Wilensky (2004), CC BY-NC-SA 3.0. Full notices: NOTICE.md. */
import { Agent, Grid, Random, World, stats } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface Parameters {
  seed: number;
  ratio0: number;
  ratio1: number;
  ratio2: number;
  ratio3: number;
  ratio4: number;
  ratio5: number;
  ratio6: number;
  sampleSize: number;
  setupApart: boolean;
  blackOut: boolean;
  dieNums: boolean;
}
export const inputs: Inputs<Parameters> = {
  seed: { kind: "number", default: 1, integer: true },
  ratio0: { kind: "number", default: 0, min: 0, max: 10, integer: true },
  ratio1: { kind: "number", default: 1, min: 0, max: 10, integer: true },
  ratio2: { kind: "number", default: 6, min: 0, max: 10, integer: true },
  ratio3: { kind: "number", default: 5, min: 0, max: 10, integer: true },
  ratio4: { kind: "number", default: 0, min: 0, max: 10, integer: true },
  ratio5: { kind: "number", default: 4, min: 0, max: 10, integer: true },
  ratio6: { kind: "number", default: 0, min: 0, max: 10, integer: true },
  sampleSize: { kind: "number", default: 10, min: 1, max: 20, integer: true },
  setupApart: { kind: "boolean", default: true },
  blackOut: { kind: "boolean", default: false },
  dieNums: { kind: "boolean", default: false },
};
function plotHistogram(values: readonly number[]) {
  const max = values.reduce(
    (max, value) => Math.max(max, Math.floor(value)),
    1,
  );
  const h = stats.histogram(values, {
    edges: Array.from({ length: max + 2 }, (_, i) => i),
  });
  return Object.freeze(h.counts.map((y, x) => Object.freeze({ x, y })));
}
export function create(options: Partial<Parameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const grid = Grid.create(
    { x: 15, y: 15, boundary: "wrap" },
    { state: { value: -1, selected: 0 } },
  );
  const world = World.create(grid.space, { random });
  world.add(grid);
  // Canonical Field references in the original print-out order, never tile copies.
  const tiles = [...grid.fields].sort((a, b) => a.x - b.x || a.y - b.y);
  const walker = world.add(Agent.create({}));
  let visible = !settings.blackOut || settings.setupApart;
  const totals: number[] = [0],
    values: number[] = [];
  const ratios = [
    settings.ratio0,
    settings.ratio1,
    settings.ratio2,
    settings.ratio3,
    settings.ratio4,
    settings.ratio5,
    settings.ratio6,
  ];
  const sum = ratios.reduce((a, b) => a + b, 0);
  if (sum === 0)
    throw new RangeError("Cannot set all ratio-units sliders to 0.");
  function setupFieldsPolish() {
    const raw = ratios.map((n) => (n / sum) * 225),
      nums = raw.map(Math.round);
    while (nums.reduce((a, b) => a + b, 0) < 225) {
      const rem = raw.map((n) => (n * 225) % 225);
      const i = rem.indexOf(Math.max(...rem));
      nums[i]!++;
      raw[i] = Math.floor(raw[i]!) + 1;
    }
    while (nums.reduce((a, b) => a + b, 0) > 225) {
      const rem = raw.map((n) => (n * 225) % 225 || 225);
      const i = rem.indexOf(Math.min(...rem));
      nums[i]!--;
      raw[i] = Math.floor(raw[i]!);
    }
    return nums;
  }
  const populationCounts = setupFieldsPolish();
  function setupFields() {
    populationCounts.forEach((n, value) => {
      for (const t of random.sample(
        tiles.filter((t) => t.value < 0),
        { count: n },
      ))
        t.value = value;
    });
    if (settings.setupApart) {
      let index = 0;
      populationCounts.forEach((n, value) => {
        for (let i = 0; i < n; i++) tiles[index++]!.value = value;
      });
      for (let pass = 0; pass < 56; pass++)
        for (const tile of random.sample(tiles, {
          count: tiles.length,
          algorithm: "fisher-yates-descending",
        })) {
          const neighbor = grid.neighbors(tile, { neighborhood: "faces" })[
            Math.floor(random.number() * 4)
          ]!;
          [tile.value, neighbor.value] = [neighbor.value, tile.value];
        }
    }
  }
  function setupLittleGuy() {
    const tile = random.sample(tiles, { count: 1 })[0]!;
    walker.move({ to: tile });
    const neighbor = random.sample(
      grid.neighbors(tile, { neighborhood: "faces" }),
      { count: 1 },
    )[0]!;
    walker.rotate({ towards: neighbor });
  }
  function clearSelection() {
    for (const t of tiles) t.selected = 0;
    visible = !settings.blackOut;
  }
  function getReadyForNextSample() {
    setupLittleGuy();
    values.length = 0;
  }
  function selectField() {
    const tile = grid.fieldAt(walker)!;
    tile.selected++;
    return tile.value;
  }
  function go() {
    clearSelection();
    getReadyForNextSample();
    for (let i = 0; i < settings.sampleSize; i++) {
      values.push(selectField());
      walker.move(1);
      walker.rotate([-90, 0, 90][Math.floor(random.number() * 3)]!);
    }
    totals.push(values.reduce((a, b) => a + b, 0));
    world.tick.advance();
  }
  setupFields();
  setupLittleGuy();
  return {
    get world() {
      return world;
    },
    get grid() {
      return grid;
    },
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i++) go();
    },
    clearSelection,
    setDisplay(change: Partial<Pick<Parameters, "blackOut" | "dieNums">>) {
      settings = parameters(inputs, { ...settings, ...change });
    },
    read() {
      let cumulativeTotal = 0;
      const cumulativeMeans = totals.map((value, x) => {
        cumulativeTotal += value;
        return Object.freeze({ x, y: cumulativeTotal / (x + 1) });
      });
      const expectedValue =
        settings.sampleSize * ratios.reduce((a, n, i) => a + (n * i) / sum, 0);
      return Object.freeze({
        tick: world.tick.value,
        width: 15,
        height: 15,
        parameters: settings,
        expectedValue,
        populationCounts: Object.freeze([...populationCounts]),
        populationPercentages: Object.freeze(
          ratios.map((n) => (n / sum) * 100),
        ),
        calculation: `${settings.sampleSize} × (${ratios.map((n, i) => `${i} × ${n}/${sum}`).join(" + ")})`,
        totalHistogram: plotHistogram(totals),
        cumulativeMeans: Object.freeze(cumulativeMeans),
        sampleTotal: totals.at(-1)!,
        mean: stats.describe(totals).mean ?? 0,
        runs: totals.length,
        totals: Object.freeze([...totals]),
        values: Object.freeze([...values]),
        walker: Object.freeze({
          x: walker.x,
          y: walker.y,
          heading: walker.heading,
        }),
        cells: Object.freeze(
          tiles.map((t) =>
            Object.freeze({
              id: String((t.x + 7) * 15 + t.y + 7),
              x: t.x,
              y: t.y,
              value: t.value,
              selected: t.selected,
              visible: visible || t.selected > 0,
            }),
          ),
        ),
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: "Expected Value",
  description:
    "Tile population and correlated wandering samples. Abrahamson & Wilensky (2004), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<Parameters, ReturnType<typeof create>>;
