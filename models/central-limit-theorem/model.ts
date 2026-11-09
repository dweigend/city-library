/** Central Limit Theorem, Wilensky (2005), CC BY-NC-SA 3.0. Full source notices: NOTICE.md. */
import { Agent, Grid, Random, World, stats } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface Parameters {
  seed: number;
  sampleSize: number;
  maxValue: number;
  alsoSums: boolean;
  showEV: boolean;
}
export const inputs: Inputs<Parameters> = {
  seed: { kind: "number", default: 1, integer: true },
  sampleSize: { kind: "number", default: 10, min: 1, max: 10, integer: true },
  maxValue: { kind: "number", default: 28, min: 0, max: 30, integer: true },
  alsoSums: { kind: "boolean", default: false },
  showEV: { kind: "boolean", default: true },
};
type Person = Agent<{ sourceIndex: number; chosen: boolean }>;
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
  const grid = Grid.add(
    { x: 31, y: 31, boundary: "wrap" },
    { state: { active: false } },
  );
  const world = World.add(grid.space, { random });
  world.add(grid);
  const fields = grid.fields;
  let ranger = 0,
    message = "",
    background = "setup",
    nextSourceIndex = 0;
  const means: number[] = [],
    sums: number[] = [];
  // World membership is authoritative. This only narrows its known payload type.
  function people() {
    return world.agents as readonly Person[];
  }
  function setup() {
    for (const p of people()) p.delete();
    for (const p of fields) p.active = false;
    means.length = 0;
    sums.length = 0;
    world.tick.reset();
    ranger = 0;
    message = "";
    background = "setup";
    nextSourceIndex = 0;
  }
  function sproutPerson(x: number, y: number) {
    const field = grid.fieldAt({ x, y })!;
    world.add(
      Agent.add(
        { sourceIndex: nextSourceIndex++, chosen: false },
        { position: field },
      ),
    );
  }
  function createPopulation() {
    setup();
    ranger = settings.maxValue + 1;
    background = "random";
    for (const field of fields) field.active = field.x < ranger - 15;
    for (let x = -15; x < -15 + ranger; x++) {
      const top = Math.floor(random.number() * 31) - 15;
      for (let y = -14; y < top; y++) sproutPerson(x, y);
    }
  }
  function preset(n: number) {
    if (!Number.isInteger(n) || n < 1 || n > 6)
      throw new RangeError("Preset must be from 1 to 6.");
    setup();
    settings = parameters(inputs, { ...settings, maxValue: 30 });
    ranger = 31;
    background = "preset";
    for (const field of fields) field.active = true;
    for (let x = -15; x <= 15; x++)
      for (let y = -14; y <= 15; y++) {
        const included =
          n === 1
            ? y < 0
            : n === 2
              ? y < -15 + Math.abs(x)
              : n === 3
                ? ((x % 2) + 2) % 2 === 1
                : n === 4
                  ? Math.abs(x) === 15
                  : n === 5
                    ? y < 2 - Math.abs(x)
                    : y < 1 + x;
        if (included) sproutPerson(x, y);
      }
  }
  function drawYourOwnPeople(x: number, y: number) {
    if (!Number.isFinite(x) || !Number.isFinite(y))
      throw new TypeError("Drawing coordinates must be finite.");
    background = "draw";
    for (const field of fields) field.active = true;
    ranger = settings.maxValue + 1;
    const column = Math.round(x);
    if (column < -15 || column > 15 || Math.round(y) === -15) return;
    const occupied = fields.filter(
      (p) => p.x === column && grid.agentsAt(p).length > 0,
    );
    const top = Math.min(
      15,
      1 + occupied.reduce((highest, p) => Math.max(highest, p.y), -15),
    );
    const field = grid.fieldAt({ x: column, y: top })!;
    if (grid.agentsAt(field).length === 0) sproutPerson(column, top);
  }
  function resetAgents() {
    for (const p of people()) p.chosen = false;
  }

  function calculateAndPlotSampleStuff() {
    const sum = people()
      .filter((p) => p.chosen)
      .reduce((a, p) => a + p.x + 15, 0);
    sums.push(sum);
    means.push(sum / settings.sampleSize);
  }
  function go() {
    resetAgents();
    if (settings.sampleSize > people().length) {
      message = "There are not enough people to take a sample of this size.";
      return;
    }
    message = "";
    for (const p of random.sample(people(), { count: settings.sampleSize }))
      p.chosen = true;
    world.tick.advance();
    calculateAndPlotSampleStuff();
  }
  return {
    get world() {
      return world;
    },
    get grid() {
      return grid;
    },
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i++) {
        go();
        if (message) break;
      }
    },
    setup,
    createPopulation,
    preset,
    drawYourOwnPeople,
    setRules(change: Partial<Omit<Parameters, "seed">>) {
      settings = parameters(inputs, { ...settings, ...change });
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        width: 31,
        height: 31,
        parameters: settings,
        ranger,
        background,
        message,
        population: people().length,
        cells: Object.freeze(
          fields.map((p) =>
            Object.freeze({
              id: `${p.x},${p.y}`,
              x: p.x,
              y: p.y,
              active: p.active,
            }),
          ),
        ),
        people: Object.freeze(
          people().map((p) =>
            Object.freeze({
              id: String(p.sourceIndex),
              x: p.x,
              y: p.y,
              chosen: p.chosen,
            }),
          ),
        ),
        means: Object.freeze([...means]),
        sums: Object.freeze([...sums]),
        meanHistogram: plotHistogram(means),
        sumHistogram: plotHistogram(sums),
        numSamples: means.length,
        expectedValue:
          settings.showEV && people().length
            ? people().reduce((a, p) => a + p.x + 15, 0) / people().length
            : null,
        stdDevMeans:
          stats.describe(means, { sample: true }).standardDeviation ?? null,
        stdDevSums: settings.alsoSums
          ? (stats.describe(sums, { sample: true }).standardDeviation ?? null)
          : null,
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: "Central Limit Theorem",
  description:
    "Finite populations, sampling without replacement and sample means. Wilensky (2005), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<Parameters, ReturnType<typeof create>>;
