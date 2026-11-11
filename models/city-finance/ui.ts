import { defineUI, indexedColor, scientificPalette, type Observation, type SpatialAgent, type SpatialData } from "../../ui/index.ts";
import { model } from "./model.ts";

const conditionColor = indexedColor(55);
const poorColor = indexedColor(15);
const repairedColor = scientificPalette.waiting;
const outlineColor = scientificPalette.neutral;
const cashColor = indexedColor(105);
const backlogColor = indexedColor(25);

export const ui = defineUI(model, {
  setup: [
    { field: "initialCash", label: "Initial cash (CU)" },
    { field: "taxBase", label: "Tax base (CU/year)" },
    { field: "serviceCost", label: "Service cost (CU/year)" },
    { field: "replacementValue", label: "Value of all assets (CU)" },
    { field: "annualWear", label: "Mean wear (condition/year)" },
  ],
  change: (instance, changes) => instance.setPolicy(changes),
  live: {
    maintenanceBudget: { label: "Maintenance budget (CU/year)" },
    repairPriority: { label: "Repair order" },
    taxRate: { label: "Tax rate (fraction)" },
  },
  monitors: [
    { label: "Year", value: state => state.tick },
    { label: "Cash (CU)", value: state => state.cash, format: (value: number) => value.toFixed(0) },
    { label: "Repair backlog (CU)", value: state => state.backlog, format: (value: number) => value.toFixed(0) },
    { label: "Mean condition", value: state => state.meanCondition, format: (value: number) => value.toFixed(3) },
    { label: "Assets below 0.4", value: state => state.poorAssetCount },
    { label: "Maintenance spent (CU, total)", value: state => state.cumulativeMaintenanceSpending, format: (value: number) => value.toFixed(0) },
  ],
  views: [
    { type: "spatial", label: "Asset inventory · green bar = condition (value below) · red outline: below 0.4, repairs cost double · amber bar above: repaired this year (CU spent)", data: inventoryScene },
    { type: "line", label: "Cash and repair backlog", xAxis: { label: "Year" }, yAxis: { unit: "CU" },
      series: state => [
        { label: "Cash", color: cashColor, points: state.history.map(sample => ({ x: sample.tick, y: sample.values.cash! })) },
        { label: "Repair backlog", color: backlogColor, points: state.history.map(sample => ({ x: sample.tick, y: sample.values.backlog! })) },
      ] },
    { type: "line", label: "Mean asset condition", xAxis: { label: "Year" }, yAxis: { label: "Condition", unit: "0–1" },
      series: state => [
        { label: "Mean condition", color: conditionColor, points: state.history.map(sample => ({ x: sample.tick, y: sample.values.meanCondition! })) },
        { label: "Late-repair threshold", color: poorColor, points: state.history.map(sample => ({ x: sample.tick, y: state.lateRepairThreshold })) },
      ] },
    { type: "table", label: "Last year's flows", rows: state => [
      { Flow: "Tax revenue", "CU/year": state.taxRevenue.toFixed(0) },
      { Flow: "Services", "CU/year": state.serviceSpending.toFixed(0) },
      { Flow: "Maintenance", "CU/year": state.maintenanceSpending.toFixed(0) },
      { Flow: "Wear (at normal repair cost)", "CU/year": state.wearValue.toFixed(0) },
    ] },
    { type: "inspector", label: "Selected asset", value: (state, selected) => {
      const asset = state.assets.find(candidate => candidate.id === selected);
      return asset ? { asset: asset.id, condition: asset.condition.toFixed(3), "Wear per year": asset.wearPerYear.toFixed(3),
        "Repaired this year (CU)": asset.repairedThisYear.toFixed(0), "Cost to restore (CU)": asset.repairCost.toFixed(0),
        "Late repair": asset.isPoor ? "Yes, double cost" : "No" } : undefined;
    } },
  ],
});

type State = Observation<typeof model>;
const columns = 6;

function inventoryScene(state: State): SpatialData {
  const agents: SpatialAgent[] = [];
  const labels: { x: number; y: number; text: string }[] = [];
  state.assets.forEach((asset, index) => {
    const x = -3.75 + (index % columns) * 1.5;
    const y = 0.95 - Math.floor(index / columns) * 2.3;
    // Two separate channels: the outline carries the condition state, the amber bar above carries this year's repair.
    agents.push({ id: asset.id, x, y, shape: "rectangle", extent: { width: 1.2, height: 0.8 }, filled: false,
      stroke: asset.isPoor ? poorColor : outlineColor, strokeWidth: asset.isPoor ? 3 : 1.5 });
    if (asset.condition > 0) agents.push({ id: `${asset.id}:condition`, x: x - 0.55 + 0.55 * asset.condition, y,
      shape: "rectangle", extent: { width: 1.1 * asset.condition, height: 0.5 }, color: conditionColor, selectable: false });
    if (asset.repairedThisYear > 0) {
      agents.push({ id: `${asset.id}:repair`, x, y: y + 0.55, shape: "rectangle", extent: { width: 1.2, height: 0.14 },
        color: repairedColor, selectable: false });
      labels.push({ x, y: y + 0.82, text: `+${asset.repairedThisYear.toFixed(0)}` });
    }
    labels.push({ x, y: y - 0.82, text: asset.condition.toFixed(3) });
  });
  labels.push({ x: 0, y: 2.45, text: `Cash ${state.cash.toFixed(0)} CU · backlog ${state.backlog.toFixed(0)} CU` });
  const repaired = state.assets.filter(asset => asset.repairedThisYear > 0);
  return {
    width: 9.4, height: 5.5, agents, labels,
    description: `Year ${state.tick}: mean condition ${state.meanCondition.toFixed(2)}, ${state.poorAssetCount} of 12 assets below 0.4, ${repaired.length} repaired this year (${repaired.map(asset => `${asset.id} ${asset.repairedThisYear.toFixed(0)}`).join(", ") || "none"}), cash ${state.cash.toFixed(0)}, backlog ${state.backlog.toFixed(0)} currency units.`,
  };
}
