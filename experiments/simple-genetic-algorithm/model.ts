/** Stonedahl & Wilensky (2008), CC BY-NC-SA 3.0. Exact source/notices adjacent. */
import { Agent, Random, World, run, stats } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface Parameters {
  seed: number;
  width: number;
  populationSize: number;
  crossoverRate: number;
  mutationRate: number;
  plotDiversity: boolean;
}
export const inputs: Inputs<Parameters> = {
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  width: { kind: "number", default: 100, min: 2, max: 1000, integer: true },
  populationSize: {
    kind: "number",
    default: 100,
    min: 5,
    max: 200,
    integer: true,
    step: 5,
  },
  crossoverRate: {
    kind: "number",
    default: 70,
    min: 0,
    max: 100,
    integer: true,
  },
  mutationRate: { kind: "number", default: 0, min: 0, max: 10, step: 0.1 },
  plotDiversity: { kind: "boolean", default: true },
};
export function calculateFitness(bits: readonly number[]) {
  if (
    !Array.isArray(bits) ||
    bits.length === 0 ||
    Array.from({ length: bits.length }, (_, i) => i).some(
      (i) => !Object.hasOwn(bits, i) || (bits[i] !== 0 && bits[i] !== 1),
    )
  )
    throw new RangeError("Nonempty binary genome required.");
  return bits.reduce((s, b) => s + b, 0);
}
export function hammingDistance(a: readonly number[], b: readonly number[]) {
  calculateFitness(a);
  calculateFitness(b);
  if (a.length !== b.length) throw new RangeError("Genome lengths must match.");
  return a.reduce((sum, v, i) => sum + Number(v !== b[i]), 0) / a.length;
}
export function create(options: Partial<Parameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.add({ seed: settings.seed }),
    world = World.add({ random });
  type Individual = Agent<{ who: number; bits: number[]; fitness: number }>;
  let nextWho = 0;
  const population = () => world.agents as readonly Individual[];
  function add(bits: readonly number[]) {
    return world.add(
      Agent.add({
        who: nextWho++,
        bits: [...bits],
        fitness: calculateFitness(bits),
      }),
    );
  }
  for (let i = 0; i < settings.populationSize; i++)
    add(
      Array.from({ length: settings.width }, () =>
        Math.floor(random.number() * 2),
      ),
    );
  function chooseBest(source: readonly Individual[]) {
    const max = Math.max(...source.map((p) => p.fitness));
    return random.sample(source.filter((p) => p.fitness === max))[0]!;
  }
  let winner = chooseBest(population());
  function diversity() {
    const ps = population();
    let sum = 0;
    for (let i = 0; i < ps.length; i++)
      for (let j = i + 1; j < ps.length; j++)
        sum += hammingDistance(ps[i]!.bits, ps[j]!.bits);
    return sum / Math.floor(ps.length ** 2 / 4);
  }
  function measurements() {
    const summary = stats.describe(population().map((p) => p.fitness));
    return { best: summary.max!, mean: summary.mean!, worst: summary.min! };
  }
  const history: {
    tick: number;
    best: number;
    mean: number;
    worst: number;
    diversity: number | null;
  }[] = [];
  function record() {
    history.push({
      tick: world.tick.value,
      ...measurements(),
      diversity: settings.plotDiversity ? diversity() : null,
    });
    if (history.length > 1001) history.shift();
  }
  function crossover(
    a: readonly number[],
    b: readonly number[],
  ): [number[], number[]] {
    calculateFitness(a);
    calculateFitness(b);
    if (a.length !== settings.width || b.length !== settings.width)
      throw new RangeError("Genome width must match.");
    const split = 1 + Math.floor(random.number() * (settings.width - 1));
    return [
      [...a.slice(0, split), ...b.slice(split)],
      [...b.slice(0, split), ...a.slice(split)],
    ];
  }
  function mutate(bits: readonly number[]) {
    calculateFitness(bits);
    return bits.map((b) =>
      random.number() * 100 < settings.mutationRate ? 1 - b : b,
    );
  }
  function createNextGeneration() {
    const old = [...population()];
    if (old.length < 3)
      throw new RangeError("Tournament requires three individuals.");
    const offspring: number[][] = [],
      pairs = Math.floor(
        (settings.populationSize * settings.crossoverRate) / 100 / 2,
      );
    const parent = () => chooseBest(random.sample(old, { count: 3 }));
    for (let i = 0; i < pairs; i++)
      offspring.push(...crossover(parent().bits, parent().bits));
    while (offspring.length < settings.populationSize)
      offspring.push([...parent().bits]);
    for (const p of old) p.delete();
    for (const bits of random.sample(offspring, { count: offspring.length }))
      add(mutate(bits));
    winner = chooseBest(population());
  }
  record();
  return {
    diversity,
    measurements,
    crossover,
    mutate,
    createNextGeneration,
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i++) {
        if (winner.fitness === settings.width) break;
        run(world, createNextGeneration);
        record();
      }
    },
    setParameters(patch: Partial<Omit<Parameters, "seed" | "width">>) {
      parameters(inputs, patch);
      if (Object.hasOwn(patch, "seed") || Object.hasOwn(patch, "width"))
        throw new TypeError("Seed and genome width are setup-only.");
      settings = parameters(inputs, { ...settings, ...patch });
    },
    setScenario(s: { genomes: readonly (readonly number[])[] }) {
      if (
        !Array.isArray(s.genomes) ||
        s.genomes.length < 3 ||
        s.genomes.length > 200
      )
        throw new RangeError("Three to200 genomes required.");
      for (const bits of s.genomes) {
        calculateFitness(bits);
        if (bits.length !== settings.width)
          throw new RangeError("Genome width must match.");
      }
      for (const p of [...population()]) p.delete();
      for (const bits of s.genomes) add(bits);
      winner = chooseBest(population());
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        width: settings.width,
        height: 4,
        parameters: settings,
        randomState: random.state,
        ...measurements(),
        done: winner.fitness === settings.width,
        diversity: diversity(),
        winner: Object.freeze({
          id: winner.who,
          bits: Object.freeze([...winner.bits]),
          fitness: winner.fitness,
        }),
        population: Object.freeze(
          population().map((p) =>
            Object.freeze({
              id: p.who,
              bits: Object.freeze([...p.bits]),
              fitness: p.fitness,
            }),
          ),
        ),
        history: Object.freeze(history.map((h) => Object.freeze({ ...h }))),
      });
    },
  };
}
export const model = {
  title: "Simple Genetic Algorithm",
  description:
    "Tournament selection, single-point crossover and mutation on ALL-ONES. Stonedahl & Wilensky (2008), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<Parameters, ReturnType<typeof create>>;
