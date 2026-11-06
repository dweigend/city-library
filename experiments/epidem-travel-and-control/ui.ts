import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

const numbers = new Intl.NumberFormat("en", { maximumFractionDigits: 3 });

const binding = defineUI(model, {
  setup: [
    { field: "seed" },
    { field: "initialPeople" },
    { field: "initialAmbulance" },
  ],
  live: [
    {
      field: "infectionChance",
      value: (state) => state.parameters.infectionChance,
      set: (instance, value) =>
        instance.setParameters({ infectionChance: Number(value) }),
    },
    {
      field: "recoveryChance",
      value: (state) => state.parameters.recoveryChance,
      set: (instance, value) =>
        instance.setParameters({ recoveryChance: Number(value) }),
    },
    {
      field: "averageRecoveryTime",
      value: (state) => state.parameters.averageRecoveryTime,
      set: (instance, value) =>
        instance.setParameters({ averageRecoveryTime: Number(value) }),
    },
    {
      field: "averageIsolationTendency",
      value: (state) => state.parameters.averageIsolationTendency,
      set: (instance, value) =>
        instance.setParameters({ averageIsolationTendency: Number(value) }),
    },
    {
      field: "inoculationChance",
      value: (state) => state.parameters.inoculationChance,
      set: (instance, value) =>
        instance.setParameters({ inoculationChance: Number(value) }),
    },
    {
      field: "averageHospitalGoingTendency",
      value: (state) => state.parameters.averageHospitalGoingTendency,
      set: (instance, value) =>
        instance.setParameters({ averageHospitalGoingTendency: Number(value) }),
    },
    {
      field: "intraMobility",
      value: (state) => state.parameters.intraMobility,
      set: (instance, value) =>
        instance.setParameters({ intraMobility: Number(value) }),
    },
    {
      field: "travelTendency",
      value: (state) => state.parameters.travelTendency,
      set: (instance, value) =>
        instance.setParameters({ travelTendency: Number(value) }),
    },
    {
      field: "edges",
      value: (state) => state.parameters.edges,
      set: (instance, value) =>
        instance.setParameters({ edges: Boolean(value) }),
    },
    {
      field: "travel",
      value: (state) => state.parameters.travel,
      set: (instance, value) =>
        instance.setParameters({ travel: Boolean(value) }),
    },
  ],
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
      series: (state) => [
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
      ],
    },
  ],
});

export { model };
export const sourceMarker =
  "selected-disease-gene-b09:epidem-travel-and-control:7bde08421020920d17631b85cbef80c945a6a97857040a079c8aacbc3a35ac07";
export const ui = { ...binding, model, sourceMarker };
