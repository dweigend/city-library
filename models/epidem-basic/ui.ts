import { defineUI, type Observation, type Series } from "../../ui/index.ts";

import { model } from "./model.ts";

const numbers = new Intl.NumberFormat("en", { maximumFractionDigits: 3 });

const binding = defineUI(model, {
  setup: ["seed", "initialPersonCount"],
  change: (instance, changes) => instance.setParameters(changes),
  live: {
    infectionChance: {},
    recoveryChance: {},
    averageRecoveryTime: {},
  },
  actions: [],
  complete: (state) => state.stopped,
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Curricular%20Models/epiDEM/epiDEM%20Basic.nlogox",
    label: "Source attribution · source notices",
  },
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    { label: "Infected", value: (state) => state.infectedCount },
    { label: "Recovered", value: (state) => state.curedCount },
    { label: "R0", value: (state) => numbers.format(state.r0) },
    { label: "Infection rate", value: (state) => numbers.format(state.betaN) },
    { label: "Recovery rate", value: (state) => numbers.format(state.gamma) },
  ],
  views: [
    {
      type: "spatial",
      label: "Basic Epidemic",
      data: (state) => ({
        width: state.width,
        height: state.height,
        agents: state.agents.map((agent) => ({ ...agent, size: 5 })),
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
      label: "Infected",
      color: "#df4545",
      points: state.history.map((point) => ({
        x: point.tick,
        y: Number(point.infectedPersonCount),
      })),
    },
    {
      label: "Recovered",
      color: "#35a85b",
      points: state.history.map((point) => ({
        x: point.tick,
        y: Number(point.recoveredPersonCount),
      })),
    },
  ];
}
