/** Partition Permutation Distribution, Wilensky (2004), CC BY-NC-SA 3.0. See NOTICE.md. */
import { Random, World, stats } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface Parameters {
  seed: number;
  targetTotal: number;
  numSuccesses: number;
  diminishingSampleSpace: boolean;
  waitAtFull: boolean;
}
export const inputs: Inputs<Parameters> = {
  seed: { kind: "number", default: 1, integer: true },
  targetTotal: { kind: "number", default: 72, min: 2, max: 100, integer: true },
  numSuccesses: {
    kind: "number",
    default: 10000,
    min: 0,
    max: 10000,
    step: 100,
    integer: true,
  },
  diminishingSampleSpace: { kind: "boolean", default: true },
  waitAtFull: { kind: "boolean", default: true },
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
  const world = World.add({ random });
  let successes = 0,
    seriesTrials = 0,
    addend: number | string = 0;
  let short: number[] = [],
    previous: number[] = [];
  const all: number[] = [],
    series: number[] = [];
  let ribbon: { value: number; color: number }[] = [];
  function randomGuessAndUpdateTotal() {
    const total = short.reduce((a, b) => a + b, 0);
    const space = settings.diminishingSampleSpace
      ? settings.targetTotal - total
      : settings.targetTotal;
    // NetLogo random accepts negative bounds: integers toward zero, excluding
    // the bound itself. Live target changes can make the remaining gap <= 0.
    const draw = Math.floor(random.number() * Math.abs(space));
    addend = 1 + (space < 0 ? -draw : draw);
    if (total + addend <= settings.targetTotal) {
      short.push(addend);
      ribbon.push({ value: addend, color: Math.floor(random.number() * 14) });
    }
    seriesTrials++;
    all.push(addend);
  }
  function finishUp() {
    if (short.reduce((a, b) => a + b, 0) === settings.targetTotal) {
      series.push(seriesTrials);
      seriesTrials = 0;
      previous = short;
      short = [];
      addend = "-";
      successes++;
      ribbon = [];
    }
  }
  function go() {
    if (successes >= settings.numSuccesses) return;
    randomGuessAndUpdateTotal();
    world.tick.advance();
    finishUp();
  }
  return {
    get world() {
      return world;
    },
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count && successes < settings.numSuccesses; i++) go();
    },
    setRules(
      change: Partial<
        Pick<
          Parameters,
          | "numSuccesses"
          | "diminishingSampleSpace"
          | "waitAtFull"
          | "targetTotal"
        >
      >,
    ) {
      settings = parameters(inputs, { ...settings, ...change });
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        parameters: settings,
        successes,
        seriesTrials,
        addend,
        current: Object.freeze([...short]),
        previous: Object.freeze([...previous]),
        addends: Object.freeze([...all]),
        series: Object.freeze([...series]),
        ribbon: Object.freeze(ribbon.map((x) => Object.freeze({ ...x }))),
        addendHistogram: plotHistogram(all),
        seriesHistogram: plotHistogram(series),
        runningTotal: short.reduce((a, b) => a + b, 0),
        done: successes >= settings.numSuccesses,
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: "Partition Permutation Distribution",
  description:
    "Random addends with retained overshoot trials. Wilensky (2004), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<Parameters, ReturnType<typeof create>>;
