import { defineUI, type Series } from "../../ui/index.ts";

import { model } from "./model.ts";

const binding = defineUI(model, {
  setup: ["seed"],
  live: {
    auto: {
      set: (instance, value) => instance.setParameters({ auto: value }),
    },
    speedLimit: {
      set: (instance, value) => instance.setParameters({ speedLimit: value }),
    },
    maxAccel: {
      set: (instance, value) => instance.setParameters({ maxAccel: value }),
    },
    maxBrake: {
      set: (instance, value) => instance.setParameters({ maxBrake: value }),
    },
    freqNorth: {
      set: (instance, value) => instance.setParameters({ freqNorth: value }),
    },
    freqEast: {
      set: (instance, value) => instance.setParameters({ freqEast: value }),
    },
    greenLength: {
      set: (instance, value) => instance.setParameters({ greenLength: value }),
    },
    yellowLength: {
      set: (instance, value) => instance.setParameters({ yellowLength: value }),
    },
  },
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Social%20Science/Unverified/Traffic%20Intersection.nlogox",
    label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0",
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
export const sourceMarker =
  "selected-transport-b04:traffic-intersection:231db7a8ab42c4bb097f57fbde6520b6b1c64d6c39d3e96c2c3d57e6aaa4b5c9";
export const ui = { ...binding, model, sourceMarker };

type UIObservation = ReturnType<ReturnType<typeof model.create>["read"]>;

function waitingCarsSeries(state: UIObservation): readonly Series[] {
  return [
    {
      label: "Overall",
      points: state.history.map((point) => ({
        x: point.tick,
        y: point.waiting,
      })),
    },
    {
      label: "Northbound",
      color: "#dc3434",
      points: state.history.map((point) => ({
        x: point.tick,
        y: point.waitingNorth,
      })),
    },
    {
      label: "Eastbound",
      color: "#345bd6",
      points: state.history.map((point) => ({
        x: point.tick,
        y: point.waitingEast,
      })),
    },
  ];
}
