import {
  defineUI,
  netLogoColor,
  type SpatialData,
  type Series,
} from "../../ui/index.ts";

import { model } from "./model.ts";

export const ui = defineUI(model, {
  setup: ["seed"],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/UrbanSuite-EconomicDisparity",
    label: "Original NetLogo model · Felsen and Wilensky · CC BY-NC-SA 3.0",
  },
  actions: [
    {
      label: "Quality",
      run: (instance) => instance.setViewMode("quality"),
      pressed: (state) => state.viewMode === "quality",
    },
    {
      label: "Price",
      run: (instance) => instance.setViewMode("price"),
      pressed: (state) => state.viewMode === "price",
    },
    {
      label: "Distance",
      run: (instance) => instance.setViewMode("dist"),
      pressed: (state) => state.viewMode === "dist",
    },
    {
      label: "Poor utility",
      run: (instance) => instance.setViewMode("poor-utility"),
      pressed: (state) => state.viewMode === "poor-utility",
    },
    {
      label: "Rich utility",
      run: (instance) => instance.setViewMode("rich-utility"),
      pressed: (state) => state.viewMode === "rich-utility",
    },
  ],
  live: {
    numberOfTests: {
      label: "Location tests",
      set: (instance, value) => instance.setRules({ numberOfTests: value }),
    },
    residentsPerJob: {
      set: (instance, value) => instance.setRules({ residentsPerJob: value }),
    },
    poorPerStep: {
      label: "Poor births per step",
      set: (instance, value) => instance.setRules({ poorPerStep: value }),
    },
    richPerStep: {
      label: "Rich births per step",
      set: (instance, value) => instance.setRules({ richPerStep: value }),
    },
    poorPricePriority: {
      set: (instance, value) => instance.setRules({ poorPricePriority: value }),
    },
    richQualityPriority: {
      set: (instance, value) =>
        instance.setRules({ richQualityPriority: value }),
    },
    maxJobs: {
      label: "Maximum jobs",
      set: (instance, value) => instance.setRules({ maxJobs: value }),
    },
    deathRate: {
      label: "Oldest residents removed",
      set: (instance, value) => instance.setRules({ deathRate: value }),
    },
  },
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    { label: "Rich", value: (state) => state.counts.rich },
    { label: "Poor", value: (state) => state.counts.poor },
    { label: "Jobs", value: (state) => state.counts.jobs },
    { label: "Counter", value: (state) => state.counter },
    {
      label: "Rich median",
      value: (state) => state.medianTravelDistance.rich?.toPrecision(6) ?? "—",
    },
    {
      label: "Poor median",
      value: (state) => state.medianTravelDistance.poor?.toPrecision(6) ?? "—",
    },
    { label: "View", value: (state) => state.viewMode },
  ],
  views: [
    {
      type: "inspector",
      label: "Selected",
      value: (state, id) =>
        state.agents.find((agent) => agent.id === id) ??
        state.cells.find((cell) => cell.id === id),
    },
    {
      type: "spatial",
      label: "Residents, jobs and land",
      data: residentsJobsAndLandData,
    },
    {
      type: "line",
      label: "Median travel distance · actual nearest job",
      series: medianTravelDistanceActualNearestJobSeries,
    },
  ],
});

type UIObservation = ReturnType<ReturnType<typeof model.create>["read"]>;

function residentsJobsAndLandData(state: UIObservation): SpatialData {
  return {
    width: state.width,
    height: state.height,
    cells: state.cells.map((cell) => ({
      id: cell.id,
      x: cell.x,
      y: cell.y,
      color: netLogoColor(cell.colorNumber),
    })),
    agents: state.agents.map((agent) => ({
      ...agent,
      color:
        agent.kind === "job"
          ? "#d73229"
          : agent.kind === "rich"
            ? "#ffffff"
            : "#000000",
      size: agent.kind === "job" ? 9 : 6,
      shape: "circle" as const,
    })),
  };
}

function medianTravelDistanceActualNearestJobSeries(
  state: UIObservation,
): readonly Series[] {
  return [
    {
      label: "Rich",
      points: state.history
        .filter((point) => point.richMedianTravelDistance !== undefined)
        .map((point) => ({
          x: point.tick,
          y: point.richMedianTravelDistance!,
        })),
    },
    {
      label: "Poor",
      points: state.history
        .filter((point) => point.poorMedianTravelDistance !== undefined)
        .map((point) => ({
          x: point.tick,
          y: point.poorMedianTravelDistance!,
        })),
    },
  ];
}
