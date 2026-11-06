import { defineUI, netLogoColor } from "../../ui/index.ts";
import type { SpatialData } from "../../ui/index.ts";
import { model } from "./model.ts";
import type { TijuanaRead, VisualUpdate } from "./model.ts";

const reported = (value: number | undefined, reason: string | null, digits: number) =>
  value === undefined ? `N/A (${reason})` : value.toFixed(digits);

/** Presentation only: source patch sizes become CSS-pixel symbols, not distances. */
function spatial(state: TijuanaRead): SpatialData {
  return {
    width: state.width,
    height: state.height,
    showLabels: true,
    cells: state.cells.map((cell) => ({
      id: cell.id, x: cell.x, y: cell.y, color: netLogoColor(cell.colorNumber),
    })),
    segments: state.traces.map((trace) => ({
      from: trace.from, to: trace.to,
      color: netLogoColor(trace.colorNumber), width: trace.width,
    })),
    agents: state.agents.filter((agent) => !agent.hidden).map((agent) => ({
      id: agent.id, x: agent.x, y: agent.y, heading: agent.heading,
      color: netLogoColor(agent.colorNumber), size: Math.max(0, agent.size) * 4,
      shape: agent.shape === "default" ? "triangle" as const : "circle" as const,
      label: String(agent.label),
    })),
  };
}

export const ui = defineUI(model, {
  setup: [{ field: "seed" }],
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Curricular%20Models/Urban%20Suite/Urban%20Suite%20-%20Tijuana%20Bordertowns.nlogox",
    label: "Original NetLogo model · Uri Wilensky · CC BY-NC-SA 3.0",
  },
  // The shared GO controls are available only after the source setup phase.
  complete: (state) => !state.setupDone,
  actions: [
    { label: "Clear", run: (instance) => instance.clear() },
    { label: "Cityscape step", enabled: (state) => !state.setupDone,
      run: (instance) => { instance.advanceCityscape(); } },
    { label: "100 cityscape calls", enabled: (state) => !state.setupDone,
      run: (instance) => { instance.advanceCityscape(100); } },
    { label: "Cityscape continue", enabled: (state) => !state.setupDone && state.tick > 0,
      run: (instance) => { instance.advanceCityscape(); },
      repeat: { label: "Keep building", intervalMs: 100 } },
    { label: "Update now", run: (instance) => instance.updateDisplay() },
  ],
  drawing: {
    toggleLabel: "Add node",
    enabled: () => true,
    intent: (instance, intent) => {
      if (intent.phase !== "end") instance.addNode(intent.position);
    },
  },
  live: [
    { field: "maquiladoras", label: "Maquiladoras", value: (s) => s.parameters.maquiladoras,
      set: (m, v) => m.setRules({ maquiladoras: Number(v) }) },
    { field: "serviceCenters", label: "Service centers", value: (s) => s.parameters.serviceCenters,
      set: (m, v) => m.setRules({ serviceCenters: Number(v) }) },
    { field: "migrationTicks", label: "Migration ticks", value: (s) => s.parameters.migrationTicks,
      set: (m, v) => m.setRules({ migrationTicks: Number(v) }) },
    { field: "crossingTicks", label: "Crossing ticks", value: (s) => s.parameters.crossingTicks,
      set: (m, v) => m.setRules({ crossingTicks: Number(v) }) },
    { field: "buildingTicks", label: "Building ticks", value: (s) => s.parameters.buildingTicks,
      set: (m, v) => m.setRules({ buildingTicks: Number(v) }) },
    { field: "initDensity", label: "Initial density", value: (s) => s.parameters.initDensity,
      set: (m, v) => m.setRules({ initDensity: Number(v) }) },
    { field: "coloniaSize", label: "Colonia size", value: (s) => s.parameters.coloniaSize,
      set: (m, v) => m.setRules({ coloniaSize: Number(v) }) },
    { field: "requiredCapital", label: "Required capital", value: (s) => s.parameters.requiredCapital,
      set: (m, v) => m.setRules({ requiredCapital: Number(v) }) },
    { field: "carryingCapacity", label: "Carrying capacity", value: (s) => s.parameters.carryingCapacity,
      set: (m, v) => m.setRules({ carryingCapacity: Number(v) }) },
    { field: "visualUpdate", label: "Visual update", value: (s) => s.parameters.visualUpdate,
      set: (m, v) => m.setRules({ visualUpdate: v as VisualUpdate }) },
    { field: "colorCode", label: "Color code", value: (s) => s.parameters.colorCode,
      set: (m, v) => m.setRules({ colorCode: Boolean(v) }) },
    { field: "cityGrowth", label: "City growth", value: (s) => s.parameters.cityGrowth,
      set: (m, v) => m.setRules({ cityGrowth: Boolean(v) }) },
  ],
  monitors: [
    { label: "Phase", value: (s) => s.phase },
    { label: "Tick", value: (s) => s.tick },
    { label: "Epoch", value: (s) => s.epoch },
    { label: "Services / jobs", value: (s) => `${s.counts.serviceCenters} / ${s.counts.employmentCenters}` },
    { label: "Builders (1 / 2 / 3)", value: (s) => `${s.counts.firstBuilders} / ${s.counts.secondBuilders} / ${s.counts.thirdBuilders}` },
    { label: "Seed migrants", value: (s) => s.seedMigrants },
    { label: "Irregular settlers", value: (s) => s.counts.migrants },
    { label: "Nodes / rings", value: (s) => `${s.counts.nodes} / ${s.counts.rings}` },
    { label: "Values", value: (s) => s.globals.values.toFixed(2) },
    { label: "Weights", value: (s) => s.globals.weights.toFixed(3) },
    { label: "Marginal", value: (s) => s.globals.marginalValue.toFixed(1) },
    { label: "Marginal weight", value: (s) => s.globals.marginalWeight.toFixed(3) },
    { label: "Max cost", value: (s) => s.globals.maxCost },
    { label: "Crossed", value: (s) => s.globals.crossed },
    { label: "Savings", value: (s) => reported(s.reports.savings, s.reports.unavailable.savings, 0) },
    { label: "Savings node", value: (s) => reported(s.reports.savingsNode, s.reports.unavailable.savingsNode, 3) },
    { label: "No water (%)", value: (s) => reported(s.reports.noWaterPercent, s.reports.unavailable.noWaterPercent, 0) },
    { label: "No power (%)", value: (s) => reported(s.reports.noPowerPercent, s.reports.unavailable.noPowerPercent, 0) },
    { label: "Pen segments", value: (s) => s.traces.length },
    { label: "Recorded calls", value: (s) => s.history.length },
    { label: "Last failure", value: (s) => s.lastFailure ? `${s.lastFailure.action}: ${s.lastFailure.code}: ${s.lastFailure.message}` : "None" },
    { label: "Warnings", value: (s) => s.warnings.join("; ") || "None" },
  ],
  views: [
    { type: "inspector", label: "Selected agent or field", value: (state, id) => {
      const item = state.agents.find((agent) => agent.id === id)
        ?? state.cells.find((cell) => cell.id === id);
      return item && Object.fromEntries(Object.entries(item).map(([key, value]) =>
        [key, typeof value === "object" ? JSON.stringify(value) : value]));
    } },
    { type: "spatial", label: "Tijuana", data: spatial },
  ],
});
