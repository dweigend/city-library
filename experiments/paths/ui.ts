import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

const binding = defineUI(model, {
  setup: [{ field: "seed" }, { field: "walkerCount" }],
  live: [
    {
      field: "minimumRoutePopularity",
      value: (state) => state.parameters.minimumRoutePopularity,
      set: (instance, value) =>
        instance.setParameters({ minimumRoutePopularity: Number(value) }),
    },
    {
      field: "walkerVisionDist",
      value: (state) => state.parameters.walkerVisionDist,
      set: (instance, value) =>
        instance.setParameters({ walkerVisionDist: Number(value) }),
    },
    {
      field: "popularityDecayRate",
      value: (state) => state.parameters.popularityDecayRate,
      set: (instance, value) =>
        instance.setParameters({ popularityDecayRate: Number(value) }),
    },
    {
      field: "popularityPerStep",
      value: (state) => state.parameters.popularityPerStep,
      set: (instance, value) =>
        instance.setParameters({ popularityPerStep: Number(value) }),
    },
    {
      field: "showPopularity",
      value: (state) => state.parameters.showPopularity,
      set: (instance, value) =>
        instance.setParameters({ showPopularity: Boolean(value) }),
    },
  ],
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Social%20Science/Paths.nlogox",
    label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0",
  },
  drawing: {
    toggleLabel: "Place buildings",
    enabled: () => true,
    intent: (instance, intent) => {
      if (intent.phase === "begin") instance.toggleBuilding(intent.position);
    },
  },
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    { label: "Walkers", value: (state) => state.walkers.length },
    { label: "Buildings", value: (state) => state.buildings.length },
  ],
  views: [
    {
      type: "spatial",
      label: "Paths",
      data: (state) => ({
        width: state.width,
        height: state.height,
        cells: state.cells,
        agents: [
          ...state.walkers.map((walker) => ({
            ...walker,
            shape: "triangle" as const,
            size: 5,
          })),
          ...state.buildings.map((building) => ({ ...building, size: 12 })),
        ],
      }),
    },
    {
      type: "inspector",
      label: "Patch",
      value: (state, id) => state.cells.find((cell) => cell.id === id),
    },
  ],
});

export { model };
export const sourceMarker =
  "selected-transport-b04:paths:89f74e30ca5a70a0fc139e99c6e2ea62e9509ce1c8c76bc8cffa154cf3cd75d0";
export const ui = { ...binding, model, sourceMarker };
