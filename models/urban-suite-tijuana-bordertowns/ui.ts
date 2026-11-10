import { defineUI, indexedColor, type Observation, type SpatialData } from "../../ui/index.ts";

import { model, type TijuanaRead } from "./model.ts";

export const ui = defineUI(model, {
  setup: ["seed"],
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Curricular%20Models/Urban%20Suite/Urban%20Suite%20-%20Tijuana%20Bordertowns.nlogox",
    label: "Source attribution · Uri Wilensky · CC BY-NC-SA 3.0",
  },
  // The shared GO controls are available only after the source setup phase.
  complete: (state) => !state.setupDone,
  actions: [
    { label: "Clear", run: (instance) => instance.clear() },
    {
      label: "Cityscape step",
      enabled: (state) => !state.setupDone,
      run: (instance) => {
        instance.advanceCityscape();
      },
    },
    {
      label: "100 cityscape steps",
      enabled: (state) => !state.setupDone,
      run: (instance) => {
        instance.advanceCityscape(100);
      },
    },
    { label: "Update now", run: (instance) => instance.updateDisplay() },
  ],
  drawing: {
    toggleLabel: "Add node",
    enabled: () => true,
    intent: (instance, intent) => {
      if (intent.phase !== "end") instance.addNode(intent.position);
    },
  },
  change: (instance, changes) => instance.setRules(changes),
  live: {
    maquiladoras: {},
    serviceCenters: {},
    migrationTicks: {},
    crossingTicks: {},
    buildingTicks: {},
    initDensity: {
      label: "Initial density",
    },
    coloniaSize: {},
    requiredCapital: {},
    carryingCapacity: {},
    visualUpdate: {},
    colorCode: {},
    cityGrowth: {},
  },
  // The ten source monitors, plus phase and tick to show where the staged flow stands.
  monitors: [
    { label: "Phase", value: (s) => s.phase },
    { label: "Tick", value: (s) => s.tick },
    {
      label: "Values",
      value: (s) => s.globals.values,
      format: (value: number) => value.toFixed(2),
    },
    {
      label: "Weights",
      value: (s) => s.globals.weights,
      format: (value: number) => value.toFixed(3),
    },
    {
      label: "Marginal",
      value: (s) => s.globals.marginalValue,
      format: (value: number) => value.toFixed(1),
    },
    { label: "Crossed", value: (s) => s.globals.crossed },
    { label: "Irregular settlers", value: (s) => s.counts.migrants },
    {
      label: "Builders (1 / 2 / 3)",
      value: (s) =>
        `${s.counts.firstBuilders} / ${s.counts.secondBuilders} / ${s.counts.thirdBuilders}`,
    },
    {
      label: "Savings",
      value: (s) =>
        reportValue(s.reports.savings, s.reports.unavailable.savings),
      format: (value: number | string) =>
        typeof value === "number" ? value.toFixed(0) : value,
    },
    {
      label: "Savings node",
      value: (s) =>
        reportValue(s.reports.savingsNode, s.reports.unavailable.savingsNode),
      format: (value: number | string) =>
        typeof value === "number" ? value.toFixed(3) : value,
    },
    {
      label: "No water (%)",
      value: (s) =>
        reportValue(s.reports.noWaterPercent, s.reports.unavailable.noWaterPercent),
      format: (value: number | string) =>
        typeof value === "number" ? value.toFixed(0) : value,
    },
    {
      label: "No power (%)",
      value: (s) =>
        reportValue(s.reports.noPowerPercent, s.reports.unavailable.noPowerPercent),
      format: (value: number | string) =>
        typeof value === "number" ? value.toFixed(0) : value,
    },
    {
      label: "Notice",
      value: (s) =>
        s.lastFailure
          ? `${s.lastFailure.action}: ${s.lastFailure.message}`
          : s.warnings.join("; ") || "None",
    },
  ],
  views: [
    {
      type: "inspector",
      label: "Selected agent or field",
      value: selectedAgentOrFieldInspector,
    },
    { type: "spatial", label: "Tijuana", data: spatial },
  ],
});

type UIObservation = Observation<typeof model>;

function selectedAgentOrFieldInspector(
  state: UIObservation,
  id: string | null,
): Readonly<Record<string, string | number | boolean>> | undefined {
  const item =
    state.agents.find((agent) => agent.id === id) ??
    state.cells.find((cell) => cell.id === id);
  return (
    item &&
    Object.fromEntries(
      Object.entries(item).map(([key, value]) => [
        key,
        typeof value === "object" ? JSON.stringify(value) : value,
      ]),
    )
  );
}

/** Presentation only: source patch sizes become CSS-pixel symbols, not distances. */
function spatial(state: TijuanaRead): SpatialData {
  return {
    width: state.width,
    height: state.height,
    showLabels: true,
    cells: state.cells.map((cell) => ({
      id: cell.id,
      x: cell.x,
      y: cell.y,
      color: indexedColor(cell.colorNumber),
    })),
    segments: state.traces.map((trace) => ({
      from: trace.from,
      to: trace.to,
      color: indexedColor(trace.colorNumber),
      width: trace.width,
    })),
    agents: state.agents
      .filter((agent) => !agent.hidden)
      .map((agent) => ({
        id: agent.id,
        x: agent.x,
        y: agent.y,
        heading: agent.heading,
        color: indexedColor(agent.colorNumber),
        size: Math.max(0, agent.size) * 4,
        shape:
          agent.shape === "default"
            ? ("triangle" as const)
            : ("circle" as const),
        label: String(agent.label),
      })),
  };
}

/** Source reporters are undefined over empty groups; say so in plain words. */
const reportValue = (
  value: number | undefined,
  reason: string | null,
) => {
  if (value !== undefined) return value;
  return reason === "empty-subset" ? "None yet" : "N/A";
};
