/** Random Combinations and Permutations, Wilensky (2004), CC BY-NC-SA 3.0. See NOTICE.md. */
import { Random, World, stats } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface Parameters {
  seed: number;
  width: number;
  height: number;
  choices: number;
  dice: boolean;
  singleSuccess: boolean;
  analysisType: "combination" | "permutations" | "both";
  bars: boolean;
  sampleSize: number;
}
export const inputs: Inputs<Parameters> = {
  seed: { kind: "number", default: 1, integer: true },
  width: { kind: "number", default: 3, min: 1, max: 5, integer: true },
  height: { kind: "number", default: 1, min: 1, max: 2, integer: true },
  choices: { kind: "number", default: 2, min: 2, max: 6, integer: true },
  dice: { kind: "boolean", default: true },
  singleSuccess: { kind: "boolean", default: false },
  analysisType: {
    kind: "choice",
    default: "both",
    options: ["combination", "permutations", "both"],
  },
  bars: { kind: "boolean", default: true },
  sampleSize: {
    kind: "number",
    default: 1000,
    min: 100,
    max: 100000,
    step: 100,
    integer: true,
  },
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
  const world = World.create({ random });
  const original: (number | null)[] = Array(
      settings.width * settings.height,
    ).fill(settings.dice ? null : 0),
    guesses: (number | null)[] = Array(original.length).fill(null);
  let exists = false,
    abortCreate = false,
    hidden = false,
    creating = false,
    countSteps = 0,
    countCombiSuccesses = 0,
    countPermisSuccesses = 0,
    samplesCounter = 0,
    attempts = 0,
    done = false,
    allCombiMatch = false,
    allPermisMatch = false;
  let instructions = `OK, you have created a ${settings.width}-by-${settings.height} block. Now press Create Combi.`;
  const combiSamples: number[] = [],
    permisSamples: number[] = [];
  function createCombi() {
    if (abortCreate) return;
    creating = true;
    exists = true;
    instructions =
      "Click on the squares repeatedly to create your combination. Then finish Create Combi.";
  }
  function finishCombi() {
    creating = false;
  }
  function assignColorOrImage(index: number) {
    if (!Number.isInteger(index) || index < 0 || index >= original.length)
      throw new RangeError("Select a square in the combination.");
    if (!creating || abortCreate) return;
    const before = original[index];
    original[index] = before === null ? 0 : (before! + 1) % settings.choices;
  }
  function selectAt(x: number, y: number) {
    const left = -(Math.ceil(settings.width / 2) - 1),
      bottom = 1 - (Math.ceil(settings.height / 2) - 1),
      col = Math.round(x) - left,
      row = Math.round(y) - bottom;
    if (col >= 0 && col < settings.width && row >= 0 && row < settings.height)
      assignColorOrImage(row * settings.width + col);
  }
  function howManyOfEachChoice(values: readonly (number | null)[]) {
    return Array.from(
      { length: settings.choices },
      (_, value) => values.filter((x) => x === value).length,
    );
  }
  function guess() {
    for (let i = 0; i < guesses.length; i++)
      guesses[i] = Math.floor(random.number() * settings.choices);
  }
  function check() {
    allCombiMatch = guesses.every((v, i) => v === original[i]);
    const a = howManyOfEachChoice(original),
      b = howManyOfEachChoice(guesses);
    allPermisMatch = a.every((n, i) => n === b[i]);
  }
  function littleSetup() {
    countSteps = 0;
    countCombiSuccesses = 0;
    countPermisSuccesses = 0;
    combiSamples.length = 0;
    permisSamples.length = 0;
  }
  function plotSample() {
    samplesCounter++;
    combiSamples.unshift(countCombiSuccesses);
    permisSamples.unshift(countPermisSuccesses);
    countSteps = 0;
    countCombiSuccesses = 0;
    countPermisSuccesses = 0;
  }
  function searchCombi() {
    creating = false;
    if (settings.dice && original.some((n) => n === null)) {
      instructions =
        "You are in Dice mode. Please pick dice faces for every square.";
      return;
    }
    if (!exists) {
      instructions =
        "Please work this way: press Setup, and then Create Combi.";
      return;
    }
    abortCreate = true;
    instructions =
      "The program guesses combinations randomly and tracks matches.";
    guess();
    check();
    countSteps++;
    attempts++;
    if (allCombiMatch) countCombiSuccesses++;
    if (allPermisMatch) countPermisSuccesses++;
    if (
      settings.singleSuccess &&
      ((settings.analysisType !== "permutations" && allCombiMatch) ||
        (settings.analysisType !== "combination" && allPermisMatch))
    ) {
      instructions = `Congratulations! You discovered ${allCombiMatch ? "the hidden combination" : "a permutation"} in ${combiSamples.length * settings.sampleSize + countSteps} steps. Set up and try again.`;
      littleSetup();
      done = true;
      return;
    }
    if (countSteps === settings.sampleSize) plotSample();
  }
  function hideReveal() {
    if (!exists) {
      instructions = "Please first create a combination.";
      return;
    }
    hidden = !hidden;
  }
  return {
    get world() {
      return world;
    },
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count && !done; i++) {
        searchCombi();
        if (!abortCreate) break;
      }
    },
    createCombi,
    finishCombi,
    assignColorOrImage,
    selectAt,
    hideReveal,
    setRules(
      change: Partial<
        Pick<
          Parameters,
          "singleSuccess" | "analysisType" | "bars" | "sampleSize"
        >
      >,
    ) {
      settings = parameters(inputs, { ...settings, ...change });
    },
    read() {
      const mean = (a: readonly number[]) =>
        a.length ? a.reduce((x, y) => x + y, 0) / a.length : null;
      const combiMean = mean(combiSamples),
        permisMean = mean(permisSamples);
      const left = -(Math.ceil(settings.width / 2) - 1),
        bottom = 1 - (Math.ceil(settings.height / 2) - 1);
      const squares = [
        ...original.map((value, i) =>
          Object.freeze({
            id: `original-${i}`,
            original: true,
            value,
            x: left + (i % settings.width),
            y: bottom + Math.floor(i / settings.width),
          }),
        ),
        ...guesses.map((value, i) =>
          Object.freeze({
            id: `guess-${i}`,
            original: false,
            value,
            x: left + (i % settings.width),
            y: bottom + Math.floor(i / settings.width) - 3,
          }),
        ),
      ];
      return Object.freeze({
        tick: world.tick.value,
        parameters: settings,
        squares: Object.freeze(squares),
        distributionSeries: Object.freeze([
          ...(settings.analysisType !== "permutations"
            ? [
                Object.freeze({
                  label: "Combination",
                  color: "#16a34a",
                  points: plotHistogram(combiSamples),
                }),
              ]
            : []),
          ...(settings.analysisType !== "combination"
            ? [
                Object.freeze({
                  label: "Permutations",
                  color: "#2563eb",
                  points: plotHistogram(permisSamples),
                }),
              ]
            : []),
        ]),
        original: Object.freeze([...original]),
        guesses: Object.freeze([...guesses]),
        exists,
        abortCreate,
        hidden,
        creating,
        countSteps,
        countCombiSuccesses,
        countPermisSuccesses,
        samplesCounter,
        attempts,
        done,
        allCombiMatch,
        allPermisMatch,
        instructions,
        choiceCounts: Object.freeze(howManyOfEachChoice(original)),
        combiSamples: Object.freeze([...combiSamples]),
        permisSamples: Object.freeze([...permisSamples]),
        combiMean,
        permisMean,
        ratio: combiMean ? permisMean! / combiMean : null,
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: "Random Combinations and Permutations",
  description:
    "User-set patterns and random ordered / unordered matches. Wilensky (2004), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<Parameters, ReturnType<typeof create>>;
