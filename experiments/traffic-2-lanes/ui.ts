import type { SpatialData, Series } from "../../ui/index.ts";
import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

const binding = defineUI(model, {
  setup: ["seed"],
  live: {
    numberOfCars: {
      set: (instance, value) => instance.setParameters({ numberOfCars: value }),
    },
    acceleration: {
      set: (instance, value) => instance.setParameters({ acceleration: value }),
    },
    deceleration: {
      set: (instance, value) => instance.setParameters({ deceleration: value }),
    },
    maxPatience: {
      set: (instance, value) => instance.setParameters({ maxPatience: value }),
    },
  },
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Social%20Science/Traffic%202%20Lanes.nlogox",
    label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0",
  },
  drawing: {
    toggleLabel: "Select car",
    enabled: () => true,
    intent: (instance, intent) => {
      if (intent.phase === "begin") instance.selectCarAt(intent.position);
    },
  },
  actions: [
    {
      label: "Watch selected car",
      run: (instance) => instance.setPerspective("watch"),
    },
    {
      label: "Follow selected car",
      run: (instance) => instance.setPerspective("follow"),
    },
    {
      label: "Reset perspective",
      run: (instance) => instance.setPerspective("normal"),
    },
  ],
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    {
      label: "Selected speed",
      value: (state) =>
        state.cars
          .find((car) => car.id === state.selectedCarId)!
          .speed.toFixed(3),
    },
  ],
  views: [
    {
      type: "spatial",
      label: "Two lanes",
      data: twoLanesData,
    },
    {
      type: "line",
      label: "Car speeds",
      series: carSpeedsSeries,
    },
    {
      type: "line",
      label: "Driver patience",
      series: driverPatienceSeries,
    },
    {
      type: "line",
      label: "Cars per lane",
      series: carsPerLaneSeries,
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
  "selected-transport-b04:traffic-2-lanes:6a3d627581f1a628e42ff2ca13c643824f9a441309d08645e101df13d09f17d9";
export const ui = { ...binding, model, sourceMarker };

type UIObservation = ReturnType<ReturnType<typeof model.create>["read"]>;

function twoLanesData(state: UIObservation): SpatialData {
  const selected = state.cars.find((car) => car.id === state.selectedCarId)!;
  return {
    width: state.width,
    height: state.height,
    cells: state.cells,
    agents: state.cars.map((car) => ({
      ...car,
      x:
        state.perspective === "follow"
          ? ((car.x - selected.x + 61.5) % 41) - 20.5
          : car.x,
      size:
        car.id === state.selectedCarId && state.perspective !== "normal"
          ? 12
          : 7,
    })),
  };
}

function carSpeedsSeries(state: UIObservation): readonly Series[] {
  return [
    {
      label: "Mean",
      color: "#298d35",
      points: state.history.map((point) => ({
        x: point.tick,
        y: point.meanSpeed,
      })),
    },
    {
      label: "Minimum",
      color: "#3259cc",
      points: state.history.map((point) => ({
        x: point.tick,
        y: point.minSpeed,
      })),
    },
    {
      label: "Maximum",
      color: "#39a4b1",
      points: state.history.map((point) => ({
        x: point.tick,
        y: point.maxSpeed,
      })),
    },
    {
      label: "Selected",
      color: "#df3535",
      points: state.history.map((point) => ({
        x: point.tick,
        y: point.selectedSpeed,
      })),
    },
  ];
}

function driverPatienceSeries(state: UIObservation): readonly Series[] {
  return [
    {
      label: "Mean",
      color: "#298d35",
      points: state.history.map((point) => ({
        x: point.tick,
        y: point.meanPatience,
      })),
    },
    {
      label: "Minimum",
      color: "#3259cc",
      points: state.history.map((point) => ({
        x: point.tick,
        y: point.minPatience,
      })),
    },
    {
      label: "Maximum",
      color: "#39a4b1",
      points: state.history.map((point) => ({
        x: point.tick,
        y: point.maxPatience,
      })),
    },
    {
      label: "Selected",
      color: "#df3535",
      points: state.history.map((point) => ({
        x: point.tick,
        y: point.selectedPatience,
      })),
    },
  ];
}

function carsPerLaneSeries(state: UIObservation): readonly Series[] {
  return [
    {
      label: "Lane 1",
      color: "#298d35",
      points: state.history.map((point) => ({
        x: point.tick,
        y: point.lane1,
      })),
    },
    {
      label: "Lane 2",
      color: "#3259cc",
      points: state.history.map((point) => ({
        x: point.tick,
        y: point.lane2,
      })),
    },
  ];
}
