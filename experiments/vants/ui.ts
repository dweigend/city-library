import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: [
    { field: "width" },
    { field: "height" },
    { field: "seed" },
    { field: "numVants" },
  ],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/Vants",
    label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0",
  },
  actions: [
    {
      label: "Reverse step",
      repeat: { label: "Run reverse", intervalMs: 100 },
      run: (instance) => instance.reverse(),
    },
  ],
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    {
      label: "Black cells",
      value: (state) => state.cells.filter((cell) => cell.on).length,
    },
  ],
  views: [
    {
      type: "spatial",
      label: "Vants",
      data: (state) => ({
        width: state.width,
        height: state.height,
        cells: state.cells.map((cell) => ({
          ...cell,
          color: cell.on ? "#000000" : "#ffffff",
        })),
        agents: state.agents.map((agent) => ({
          ...agent,
          color: "#d73027",
          size: 8,
          shape: "triangle" as const,
        })),
      }),
    },
    {
      type: "inspector",
      label: "Vant",
      value: (state, id) => state.agents.find((agent) => agent.id === id),
    },
  ],
});
