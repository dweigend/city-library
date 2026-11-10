import { defineUI, type Observation, type GridData } from "../../ui/index.ts";

import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["width", "height", "seed"],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/Sand",
    label: "Source attribution · Uri Wilensky · CC BY-NC-SA 3.0",
  },
  change: (instance, changes) => instance.setLive(changes),
  live: {
    releaseChance: {
      label: "Release chance (%)",
    },
    spacing: {},
    density: {
      label: "Dump density (%)",
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

type UIObservation = Observation<typeof model>;

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
