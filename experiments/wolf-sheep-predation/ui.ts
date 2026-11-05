import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: [
    { field: "seed" },
    { field: "mode" },
    { field: "initialSheep" },
    { field: "initialWolves" },
  ],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/WolfSheepPredation",
    label: "Original NetLogo model · Uri Wilensky · CC BY-NC-SA 3.0",
  },
  complete: (state) => state.done,
  live: [
    {
      field: "sheepGain",
      label: "Sheep food gain",
      value: (state) => state.parameters.sheepGain,
      set: (instance, value) => instance.setRules({ sheepGain: Number(value) }),
    },
    {
      field: "wolfGain",
      label: "Wolf food gain",
      value: (state) => state.parameters.wolfGain,
      set: (instance, value) => instance.setRules({ wolfGain: Number(value) }),
    },
    {
      field: "sheepReproduce",
      label: "Sheep reproduction (%)",
      value: (state) => state.parameters.sheepReproduce,
      set: (instance, value) =>
        instance.setRules({ sheepReproduce: Number(value) }),
    },
    {
      field: "wolfReproduce",
      label: "Wolf reproduction (%)",
      value: (state) => state.parameters.wolfReproduce,
      set: (instance, value) =>
        instance.setRules({ wolfReproduce: Number(value) }),
    },
    {
      field: "grassRegrowth",
      label: "Grass regrowth",
      value: (state) => state.parameters.grassRegrowth,
      set: (instance, value) =>
        instance.setRules({ grassRegrowth: Number(value) }),
      enabled: (state) => state.parameters.mode === "sheep-wolves-grass",
    },
  ],
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
      data: (state) => ({
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
            agent.species === "sheep"
              ? ("circle" as const)
              : ("triangle" as const),
          size: agent.species === "sheep" ? 10 : 14,
        })),
      }),
    },
    {
      type: "line",
      label: "Populations",
      series: (state) => [
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
      ],
    },
  ],
});
