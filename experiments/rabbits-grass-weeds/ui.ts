import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: [{ field: "seed" }, { field: "number" }],
  live: (
    [
      "birthThreshold",
      "grassGrowRate",
      "grassEnergy",
      "weedsGrowRate",
      "weedEnergy",
    ] as const
  ).map((field) => ({
    field,
    value: (s) => s.parameters[field],
    set: (m, v) =>
      m.setRules({
        [field]: Number(v),
      }),
  })),
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/RabbitsGrassWeeds",
    label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0",
  },
  complete: (s) => s.done,
  monitors: [
    {
      label: "Tick",
      value: (s) => s.tick,
    },
    {
      label: "Rabbits",
      value: (s) => s.rabbits.length,
    },
  ],
  views: [
    {
      type: "spatial",
      label: "Rabbits and resources",
      data: (s) => ({
        width: s.width,
        height: s.height,
        cells: s.cells.map((c) => ({
          ...c,
          color:
            c.cover === "grass"
              ? "#389b39"
              : c.cover === "weeds"
                ? "#b539ba"
                : "#000000",
        })),
        agents: s.rabbits.map((a) => ({
          ...a,
          color: "#ffffff",
          size: 5,
        })),
      }),
    },
    {
      type: "line",
      label: "Populations (resources / 4)",
      series: (s) =>
        (["rabbits", "grass", "weeds"] as const).map((key) => ({
          label: key,
          color:
            key === "rabbits"
              ? "#d73027"
              : key === "grass"
                ? "#389b39"
                : "#b539ba",
          points: s.history.map((p) => ({
            x: p.tick,
            y: p[key],
          })),
        })),
    },
  ],
});
