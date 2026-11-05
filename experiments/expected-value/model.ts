/** Expected Value, Abrahamson & Wilensky (2004), CC BY-NC-SA 3.0. Full notices: NOTICE.md. */
import { Random, stats } from "city-library";
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
  const random = Random.add({ seed: settings.seed });
  const tiles = Array.from({ length: 225 }, (_, i) => ({
    id: String(i),
    x: Math.floor(i / 15) - 7,
    y: (i % 15) - 7,
    value: -1,
    selected: 0,
  }));
  let tick = 0,
    visible = !settings.blackOut || settings.setupApart;
  const totals: number[] = [0],
    values: number[] = [];
  const walker = { x: 0, y: 0, heading: 0 };
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
  function setupPatchesPolish() {
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
  const populationCounts = setupPatchesPolish();
  function setupPatches() {
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
          compatibility: "legacy-shuffle",
        })) {
          const neighbor = neighbors4(tile)[Math.floor(random.number() * 4)]!;
          [tile.value, neighbor.value] = [neighbor.value, tile.value];
        }
    }
  }
  function at(x: number, y: number) {
    return tiles[(Math.round(x) + 7) * 15 + Math.round(y) + 7]!;
  }
  function wrap(n: number) {
    return ((((n + 7.5) % 15) + 15) % 15) - 7.5;
  }
  function neighbors4(t: { x: number; y: number }) {
    return [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ].map(([dx, dy]) => at(wrap(t.x + dx!), wrap(t.y + dy!)));
  }
  function setupLittleGuy() {
    const tile = random.sample(tiles, { count: 1 })[0]!;
    walker.x = tile.x;
    walker.y = tile.y;
    walker.heading = Math.floor(random.number() * 4) * 90;
  }
  function clearSelection() {
    for (const t of tiles) t.selected = 0;
    visible = !settings.blackOut;
  }
  function getReadyForNextSample() {
    setupLittleGuy();
    values.length = 0;
  }
  function selectPatch() {
    const tile = at(walker.x, walker.y);
    tile.selected++;
    return tile.value;
  }
  function go() {
    clearSelection();
    getReadyForNextSample();
    for (let i = 0; i < settings.sampleSize; i++) {
      values.push(selectPatch());
      const rad = (walker.heading * Math.PI) / 180;
      walker.x = wrap(walker.x + Math.round(Math.sin(rad)));
      walker.y = wrap(walker.y + Math.round(Math.cos(rad)));
      walker.heading =
        (walker.heading +
          [-90, 0, 90][Math.floor(random.number() * 3)]! +
          360) %
        360;
    }
    totals.push(values.reduce((a, b) => a + b, 0));
    tick++;
  }
  setupPatches();
  setupLittleGuy();
  return {
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
        tick,
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
        mean: totals.reduce((a, b) => a + b, 0) / totals.length,
        runs: totals.length,
        totals: Object.freeze([...totals]),
        values: Object.freeze([...values]),
        walker: Object.freeze({ ...walker }),
        cells: Object.freeze(
          tiles.map((t) =>
            Object.freeze({ ...t, visible: visible || t.selected > 0 }),
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
