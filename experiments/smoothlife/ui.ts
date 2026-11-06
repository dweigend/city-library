import { defineUI } from "../../ui/index.ts";
import { model, type SmoothLifeParameters } from "./model.ts";
const liveFields = [
  "minBirth",
  "maxBirth",
  "minSurvive",
  "maxSurvive",
  "innerStepWidth",
  "outerStepWidth",
  "paintValue",
  "paintRadius",
] as const;
export const ui = defineUI(model, {
  setup: [
    { field: "width" },
    { field: "height" },
    { field: "seed" },
    { field: "innerRadius" },
    { field: "outerRadius" },
  ],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/SmoothLife",
    label: "Original NetLogo model · Head & Wilensky · CC BY-NC-SA 3.0",
  },
  actions: [
    { label: "Erase all", run: (instance) => instance.eraseAll() },
    {
      label: "Paint",
      run: (instance) => instance.setDrawing(!instance.read().drawing),
      pressed: (state) => state.drawing,
    },
    {
      label: "Paint selected",
      enabled: (_, id) => id !== null,
      run(instance, id) {
        const cell = instance.read().cells.find((cell) => cell.id === id);
        if (cell) instance.paint({ x: cell.x, y: cell.y });
      },
    },
  ],
  live: liveFields.map((field) => ({
    field,
    value: (state: ReturnType<ReturnType<typeof model.create>["read"]>) =>
      state.parameters[field],
    set: (
      instance: ReturnType<typeof model.create>,
      value: string | number | boolean,
    ) =>
      instance.setRules({
        [field]: Number(value),
      } as Partial<SmoothLifeParameters>),
  })),
  drawing: {
    enabled: (state) => state.drawing,
    intent(instance, intent) {
      if (intent.phase !== "end") instance.draw(intent.position);
    },
  },
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    { label: "Disk cells", value: (state) => state.innerCount },
    { label: "Annulus cells", value: (state) => state.outerCount },
  ],
  views: [
    {
      type: "grid",
      label: "Cells",
      data: (state) => ({
        width: state.width,
        height: state.height,
        cells: state.cells.map((cell) => {
          const channel = Math.round(cell.value * 255);
          return { ...cell, color: `rgb(${channel},${channel},${channel})` };
        }),
      }),
    },
  ],
});
