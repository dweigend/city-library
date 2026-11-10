import { defineUI, type Observation, type SpatialData, type Series } from "../../ui/index.ts";

import { model } from "./model.ts";

const binding = defineUI(model, {
  setup: ["seed", "leafCount", "startSugarMean", "startSugarStddev"],
  change: (instance, changes) => instance.setParameters(changes),
  live: {
    windFactor: {},
    temperature: {},
    rainIntensity: {},
    sunIntensity: {},
    leafDisplayMode: {},
  },
  complete: (state) => state.stopped,
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Biology/Autumn.nlogox",
    label: "Source attribution · Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    { label: "Leaves", value: (state) => state.leaves.length },
    { label: "Dead leaves", value: (state) => state.deadLeaves.length },
    { label: "Raindrops", value: (state) => state.raindrops.length },
  ],
  views: [
    {
      type: "spatial",
      label: "Autumn",
      data: autumnData,
    },
    {
      type: "line",
      label: "Leaves",
      series: leavesSeries,
    },
    {
      type: "line",
      label: "Weather",
      series: weatherSeries,
    },
    {
      type: "line",
      label: "Leaf averages",
      series: leafAveragesSeries,
    },
  ],
});

export { model };

export const ui = { ...binding, model };

type UIObservation = Observation<typeof model>;

function autumnData(state: UIObservation): SpatialData {
  return {
    width: state.width,
    height: state.height,
    agents: [
      ...state.deadLeaves,
      ...state.leaves,
      ...state.raindrops,
      ...state.suns,
    ].map((agent) => ({
      ...agent,
      size: agent.size * 12 * Math.sqrt(agent.fillFraction),
      shape:
        agent.group === "leaf" || agent.group === "dead-leaf"
          ? ("triangle" as const)
          : ("circle" as const),
    })),
    cells: state.cells,
  };
}

function leavesSeries(state: UIObservation): readonly Series[] {
  return [
    {
      label: "Live",
      color: "#348b34",
      points: state.history.flatMap((point) => [
        { x: point.tick, y: point.leafCount },
      ]),
    },
    {
      label: "Dead",
      color: "#8a5c2e",
      points: state.history.flatMap((point) => [
        { x: point.tick, y: point.deadLeafCount },
      ]),
    },
  ];
}

function weatherSeries(state: UIObservation): readonly Series[] {
  return [
    {
      label: "Temperature",
      color: "#d63838",
      points: state.history.flatMap((point) => [
        { x: point.tick, y: point.temperature },
      ]),
    },
    {
      label: "Rain",
      color: "#357be5",
      points: state.history.flatMap((point) => [
        { x: point.tick, y: point.rain },
      ]),
    },
    {
      label: "Wind",
      color: "#777777",
      points: state.history.flatMap((point) => [
        { x: point.tick, y: point.wind },
      ]),
    },
    {
      label: "Sunlight",
      color: "#d4ba25",
      points: state.history.flatMap((point) => [
        { x: point.tick, y: point.sunlight },
      ]),
    },
  ];
}

function leafAveragesSeries(state: UIObservation): readonly Series[] {
  return [
    {
      label: "Chlorophyll",
      color: "#348b34",
      points: state.history.flatMap((point) =>
        point.chlorophyll === undefined
          ? []
          : [{ x: point.tick, y: point.chlorophyll }],
      ),
    },
    {
      label: "Water",
      color: "#357be5",
      points: state.history.flatMap((point) =>
        point.water === undefined ? [] : [{ x: point.tick, y: point.water }],
      ),
    },
    {
      label: "Sugar",
      color: "#8a5c2e",
      points: state.history.flatMap((point) =>
        point.sugar === undefined ? [] : [{ x: point.tick, y: point.sugar }],
      ),
    },
    {
      label: "Carotene",
      color: "#d4ba25",
      points: state.history.flatMap((point) =>
        point.carotene === undefined
          ? []
          : [{ x: point.tick, y: point.carotene }],
      ),
    },
    {
      label: "Anthocyanin",
      color: "#d63838",
      points: state.history.flatMap((point) =>
        point.anthocyanin === undefined
          ? []
          : [{ x: point.tick, y: point.anthocyanin }],
      ),
    },
    {
      label: "Attachedness",
      color: "#777777",
      points: state.history.flatMap((point) =>
        point.attachedness === undefined
          ? []
          : [{ x: point.tick, y: point.attachedness }],
      ),
    },
  ];
}
