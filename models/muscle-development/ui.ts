import { defineUI, type Observation, type Series } from "../../ui/index.ts";

import { model } from "./model.ts";

const binding = defineUI(model, {
  setup: ["seed", "slowTwitchFiberPercent"],
  change: (instance, changes) => instance.setParameters(changes),
  live: {
    daysBetweenWorkouts: {},
    hoursOfSleep: {},
    intensity: {},
    lift: {},
  },
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Biology/Muscle%20Development.nlogox",
    label: "Source attribution · Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    {
      label: "Muscle mass",
      value: (state) => state.muscleMass,
      format: (value: number) => value.toFixed(2),
    },
  ],
  views: [
    {
      type: "spatial",
      label: "Muscle Development",
      data: (state) => ({
        width: state.width,
        height: state.height,
        agents: state.fibers.map((agent) => ({
          ...agent,
          size: agent.size * 25,
        })),
        cells: state.cells,
      }),
    },
    {
      type: "line",
      label: "Muscle development",
      series: (state) => [
        {
          label: "Mass / 100",
          color: "#b22b2b",
          points: state.history.flatMap((point) => [
            { x: point.tick, y: point.muscleMass / 100 },
          ]),
        },
      ],
    },
    {
      type: "line",
      label: "Hormones",
      series: hormonesSeries,
    },
  ],
});

export { model };

export const ui = { ...binding, model };

type UIObservation = Observation<typeof model>;

function hormonesSeries(state: UIObservation): readonly Series[] {
  return [
    {
      label: "Anabolic",
      color: "#348b34",
      points: state.history.flatMap((point) => [
        { x: point.tick, y: point.anabolic },
      ]),
    },
    {
      label: "Catabolic",
      color: "#d4ba25",
      points: state.history.flatMap((point) => [
        { x: point.tick, y: point.catabolic },
      ]),
    },
  ];
}
