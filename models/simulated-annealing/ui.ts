import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["width", "height", "seed"],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/SimulatedAnnealing",
    label:
      "Original NetLogo model \u00B7 Stonedahl and Wilensky \u00B7 CC BY-NC-SA 3.0",
  },
  change: (instance, changes) => instance.setParameters(changes),
  live: {
    coolingRate: {
      label: "Cooling (%)",
    },
    swapRadius: {},
    acceptEqualChanges: {},
  },
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Temperature", value: (s) => s.temperature.toPrecision(6) },
    { label: "Global energy", value: (s) => s.globalEnergy },
    {
      label: "Accepted / attempted",
      value: (s) => `${s.accepted} / ${s.attempts}`,
    },
  ],
  views: [
    {
      type: "grid",
      label: "Brightness",
      data: (s) => ({
        width: s.width,
        height: s.height,
        cells: s.cells.map((f) => ({
          ...f,
          color: f.brightness ? "#ffffff" : "#000000",
        })),
      }),
    },
    {
      type: "line",
      label: "Global energy",
      series: (s) => [
        {
          label: "Energy",
          points: s.history.map((p) => ({ x: p.tick, y: p.energy })),
        },
      ],
    },
  ],
});
