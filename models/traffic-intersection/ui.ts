import { defineUI, type Observation, type Series } from "../../ui/index.ts";

import { model } from "./model.ts";

const binding = defineUI(model, {
  setup: ["seed"],
  change: (instance, changes) => instance.setParameters(changes),
  live: {
    auto: {},
    speedLimit: {},
    maxAccel: {},
    maxBrake: {},
    freqNorth: {},
    freqEast: {},
    greenLength: {},
    yellowLength: {},
  },
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Social%20Science/Unverified/Traffic%20Intersection.nlogox",
    label: "Source attribution · Wilensky · CC BY-NC-SA 3.0",
  },
  actions: [{ label: "Switch", run: (instance) => instance.changeToYellow() }],
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    {
      label: "Waiting overall",
      value: (state) => state.cars.filter((car) => car.speed === 0).length,
    },
    { label: "Accidents", value: (state) => state.accidents.length },
  ],
  views: [
    {
      type: "spatial",
      label: "Intersection",
      data: (state) => ({
        width: state.width,
        height: state.height,
        cells: state.cells,
        agents: [
          ...state.cars.map((car) => ({ ...car, size: 7 })),
          ...state.lights.map((light) => ({ ...light, size: 9 })),
          ...state.accidents.map((accident) => ({ ...accident, size: 13 })),
        ],
      }),
    },
    {
      type: "line",
      label: "Waiting cars",
      series: waitingCarsSeries,
    },
    {
      type: "inspector",
      label: "Car",
      value: (state, id) => state.cars.find((car) => car.id === id),
    },
  ],
});

export { model };

export const ui = { ...binding, model };

type UIObservation = Observation<typeof model>;

function waitingCarsSeries(state: UIObservation): readonly Series[] {
  return [
    {
      label: "Overall",
      points: state.history.map((point) => ({
        x: point.tick,
        y: point.waitingCarCount,
      })),
    },
    {
      label: "Northbound",
      color: "#dc3434",
      points: state.history.map((point) => ({
        x: point.tick,
        y: point.waitingNorthCarCount,
      })),
    },
    {
      label: "Eastbound",
      color: "#345bd6",
      points: state.history.map((point) => ({
        x: point.tick,
        y: point.waitingEastCarCount,
      })),
    },
  ];
}
