import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

const binding = defineUI(model, {
  setup: [
    { field: "seed" },
    { field: "initialChloroplasts" },
    { field: "initialCarbonDioxide" },
  ],
  live: [
    {
      field: "waterflowThroughLeaf",
      value: (state) => state.parameters.waterflowThroughLeaf,
      set: (instance, value) =>
        instance.setParameters({ waterflowThroughLeaf: Number(value) }),
    },
    {
      field: "intensityOfLight",
      value: (state) => state.parameters.intensityOfLight,
      set: (instance, value) =>
        instance.setParameters({ intensityOfLight: Number(value) }),
    },
    {
      field: "autoStop",
      value: (state) => state.parameters.autoStop,
      set: (instance, value) =>
        instance.setParameters({ autoStop: Boolean(value) }),
    },
    {
      field: "stopAt",
      value: (state) => state.parameters.stopAt,
      set: (instance, value) =>
        instance.setParameters({ stopAt: Number(value) }),
    },
  ],
  complete: (state) => state.stopped,
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Biology/Chloroplasts%20and%20Food.nlogox",
    label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    { label: "CO2", value: (state) => state.carbonDioxide },
    { label: "O2", value: (state) => state.oxygen },
    { label: "Glucose produced", value: (state) => state.glucoseProduced },
  ],
  views: [
    {
      type: "spatial",
      label: "Chloroplasts and Food",
      data: (state) => ({
        width: state.width,
        height: state.height,
        agents: state.agents
          .filter((agent) => !agent.hidden)
          .map((agent) => ({
            ...agent,
            size:
              agent.breed === "chloroplast"
                ? 70
                : agent.breed === "photon"
                  ? 4
                  : 7,
          })),
        cells: state.cells,
      }),
    },
    {
      type: "line",
      label: "Molecules",
      series: (state) => [
        {
          label: "CO2",
          color: "#222222",
          points: state.history.flatMap((point) => [
            { x: point.tick, y: point.carbonDioxide },
          ]),
        },
        {
          label: "O2",
          color: "#df4545",
          points: state.history.flatMap((point) => [
            { x: point.tick, y: point.oxygen },
          ]),
        },
        {
          label: "Glucose produced",
          color: "#b67b37",
          points: state.history.flatMap((point) => [
            { x: point.tick, y: point.glucoseProduced },
          ]),
        },
      ],
    },
  ],
});

export { model };
export const sourceMarker =
  "selected-biology-b07:chloroplasts-and-food:7c1ca18d90bd70a969ec8722fb056cafeea758c898a39efbaada099aa5e28f66";
export const ui = { ...binding, model, sourceMarker };
