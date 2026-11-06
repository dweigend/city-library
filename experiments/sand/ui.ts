import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: [{ field: "width" }, { field: "height" }, { field: "seed" }],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/Sand",
    label: "Original NetLogo model · Uri Wilensky · CC BY-NC-SA 3.0",
  },
  live: [
    {
      field: "releaseChance",
      label: "Release chance (%)",
      value: (s) => s.parameters.releaseChance,
      set: (m, v) => m.setLive({ releaseChance: Number(v) }),
    },
    {
      field: "spacing",
      value: (s) => s.parameters.spacing,
      set: (m, v) => m.setLive({ spacing: Number(v) }),
    },
    {
      field: "density",
      label: "Dump density (%)",
      value: (s) => s.parameters.density,
      set: (m, v) => m.setLive({ density: Number(v) }),
    },
  ],
  actions: [{ label: "Dump sand", run: (m) => m.dumpSand() }],
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    {
      label: "Sand sites",
      value: (s) => s.cells.filter((c) => c.status === "sand").length,
    },
  ],
  views: [
    {
      type: "grid",
      label: "Sand",
      data: (s) => ({
        width: s.width,
        height: s.height,
        cells: s.cells.map((c) => ({
          ...c,
          color: {
            empty: "#000000",
            floor: "#8b8b8b",
            spout: "#2d53cf",
            sand: "#a56a2a",
          }[c.status],
        })),
      }),
    },
  ],
});
