import type { Series } from "../../ui/index.ts";
import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

const numbers = new Intl.NumberFormat("en", { maximumFractionDigits: 3 });

const binding = defineUI(model, {
  setup: ["seed", "initialPeople"],
  live: {
    infectionChance: {
      set: (instance, value) =>
        instance.setParameters({ infectionChance: value }),
    },
    recoveryChance: {
      set: (instance, value) =>
        instance.setParameters({ recoveryChance: value }),
    },
    averageRecoveryTime: {
      set: (instance, value) =>
        instance.setParameters({ averageRecoveryTime: value }),
    },
  },
  actions: [],
  complete: (state) => state.stopped,
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Curricular%20Models/epiDEM/epiDEM%20Basic.nlogox",
    label: "Original NetLogo model · source notices",
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
      label: "epiDEM Basic",
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
export const sourceMarker =
  "selected-disease-gene-b09:epidem-basic:049c5556e76cf22b7ec76e801c09134d02cf29619ea46c8c9578e9862be2c07a";
export const ui = { ...binding, model, sourceMarker };

type UIObservation = ReturnType<ReturnType<typeof model.create>["read"]>;

function historySeries(state: UIObservation): readonly Series[] {
  return [
    {
      label: "Infected",
      color: "#df4545",
      points: state.history.map((point) => ({
        x: point.tick,
        y: Number(point.infected),
      })),
    },
    {
      label: "Recovered",
      color: "#35a85b",
      points: state.history.map((point) => ({
        x: point.tick,
        y: Number(point.cured),
      })),
    },
  ];
}
