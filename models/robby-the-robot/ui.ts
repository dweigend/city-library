import { defineUI, indexedColor, type Observation, type SpatialData } from "../../ui/index.ts";

import { model, actionSymbol } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["seed"],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/RobbytheRobot",
    label:
      "Source attribution \u00B7 Mitchell, Tisue and Wilensky \u00B7 CC0",
  },
  change: (instance, changes) => instance.setParameters(changes),
  live: {
    populationSize: {
      label: "Next population",
    },
    mutationRate: {
      label: "Mutation probability",
    },
    numberOfGenerations: {
      label: "Generation limit",
    },
  },
  actions: [
    {
      label: "One generation to limit",
      run: (m) => m.advanceToLimit(),
      enabled: (s) => s.tick < s.parameters.numberOfGenerations,
      repeat: { label: "Run to limit", intervalMs: 300 },
    },
    {
      label: "View environment",
      run: (m) => m.showEnvironment(),
      enabled: (s) => s.tick > 0,
    },
    {
      label: "Trial step",
      run: (m) => m.trialStep(),
      enabled: (s) => s.tick > 0,
    },
    { label: "View strategies", run: (m) => m.showStrategies() },
  ],
  monitors: [
    { label: "Generation", value: (s) => s.tick },
    {
      label: "Best fitness",
      value: (s) => s.bestFitness,
      format: (value: number) => value.toFixed(2),
    },
    {
      label: "Trial score",
      value: (s) => (s.visuals && s.robot ? s.robot.score : "\u2014"),
    },
  ],
  views: [
    {
      type: "spatial",
      label: "Robby environment",
      data: robbyEnvironmentData,
    },
    {
      type: "scatter",
      label: "Population fitness and allele distance",
      series: (s) => [
        {
          label: "Strategies",
          color: indexedColor(15),
          points: s.population.map((p) => ({
            x: p.fitness,
            y: p.displayDistance,
          })),
        },
      ],
    },
    {
      type: "line",
      label: "Best fitness",
      series: (s) => [
        {
          label: "Best",
          points: s.history.map((p) => ({ x: p.tick, y: p.bestFitness })),
        },
      ],
    },
    {
      type: "table",
      label: "Best strategy · action per situation",
      rows: bestStrategyRows,
    },
    {
      type: "table",
      label: "Output",
      rows: (s) => s.output.map((text, line) => ({ line, text })),
    },
  ],
});

type UIObservation = Observation<typeof model>;

/**
 * Each gene answers one situation, encoded in base 3 as north, east, south, west, here
 * (0 empty, 1 can, 2 wall). Situations with a wall on Robby's own cell cannot occur.
 */
function bestStrategyRows(s: UIObservation) {
  const site = ["empty", "can", "wall"] as const;
  return s.bestChromosome.flatMap((action, situation) => {
    const sense = (place: number) => site[Math.floor(situation / place) % 3]!;
    if (sense(1) === "wall") return [];
    return [{
      north: sense(81), east: sense(27), south: sense(9), west: sense(3), here: sense(1),
      action: `${actionSymbol(action)} ${action}`,
    }];
  });
}

function robbyEnvironmentData(s: UIObservation): SpatialData {
  return {
    width: 10,
    height: 10,
    cells: s.cells.map((c) => ({
      ...c,
      color: !s.visuals
        ? "#ffffff"
        : c.can
          ? "#f0ae37"
          : c.collected
            ? "#b9b9b9"
            : "#ffffff",
    })),
    segments: s.trail.map((t) => ({
      from: { x: t.from.x - 4.5, y: t.from.y - 4.5 },
      to: { x: t.to.x - 4.5, y: t.to.y - 4.5 },
      color: "#2467bb",
    })),
    agents:
      s.visuals && s.robot
        ? [
            {
              id: "robot",
              x: s.robot.x - 4.5,
              y: s.robot.y - 4.5,
              heading: s.robot.heading,
              label: String(s.robot.score),
              color: "#2467bb",
              size: 15,
              shape: "triangle" as const,
            },
          ]
        : [],
  };
}
