import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["width", "height", "seed", "innerRadius", "outerRadius"],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/SmoothLife",
    label: "Source attribution · Head & Wilensky · CC BY-NC-SA 3.0",
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
  live: {
    minBirth: {
      set: (instance, value) => instance.setRules({ minBirth: value }),
    },
    maxBirth: {
      set: (instance, value) => instance.setRules({ maxBirth: value }),
    },
    minSurvive: {
      set: (instance, value) => instance.setRules({ minSurvive: value }),
    },
    maxSurvive: {
      set: (instance, value) => instance.setRules({ maxSurvive: value }),
    },
    innerStepWidth: {
      set: (instance, value) => instance.setRules({ innerStepWidth: value }),
    },
    outerStepWidth: {
      set: (instance, value) => instance.setRules({ outerStepWidth: value }),
    },
    paintValue: {
      set: (instance, value) => instance.setRules({ paintValue: value }),
    },
    paintRadius: {
      set: (instance, value) => instance.setRules({ paintRadius: value }),
    },
  },
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
