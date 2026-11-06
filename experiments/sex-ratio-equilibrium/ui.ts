import { defineUI, type Series } from "../../ui/index.ts";

import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: [
    "seed",
    { field: "initialPopulationSize", label: "Initial population" },
    { field: "initialAdultSexRatio", label: "Initial male percentage" },
    {
      field: "initialAverageMaleChildChance",
      label: "Initial male-child chance",
    },
  ],
  live: {
    meanLongevity: {
      set: (m, v) => m.setParameters({ meanLongevity: v }),
    },
    gestationPeriod: {
      set: (m, v) => m.setParameters({ gestationPeriod: v }),
    },
    maximumLitterSize: {
      set: (m, v) => m.setParameters({ maximumLitterSize: v }),
    },
    matingChance: {
      set: (m, v) => m.setParameters({ matingChance: v }),
    },
  },
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Biology/Evolution/Sex%20Ratio%20Equilibrium.nlogox",
    label: "NetLogo original · Wilensky · CC BY-NC-SA 3.0",
  },
  complete: (s) => s.done,
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    {
      label: "Adult sex ratio (%)",
      value: (s) => Number(s.adultSexRatio.toFixed(2)),
    },
    {
      label: "Male-child chance",
      value: (s) => Number(s.averageMaleChildChance.toFixed(3)),
    },
    { label: "Running average", value: (s) => s.runningAverageAdultSexRatio },
    { label: "Running SD", value: (s) => s.runningSdAdultSexRatio },
    { label: "Male mating success", value: (s) => s.maleMatingSuccess },
    { label: "Female mating success", value: (s) => s.femaleMatingSuccess },
  ],
  views: [
    {
      type: "spatial",
      label: "Population",
      data: (s) => ({
        width: s.width,
        height: s.height,
        agents: [...s.males, ...s.females].map((a) => ({
          ...a,
          color:
            a.sex === "male" ? "#3bb34b" : a.carrying ? "#f6a130" : "#428bd0",
          size: 7,
        })),
      }),
    },
    {
      type: "line",
      label: "Population by sex",
      series: populationBySexSeries,
    },
    {
      type: "line",
      label: "Mating success ratio (male to female)",
      series: (s) => [
        {
          label: "Ratio",
          points: s.history
            .filter((p) => p.matingRatio !== null)
            .map((p) => ({ x: p.tick, y: p.matingRatio! })),
        },
      ],
    },
    {
      type: "line",
      label: "Adult sex ratio",
      series: (s) => [
        {
          label: "Male percentage",
          points: s.adultSexRatioHistory.map((y, x) => ({ x: x + 1, y })),
        },
      ],
    },
    {
      type: "line",
      label: "Average male-child chance",
      series: (s) => [
        {
          label: "Chance",
          points: s.history.map((p) => ({ x: p.tick, y: p.chance })),
        },
      ],
    },
    {
      type: "inspector",
      label: "Selected individual",
      value: selectedIndividualInspector,
    },
  ],
});

type UIObservation = ReturnType<ReturnType<typeof model.create>["read"]>;

function populationBySexSeries(s: UIObservation): readonly Series[] {
  return [
    {
      label: "Males",
      color: "#3bb34b",
      points: s.history.map((p) => ({ x: p.tick, y: p.males })),
    },
    {
      label: "Females",
      color: "#428bd0",
      points: s.history.map((p) => ({ x: p.tick, y: p.females })),
    },
    {
      label: "Carrying",
      color: "#f6a130",
      points: s.history.map((p) => ({ x: p.tick, y: p.pregnant })),
    },
    {
      label: "Not carrying",
      color: "#5555a0",
      points: s.history.map((p) => ({ x: p.tick, y: p.nonPregnant })),
    },
  ];
}

function selectedIndividualInspector(
  s: UIObservation,
  id: string | null,
): Readonly<Record<string, string | number | boolean>> | undefined {
  const a = [...s.males, ...s.females].find((a) => a.id === id);
  return a
    ? {
        sex: a.sex,
        age: a.age,
        longevity: a.longevity,
        adult: a.adult,
        maleChildChance: a.maleChildChance,
        carrying: a.carrying,
        gestation: a.gestation,
        partners: a.numOfExes,
        children: a.numOfChildren,
      }
    : undefined;
}
