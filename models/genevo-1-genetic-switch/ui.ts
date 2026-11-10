import { defineUI, type Observation, type Series } from "../../ui/index.ts";

import { model } from "./model.ts";

const binding = defineUI(model, {
  setup: ["seed", "lacICount", "rnapCount"],
  change: (instance, changes) => instance.setParameters(changes),
  live: {
    lactose: {},
    glucose: {},
    levelSpace: {},
    lacIBondLeakage: {},
    lacILactoseBindingChance: {},
    lacILactoseSeparationChance: {},
    lacYDegradationChance: {},
    lacZDegradationChance: {},
  },
  actions: [{ label: "Reset parameters", run: (instance) => instance.reset() }],
  complete: (state) => state.stopped,
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Curricular%20Models/GenEvo/GenEvo%201%20Genetic%20Switch.nlogox",
    label: "Source attribution · source notices",
  },
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    { label: "Energy", value: (state) => state.energy },
    { label: "LacZ", value: (state) => state.lacZCount },
    { label: "LacY", value: (state) => state.lacYCount },
    { label: "Message", value: (state) => state.message },
    { label: "Divisions", value: (state) => state.divisionCount },
  ],
  views: [
    {
      type: "spatial",
      label: "GenEvo 1 Genetic Switch",
      data: (state) => ({
        width: state.width,
        height: state.height,
        agents: state.agents
          .filter((agent) => !agent.hidden)
          .map((agent) => ({ ...agent, size: 5 })),
        cells: state.cells,
      }),
    },
    {
      type: "line",
      label: "History",
      series: historySeries,
    },
  ],
});

export { model };

export const ui = { ...binding, model };

type UIObservation = Observation<typeof model>;

function historySeries(state: UIObservation): readonly Series[] {
  return [
    {
      label: "Energy",
      color: "#888888",
      points: state.history.map((point) => ({
        x: point.tick,
        y: Number(point.energy),
      })),
    },
    {
      label: "LacZ",
      color: "#df4545",
      points: state.history.map((point) => ({
        x: point.tick,
        y: Number(point.lacZCount),
      })),
    },
  ];
}
