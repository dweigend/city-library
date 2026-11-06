import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: [
    {
      field: "seed",
    },
    {
      field: "number",
    },
    {
      field: "density",
    },
  ],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/Termites",
    label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    {
      label: "Work sweeps",
      value: (s) => s.work,
    },
    {
      label: "Chips on ground",
      value: (s) => s.chipCount,
    },
    {
      label: "Carrying",
      value: (s) => s.carryingCount,
    },
  ],
  views: [
    {
      type: "spatial",
      label: "Wood chips and termites",
      data: (s) => ({
        width: s.width,
        height: s.height,
        cells: s.cells.map((c) => ({
          ...c,
          color: c.chip ? "#eeee2b" : "#000000",
        })),
        agents: s.termites.map((a) => ({
          ...a,
          color: a.carrying ? "#ee8d24" : "#ffffff",
          size: 4,
        })),
      }),
    },
    {
      type: "inspector",
      label: "Termite",
      value: (s, id) => s.termites.find((a) => a.id === id),
    },
  ],
});
