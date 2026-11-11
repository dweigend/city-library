import { defineUI, indexedColor, scientificPalette, type Observation, type SpatialAgent, type SpatialData, type SpatialSegment } from "../../ui/index.ts";
import { model } from "./model.ts";

const colors = {
  demand: scientificPalette.neutral,
  renewable: indexedColor(45),
  battery: indexedColor(65),
  grid: indexedColor(105),
  curtailed: indexedColor(5),
  unmet: indexedColor(15),
  heat: indexedColor(25),
};

export const ui = defineUI(model, {
  setup: [
    { field: "solarCapacityKw", label: "Solar capacity (kW)" },
    { field: "windOutputKw", label: "Wind output (kW)" },
    { field: "batteryCapacityKwh", label: "Battery capacity (kWh)" },
    { field: "initialBatteryKwh", label: "Initial battery energy (kWh)" },
    { field: "batteryPowerKw", label: "Battery power (kW)" },
    { field: "demandScale", label: "Demand scale (×)" },
  ],
  live: {
    flexibleShare: { label: "Evening demand moved to midday (share)", set: (instance, value) => instance.setFlexibleShare(value) },
    electricityNetworkCapacityKw: { label: "Power import limit (kW)", set: (instance, value) => instance.setNetworkCapacity({ electricityNetworkCapacityKw: value }) },
    heatNetworkCapacityKw: { label: "Heat network (kW)", set: (instance, value) => instance.setNetworkCapacity({ heatNetworkCapacityKw: value }) },
  },
  monitors: [
    { label: "Clock", value: state => state.intervalHour === null ? "Setup" : `Day ${Math.floor((state.tick - 1) / 24) + 1} · ${String(state.intervalHour).padStart(2, "0")}:00–${String(state.intervalHour + 1).padStart(2, "0")}:00` },
    { label: "Stored at end of hour (kWh)", value: state => state.batteryKwh, format: (value: number) => value.toFixed(1) },
    { label: "Unmet today (kWh)", value: state => state.today.unmetKwh, format: (value: number) => value.toFixed(1) },
    { label: "Curtailed today (kWh)", value: state => state.today.curtailedKwh, format: (value: number) => value.toFixed(1) },
    { label: "Unmet last full day (kWh)", value: state => state.lastDay.unmetKwh, format: (value: number) => value.toFixed(1) },
  ],
  views: [
    { type: "spatial", label: "Energy in the last completed hour (kWh) · numbers on lines = energy moved · line width ∝ energy, capped at 12 kWh · battery bar = stored energy at hour end", data: flowScene },
    { type: "table", label: "Electricity balance of the last completed hour (kWh)", rows: balanceRows },
    { type: "line", label: "Hourly electricity · energy in each completed hour", xAxis: { label: "Hour ending", unit: "h" }, yAxis: { unit: "kWh" },
      series: state => [
        hourlySeries(state, "Demand", indexedColor(5), sample => sample.electricityDemandKwh!),
        hourlySeries(state, "Solar + wind", colors.renewable, sample => sample.renewableKwh!),
        hourlySeries(state, "Battery out", colors.battery, sample => sample.batteryDischargeKwh!),
        hourlySeries(state, "Import", colors.grid, sample => sample.electricityNetworkKwh!),
      ] },
    { type: "bar", label: "Battery charge (+) and discharge (−) in each completed hour", xAxis: { label: "Hour ending", unit: "h" }, yAxis: { unit: "kWh" },
      series: state => [
        hourlySeries(state, "Charge", colors.renewable, sample => sample.batteryChargeKwh!),
        hourlySeries(state, "Discharge", colors.battery, sample => -sample.batteryDischargeKwh!),
      ] },
    { type: "line", label: "Battery stored energy · stock at the end of each hour", xAxis: { label: "Time", unit: "h" }, yAxis: { unit: "kWh" },
      series: state => [{ label: "Stored", color: colors.battery, points: state.history.map(sample => ({ x: sample.tick, y: sample.values.batteryKwh! })) }] },
    { type: "bar", label: "Daily electricity totals", xAxis: { label: "Day" }, yAxis: { unit: "kWh" },
      series: state => [
        { label: "Unmet", color: colors.unmet, points: [{ x: "Last full day", y: state.lastDay.unmetKwh }, { x: "Today so far", y: state.today.unmetKwh }] },
        { label: "Curtailed", color: colors.curtailed, points: [{ x: "Last full day", y: state.lastDay.curtailedKwh }, { x: "Today so far", y: state.today.curtailedKwh }] },
        { label: "Import", color: colors.grid, points: [{ x: "Last full day", y: state.lastDay.importKwh }, { x: "Today so far", y: state.today.importKwh }] },
      ] },
  ],
});

