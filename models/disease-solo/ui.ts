import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

const binding = defineUI(model, {
  setup: ["seed", "androidCount"],
  live: {
    infectionChance: {
      set: (instance, value) =>
        instance.setParameters({ infectionChance: value }),
    },
    stepSize: {
      set: (instance, value) => instance.setParameters({ stepSize: value }),
    },
    avoid: {
      set: (instance, value) => instance.setParameters({ avoid: value }),
    },
    chase: {
      set: (instance, value) => instance.setParameters({ chase: value }),
    },
  },
  actions: [
    { label: "Infect", run: (instance) => instance.infect() },
    { label: "Keep plots", run: (instance) => instance.setupKeep() },
    { label: "Clear plots", run: (instance) => instance.setupClear() },
    { label: "Up", run: (instance) => instance.move(0) },
    { label: "Right", run: (instance) => instance.move(90) },
    { label: "Down", run: (instance) => instance.move(180) },
    { label: "Left", run: (instance) => instance.move(270) },
  ],
  complete: (state) => state.stopped,
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Biology/Disease%20Solo.nlogox",
    label: "Original NetLogo model · source notices",
  },
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    { label: "Sick", value: (state) => state.sickCount },
    { label: "Run", value: (state) => state.runNumber },
  ],
  views: [
    {
      type: "spatial",
      label: "Disease Solo",
      data: (state) => ({
        width: state.width,
        height: state.height,
        agents: state.agents.map((agent) => ({ ...agent, size: 5 })),
      }),
    },
    {
      type: "line",
      label: "History",
      series: (state) => [
        {
          label: "Sick",
          color: "#df4545",
          points: state.history.map((point) => ({
            x: point.tick,
            y: Number(point.sick),
          })),
        },
      ],
    },
  ],
});

export { model };
export const sourceMarker =
  "selected-disease-gene-b09:disease-solo:f3d15df285ed35bcba2a6b3a718acf63de1589c8be099b44c2b6f1743b701a97";
export const ui = { ...binding, model, sourceMarker };
