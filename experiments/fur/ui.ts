import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

const binding = defineUI(model, {
  setup: [
    { field: "seed" },
    { field: "innerRadiusX" },
    { field: "innerRadiusY" },
    { field: "outerRadiusX" },
    { field: "outerRadiusY" },
  ],
  live: [
    {
      field: "initialDensity",
      value: (state) => state.parameters.initialDensity,
      set: (instance, value) =>
        instance.setParameters({ initialDensity: Number(value) }),
    },
    {
      field: "ratio",
      value: (state) => state.parameters.ratio,
      set: (instance, value) =>
        instance.setParameters({ ratio: Number(value) }),
    },
  ],
  actions: [{ label: "Restart", run: (instance) => instance.restart() }],
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Biology/Fur.nlogox",
    label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    { label: "White cells", value: (state) => state.whiteCount },
  ],
  views: [
    {
      type: "grid",
      label: "Skin",
      data: (state) => ({
        width: state.width,
        height: state.height,
        cells: state.cells,
      }),
    },
  ],
});

export { model };
export const sourceMarker =
  "selected-biology-b07:fur:8f7b57b7df931ec45906251a9421017d438286b5607c20c409f722e6db311bc5";
export const ui = { ...binding, model, sourceMarker };