type State = Observation<typeof model>;
type Point = { x: number; y: number };
const widthCapKwh = 12;
const maximumWidth = 8;
const boxWidth = 1.8;
const boxHeight = 0.6;
// Sources left, uses right; heat is a separate row with its own network.
const places: Record<string, Point> = {
  renewables: { x: -3.6, y: 2.4 }, battery: { x: -3.6, y: 0.7 }, grid: { x: -3.6, y: -1.35 },
  curtailed: { x: 2.3, y: 2.4 }, homes: { x: 2.3, y: 0.7 }, unmet: { x: 2.3, y: -1.35 },
  heatNetwork: { x: -3.6, y: -2.9 }, heatDemand: { x: 0.9, y: -2.9 }, heatShort: { x: 3.0, y: -2.9 },
};
const names: Record<string, string> = {
  renewables: "Solar + wind", battery: "Battery", grid: "Import", curtailed: "Curtailed", homes: "Demand", unmet: "Unmet",
  heatNetwork: "Heat network", heatDemand: "Heat need", heatShort: "Short",
};

function flowScene(state: State): SpatialData {
  const flow = state.flow;
  const kwh = (value: number) => value.toFixed(1);
  const direct = flow.renewableKwh - flow.batteryChargeKwh - flow.curtailedKwh;
  // [from, to, energy, color, share of the way along the line where its number sits]
  const arrows: [string, string, number, string, number][] = [
    ["renewables", "homes", direct, colors.renewable, 0.3],
    ["renewables", "battery", flow.batteryChargeKwh, colors.renewable, 0.5],
    ["renewables", "curtailed", flow.curtailedKwh, colors.curtailed, 0.5],
    ["battery", "homes", flow.batteryDischargeKwh, colors.battery, 0.5],
    ["grid", "homes", flow.electricityNetworkKwh, colors.grid, 0.3],
    ["heatNetwork", "heatDemand", flow.heatNetworkKwh, colors.heat, 0.5],
  ];
  const visible = arrows.filter(([, , energy]) => energy > 1e-9);
  const segments: SpatialSegment[] = visible.map(([from, to, energy, color]) => ({
    from: edge(places[from]!, places[to]!), to: edge(places[to]!, places[from]!), color,
    width: 1 + (maximumWidth - 1) * Math.min(1, energy / widthCapKwh),
  }));
  const box = (id: string, color: string, filled = false): SpatialAgent => ({
    id, ...places[id]!, shape: "rectangle", extent: { width: boxWidth, height: boxHeight }, color, filled, stroke: color, strokeWidth: 2, selectable: false,
  });
  const agents: SpatialAgent[] = [
    box("renewables", colors.renewable), box("battery", colors.battery), box("grid", colors.grid),
    box("homes", colors.demand), box("curtailed", colors.curtailed),
    box("unmet", colors.unmet, flow.electricityUnmetKwh > 1e-9), box("heatNetwork", colors.heat),
    box("heatDemand", colors.heat), box("heatShort", colors.unmet, flow.heatUnmetKwh > 1e-9),
  ];
  // Stored energy is a stock: a bar along the bottom of the battery box, separate from the hour's flows.
  const fill = state.parameters.batteryCapacityKwh === 0 ? 0 : state.batteryKwh / state.parameters.batteryCapacityKwh;
  const battery = places.battery!;
  if (fill > 0) agents.push({ id: "battery:fill", x: battery.x - boxWidth / 2 + boxWidth * fill / 2, y: battery.y - boxHeight / 2 - 0.12, shape: "rectangle",
    extent: { width: boxWidth * fill, height: 0.12 }, color: colors.battery, selectable: false });
  const heatShort = places.heatShort!;
  const labels = [
    // Names above the boxes, the hour's amount inside.
    ...Object.entries(names).map(([id, name]) => ({ x: places[id]!.x + (id === "battery" ? 1.45 : 0), y: places[id]!.y + boxHeight / 2 + 0.25, text: name })),
    { ...places.renewables!, text: kwh(flow.renewableKwh) },
    { ...places.grid!, text: kwh(flow.electricityNetworkKwh) },
    { ...places.homes!, text: kwh(flow.electricityDemandKwh) },
    { ...places.curtailed!, text: kwh(flow.curtailedKwh) },
    { ...places.unmet!, text: kwh(flow.electricityUnmetKwh) },
    { ...places.heatNetwork!, text: kwh(flow.heatNetworkKwh) },
    { ...places.heatDemand!, text: kwh(flow.heatDemandKwh) },
    { ...heatShort, text: kwh(flow.heatUnmetKwh) },
    { ...battery, text: `${netBattery(flow)}` },
    { x: battery.x, y: battery.y - boxHeight / 2 - 0.4, text: `stored ${kwh(state.batteryKwh)}/${kwh(state.parameters.batteryCapacityKwh)}` },
    ...visible.map(([from, to, energy, , share]) => {
      const start = edge(places[from]!, places[to]!);
      const end = edge(places[to]!, places[from]!);
      // Numbers sit above a sloped or horizontal line and beside a vertical one.
      const vertical = Math.abs(end.x - start.x) < 1e-9;
      return { x: start.x + (end.x - start.x) * share + (vertical ? 0.9 : 0), y: start.y + (end.y - start.y) * share + (vertical ? 0.2 : 0.35), text: kwh(energy) };
    }),
  ];
  return {
    width: 10.6, height: 7.2, agents, segments, labels,
    description: state.intervalHour === null ? "Setup: no hour completed yet." :
      `Hour ${state.intervalHour}: demand ${kwh(flow.electricityDemandKwh)} kWh = solar and wind used directly ${kwh(direct)} + battery out ${kwh(flow.batteryDischargeKwh)} + import ${kwh(flow.electricityNetworkKwh)} + unmet ${kwh(flow.electricityUnmetKwh)}. Battery in ${kwh(flow.batteryChargeKwh)}, curtailed ${kwh(flow.curtailedKwh)}, stored ${kwh(state.batteryKwh)} kWh at hour end. Heat demand ${kwh(flow.heatDemandKwh)} = network ${kwh(flow.heatNetworkKwh)} + short ${kwh(flow.heatUnmetKwh)}.`,
  };
}

