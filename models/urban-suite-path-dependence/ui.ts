import {
  defineUI,
  indexedColor,
  type Observation,
  type SpatialData,
  type BarSeries,
} from "../../ui/index.ts";

import { model } from "./model.ts";

export const ui = defineUI(model, {
  setup: [
    "seed",
    "initialFirmCount",
    { field: "distribute", label: "Distribute firms" },
  ],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/UrbanSuite-PathDependence",
    label: "Source attribution · Rand and Wilensky · CC BY-NC-SA 3.0",
  },
  actions: [{ label: "Disturb", run: (instance) => instance.disturb() }],
  change: (instance, changes) => instance.setRules(changes),
  live: {
    regionSize: {
      label: "Region radius",
    },
    increasingReturns: {},
    attemptCount: {
      label: "Search attempts",
    },
    birth: {},
  },
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    { label: "Firms", value: (state) => state.counts.firmCount },
    { label: "Settled", value: (state) => state.counts.settledFirmCount },
    { label: "Searching", value: (state) => state.counts.searchingFirmCount },
    {
      label: "Largest regional population",
      value: (state) => state.largestFirmCount,
    },
    {
      label: "Maximum cell occupancy",
      value: (state) => state.maxOccupantCount,
    },
    {
      label: "Setup warning",
      value: (state) => state.warnings.join(" ") || "—",
    },
  ],
  views: [
    {
      type: "inspector",
      label: "Selected",
      value: (state, id) =>
        state.firms.find((firm) => firm.id === id) ??
        state.cells.find((cell) => cell.id === id),
    },
    {
      type: "spatial",
      label: "Firms and field quality",
      data: firmsAndFieldQualityData,
    },
    {
      type: "bar",
      label: "Residents · occupied fields by occupant count",
      series: residentsOccupiedFieldsByOccupantCountSeries,
    },
  ],
});

type UIObservation = Observation<typeof model>;

function firmsAndFieldQualityData(state: UIObservation): SpatialData {
  return {
    width: state.width,
    height: state.height,
    cells: state.cells.map((cell) => ({
      id: cell.id,
      x: cell.x,
      y: cell.y,
      color: indexedColor(cell.quality * 10 + 50),
    })),
    // Fixed symbols and numeric inspection replace the source's relative-size glyphs.
    agents: state.firms.map((firm) => ({
      ...firm,
      color: "#d73229",
      size: 8,
      shape: "circle" as const,
    })),
  };
}

function residentsOccupiedFieldsByOccupantCountSeries(
  state: UIObservation,
): readonly BarSeries[] {
  return [
    {
      label: "Occupied fields",
      points: state.histogram.counts.map((count, index) => ({
        x:
          (state.histogram.edges[index]! + state.histogram.edges[index + 1]!) /
          2,
        y: count,
      })),
    },
  ];
}
