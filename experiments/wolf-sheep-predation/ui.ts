import type { SpatialData, Series } from "../../ui/index.ts";
import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["seed", "mode", "initialSheep", "initialWolves"],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/WolfSheepPredation",
    label: "Original NetLogo model · Uri Wilensky · CC BY-NC-SA 3.0",
  },
  complete: (state) => state.done,
  live: {
    sheepGain: {
      label: "Sheep food gain",
      set: (instance, value) => instance.setRules({ sheepGain: value }),
    },
    wolfGain: {
      label: "Wolf food gain",
      set: (instance, value) => instance.setRules({ wolfGain: value }),
    },
    sheepReproduce: {
      label: "Sheep reproduction (%)",
      set: (instance, value) => instance.setRules({ sheepReproduce: value }),
    },
    wolfReproduce: {
      label: "Wolf reproduction (%)",
      set: (instance, value) => instance.setRules({ wolfReproduce: value }),
    },
    grassRegrowth: {
      set: (instance, value) => instance.setRules({ grassRegrowth: value }),
      enabled: (state) => state.parameters.mode === "sheep-wolves-grass",
    },
  },
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    { label: "Sheep", value: (state) => state.counts.sheep },
    { label: "Wolves", value: (state) => state.counts.wolves },
    {
      label: "Grass / 4",
      value: (state) =>
        state.parameters.mode === "sheep-wolves-grass"
          ? (state.counts.grass / 4).toFixed(0)
          : "—",
    },
  ],
  views: [
    {
      type: "inspector",
      label: "Selected",
      value: (state, selectedId) =>
        state.agents.find((agent) => agent.id === selectedId) ??
        state.cells.find((cell) => cell.id === selectedId),
    },
    {
      type: "spatial",
      label: "Animals and grass",
      data: animalsAndGrassData,
    },
    {
      type: "line",
      label: "Populations",
      series: populationsSeries,
    },
  ],
});

type UIObservation = ReturnType<ReturnType<typeof model.create>["read"]>;

function animalsAndGrassData(state: UIObservation): SpatialData {
  return {
    width: state.width,
    height: state.height,
    cells: state.cells.map((cell) => ({
      id: cell.id,
      x: cell.x,
      y: cell.y,
      color: cell.grass ? "#60ad2c" : "#a07850",
    })),
    agents: state.agents.map((agent) => ({
      id: agent.id,
      x: agent.x,
      y: agent.y,
      heading: agent.heading,
      label:
        agent.species === "wolf" ||
        state.parameters.mode === "sheep-wolves-grass"
          ? String(Math.round(agent.energy))
          : undefined,
      color: agent.species === "sheep" ? "#fff" : "#171717",
      shape:
        agent.species === "sheep" ? ("circle" as const) : ("triangle" as const),
      size: agent.species === "sheep" ? 10 : 14,
    })),
  };
}

function populationsSeries(state: UIObservation): readonly Series[] {
  return [
    {
      label: "Sheep",
      color: "#e58032",
      points: state.history.map((point) => ({
        x: point.tick,
        y: point.sheep,
      })),
    },
    {
      label: "Wolves",
      color: "currentColor",
      points: state.history.map((point) => ({
        x: point.tick,
        y: point.wolves,
      })),
    },
    ...(state.history.some((point) => point.grassAvailable)
      ? [
          {
            label: "Grass / 4",
            color: "#60ad2c",
            points: state.history
              .filter((point) => point.grassAvailable)
              .map((point) => ({
                x: point.tick,
                y: point.grass / 4,
              })),
          },
        ]
      : []),
  ];
}
