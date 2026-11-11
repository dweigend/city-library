import { defineUI, indexedColor, scientificPalette, type Observation, type SpatialAgent, type SpatialData } from "../../ui/index.ts";
import { model } from "./model.ts";

const firmColors = [25, 105, 125, 45, 65, 85, 15, 115, 35, 135].map(indexedColor);
const vacancyColor = scientificPalette.waiting;
const unemployedColor = scientificPalette.unavailable;
const ordersColor = indexedColor(105);
const salesColor = indexedColor(55);
const lostColor = indexedColor(15);

export const ui = defineUI(model, {
  setup: [
    { field: "householdCount", label: "Households" },
    { field: "firmCount", label: "Firms" },
    { field: "wage", label: "Wage (currency/month)" },
    { field: "spendingFraction", label: "Wage share spent locally" },
  ],
  live: {
    externalDemand: { label: "Outside orders (currency/month)", set: (instance, value) => instance.setExternalDemand(value) },
    hiringLimit: { label: "Hires per firm per month", set: (instance, value) => instance.setHiringLimit(value) },
  },
  monitors: [
    { label: "Month", value: state => state.tick },
    { label: "Employed", value: state => state.employedCount },
    { label: "Open vacancies", value: state => state.vacancyCount },
    { label: "Orders / month", value: state => state.orders, format: (value: number) => value.toFixed(0) },
    { label: "Lost orders / month", value: state => state.lostOrders, format: (value: number) => value.toFixed(0) },
    { label: "Lost orders total", value: state => state.cumulativeLostOrders, format: (value: number) => value.toFixed(0) },
  ],
  views: [
    { type: "spatial", label: "Firms and households · filled slots are jobs, amber outlines open vacancies · household color = employer, gray outline = unemployed", data: economyScene },
    { type: "line", label: "Employment and desired jobs · employed drawn on top; where only blue shows, both are equal", xAxis: { label: "Month" }, yAxis: { label: "Jobs" },
      series: state => [
        { label: "Desired jobs", color: indexedColor(25), points: state.history.filter(sample => sample.tick > 0).map(sample => ({ x: sample.tick, y: sample.values.desiredJobCount! })) },
        { label: "Employed", color: ordersColor, points: state.history.map(sample => ({ x: sample.tick, y: sample.values.employedCount! })) },
      ] },
    { type: "bar", label: "Hiring gap · open vacancies (desired − employed) at the end of each month", xAxis: { label: "Month" }, yAxis: { label: "Jobs" },
      series: state => [{ label: "Open vacancies", color: vacancyColor,
        points: state.history.filter(sample => sample.tick > 0).map(sample => ({ x: sample.tick, y: sample.values.vacancyCount! })) }] },
    { type: "line", label: "Orders, sales and lost orders · per completed month (where orders and sales coincide, every order was sold)", xAxis: { label: "Month" }, yAxis: { unit: "currency/month" },
      series: state => [
        monthlySeries(state, "Orders", ordersColor, "orders"),
        monthlySeries(state, "Sales", salesColor, "sales"),
        monthlySeries(state, "Lost orders", lostColor, "lostOrders"),
      ] },
    { type: "inspector", label: "Selected firm or household", value: (state, selected): Record<string, string | number> | undefined => {
      const firm = state.firms.find(candidate => candidate.id === selected);
      if (firm) return { firm: firm.id, "Desired jobs": firm.desiredJobCount, employees: firm.employeeCount, vacancies: firm.vacancyCount,
        "Revenue last month": firm.revenue.toFixed(1), balance: firm.balance.toFixed(1) };
      const household = state.households.find(candidate => candidate.id === selected);
      return household ? { household: household.id, employer: household.employerId ?? "Unemployed", balance: household.balance.toFixed(1) } : undefined;
    } },
  ],
});

type State = Observation<typeof model>;
const householdColumns = 10;

function economyScene(state: State): SpatialData {
  const firmCount = state.firms.length;
  const firmWidth = 10 / firmCount;
  const slotColumns = 5;
  // Fixed per run: room for every household in the most even split, so the canvas never jumps.
  const slotRows = Math.ceil(Math.ceil(state.households.length / firmCount) / slotColumns);
  const firmTop = 2.4;
  const firmHeight = 0.5 + slotRows * 0.32;
  const firmCenter = (index: number) => -5 + firmWidth * (index + 0.5);
  const agents: SpatialAgent[] = [];
  const labels: { x: number; y: number; text: string }[] = [];
  state.firms.forEach((firm, index) => {
    const x = firmCenter(index);
    agents.push({ id: firm.id, x, y: firmTop - firmHeight / 2, shape: "rectangle", extent: { width: firmWidth * 0.9, height: firmHeight },
      filled: false, stroke: firmColors[index % firmColors.length], strokeWidth: 2 });
    labels.push({ x, y: firmTop + 0.25, text: `Firm ${index + 1} · ${firm.employeeCount}/${firm.desiredJobCount}` });
    const slotCount = Math.max(firm.desiredJobCount, firm.employeeCount);
    for (let slot = 0; slot < slotCount; slot += 1) {
      const filled = slot < firm.employeeCount;
      agents.push({ id: `${firm.id}:slot:${slot}`, selectable: false, shape: "rectangle",
        x: x + (slot % slotColumns - (slotColumns - 1) / 2) * 0.32, y: firmTop - 0.4 - Math.floor(slot / slotColumns) * 0.32,
        extent: { width: 0.22, height: 0.22 }, color: firmColors[index % firmColors.length], filled,
        stroke: filled ? undefined : vacancyColor, strokeWidth: filled ? 0 : 1.5 });
    }
  });
  const householdTop = firmTop - firmHeight - 0.8;
  state.households.forEach((household, index) => {
    const x = -4.5 + index % householdColumns;
    const y = householdTop - Math.floor(index / householdColumns) * 0.55;
    const firmIndex = state.firms.findIndex(firm => firm.id === household.employerId);
    const color = firmIndex < 0 ? unemployedColor : firmColors[firmIndex % firmColors.length]!;
    agents.push({ id: household.id, x, y, size: 11, color, filled: firmIndex >= 0, stroke: color, strokeWidth: 1.5 });
  });
  const householdRows = Math.ceil(state.households.length / householdColumns);
  const bottom = householdTop - householdRows * 0.55;
  labels.push({ x: 0, y: bottom - 0.05,
    text: `Outside ${state.parameters.externalDemand} + local ${(state.nextOrders - state.parameters.externalDemand).toFixed(0)} = next orders ${state.nextOrders.toFixed(0)}` });
  const height = firmTop + 0.8 - (bottom - 0.4);
  // Shift everything so the scene is vertically centered.
  const shift = -(firmTop + 0.8 + bottom - 0.4) / 2;
  return {
    width: 10.6, height,
    labels: labels.map(label => ({ ...label, y: label.y + shift })),
    agents: agents.map(agent => ({ ...agent, y: agent.y + shift })),
    description: `Month ${state.tick}: ${state.employedCount} of ${state.households.length} households employed, ${state.vacancyCount} vacancies, orders ${state.orders.toFixed(0)}, lost orders ${state.lostOrders.toFixed(0)}.`,
  };
}

function monthlySeries(state: State, label: string, color: string, key: "orders" | "sales" | "lostOrders") {
  return { label, color, points: state.history.filter(sample => sample.tick > 0).map(sample => ({ x: sample.tick, y: sample.values[key]! })) };
}
