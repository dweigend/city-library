/** Wilensky (2023), CC BY-NC-SA 3.0; see NOTICE.md. */
import { Agent, Random, World, stats } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";

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
type LearnerGroup = "non-learner" | "random-learner" | "smart-learner";
type Learner = Agent<{
  group: LearnerGroup;
  genotype: Allele[];
  phenotype: number[];
  fitness: number;
}>;
export function create(options: Partial<Parameters> = {}) {
  let settings = parseParameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const world = World.create({ random });
  let targetPhenotype: number[] = [];
  const history: {
    tick: number;
    nonLearnerCount: number;
    randomLearnerCount: number;
    smartLearnerCount: number;
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
  const population = (group: LearnerGroup) =>
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
      a.group === "non-learner" ? -28 : a.group === "smart-learner" ? 28 : 0;
    a.move({
      to: {
        x: offset + (correctAlleleFrequency(a) - 0.5) * 20,
        y: a.fitness * 100 - 50,
      },
    });
  }
  function meanPlasticity(group: LearnerGroup): number {
    const members = population(group);
    return members.length
      ? members.reduce((sum, a) => sum + plasticityFrequency(a) * 100, 0) /
          members.length
      : 0;
  }
  function record() {
    history.push({
      tick: world.tick.value,
      nonLearnerCount: population("non-learner").length,
      randomLearnerCount: population("random-learner").length,
      smartLearnerCount: population("smart-learner").length,
      nonPlasticity: meanPlasticity("non-learner"),
      randomPlasticity: meanPlasticity("random-learner"),
      smartPlasticity: meanPlasticity("smart-learner"),
      nonCorrect: stats.describe(
        population("non-learner").map((a) => correctAlleleFrequency(a) * 100),
      ).mean,
      randomCorrect: stats.describe(
        population("random-learner").map((a) => correctAlleleFrequency(a) * 100),
      ).mean,
      smartCorrect: stats.describe(
        population("smart-learner").map((a) => correctAlleleFrequency(a) * 100),
      ).mean,
      nonFitness: stats.describe(population("non-learner").map((a) => a.fitness))
        .mean,
      randomFitness: stats.describe(
        population("random-learner").map((a) => a.fitness),
      ).mean,
      smartFitness: stats.describe(
        population("smart-learner").map((a) => a.fitness),
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
      "random-learner",
      "non-learner",
      "smart-learner",
    ] as const) {
      for (let i = 0; i < settings.populationSize; i++) {
        const produced = produceGene();
        const genotype =
          group === "non-learner"
            ? (initPhenotype(produced) as Allele[])
            : produced;
        const phenotype =
          group === "non-learner"
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
  function select(group: LearnerGroup) {
    const members = population(group);
    const shuffled = random.sample(members, {
      sampleCount: members.length,
      algorithm: "fisher-yates-descending",
    });
    shuffled.sort((a, b) => a.fitness - b.fitness);
    for (const a of shuffled.slice(0, Math.ceil(settings.populationSize * 0.2)))
      a.delete();
  }
  function reproduce(group: LearnerGroup) {
    for (let i = 0; i < Math.floor(settings.populationSize * 0.2); i++) {
      const members = population(group);
      const tournament = random.sample(members, {
        sampleCount: Math.floor(settings.populationSize * 0.3),
      });
      if (tournament.length < 2)
        throw new RangeError(
          "Weighted selection requires two tournament members.",
        );
      const selected = random.sample(tournament, {
        sampleCount: 2,
        weight: (a) => a.fitness,
      });
      if (selected.length < 2) {
        const remaining = tournament.filter((a) => !selected.includes(a));
        selected.push(
          ...random.sample(remaining, { sampleCount: 2 - selected.length }),
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
              group === "non-learner"
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
  function advance(stepCount = 1) {
    validateStepCount(stepCount);
    for (let i = 0; i < stepCount; i++) {
      for (const group of [
        "random-learner",
        "smart-learner",
        "non-learner",
      ] as const) {
        const members = population(group);
        for (const a of random.sample(members, {
          sampleCount: members.length,
          algorithm: "fisher-yates-descending",
        })) {
          if (group === "random-learner") randomLearn(a);
          else if (group === "smart-learner") smartLearn(a);
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
    const snapshots = (group: LearnerGroup) =>
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

      tick: world.tick.value,
      width: 81,
      height: 111,
      parameters: settings,
      targetPhenotype: [...targetPhenotype],
      nonLearners: snapshots("non-learner"),
      randomLearners: snapshots("random-learner"),
      smartLearners: snapshots("smart-learner"),
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
      settings = parseParameters(inputs, { ...settings, ...update });
    },
  };
}
export const model = {
  title: "Baldwin Effect",
  inputs,
  create,
} satisfies Definition<Parameters, ReturnType<typeof create>>;
