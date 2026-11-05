import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
const colors = { low: "#d94838", middle: "#60ad2c", high: "#355fa5" };
export const ui = defineUI(model, {
  setup: [{ field: "seed" }, { field: "people" }, { field: "bestLand" }],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/WealthDistribution",
    label: "Original NetLogo model · Uri Wilensky · CC BY-NC-SA 3.0",
  },
  live: [
    {
      field: "growthInterval",
      label: "Growth interval",
      value: (state) => state.parameters.growthInterval,
      set: (instance, value) =>
        instance.setRules({ growthInterval: Number(value) }),
    },
    {
      field: "growthAmount",
      label: "Growth amount",
      value: (state) => state.parameters.growthAmount,
      set: (instance, value) =>
        instance.setRules({ growthAmount: Number(value) }),
    },
    {
      field: "maxVision",
      label: "Maximum vision",
      value: (state) => state.parameters.maxVision,
      set: (instance, value) => instance.setRules({ maxVision: Number(value) }),
    },
    {
      field: "metabolismMax",
      label: "Maximum metabolism",
      value: (state) => state.parameters.metabolismMax,
      set: (instance, value) =>
        instance.setRules({ metabolismMax: Number(value) }),
    },
    {
      field: "minLife",
      label: "Minimum life",
      value: (state) => state.parameters.minLife,
      set: (instance, value) => instance.setRules({ minLife: Number(value) }),
    },
    {
      field: "maxLife",
      label: "Maximum life",
      value: (state) => state.parameters.maxLife,
      set: (instance, value) => instance.setRules({ maxLife: Number(value) }),
    },
  ],
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    { label: "People", value: (state) => state.peopleCount },
    { label: "Total wealth", value: (state) => state.totalWealth },
    { label: "Gini", value: (state) => state.gini.toFixed(3) },
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
      label: "Resources and wealth classes",
      data: (state) => ({
        width: state.width,
        height: state.height,
        cells: state.cells.map((cell) => ({
          id: cell.id,
          x: cell.x,
          y: cell.y,
          color: `rgb(${Math.round((cell.grain / 50) * 255)},${Math.round((cell.grain / 50) * 255)},0)`,
        })),
        agents: state.agents.map((agent) => ({
          id: agent.id,
          x: agent.x,
          y: agent.y,
          heading: agent.heading,
          color: colors[agent.class],
          shape: "triangle" as const,
          size: 8,
        })),
      }),
    },
    {
      type: "bar",
      label: "Current wealth classes",
      series: (state) => [
        {
          label: "People · low / middle / high",
          color: "#355fa5",
          points: [
            { x: 0, y: state.classes.low },
            { x: 1, y: state.classes.middle },
            { x: 2, y: state.classes.high },
          ],
        },
      ],
    },
    {
      type: "line",
      label: "Wealth classes",
      series: (state) =>
        (["low", "middle", "high"] as const).map((key) => ({
          label: key,
          color: colors[key],
          points: state.history.map((point) => ({
            x: point.tick,
            y: point[key],
          })),
        })),
    },
    {
      type: "line",
      label: "Lorenz curve (%)",
      series: (state) => [
        { label: "Wealth", color: "#d94838", points: state.lorenz },
        {
          label: "Equality",
          color: "currentColor",
          points: [
            { x: 0, y: 0 },
            { x: 100, y: 100 },
          ],
        },
      ],
    },
    {
      type: "line",
      label: "Gini index",
      series: (state) => [
        {
          label: "Gini",
          color: "#355fa5",
          points: state.history.map((point) => ({
            x: point.tick,
            y: point.gini,
          })),
        },
      ],
    },
  ],
});
