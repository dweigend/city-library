import { defineUI, indexedColor, type Observation, type SpatialData } from "../../ui/index.ts";

import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["seed"],
  live: {
    worldSize: {
      set: (m, value) => m.setParameters({ worldSize: value }),
    },
    maxAdults: {
      set: (m, value) => m.setParameters({ maxAdults: value }),
    },
    zygoteFitnessThreshold: {
      set: (m, value) => m.setParameters({ zygoteFitnessThreshold: value }),
    },
    gameteFitnessThreshold: {
      set: (m, value) => m.setParameters({ gameteFitnessThreshold: value }),
    },
    mutationSigma: {
      set: (m, value) => m.setParameters({ mutationSigma: value }),
    },
    speedSizeCorrelation: {
      set: (m, value) => m.setParameters({ speedSizeCorrelation: value }),
    },
    allowAssortativeFusion: {
      set: (m, value) => m.setParameters({ allowAssortativeFusion: value }),
    },
  },
  actions: [
    {
      label: "Restore default parameters",
      run: (m) => m.restoreDefaultParameters(),
    },
  ],
  complete: (s) => s.done,
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Biology/Evolution/Anisogamy.nlogox",
    label: "Source attribution · Anisogamy · Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Adults", value: (s) => s.adults.length },
    { label: "Gametes", value: (s) => s.gametes.length },
    { label: "Zygotes", value: (s) => s.zygotes.length },
    { label: "Tick advance", value: (s) => s.tickAdvanceAmount },
  ],
  views: [
    {
      type: "spatial",
      label: "Adults, gametes and zygotes",
      data: adultsGametesAndZygotesData,
    },
    {
      type: "line",
      label: "Adult mating types",
      series: (s) =>
        (["blueAdults", "redAdults"] as const).map((key) => ({
          label: key.startsWith("blue") ? "Blue" : "Red",
          color: key === "blueAdults" ? "#4575b4" : "#d73027",
          points: s.history.map((p) => ({ x: p.tick, y: p[key] })),
        })),
    },
    {
      type: "line",
      label: "Gamete mating types",
      series: (s) =>
        (["blueGametes", "redGametes"] as const).map((key) => ({
          label: key.startsWith("blue") ? "Blue" : "Red",
          color: key === "blueGametes" ? "#4575b4" : "#d73027",
          points: s.history.map((p) => ({ x: p.tick, y: p[key] })),
        })),
    },
    {
      type: "line",
      label: "Mean gamete mass trait",
      series: (s) =>
        (["blueMeanTrait", "redMeanTrait"] as const).map((key) => ({
          label: key.startsWith("blue") ? "Blue" : "Red",
          color: key === "blueMeanTrait" ? "#4575b4" : "#d73027",
          points: s.history.flatMap((p) =>
            p[key] === undefined ? [] : [{ x: p.tick, y: p[key]! }],
          ),
        })),
    },
    {
      type: "bar",
      label: "Adult gamete mass traits",
      series: (s) =>
        (["blue", "red"] as const).map((key) => ({
          label: key.startsWith("blue") ? "Blue" : "Red",
          color: key === "blue" ? "#4575b4" : "#d73027",
          points: s.traitDistribution[key].counts.map((count, i) => ({
            x: s.traitDistribution[key].edges[i]!,
            y: count,
          })),
        })),
    },
    {
      type: "inspector",
      label: "Inherited strategy",
      value: inheritedStrategyInspector,
    },
  ],
});

type UIObservation = Observation<typeof model>;

function adultsGametesAndZygotesData(s: UIObservation): SpatialData {
  return {
    width: s.width,
    height: s.height,
    cells: s.cells.map((c) => ({ ...c, color: indexedColor(c.color) })),
    agents: [...s.adults, ...s.gametes, ...s.zygotes].map((a) => ({
      ...a,
      color: indexedColor(
        a.matingTypeTrait +
          (a.group === "adult" ? 1 : a.group === "gamete" ? -1 : 3),
      ),
      size:
        a.group === "gamete"
          ? Math.max(2, a.size * 8)
          : a.group === "zygote"
            ? 5
            : 7,
    })),
  };
}

function inheritedStrategyInspector(
  s: UIObservation,
  id: string | null,
): Readonly<Record<string, string | number | boolean>> | undefined {
  const a = [...s.adults, ...s.gametes, ...s.zygotes].find((a) => a.id === id);
  return a
    ? {
        group: a.group,
        matingType: a.matingTypeTrait,
        massTrait: a.gameteSizeTrait,
        life: a.life,
        incubationTime: a.incubationTime,
      }
    : undefined;
}
