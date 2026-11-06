import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

const binding = defineUI(model, {
  setup: [{ field: "seed" }, { field: "lacINumber" }, { field: "rnapNumber" }],
  live: [
    {
      field: "lactose",
      value: (state) => state.parameters.lactose,
      set: (instance, value) =>
        instance.setParameters({ lactose: Boolean(value) }),
    },
    {
      field: "glucose",
      value: (state) => state.parameters.glucose,
      set: (instance, value) =>
        instance.setParameters({ glucose: Boolean(value) }),
    },
    {
      field: "levelSpace",
      value: (state) => state.parameters.levelSpace,
      set: (instance, value) =>
        instance.setParameters({ levelSpace: Boolean(value) }),
    },
    {
      field: "lacIBondLeakage",
      value: (state) => state.parameters.lacIBondLeakage,
      set: (instance, value) =>
        instance.setParameters({ lacIBondLeakage: Number(value) }),
    },
    {
      field: "lacILactoseBindingChance",
      value: (state) => state.parameters.lacILactoseBindingChance,
      set: (instance, value) =>
        instance.setParameters({ lacILactoseBindingChance: Number(value) }),
    },
    {
      field: "lacILactoseSeparationChance",
      value: (state) => state.parameters.lacILactoseSeparationChance,
      set: (instance, value) =>
        instance.setParameters({ lacILactoseSeparationChance: Number(value) }),
    },
    {
      field: "lacYDegradationChance",
      value: (state) => state.parameters.lacYDegradationChance,
      set: (instance, value) =>
        instance.setParameters({ lacYDegradationChance: Number(value) }),
    },
    {
      field: "lacZDegradationChance",
      value: (state) => state.parameters.lacZDegradationChance,
      set: (instance, value) =>
        instance.setParameters({ lacZDegradationChance: Number(value) }),
    },
  ],
  actions: [{ label: "Reset parameters", run: (instance) => instance.reset() }],
  complete: (state) => state.stopped,
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Curricular%20Models/GenEvo/GenEvo%201%20Genetic%20Switch.nlogox",
    label: "Original NetLogo model · source notices",
  },
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    { label: "Energy", value: (state) => state.energy },
    { label: "LacZ", value: (state) => state.lacZCount },
    { label: "LacY", value: (state) => state.lacYCount },
    { label: "Message", value: (state) => state.message },
    { label: "Divisions", value: (state) => state.divisionNumber },
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
      series: (state) => [
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
            y: Number(point.lacZ),
          })),
        },
      ],
    },
  ],
});

export { model };
export const sourceMarker =
  "selected-disease-gene-b09:genevo-1-genetic-switch:6f46710d78daad311551c2ee934317d98ef52ad92779b8312ba66dcd4c7d330e";
export const ui = { ...binding, model, sourceMarker };
