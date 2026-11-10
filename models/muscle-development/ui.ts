import { defineUI, type Observation, type Series } from "../../ui/index.ts";

import { model } from "./model.ts";

const binding = defineUI(model, {
  setup: ["seed", "slowTwitchFibers"],
  live: {
    daysBetweenWorkouts: {
      set: (instance, value) =>
        instance.setParameters({ daysBetweenWorkouts: value }),
    },
    hoursOfSleep: {
      set: (instance, value) => instance.setParameters({ hoursOfSleep: value }),
    },
    intensity: {
      set: (instance, value) => instance.setParameters({ intensity: value }),
    },
    lift: {
      set: (instance, value) => instance.setParameters({ lift: value }),
    },
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
export const sourceMarker =
  "selected-biology-b07:muscle-development:29c39af0fbaff47c0ecab4d901260f05a5195f807046dd895ddd66eef1163e26";
export const ui = { ...binding, model, sourceMarker };

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
