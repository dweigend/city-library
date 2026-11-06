import type { SpatialData } from "../../ui/index.ts";
import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["seed", "population"],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/Ants",
    label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0",
  },
  live: {
    diffusionRate: {
      label: "Diffusion rate (%)",
      set: (m, v) => m.setRules({ diffusionRate: v }),
    },
    evaporationRate: {
      label: "Evaporation rate (%)",
      set: (m, v) => m.setRules({ evaporationRate: v }),
    },
  },
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    {
      label: "Carrying food",
      value: (s) => s.ants.filter((a) => a.carrying).length,
    },
    {
      label: "Food remaining",
      value: (s) => s.foodByPile.reduce((a, b) => a + b, 0),
    },
  ],
  views: [
    {
      type: "spatial",
      label: "Nest, food and pheromone",
      data: nestFoodAndPheromoneData,
    },
    {
      type: "inspector",
      label: "Selected ant",
      value: (s, id) => s.ants.find((a) => a.id === id),
    },
    {
      type: "line",
      label: "Food in each pile",
      series: (s) =>
        [1, 2, 3].map((n) => ({
          label: `Pile ${n}`,
          color: ["#00aaaa", "#4499cc", "#2244cc"][n - 1]!,
          points: s.history.map((p) => ({
            x: p.tick,
            y: n === 1 ? p.food1 : n === 2 ? p.food2 : p.food3,
          })),
        })),
    },
  ],
});

type UIObservation = ReturnType<ReturnType<typeof model.create>["read"]>;

function nestFoodAndPheromoneData(s: UIObservation): SpatialData {
  return {
    width: s.width,
    height: s.height,
    cells: s.cells.map((c) => ({
      ...c,
      color: c.nest
        ? "#a536c7"
        : c.food > 0
          ? ["#000000", "#00dddd", "#55aaff", "#2244dd"][c.foodSourceNumber]!
          : `hsl(120 80% ${Math.max(0, Math.min(90, ((c.chemical - 0.1) / 4.9) * 90))}%)`,
    })),
    agents: s.ants.map((a) => ({
      ...a,
      color: a.carrying ? "#ffac30" : "#ee3333",
      shape: "triangle" as const,
      size: 8,
    })),
  };
}
