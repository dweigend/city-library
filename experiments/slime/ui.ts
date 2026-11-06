import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

const binding = defineUI(model, {
  setup: ["seed", "population"],
  live: {
    sniffThreshold: {
      set: (instance, value) =>
        instance.setParameters({ sniffThreshold: value }),
    },
    sniffAngle: {
      set: (instance, value) => instance.setParameters({ sniffAngle: value }),
    },
    wiggleAngle: {
      set: (instance, value) => instance.setParameters({ wiggleAngle: value }),
    },
    wiggleBias: {
      set: (instance, value) => instance.setParameters({ wiggleBias: value }),
    },
  },
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Biology/Slime.nlogox",
    label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    { label: "Population", value: (state) => state.agents.length },
    { label: "Chemical", value: (state) => state.chemicalTotal.toFixed(2) },
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
export const sourceMarker =
  "selected-biology-b07:slime:ede03dc05cc186a9607cb2ef1b11dfde4a1c05eb57edd19e2a577768c04644da";
export const ui = { ...binding, model, sourceMarker };
