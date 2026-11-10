import { defineUI, type Observation, type Series } from "../../ui/index.ts";

import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["seed"],
  change: (instance, changes) => instance.setParameters(changes),
  live: {
    populationSize: {},
    geneLength: {},
    plasticity: {},
    trialCount: {},
    mutationRate: {},
    smoothness: {},
  },
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Biology/Evolution/Baldwin%20Effect.nlogox",
    label: "Source attribution · Baldwin Effect · Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [{ label: "Generation", value: (s) => s.tick }],
  views: [
    {
      type: "spatial",
      label: "Fitness and inherited matches",
      data: (s) => ({
        width: s.width,
        height: s.height,
        agents: [
          ...s.nonLearners.map((a) => ({ ...a, color: "#888888" })),
          ...s.randomLearners.map((a) => ({ ...a, color: "#d73027" })),
          ...s.smartLearners.map((a) => ({ ...a, color: "#4575b4" })),
        ].map((a) => ({ ...a, size: 5 })),
      }),
    },
    {
      type: "line",
      label: "Plastic alleles (%)",
      series: plasticAllelesSeries,
    },
    {
      type: "line",
      label: "Correct inherited alleles (%)",
      series: correctInheritedAllelesSeries,
    },
    {
      type: "line",
      label: "Mean fitness",
      series: meanFitnessSeries,
    },
    {
      type: "inspector",
      label: "Genotype and learned phenotype",
      value: genotypeAndLearnedPhenotypeInspector,
    },
  ],
});

type UIObservation = Observation<typeof model>;

function plasticAllelesSeries(s: UIObservation): readonly Series[] {
  return (
    ["nonPlasticity", "randomPlasticity", "smartPlasticity"] as const
  ).map((key) => ({
    label: key.startsWith("non")
      ? "Non-learners"
      : key.startsWith("random")
        ? "Random learners"
        : "Smart learners",
    color:
      key === "nonPlasticity"
        ? "#888888"
        : key === "randomPlasticity"
          ? "#d73027"
          : "#4575b4",
    points: s.history.map((p) => ({ x: p.tick, y: p[key] })),
  }));
}

function correctInheritedAllelesSeries(s: UIObservation): readonly Series[] {
  return (["nonCorrect", "randomCorrect", "smartCorrect"] as const).map(
    (key) => ({
      label: key.startsWith("non")
        ? "Non-learners"
        : key.startsWith("random")
          ? "Random learners"
          : "Smart learners",
      color:
        key === "nonCorrect"
          ? "#888888"
          : key === "randomCorrect"
            ? "#d73027"
            : "#4575b4",
      points: s.history.flatMap((p) =>
        p[key] === undefined ? [] : [{ x: p.tick, y: p[key]! }],
      ),
    }),
  );
}

function meanFitnessSeries(s: UIObservation): readonly Series[] {
  return (["nonFitness", "randomFitness", "smartFitness"] as const).map(
    (key) => ({
      label: key.startsWith("non")
        ? "Non-learners"
        : key.startsWith("random")
          ? "Random learners"
          : "Smart learners",
      color:
        key === "nonFitness"
          ? "#888888"
          : key === "randomFitness"
            ? "#d73027"
            : "#4575b4",
      points: s.history.flatMap((p) =>
        p[key] === undefined ? [] : [{ x: p.tick, y: p[key]! }],
      ),
    }),
  );
}

function genotypeAndLearnedPhenotypeInspector(
  s: UIObservation,
  id: string | null,
): Readonly<Record<string, string | number | boolean>> | undefined {
  const a = [...s.nonLearners, ...s.randomLearners, ...s.smartLearners].find(
    (a) => a.id === id,
  );
  return a
    ? {
        genotype: a.genotype.join(""),
        phenotype: a.phenotype.join(""),
        fitness: a.fitness,
        plasticity: a.plasticityFrequency,
        correctAlleles: a.correctAlleleFrequency,
      }
    : undefined;
}
