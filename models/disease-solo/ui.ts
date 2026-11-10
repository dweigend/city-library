import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

const binding = defineUI(model, {
  setup: ["seed", "androidCount"],
  change: (instance, changes) => instance.setParameters(changes),
  live: {
    infectionChance: {},
    stepSize: {},
    avoid: {},
    chase: {},
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
    label: "Source attribution · NetLogo model · source notices",
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
            y: Number(point.sickPersonCount),
          })),
        },
      ],
    },
  ],
});

export { model };

export const ui = { ...binding, model };
