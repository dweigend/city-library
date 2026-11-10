import { defineUI, type Observation, type Series } from "../../ui/index.ts";

import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["width", "height", "seed"],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/SolidDiffusion",
    label: "Source attribution · Uri Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Vacancies", value: (s) => s.vacancies },
    {
      label: "Max diffusion distance squared",
      value: (s) => s.maxDiffusionDistance ?? "Undefined",
    },
  ],
  views: [
    {
      type: "spatial",
      label: "Atoms",
      data: (s) => ({
        width: s.width,
        height: s.height,
        agents: s.atoms.map((a) => ({
          ...a,
          color: a.color === "green" ? "#38a339" : "#315bd5",
          size: 8,
        })),
      }),
    },
    {
      type: "line",
      label: "Atoms by column",
      series: atomsByColumnSeries,
    },
    {
      type: "line",
      label: "Max diffusion distance squared",
      series: (s) => [
        {
          label: "Distance squared",
          points: s.history.flatMap((p) =>
            p.distanceSquared === null
              ? []
              : [{ x: p.tick, y: p.distanceSquared }],
          ),
        },
      ],
    },
  ],
});

type UIObservation = Observation<typeof model>;

function atomsByColumnSeries(s: UIObservation): readonly Series[] {
  return [
    {
      label: "Greens",
      color: "#38a339",
      points: s.columns.map((c) => ({ x: c.x, y: c.greens })),
    },
    {
      label: "Blues",
      color: "#315bd5",
      points: s.columns.map((c) => ({ x: c.x, y: c.blues })),
    },
  ];
}
