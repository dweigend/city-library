/** Wilensky (2023), CC BY-NC-SA 3.0; see NOTICE.md. */
import { Agent, Random, World, stats } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export const sourceMarker = "B08-baldwin-effect-native-composition-v1";
export type Allele = 0 | 1 | "x";
export function fitnessOf(
  phenotype: readonly number[],
  target: readonly number[],
  smoothness: number,
  geneLength = target.length,
): number {
  if (phenotype.length !== target.length || !target.length)
    throw new RangeError(
      "Phenotype and target must have equal positive lengths.",
    );
  const difference = phenotype.filter((a, i) => a !== target[i]).length;
  const fitness = (geneLength - difference) / geneLength;
  return fitness >= 1 - smoothness ? fitness : 0;
}
export interface Parameters {
  seed: number;
  populationSize: number;
  geneLength: number;
  plasticity: number;
  trialCount: number;
  mutationRate: number;
  smoothness: number;
}
export const inputs: Inputs<Parameters> = {
  seed: { kind: "number", default: 1, integer: true },
  populationSize: { kind: "number", default: 200, min: 1, max: 500, integer: true },
  geneLength: { kind: "number", default: 30, min: 1, max: 100, integer: true },
  plasticity: { kind: "number", default: 0.5, min: 0, max: 1 },
  trialCount: { kind: "number", default: 20, min: 1, max: 100, integer: true },
  mutationRate: { kind: "number", default: 5, min: 0, max: 10 },
  smoothness: { kind: "number", default: 0.15, min: 0, max: 1 },
};
type Breed = "nonLearner" | "randomLearner" | "smartLearner";
type Learner = Agent<{
  group: Breed;
  genotype: Allele[];
  phenotype: number[];
  fitness: number;
}>;
export function create(options: Partial<Parameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const world = World.create({ random });
  let targetPhenotype: number[] = [];
  const history: {
    tick: number;
    nonLearners: number;
    randomLearners: number;
    smartLearners: number;
    nonPlasticity: number;
    randomPlasticity: number;
    smartPlasticity: number;
    nonCorrect: number | undefined;
    randomCorrect: number | undefined;
    smartCorrect: number | undefined;
    nonFitness: number | undefined;
    randomFitness: number | undefined;
    smartFitness: number | undefined;
  }[] = [];
  const population = (group: Breed) =>
    (world.agents as readonly Learner[]).filter((a) => a.group === group);
  function produceGene(): Allele[] {
    return Array.from({ length: settings.geneLength }, () =>
      random.number() < settings.plasticity
        ? "x"
        : random.sample([0, 1] as const)[0]!,
    );
  }
  function initPhenotype(gene: readonly Allele[]): number[] {
    return gene.map((a) => (a === "x" ? random.sample([0, 1])[0]! : a));
  }
  function plasticityFrequency(a: Learner): number {
    return a.genotype.filter((g) => g === "x").length / a.genotype.length;
  }
  function correctAlleleFrequency(a: Learner): number {
    return (
      a.genotype.filter((g, i) => g === targetPhenotype[i]).length /
      a.genotype.length
    );
  }
  function updatePosition(a: Learner) {
    const offset =
      a.group === "nonLearner" ? -28 : a.group === "smartLearner" ? 28 : 0;
    a.move({
      to: {
        x: offset + (correctAlleleFrequency(a) - 0.5) * 20,
        y: a.fitness * 100 - 50,
      },
    });
  }
  function meanPlasticity(group: Breed): number {
    const group = population(group);
    return group.length
      ? group.reduce((sum, a) => sum + plasticityFrequency(a) * 100, 0) /
          group.length
      : 0;
  }
  function record() {
    history.push({
      tick: world.tick.value,
      nonLearners: population("nonLearner").length,
      randomLearners: population("randomLearner").length,
      smartLearners: population("smartLearner").length,
      nonPlasticity: meanPlasticity("nonLearner"),
      randomPlasticity: meanPlasticity("randomLearner"),
      smartPlasticity: meanPlasticity("smartLearner"),
      nonCorrect: stats.describe(
        population("nonLearner").map((a) => correctAlleleFrequency(a) * 100),
      ).mean,
      randomCorrect: stats.describe(
        population("randomLearner").map((a) => correctAlleleFrequency(a) * 100),
      ).mean,
      smartCorrect: stats.describe(
        population("smartLearner").map((a) => correctAlleleFrequency(a) * 100),
      ).mean,
      nonFitness: stats.describe(population("nonLearner").map((a) => a.fitness))
        .mean,
      randomFitness: stats.describe(
        population("randomLearner").map((a) => a.fitness),
      ).mean,
      smartFitness: stats.describe(
        population("smartLearner").map((a) => a.fitness),
      ).mean,
    });
    if (history.length > 1001) history.splice(1, 1);
  }
  function setup() {
    world.delete(world.agents);
    world.tick.reset();
    random.reseed(settings.seed);
    history.length = 0;
    targetPhenotype = Array.from(
      { length: settings.geneLength },
      () => random.sample([0, 1])[0]!,
    );
    for (const group of [
      "randomLearner",
      "nonLearner",
      "smartLearner",
    ] as const) {
      for (let i = 0; i < settings.populationSize; i++) {
        const produced = produceGene();
        const genotype =
          group === "nonLearner"
            ? (initPhenotype(produced) as Allele[])
            : produced;
        const phenotype =
          group === "nonLearner"
            ? ([...genotype] as number[])
            : initPhenotype(genotype);
        const a = Agent.create({
          group,
          genotype,
          phenotype,
          fitness: fitnessOf(
            phenotype,
            targetPhenotype,
            settings.smoothness,
            settings.geneLength,
          ),
        });
        world.add(a);
        updatePosition(a);
      }
    }
    record();
  }
  function randomLearn(a: Learner) {
    a.fitness = fitnessOf(
      a.phenotype,
      targetPhenotype,
      settings.smoothness,
      settings.geneLength,
    );
    let total = 0;
    for (let trial = 0; trial < settings.trialCount; trial++) {
      const next = initPhenotype(a.genotype);
      const fitness = fitnessOf(
        next,
        targetPhenotype,
        settings.smoothness,
        settings.geneLength,
      );
      if (fitness > a.fitness) {
        a.phenotype = next;
        a.fitness = fitness;
      }
      total += a.fitness;
    }
    a.fitness = total / settings.trialCount;
    updatePosition(a);
  }
  function smartLearn(a: Learner) {
    a.fitness = fitnessOf(
      a.phenotype,
      targetPhenotype,
      settings.smoothness,
      settings.geneLength,
    );
    let total = 0;
    for (let trial = 0; trial < settings.trialCount; trial++) {
      const next = a.genotype.map((gene, i) =>
        gene === "x"
          ? random.number() < a.fitness
            ? a.phenotype[i]!
            : random.sample([0, 1])[0]!
          : gene,
      );
      const fitness = fitnessOf(
        next,
        targetPhenotype,
        settings.smoothness,
        settings.geneLength,
      );
      if (fitness > a.fitness) {
        a.phenotype = next;
        a.fitness = fitness;
      }
      total += a.fitness;
    }
    a.fitness = total / settings.trialCount;
    updatePosition(a);
  }
  function select(group: Breed) {
    const group = population(group);
    const shuffled = random.sample(group, {
      count: group.length,
      compatibility: "legacy-shuffle",
    });
    shuffled.sort((a, b) => a.fitness - b.fitness);
    for (const a of shuffled.slice(0, Math.ceil(settings.populationSize * 0.2)))
      a.delete();
  }
  function reproduce(group: Breed) {
    for (let i = 0; i < Math.floor(settings.populationSize * 0.2); i++) {
      const group = population(group);
      const tournament = random.sample(group, {
        count: Math.floor(settings.populationSize * 0.3),
      });
      if (tournament.length < 2)
        throw new RangeError(
          "Source weighted-n-of requires two tournament members.",
        );
      const selected = random.sample(tournament, {
        count: 2,
        weight: (a) => a.fitness,
      });
      if (selected.length < 2) {
        const remaining = tournament.filter((a) => !selected.includes(a));
        selected.push(
          ...random.sample(remaining, { count: 2 - selected.length }),
        );
      }
      const [left, right] = selected;
      const genotype = left!.genotype.map(
        (gene, j) => random.sample([gene, right!.genotype[j]!])[0]!,
      );
      const mutated = genotype.map((gene) =>
        random.number() > settings.mutationRate / 1000
          ? gene
          : random.sample(
              group === "nonLearner"
                ? ([0, 1] as Allele[])
                : ([0, 1, "x"] as Allele[]),
            )[0]!,
      );
      const parent = random.sample(selected)[0]!;
      const child = parent.copy();
      world.add(child);
      child.genotype = mutated;
      child.phenotype = initPhenotype(mutated);
      // Source hatch retains the selected parent's fitness until its next learning phase.
      updatePosition(child);
    }
  }
  function advance(count = 1) {
    stepCount(count);
    for (let i = 0; i < count; i++) {
      for (const group of [
        "randomLearner",
        "smartLearner",
        "nonLearner",
      ] as const) {
        const group = population(group);
        for (const a of random.sample(group, {
          count: group.length,
          compatibility: "legacy-shuffle",
        })) {
          if (group === "randomLearner") randomLearn(a);
          else if (group === "smartLearner") smartLearn(a);
          else {
            a.fitness = fitnessOf(
              a.phenotype,
              targetPhenotype,
              settings.smoothness,
              settings.geneLength,
            );
            updatePosition(a);
          }
        }
        select(group);
        reproduce(group);
      }
      world.tick.advance();
      record();
    }
  }
  function read() {
    const snapshots = (group: Breed) =>
      population(group).map((a) => ({
        id: a.id,
        x: a.x,
        y: a.y,
        originalY: a.y + 50,
        genotype: [...a.genotype],
        phenotype: [...a.phenotype],
        fitness: a.fitness,
        plasticityFrequency: plasticityFrequency(a),
        correctAlleleFrequency: correctAlleleFrequency(a),
      }));
    return {
      sourceMarker,
      tick: world.tick.value,
      width: 81,
      height: 111,
      parameters: settings,
      targetPhenotype: [...targetPhenotype],
      nonLearners: snapshots("nonLearner"),
      randomLearners: snapshots("randomLearner"),
      smartLearners: snapshots("smartLearner"),
      history: history.map((p) => ({ ...p })),
      randomState: random.state,
    };
  }
  setup();
  return {
    setup,
    advance,
    read,
    produceGene,
    initPhenotype,
    randomLearn,
    smartLearn,
    select,
    reproduce,
    setParameters(update: Partial<Omit<Parameters, "seed">>) {
      settings = parameters(inputs, { ...settings, ...update });
    },
  };
}
export const model = {
  title: "Baldwin Effect",
  inputs,
  create,
} satisfies Definition<Parameters, ReturnType<typeof create>>;
