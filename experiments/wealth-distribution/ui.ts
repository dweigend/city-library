import {
  defineUI,
  type Observation,
  type SpatialData,
  type SpatialAgent,
  type BarSeries,
} from "../../ui/index.ts";

import { model } from "./model.ts";
const colors = { low: "#d94838", middle: "#60ad2c", high: "#355fa5" };
export const ui = defineUI(model, {
  setup: ["seed", "people", "bestLand"],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/WealthDistribution",
    label: "Original NetLogo model · Uri Wilensky · CC BY-NC-SA 3.0",
  },
  change: (instance, changes) => instance.setRules(changes),
  live: {
    growthInterval: {},
    growthAmount: {},
    maxVision: {
      label: "Maximum vision",
    },
    metabolismMax: {
      label: "Maximum metabolism",
    },
    minLife: {
      label: "Minimum life",
    },
    maxLife: {
      label: "Maximum life",
    },
  },
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    { label: "People", value: (state) => state.peopleCount },
    { label: "Total wealth", value: (state) => state.totalWealth },
    {
      label: "Gini",
      value: (state) => state.gini,
      format: (value: number) => value.toFixed(3),
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
      label: "Resources and wealth classes",
      data: resourcesAndWealthClassesData,
    },
    {
      type: "bar",
      label: "Current wealth classes",
      xAxis: { label: "Wealth class" },
      yAxis: { label: "People" },
      series: wealthClassSeries,
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

type UIObservation = Observation<typeof model>;

function resourcesAndWealthClassesData(state: UIObservation): SpatialData {
  return {
    width: state.width,
    height: state.height,
    cells: state.cells.map((cell) => ({
      id: cell.id,
      x: cell.x,
      y: cell.y,
      color: grainColor(cell.grain),
    })),
    agents: state.agents.map((agent): SpatialAgent => ({
      id: agent.id,
      x: agent.x,
      y: agent.y,
      heading: agent.heading,
      color: colors[agent.class],
      shape: "triangle",
      size: 8,
    })),
  };
}

function wealthClassSeries(state: UIObservation): readonly BarSeries[] {
  return [
    {
      label: "People",
      color: "#355fa5",
      points: [
        { x: "Low", y: state.classes.low },
        { x: "Middle", y: state.classes.middle },
        { x: "High", y: state.classes.high },
      ],
    },
  ];
}

function grainColor(grain: number): string {
  const channel = Math.round((grain / 50) * 255);
  return `rgb(${channel},${channel},0)`;
}
