import { defineUI, type Observation, type Series } from "../../ui/index.ts";

import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: [{ field: "width", label: "Genome width" }, "seed"],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/SimpleGeneticAlgorithm",
    label: "Stonedahl & Wilensky · CC BY-NC-SA 3.0",
  },
  live: {
    populationSize: {
      set: (m, v) => m.setParameters({ populationSize: v }),
    },
    crossoverRate: {
      label: "Crossover rate (%)",
      set: (m, v) => m.setParameters({ crossoverRate: v }),
    },
    mutationRate: {
      label: "Mutation rate (%)",
      set: (m, v) => m.setParameters({ mutationRate: v }),
    },
    plotDiversity: {
      set: (m, v) => m.setParameters({ plotDiversity: v }),
    },
  },
  complete: (s) => s.done,
  monitors: [
    { label: "Generation", value: (s) => s.tick },
    { label: "Best fitness", value: (s) => s.best },
    {
      label: "Mean fitness",
      value: (s) => s.mean,
      format: (value: number) => value.toFixed(3),
    },
    { label: "Worst fitness", value: (s) => s.worst },
    {
      label: "Diversity",
      value: (s) => s.diversity,
      format: (value: number) => value.toFixed(5),
    },
  ],
  views: [
    {
      type: "grid",
      label: "Best genome",
      data: (s) => ({
        width: s.width,
        height: s.height,
        cells: Array.from({ length: s.width * s.height }, (_, i) => ({
          id: String(i),
          x: (i % s.width) - (s.width - 1) / 2,
          y: Math.floor(i / s.width) - (s.height - 1) / 2,
          color: s.winner.bits[i % s.width] === 1 ? "#eeeeee" : "#171717",
        })),
      }),
    },
    {
      type: "line",
      label: "Fitness",
      series: fitnessSeries,
    },
    {
      type: "line",
      label: "Diversity",
      series: (s) => [
        {
          label: "Normalized Hamming diversity",
          color: "#9b67c4",
          points: s.history.flatMap((h) =>
            h.diversity === null ? [] : [{ x: h.tick, y: h.diversity }],
          ),
        },
      ],
    },
  ],
});

type UIObservation = Observation<typeof model>;

function fitnessSeries(s: UIObservation): readonly Series[] {
  return [
    {
      label: "Best",
      color: "#d74343",
      points: s.history.map((h) => ({ x: h.tick, y: h.best })),
    },
    {
      label: "Average",
      color: "#47a66a",
      points: s.history.map((h) => ({ x: h.tick, y: h.mean })),
    },
    {
      label: "Worst",
      color: "#3975bc",
      points: s.history.map((h) => ({ x: h.tick, y: h.worst })),
    },
  ];
}
