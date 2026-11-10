import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

const binding = defineUI(model, {
  setup: ["seed", "gridSizeX", "gridSizeY", "carCount"],
  live: {
    power: {
      set: (instance, value) => instance.setParameters({ power: value }),
    },
    speedLimit: {
      set: (instance, value) => instance.setParameters({ speedLimit: value }),
    },
    ticksPerCycle: {
      set: (instance, value) =>
        instance.setParameters({ ticksPerCycle: value }),
    },
    currentPhase: {
      set: (instance, value) => instance.setParameters({ currentPhase: value }),
    },
    currentAuto: {
      set: (instance, value) => instance.setParameters({ currentAuto: value }),
    },
  },
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Social%20Science/Traffic%20Grid.nlogox",
    label: "Source attribution · Wilensky · CC BY-NC-SA 3.0",
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
  ],
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    { label: "Phase", value: (state) => state.phase },
    { label: "Stopped cars", value: (state) => state.stoppedCarCount },
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
            y: point.stoppedCarCount,
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
  "selected-transport-b04:traffic-grid:ec0cdcff88fbc9d54aa20a922fa3da8087c40318c929bae108f22f16932def3d";
export const ui = { ...binding, model, sourceMarker };
