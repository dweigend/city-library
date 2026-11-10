import {
  defineUI,
  indexedColor,
  type Observation,
  type SpatialData,
  type Series,
} from "../../ui/index.ts";

import { model, type Parameters } from "./model.ts";
export const ui = defineUI(model, {
  setup: [
    "seed",
    { field: "initialFruitBushes", label: "Initial bushes" },
    "initialForagers",
  ],
  live: {
    ticksToFlee: {
      set: (m, v) => m.setRules({ ticksToFlee: v }),
    },
    rateOfMutation: {
      label: "Mutation rate (%)",
      set: (m, v) => m.setRules({ rateOfMutation: v }),
    },
    collaborationBonus: {
      set: (m, v) => m.setRules({ collaborationBonus: v }),
    },
    maxAge: {
      label: "Maximum age",
      set: (m, v) => m.setRules({ maxAge: v }),
    },
    bushGrowthChance: {
      label: "Bush growth chance (%)",
      set: (m, v) => m.setRules({ bushGrowthChance: v }),
    },
    showEnergy: {
      set: (m, v) => m.setRules({ showEnergy: v }),
    },
    visualization: {
      set: (m, v) => m.setRules({ visualization: v }),
    },
  },
  complete: (s) => s.done,
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Social%20Science/Economics/Fruit%20Wars.nlogox",
    label: "Source attribution · Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Population", value: (s) => s.foragers.length },
    { label: "Average population", value: (s) => s.averagePopulation },
    { label: "Average forage", value: (s) => s.avgForage },
    { label: "Murders", value: (s) => s.murderCount },
    { label: "Starvation deaths", value: (s) => s.starvationCount },
    { label: "Age deaths", value: (s) => s.ageDeathCount },
  ],
  views: [
    {
      type: "spatial",
      label: "Foragers and fruit bushes",
      data: foragersAndFruitBushesData,
    },
    {
      type: "line",
      label: "Death causes (%)",
      series: deathCausesSeries,
    },
    {
      type: "line",
      label: "Forage rate",
      series: (s) => [
        {
          label: "Yield",
          points: s.history.map((h) => ({ x: h.tick, y: h.avgForage })),
        },
      ],
    },
    {
      type: "line",
      label: "Mean traits",
      series: meanTraitsSeries,
    },
    {
      type: "bar",
      label: "Aggression distribution",
      series: (s) =>
        (["reactiveAggression", "proactiveAggression"] as const).map((key) => ({
          label: key
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .replace(/^./, (value) => value.toUpperCase()),
          points: Array.from({ length: 61 }, (_, x) => ({
            x,
            y: s.aggressionHistograms[key].counts[x]!,
          })),
        })),
    },
  ],
});

type UIObservation = Observation<typeof model>;

function foragersAndFruitBushesData(s: UIObservation): SpatialData {
  return {
    showLabels: true,
    width: 65,
    height: 65,
    agents: [
      ...s.bushes.map((b) => ({
        ...b,
        color: indexedColor(b.color),
        size: 13,
      })),
      ...s.deaths.map((d) => ({
        ...d,
        color: "#de3030",
        label: "×",
        size: 5,
      })),
      ...s.foragers.map((a) => {
        const key = (
          {
            Strength: "strength",
            Speed: "speed",
            Intelligence: "intelligence",
            "Reactive Aggression": "reactiveAggression",
            "Proactive Aggression": "proactiveAggression",
          } as const
        )[
          s.parameters.visualization as Exclude<
            Parameters["visualization"],
            "None"
          >
        ];
        return {
          ...a,
          color: key
            ? `hsl(${key === "intelligence" ? 220 : key === "speed" ? 110 : 25} 65% ${20 + 60 * Math.min(1, a[key] / 40)}%)`
            : "#888888",
          label: s.parameters.showEnergy ? String(Math.round(a.energy)) : "",
          shape: "triangle" as const,
          size: 9,
        };
      }),
    ],
  };
}

function deathCausesSeries(s: UIObservation): readonly Series[] {
  return [
    {
      label: "Murders",
      points: s.history.map((h) => ({ x: h.tick, y: h.murderRate })),
    },
    {
      label: "Starvation",
      points: s.history.map((h) => ({ x: h.tick, y: h.starvationRate })),
    },
    {
      label: "Old age",
      points: s.history.map((h) => ({ x: h.tick, y: h.ageDeathRate })),
    },
  ];
}

function meanTraitsSeries(s: UIObservation): readonly Series[] {
  return (
    [
      "strength",
      "speed",
      "intelligence",
      "reactiveAggression",
      "proactiveAggression",
    ] as const
  ).map((key) => ({
    label: key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^./, (value) => value.toUpperCase()),
    points: s.history.flatMap((h) =>
      h[key] === null ? [] : [{ x: h.tick, y: h[key]! }],
    ),
  }));
}
