import type { GridData } from "../../ui/index.ts";
import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["width", "height", "seed"],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/Sand",
    label: "Original NetLogo model · Uri Wilensky · CC BY-NC-SA 3.0",
  },
  live: {
    releaseChance: {
      label: "Release chance (%)",
      set: (m, v) => m.setLive({ releaseChance: v }),
    },
    spacing: {
      set: (m, v) => m.setLive({ spacing: v }),
    },
    density: {
      label: "Dump density (%)",
      set: (m, v) => m.setLive({ density: v }),
    },
  },
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
      data: sandData,
    },
  ],
});

type UIObservation = ReturnType<ReturnType<typeof model.create>["read"]>;

function sandData(s: UIObservation): GridData {
  return {
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
  };
}
