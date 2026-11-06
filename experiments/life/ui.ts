import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["width", "height", "seed", "initialDensity", "initialization"],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/Life",
    label: "Original NetLogo model · Uri Wilensky · CC BY-NC-SA 3.0",
  },
  actions: [
    {
      label: "Draw cells",
      run: (model) => model.setDrawing(!model.read().drawing),
      pressed: (state) => state.drawing,
    },
    { label: "Recolor", run: (model) => model.recolor() },
    {
      label: "Toggle selected cell",
      enabled: (_, id) => id !== null,
      run(model, id) {
        const cell = model.read().cells.find((cell) => cell.id === id);
        if (cell) model.setCell({ x: cell.x, y: cell.y }, !cell.living);
      },
    },
  ],
  drawing: {
    enabled: (state) => state.drawing,
    intent(model, intent) {
      if (intent.phase === "begin") model.beginBrush(intent.position);
      else if (intent.phase === "move") model.moveBrush(intent.position);
      else model.endBrush();
    },
  },
  live: {
    foreground: {
      widget: "color",
      set: (model, value) => model.setColors({ foreground: value }),
    },
    background: {
      widget: "color",
      set: (model, value) => model.setColors({ background: value }),
    },
  },
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    { label: "Living", value: (state) => state.counts.living },
    { label: "Density", value: (state) => state.density.toFixed(4) },
  ],
  views: [
    {
      type: "grid",
      label: "Cells",
      data: (state) => ({
        width: state.width,
        height: state.height,
        cells: state.cells,
      }),
    },
  ],
});