/** Battery flow of the hour: energy in (charging) or out (discharging). */
function netBattery(flow: State["flow"]) {
  const net = flow.batteryChargeKwh - flow.batteryDischargeKwh;
  return Math.abs(net) < 0.05 ? "0.0" : `${net > 0 ? "in" : "out"} ${Math.abs(net).toFixed(1)}`;
}

/** Electricity in and out of the neighborhood in the last hour; unmet demand closes the balance. */
function balanceRows(state: State) {
  const flow = state.flow;
  const kwh = (value: number) => value.toFixed(1);
  return [
    { Side: "In", Flow: "Solar + wind", kWh: kwh(flow.renewableKwh) },
    { Side: "In", Flow: "Battery out", kWh: kwh(flow.batteryDischargeKwh) },
    { Side: "In", Flow: "Import", kWh: kwh(flow.electricityNetworkKwh) },
    { Side: "In", Flow: "Unmet (shortfall)", kWh: kwh(flow.electricityUnmetKwh) },
    { Side: "Out", Flow: "Demand", kWh: kwh(flow.electricityDemandKwh) },
    { Side: "Out", Flow: "Battery in", kWh: kwh(flow.batteryChargeKwh) },
    { Side: "Out", Flow: "Curtailed", kWh: kwh(flow.curtailedKwh) },
    { Side: "Check", Flow: "In − out", kWh: Math.abs(flow.electricityBalanceKwh) < 1e-6 ? "0.0" : flow.electricityBalanceKwh.toExponential(1) },
  ];
}

/** Start an arrow at the edge of its box rather than its center. */
function edge(from: Point, to: Point): Point {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const scale = Math.min(boxWidth / 2 / Math.max(Math.abs(dx), 1e-9), boxHeight / 2 / Math.max(Math.abs(dy), 1e-9));
  return { x: from.x + dx * scale, y: from.y + dy * scale };
}

type Values = Readonly<Record<string, number | undefined>>;
function hourlySeries(state: State, label: string, color: string, value: (values: Values) => number) {
  return { label, color, points: state.history.filter(sample => sample.tick > 0).map(sample => ({ x: sample.tick, y: value(sample.values) })) };
}
