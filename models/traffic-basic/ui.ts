import { defineUI, type Observation, type Series } from "../../ui/index.ts";

import { model } from "./model.ts";

const binding = defineUI(model, {
  setup: ["seed", "carCount"],
  live: {
    acceleration: {
      set: (instance, value) => instance.setParameters({ acceleration: value }),
    },
    deceleration: {
      set: (instance, value) => instance.setParameters({ deceleration: value }),
    },
  },
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Social%20Science/Traffic%20Basic.nlogox",
    label: "Source attribution · Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    {
      label: "Red car speed",
      value: (state) =>
        state.cars
          .find((car) => car.id === state.selectedCarId)!
          .speed,
      format: (value: number) => value.toFixed(3),
    },
  ],
  views: [
    {
      type: "spatial",
      label: "Road",
      data: (state) => ({
        width: state.width,
        height: state.height,
        cells: state.cells,
        agents: state.cars.map((car) => ({
          ...car,
          size: car.id === state.selectedCarId ? 10 : 7,
        })),
      }),
    },
    {
      type: "line",
      label: "Car speeds",
      series: carSpeedsSeries,
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

function carSpeedsSeries(state: UIObservation): readonly Series[] {
  return [
    {
      label: "Red car",
      color: "#df3535",
      points: state.history.map((point) => ({
        x: point.tick,
        y: point.selectedSpeed,
      })),
    },
    {
      label: "Minimum",
      color: "#375bd7",
      points: state.history.map((point) => ({
        x: point.tick,
        y: point.minSpeed,
      })),
    },
    {
      label: "Maximum",
      color: "#239638",
      points: state.history.map((point) => ({
        x: point.tick,
        y: point.maxSpeed,
      })),
    },
  ];
}
