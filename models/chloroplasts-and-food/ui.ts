import { defineUI, type Observation, type SpatialData, type Series } from "../../ui/index.ts";

import { model } from "./model.ts";

const binding = defineUI(model, {
  setup: ["seed", "initialChloroplastCount", "initialCarbonDioxideCount"],
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
    { label: "CO2", value: (state) => state.carbonDioxideCount },
    { label: "O2", value: (state) => state.oxygenCount },
    { label: "Glucose produced", value: (state) => state.producedGlucoseCount },
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

export const ui = { ...binding, model };

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
        { x: point.tick, y: point.carbonDioxideCount },
      ]),
    },
    {
      label: "O2",
      color: "#df4545",
      points: state.history.flatMap((point) => [
        { x: point.tick, y: point.oxygenCount },
      ]),
    },
    {
      label: "Glucose produced",
      color: "#b67b37",
      points: state.history.flatMap((point) => [
        { x: point.tick, y: point.producedGlucoseCount },
      ]),
    },
  ];
}
