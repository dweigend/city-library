import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

const binding = defineUI(model, {
  setup: [
    { field: "seed" },
    { field: "numberOfLeaves" },
    { field: "startSugarMean" },
    { field: "startSugarStddev" },
  ],
  live: [
    {
      field: "windFactor",
      value: (state) => state.parameters.windFactor,
      set: (instance, value) =>
        instance.setParameters({ windFactor: Number(value) }),
    },
    {
      field: "temperature",
      value: (state) => state.parameters.temperature,
      set: (instance, value) =>
        instance.setParameters({ temperature: Number(value) }),
    },
    {
      field: "rainIntensity",
      value: (state) => state.parameters.rainIntensity,
      set: (instance, value) =>
        instance.setParameters({ rainIntensity: Number(value) }),
    },
    {
      field: "sunIntensity",
      value: (state) => state.parameters.sunIntensity,
      set: (instance, value) =>
        instance.setParameters({ sunIntensity: Number(value) }),
    },
    {
      field: "leafDisplayMode",
      value: (state) => state.parameters.leafDisplayMode,
      set: (instance, value) =>
        instance.setParameters({
          leafDisplayMode: value as
            | "solid"
            | "chlorophyll"
            | "water"
            | "sugar"
            | "carotene"
            | "anthocyanin"
            | "attachedness",
        }),
    },
  ],
  complete: (state) => state.stopped,
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Biology/Autumn.nlogox",
    label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0",
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
      data: (state) => ({
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
            agent.breed === "leaf" || agent.breed === "dead-leaf"
              ? ("triangle" as const)
              : ("circle" as const),
        })),
        cells: state.cells,
      }),
    },
    {
      type: "line",
      label: "Leaves",
      series: (state) => [
        {
          label: "Live",
          color: "#348b34",
          points: state.history.flatMap((point) => [
            { x: point.tick, y: point.leaves },
          ]),
        },
        {
          label: "Dead",
          color: "#8a5c2e",
          points: state.history.flatMap((point) => [
            { x: point.tick, y: point.deadLeaves },
          ]),
        },
      ],
    },
    {
      type: "line",
      label: "Weather",
      series: (state) => [
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
      ],
    },
    {
      type: "line",
      label: "Leaf averages",
      series: (state) => [
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
            point.water === undefined
              ? []
              : [{ x: point.tick, y: point.water }],
          ),
        },
        {
          label: "Sugar",
          color: "#8a5c2e",
          points: state.history.flatMap((point) =>
            point.sugar === undefined
              ? []
              : [{ x: point.tick, y: point.sugar }],
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
      ],
    },
  ],
});

export { model };
export const sourceMarker =
  "selected-biology-b07:autumn:54c2fa97ac3e235b27d603dbaf7a66234ea4ab507c5643a8df95ee5ef89b5087";
export const ui = { ...binding, model, sourceMarker };
