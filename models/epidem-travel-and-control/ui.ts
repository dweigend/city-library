import { defineUI, type Observation, type Series } from "../../ui/index.ts";

import { model } from "./model.ts";

const numbers = new Intl.NumberFormat("en", { maximumFractionDigits: 3 });

const binding = defineUI(model, {
  setup: ["seed", "initialPeople", "initialAmbulance"],
  change: (instance, changes) => instance.setParameters(changes),
  live: {
    infectionChance: {},
    recoveryChance: {},
    averageRecoveryTime: {},
    averageIsolationTendency: {},
    inoculationChance: {},
    averageHospitalGoingTendency: {},
    intraMobility: {},
    travelTendency: {},
    edges: {},
    travel: {},
  },
  actions: [],
  complete: (state) => state.stopped,
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Curricular%20Models/epiDEM/epiDEM%20Travel%20and%20Control.nlogox",
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
      label: "epiDEM Travel and Control",
      data: (state) => ({
        width: state.width,
        height: state.height,
        agents: state.agents.map((agent) => ({ ...agent, size: 5 })),
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
export const sourceMarker =
  "selected-disease-gene-b09:epidem-travel-and-control:7bde08421020920d17631b85cbef80c945a6a97857040a079c8aacbc3a35ac07";
export const ui = { ...binding, model, sourceMarker };

type UIObservation = Observation<typeof model>;

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
