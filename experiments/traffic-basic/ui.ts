import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

const binding = defineUI(model, {
  setup: [{ field: "seed" }, { field: "numberOfCars" }],
  live: [
    {
      field: "acceleration",
      value: (state) => state.parameters.acceleration,
      set: (instance, value) =>
        instance.setParameters({ acceleration: Number(value) }),
    },
    {
      field: "deceleration",
      value: (state) => state.parameters.deceleration,
      set: (instance, value) =>
        instance.setParameters({ deceleration: Number(value) }),
    },
  ],
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Social%20Science/Traffic%20Basic.nlogox",
    label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    {
      label: "Red car speed",
      value: (state) =>
        state.cars
          .find((car) => car.id === state.selectedCarId)!
          .speed.toFixed(3),
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
      series: (state) => [
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
      ],
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
  "selected-transport-b04:traffic-basic:77495cbc72df4370fe07d37ca59241585fdc63b8fec36a13c70da7ba65a6a7c3";
export const ui = { ...binding, model, sourceMarker };
