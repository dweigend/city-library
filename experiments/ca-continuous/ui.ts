import { defineUI, netLogoColor } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: [
    { field: "width" },
    { field: "height" },
    { field: "seed" },
    { field: "initialization" },
    { field: "maxValue" },
  ],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/CAContinuous",
    label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0",
  },
  actions: [
    { label: "Setup single", run: (m) => m.setupSingle() },
    { label: "Setup random", run: (m) => m.setupRandom() },
    { label: "Continue", run: (m) => m.continueRun(), enabled: (s) => s.done },
  ],
  live: [
    {
      field: "addConstant",
      value: (s) => s.parameters.addConstant,
      set: (m, v) => m.setRules({ addConstant: Number(v) }),
    },
    {
      field: "precisionLevel",
      value: (s) => s.parameters.precisionLevel,
      set: (m, v) => m.setRules({ precisionLevel: Number(v) }),
    },
    {
      field: "autoContinue",
      value: (s) => s.parameters.autoContinue,
      set: (m, v) => m.setRules({ autoContinue: Boolean(v) }),
    },
  ],
  complete: (s) => s.done,
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Row", value: (s) => s.row },
  ],
  views: [
    {
      type: "grid",
      label: "Rows",
      data: (s) => ({
        width: s.width,
        height: s.height,
        cells: s.cells.map((c) => ({
          ...c,
          color: netLogoColor(c.colorNumber),
        })),
      }),
    },
  ],
});
