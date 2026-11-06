import { defineUI, netLogoColor } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: [{ field: "seed" }],
  live: (
    [
      "worldSize",
      "maxAdults",
      "zygoteFitnessThreshold",
      "gameteFitnessThreshold",
      "mutationSigma",
      "speedSizeCorrelation",
      "allowAssortativeFusion",
    ] as const
  ).map((field) => ({
    field,
    value: (s) => s.parameters[field],
    set: (m, value) =>
      m.setParameters({
        [field]:
          field === "speedSizeCorrelation" || field === "allowAssortativeFusion"
            ? Boolean(value)
            : Number(value),
      }),
  })),
  actions: [
    {
      label: "Restore default parameters",
      run: (m) => m.restoreDefaultParameters(),
    },
  ],
  complete: (s) => s.done,
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Biology/Evolution/Anisogamy.nlogox",
    label: "NetLogo Anisogamy · Wilensky · CC BY-NC-SA 3.0",
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
      data: (s) => ({
        width: s.width,
        height: s.height,
        cells: s.cells.map((c) => ({ ...c, color: netLogoColor(c.color) })),
        agents: [...s.adults, ...s.gametes, ...s.zygotes].map((a) => ({
          ...a,
          color: netLogoColor(
            a.matingTypeTrait +
              (a.breed === "adult" ? 1 : a.breed === "gamete" ? -1 : 3),
          ),
          size:
            a.breed === "gamete"
              ? Math.max(2, a.size * 8)
              : a.breed === "zygote"
                ? 5
                : 7,
        })),
      }),
    },
    {
      type: "line",
      label: "Adult mating types",
      series: (s) =>
        (["blueAdults", "redAdults"] as const).map((key) => ({
          label: key,
          color: key === "blueAdults" ? "#4575b4" : "#d73027",
          points: s.history.map((p) => ({ x: p.tick, y: p[key] })),
        })),
    },
    {
      type: "line",
      label: "Gamete mating types",
      series: (s) =>
        (["blueGametes", "redGametes"] as const).map((key) => ({
          label: key,
          color: key === "blueGametes" ? "#4575b4" : "#d73027",
          points: s.history.map((p) => ({ x: p.tick, y: p[key] })),
        })),
    },
    {
      type: "line",
      label: "Mean gamete mass trait",
      series: (s) =>
        (["blueMeanTrait", "redMeanTrait"] as const).map((key) => ({
          label: key,
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
          label: key,
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
      value: (s, id) => {
        const a = [...s.adults, ...s.gametes, ...s.zygotes].find(
          (a) => a.id === id,
        );
        return a
          ? {
              breed: a.breed,
              matingType: a.matingTypeTrait,
              massTrait: a.gameteSizeTrait,
              life: a.life,
              incubationTime: a.incubationTime,
            }
          : undefined;
      },
    },
  ],
});
