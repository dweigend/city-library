import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

const binding = defineUI(model, {
  setup: ["seed", "agentCount"],
  change: (instance, changes) => instance.setParameters(changes),
  live: {
    sniffThreshold: {},
    sniffAngle: {},
    wiggleAngle: {},
    wiggleBias: {},
  },
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Biology/Slime.nlogox",
    label: "Source attribution · Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    { label: "Population", value: (state) => state.agents.length },
    {
      label: "Chemical",
      value: (state) => state.chemicalTotal,
      format: (value: number) => value.toFixed(2),
    },
  ],
  views: [
    {
      type: "spatial",
      label: "Slime",
      data: (state) => ({
        width: state.width,
        height: state.height,
        agents: state.agents.map((agent) => ({
          ...agent,
          shape: "triangle" as const,
          size: 5,
        })),
        cells: state.cells,
      }),
    },
  ],
});

export { model };

export const ui = { ...binding, model };
