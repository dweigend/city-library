import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

const binding = defineUI(model, {
  setup: [
    { field: "seed" },
    { field: "gridSizeX" },
    { field: "gridSizeY" },
    { field: "numCars" },
  ],
  live: [
    {
      field: "power",
      value: (state) => state.parameters.power,
      set: (instance, value) =>
        instance.setParameters({ power: Boolean(value) }),
    },
    {
      field: "speedLimit",
      value: (state) => state.parameters.speedLimit,
      set: (instance, value) =>
        instance.setParameters({ speedLimit: Number(value) }),
    },
    {
      field: "ticksPerCycle",
      value: (state) => state.parameters.ticksPerCycle,
      set: (instance, value) =>
        instance.setParameters({ ticksPerCycle: Number(value) }),
    },
    {
      field: "currentPhase",
      value: (state) => state.parameters.currentPhase,
      set: (instance, value) =>
        instance.setParameters({ currentPhase: Number(value) }),
    },
    {
      field: "currentAuto",
      value: (state) => state.parameters.currentAuto,
      set: (instance, value) =>
        instance.setParameters({ currentAuto: Boolean(value) }),
    },
  ],
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/IABM%20Textbook/chapter%205/Traffic%20Grid%20Goal.nlogox",
    label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0",
  },
  drawing: {
    toggleLabel: "Select intersection",
    enabled: () => true,
    intent: (instance, intent) => {
      if (intent.phase === "begin")
        instance.selectIntersection(intent.position);
    },
  },
  actions: [
    { label: "Change light", run: (instance) => instance.changeLight() },
    {
      label: "Watch a car",
      run: (instance, selected) => {
        const state = instance.read();
        instance.watchCar(
          state.cars.some((car) => car.id === selected) ? selected! : undefined,
        );
      },
    },
    { label: "Stop watching", run: (instance) => instance.stopWatching() },
  ],
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    { label: "Phase", value: (state) => state.phase },
    { label: "Stopped cars", value: (state) => state.numCarsStopped },
  ],
  views: [
    {
      type: "spatial",
      label: "Traffic grid",
      data: (state) => ({
        width: state.width,
        height: state.height,
        cells: state.cells,
        agents: state.cars.map((car) => ({ ...car, size: car.size * 6 })),
      }),
    },
    {
      type: "line",
      label: "Stopped cars",
      series: (state) => [
        {
          label: "Stopped cars",
          points: state.history.map((point) => ({
            x: point.tick,
            y: point.numCarsStopped,
          })),
        },
      ],
    },
    {
      type: "line",
      label: "Average speed of cars",
      series: (state) => [
        {
          label: "Average speed of cars",
          points: state.history.map((point) => ({
            x: point.tick,
            y: point.meanSpeed,
          })),
        },
      ],
    },
    {
      type: "line",
      label: "Average wait time of cars",
      series: (state) => [
        {
          label: "Average wait time of cars",
          points: state.history.map((point) => ({
            x: point.tick,
            y: point.meanWait,
          })),
        },
      ],
    },
    {
      type: "inspector",
      label: "Car",
      value: (state, id) => {
        const car = state.cars.find((candidate) => candidate.id === id);
        return car
          ? {
              ...car,
              houseId: car.houseId ?? "",
              workId: car.workId ?? "",
              goalId: car.goalId ?? "",
            }
          : undefined;
      },
    },
  ],
});

export { model };
export const sourceMarker =
  "selected-transport-b04:traffic-grid-goal:7259187f36f97a8c6e9378398a72d927844233c3811151a714eb3aa97807bfa9";
export const ui = { ...binding, model, sourceMarker };
