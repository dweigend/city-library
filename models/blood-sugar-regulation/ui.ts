import { defineUI, type Observation, type SpatialData, type Series } from "../../ui/index.ts";

import { model } from "./model.ts";

const binding = defineUI(model, {
  setup: ["seed"],
  change: (instance, changes) => instance.setParameters(changes),
  live: {
    metabolicRate: {},
    glucoseSensitivity: {},
    insulinSensitivity: {},
    glucagonSensitivity: {},
  },
  actions: [
    { label: "Eat", run: (instance) => instance.eat() },
    { label: "Follow glucose", run: (instance) => instance.followGlucose() },
    { label: "Follow insulin", run: (instance) => instance.followInsulin() },
    { label: "Follow glucagon", run: (instance) => instance.followGlucagon() },
  ],
  complete: (state) => state.stopped,
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Biology/Blood%20Sugar%20Regulation.nlogox",
    label: "Source attribution · Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    { label: "Blood glucose", value: (state) => state.glucoseCount },
    { label: "Insulin", value: (state) => state.insulinCount },
    { label: "Glucagon", value: (state) => state.glucagonCount },
    { label: "Stored glucose", value: (state) => state.storedGlucose },
    { label: "Meal time", value: (state) => state.eatTime },
  ],
  views: [
    {
      type: "spatial",
      label: "Blood Sugar Regulation",
      data: bloodSugarRegulationData,
    },
    {
      type: "line",
      label: "Signal molecules",
      series: signalMoleculesSeries,
    },
  ],
});

export { model };
export const sourceMarker =
  "selected-biology-b07:blood-sugar-regulation:75efe0d13e248bbdd0850171f35e54271bb16ad78bdd3ecbe7e0afb8f3f5313f";
export const ui = { ...binding, model, sourceMarker };

type UIObservation = Observation<typeof model>;

function bloodSugarRegulationData(state: UIObservation): SpatialData {
  return {
    width: state.width,
    height: state.height,
    agents: state.agents
      .filter((agent) => agent.group !== "liver" && agent.group !== "pancreas")
      .map((agent) => ({
        ...agent,
        size: agent.id === state.followingId ? 9 : 3,
      })),
    cells: [...state.liverCells, ...state.pancreaticCells],
  };
}

function signalMoleculesSeries(state: UIObservation): readonly Series[] {
  return [
    {
      label: "Glucose",
      color: "#888888",
      points: state.history.flatMap((point) => [
        { x: point.tick, y: point.glucose },
      ]),
    },
    {
      label: "Insulin",
      color: "#58b8ed",
      points: state.history.flatMap((point) => [
        { x: point.tick, y: point.insulin },
      ]),
    },
    {
      label: "Glucagon",
      color: "#e43838",
      points: state.history.flatMap((point) => [
        { x: point.tick, y: point.glucagon },
      ]),
    },
  ];
}
