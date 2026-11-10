import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["width", "height", "seed", "initialization"],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/BriansBrain",
    label: "Source attribution · Wilensky · CC BY-NC-SA 3.0",
  },
  actions: [
    { label: "Setup blank", run: (m) => m.setupBlank() },
    { label: "Setup random", run: (m) => m.setupRandom() },
    {
      label: "Draw firing",
      run: (m) => m.setDrawing(!(m.read().drawing && m.read().brush === 1), 1),
      pressed: (s) => s.drawing && s.brush === 1,
    },
    {
      label: "Draw refractory",
      run: (m) => m.setDrawing(!(m.read().drawing && m.read().brush === 2), 2),
      pressed: (s) => s.drawing && s.brush === 2,
    },
  ],
  live: {
    initialDensity: {
      set: (m, v) => m.setInitialDensity(v),
    },
  },
  drawing: {
    enabled: (s) => s.drawing,
    intent(m, i) {
      if (i.phase === "begin") m.beginBrush(i.position);
      else if (i.phase === "move") m.moveBrush(i.position);
      else m.endBrush();
    },
  },
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Firing", value: (s) => s.counts.firingFieldCount },
    { label: "Refractory", value: (s) => s.counts.refractoryFieldCount },
  ],
  views: [
    {
      type: "grid",
      label: "Cells",
      data: (s) => ({
        width: s.width,
        height: s.height,
        cells: s.cells.map((c) => ({
          ...c,
          color: c.state === 1 ? "#fff" : c.state === 2 ? "#d73027" : "#000",
        })),
      }),
    },
  ],
});
