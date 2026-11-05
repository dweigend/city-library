/** Central Limit Theorem, Wilensky (2005), CC BY-NC-SA 3.0. Full source notices: NOTICE.md. */
import { Random, stats } from "city-library";
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
interface Person {
  id: string;
  x: number;
  y: number;
  chosen: boolean;
}
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
  let tick = 0,
    ranger = 0,
    message = "",
    background = "setup";
  const people: Person[] = [],
    means: number[] = [],
    sums: number[] = [];
  function setup() {
    people.length = 0;
    means.length = 0;
    sums.length = 0;
    tick = 0;
    ranger = 0;
    message = "";
    background = "setup";
  }
  function sproutPerson(x: number, y: number) {
    people.push({ id: String(people.length), x, y, chosen: false });
  }
  function createPopulation() {
    setup();
    ranger = settings.maxValue + 1;
    background = "random";
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
    ranger = settings.maxValue + 1;
    const column = Math.round(x);
    if (column < -15 || column > 15 || Math.round(y) === -15) return;
    const top = Math.min(
      15,
      1 +
        Math.max(-15, ...people.filter((p) => p.x === column).map((p) => p.y)),
    );
    if (!people.some((p) => p.x === column && p.y === top))
      sproutPerson(column, top);
  }
  function resetTurtles() {
    for (const p of people) p.chosen = false;
  }
  function calculateAndPlotSampleStuff() {
    const sum = people
      .filter((p) => p.chosen)
      .reduce((a, p) => a + p.x + 15, 0);
    sums.push(sum);
    means.push(sum / settings.sampleSize);
  }
  function go() {
    resetTurtles();
    if (settings.sampleSize > people.length) {
      message = "There are not enough people to take a sample of this size.";
      return;
    }
    message = "";
    for (const p of random.sample(people, { count: settings.sampleSize }))
      p.chosen = true;
    tick++;
    calculateAndPlotSampleStuff();
  }
  function standardDeviation(values: readonly number[]) {
    if (values.length < 2) return null;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    return Math.sqrt(
      values.reduce((a, n) => a + (n - mean) ** 2, 0) / (values.length - 1),
    );
  }
  return {
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
        tick,
        width: 31,
        height: 31,
        parameters: settings,
        ranger,
        background,
        message,
        population: people.length,
        cells: Object.freeze(
          Array.from({ length: 961 }, (_, i) => {
            const x = (i % 31) - 15,
              y = Math.floor(i / 31) - 15;
            return Object.freeze({
              id: `${x},${y}`,
              x,
              y,
              active:
                background !== "setup" &&
                (background !== "random" || x < ranger - 15),
            });
          }),
        ),
        people: Object.freeze(people.map((p) => Object.freeze({ ...p }))),
        means: Object.freeze([...means]),
        sums: Object.freeze([...sums]),
        meanHistogram: plotHistogram(means),
        sumHistogram: plotHistogram(sums),
        numSamples: means.length,
        expectedValue:
          settings.showEV && people.length
            ? people.reduce((a, p) => a + p.x + 15, 0) / people.length
            : null,
        stdDevMeans: standardDeviation(means),
        stdDevSums: settings.alsoSums ? standardDeviation(sums) : null,
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
