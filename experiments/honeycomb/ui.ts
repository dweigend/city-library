import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

const binding = defineUI(model, {
  setup: ["seed", "numBees"],
  live: {},
  actions: [
    { label: "Hide bees", run: (instance) => instance.hideBees() },
    { label: "Show bees", run: (instance) => instance.showBees() },
  ],
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Biology/Honeycomb.nlogox",
    label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    { label: "Bees", value: (state) => state.agents.length },
    { label: "Chemical", value: (state) => state.chemicalTotal.toFixed(2) },
  ],
  views: [
    {
      type: "spatial",
      label: "Honeycomb",
      data: (state) => ({
        width: state.width,
        height: state.height,
        agents: state.agents
          .filter((agent) => !agent.hidden)
          .map((agent) => ({ ...agent, shape: "triangle" as const, size: 4 })),
        cells: state.cells,
      }),
    },
  ],
});

export { model };
export const sourceMarker =
  "selected-biology-b07:honeycomb:812353ef075700900bccf35cc7587137a46fb6c9d3c8a17464790669a72124db";
export const ui = { ...binding, model, sourceMarker };
