import {
  defineUI,
  type Observation,
  type SpatialData,
  type Series,
  type BarSeries,
} from "../../ui/index.ts";

import { model } from "./model.ts";
const colors = {
  cutter: "#2466b9",
  stitcher: "#c33c34",
  finisher: "#338640",
  storage: "#a342a3",
  "robot-room": "#c9a52c",
  "loading-dock": "#333333",
  robot: "#777777",
  order: "#d19845",
};
export const ui = defineUI(model, {
  setup: ["seed", { field: "numberOfRobots", label: "Robots" }],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/RoboticFactory",
    label:
      "Original NetLogo model \u00B7 Martin and Wilensky \u00B7 CC BY-NC-SA 3.0",
  },
  change: (instance, changes) => instance.setParameters(changes),
  live: {
    fullCharge: {},
    justInTimeSupplyRobot: {
      label: "Dispatch charge",
    },
    showAgentName: {
      label: "Agent names",
    },
    makeTrails: {
      label: "Trails",
    },
  },
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "New sheets", value: (s) => s.newSheets },
    { label: "Products ready", value: (s) => s.productsReady },
    {
      label: "Idle / tick",
      value: (s) => s.idlePerTick,
      format: (value: number) => value.toFixed(3),
    },
    { label: "Diagnostic", value: (s) => s.diagnostic ?? "\u2014" },
  ],
  views: [
    {
      type: "spatial",
      label: "Factory floor",
      data: factoryFloorData,
    },
    {
      type: "line",
      label: "Idle time",
      series: (s) => [
        {
          label: "Sum idle / tick",
          points: s.history
            .filter((p) => p.tick > 0)
            .map((p) => ({ x: p.tick, y: p.idle })),
        },
      ],
    },
    {
      type: "line",
      label: "Outstanding orders",
      series: outstandingOrdersSeries,
    },
    {
      type: "bar",
      label: "Robot energy",
      series: robotEnergySeries,
    },
    {
      type: "line",
      label: "Supply of machines",
      series: supplyOfMachinesSeries,
    },
    {
      type: "table",
      label: "Robots",
      rows: (s) =>
        s.robots.map((r) => ({
          id: r.id,
          energy: r.energy,
          product: r.product,
          destination: r.destination ?? "nobody",
          idle: r.idleness,
        })),
    },
  ],
});

type UIObservation = Observation<typeof model>;

function factoryFloorData(s: UIObservation): SpatialData {
  return {
    width: 33,
    height: 33,
    showLabels: s.parameters.showAgentName,
    agents: [...s.machines, ...s.robots, ...s.orders].map((a) => ({
      ...a,
      id: String(a.id),
      color: colors[a.kind],
      size: a.kind === "robot" ? 9 : 13,
      label: a.label,
      shape: a.kind === "robot" ? ("triangle" as const) : ("circle" as const),
    })),
    segments: s.trails.map((t) => ({ ...t, color: "#5b7e9e", width: 1 })),
  };
}

function outstandingOrdersSeries(s: UIObservation): readonly Series[] {
  return [
    {
      label: "Total",
      points: s.history.map((p) => ({ x: p.tick, y: p.orders })),
    },
    {
      label: "Deluxe",
      points: s.history.map((p) => ({ x: p.tick, y: p.deluxe })),
    },
    {
      label: "Standard",
      points: s.history.map((p) => ({ x: p.tick, y: p.standard })),
    },
  ];
}

function robotEnergySeries(s: UIObservation): readonly BarSeries[] {
  return [
    {
      label: "Robots",
      points: s.energyHistogram.counts.map((count, i) => ({
        x: s.energyHistogram.edges[i]!,
        y: count,
      })),
    },
    {
      label: "Below zero",
      points: [{ x: -50, y: s.energyHistogram.underflow }],
    },
    {
      label: "Above 600",
      points: [{ x: 650, y: s.energyHistogram.overflow }],
    },
  ];
}

function supplyOfMachinesSeries(s: UIObservation): readonly Series[] {
  return [
    {
      label: "Finishers",
      points: s.history.map((p) => ({ x: p.tick, y: p.finishers })),
    },
    {
      label: "Cutters",
      points: s.history.map((p) => ({ x: p.tick, y: p.cutters })),
    },
    {
      label: "Stitchers",
      points: s.history.map((p) => ({ x: p.tick, y: p.stitchers })),
    },
    {
      label: "Loading dock",
      points: s.history.map((p) => ({ x: p.tick, y: p.dock })),
    },
  ];
}
