import { defineUI, netLogoColor } from "../../ui/index.ts";
import { model, type Parameters } from "./model.ts";
const rules = [
  "ticksToFlee",
  "rateOfMutation",
  "collaborationBonus",
  "maxAge",
  "bushGrowthChance",
  "showEnergy",
  "visualization",
] as const;
const labels = {
  ticksToFlee: "Ticks to flee",
  rateOfMutation: "Mutation rate (%)",
  collaborationBonus: "Collaboration bonus",
  maxAge: "Maximum age",
  bushGrowthChance: "Bush growth chance (%)",
  showEnergy: "Show energy",
  visualization: "Visualization",
};
export const ui = defineUI(model, {
  setup: [
    { field: "seed" },
    { field: "initialFruitBushes", label: "Initial bushes" },
    { field: "initialForagers", label: "Initial foragers" },
  ],
  live: rules.map((field) => ({
    field,
    label: labels[field],
    value: (s) => s.parameters[field],
    set: (m, v) =>
      m.setRules({ [field]: v } as Pick<Partial<Parameters>, typeof field>),
  })),
  complete: (s) => s.done,
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/FruitWars",
    label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0",
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
      data: (s) => ({
        width: 65,
        height: 65,
        agents: [
          ...s.bushes.map((b) => ({
            ...b,
            color: netLogoColor(b.color),
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
              label: s.parameters.showEnergy
                ? String(Math.round(a.energy))
                : "",
              shape: "triangle" as const,
              size: 9,
            };
          }),
        ],
      }),
    },
    {
      type: "line",
      label: "Death causes (%)",
      series: (s) => [
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
      ],
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
      series: (s) =>
        (
          [
            "strength",
            "speed",
            "intelligence",
            "reactiveAggression",
            "proactiveAggression",
          ] as const
        ).map((key) => ({
          label: key,
          points: s.history.flatMap((h) =>
            h[key] === null ? [] : [{ x: h.tick, y: h[key]! }],
          ),
        })),
    },
    {
      type: "bar",
      label: "Aggression distribution",
      series: (s) =>
        (["reactiveAggression", "proactiveAggression"] as const).map((key) => ({
          label: key,
          points: Array.from({ length: 61 }, (_, x) => ({
            x,
            y: s.aggressionHistograms[key].counts[x]!,
          })),
        })),
    },
  ],
});
