import { defineUI, type Observation, type SpatialData, type Series } from "../../ui/index.ts";

import { model } from "./model.ts";

const binding = defineUI(model, {
  setup: ["seed", "initialChloroplasts", "initialCarbonDioxide"],
  change: (instance, changes) => instance.setParameters(changes),
  live: {
    waterflowThroughLeaf: {},
    intensityOfLight: {},
    autoStop: {},
    stopAt: {},
  },
  complete: (state) => state.stopped,
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Biology/Chloroplasts%20and%20Food.nlogox",
    label: "Source attribution · Wilensky · CC BY-NC-SA 3.0",
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
      data: chloroplastsAndFoodData,
    },
    {
      type: "line",
      label: "Molecules",
      series: moleculesSeries,
    },
  ],
});

export { model };
export const sourceMarker =
  "selected-biology-b07:chloroplasts-and-food:7c1ca18d90bd70a969ec8722fb056cafeea758c898a39efbaada099aa5e28f66";
export const ui = { ...binding, model, sourceMarker };

type UIObservation = Observation<typeof model>;

function chloroplastsAndFoodData(state: UIObservation): SpatialData {
  return {
    width: state.width,
    height: state.height,
    agents: state.agents
      .filter((agent) => !agent.hidden)
      .map((agent) => ({
        ...agent,
        size:
          agent.group === "chloroplast" ? 70 : agent.group === "photon" ? 4 : 7,
      })),
    cells: state.cells,
  };
}

function moleculesSeries(state: UIObservation): readonly Series[] {
  return [
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
  ];
}
