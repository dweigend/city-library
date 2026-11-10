import { defineUI, indexedColor, type Observation, type SpatialData } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  monitors: [{ label: "Hour", value: state => state.tick }, { label: "Stored (kWh)", value: state => state.energyKwh },
    { label: "Grid import (kWh)", value: state => state.importedKwh }, { label: "Reserve crossings", value: state => state.reserveCrossingCount },
    { label: "Last crossing (h)", value: state => state.lastCrossingHour },
    { label: "Flow interval", value: state => state.tick === 0 ? "Initial rates" : `${state.tick - 1}–${state.tick} h` }],
  views: [
    { type: "spatial", label: "Battery and hourly flows · fill rounded to 0.25 kWh", data: microgridData },
    { type: "line", label: "Stored energy", xAxis: { unit: "h" }, yAxis: { unit: "kWh" },
      series: state => [{ label: "Battery", points: state.history.map(sample => ({ x: sample.tick, y: sample.values.energyKwh! })) }] },
  ],
});

type State = Observation<typeof model>;
const BATTERY_BLOCK_COUNT = 40;
const STORED_ENERGY_COLOR = indexedColor(55);
const INACTIVE_COLOR = indexedColor(8);
const SOLAR_COLOR = indexedColor(45);
const DEMAND_COLOR = indexedColor(25);
const GRID_COLOR = indexedColor(105);
const RESERVE_COLOR = indexedColor(15);

function microgridData(state: State): SpatialData {
  // Fixed diagram coordinates express connections and a storage gauge, not geography.
  const reserveY = -5 + state.reserveKwh;
  return {
    width: 18, height: 12, showLabels: true,
    cells: Array.from({ length: BATTERY_BLOCK_COUNT }, (_, index) => ({
      id: `battery-block:${index}`, x: index % 4 - 1.5, y: Math.floor(index / 4) - 4.5,
      color: index < Math.round(state.energyKwh / state.capacityKwh * BATTERY_BLOCK_COUNT) ? STORED_ENERGY_COLOR : INACTIVE_COLOR,
    })),
    // SpatialData uses agent descriptors for text annotations as well as glyphs.
    // These fixed diagram labels are view-only, not additional simulated agents.
    agents: [
      { id: "solar", x: -6, y: 3, size: 14 + state.solarKw * 2, color: SOLAR_COLOR },
      { id: "solar-label", x: -8, y: 4.5, size: 2, label: `Solar ${state.solarKw} kW` },
      { id: "demand", x: 4, y: 3, size: 14 + state.demandKw * 2, color: DEMAND_COLOR, label: `Load ${state.demandKw} kW` },
      { id: "grid", x: 4, y: -3, size: 14, color: GRID_COLOR },
      { id: "grid-import-label", x: 3, y: -1.8, size: 2, label: `In ${state.intervalImportedKwh.toFixed(1)} kWh` },
      { id: "grid-export-label", x: 3, y: -4.3, size: 2, label: `Out ${state.intervalExportedKwh.toFixed(1)} kWh` },
      { id: "reserve", x: -7.5, y: reserveY, size: 3, color: RESERVE_COLOR, label: `Reserve ${state.reserveKwh} kWh` },
    ],
    segments: [
      { from: { x: -2, y: reserveY }, to: { x: 2, y: reserveY }, color: RESERVE_COLOR, width: 2 },
      { from: { x: -6, y: 3 }, to: { x: -2, y: 3 }, color: state.solarKw > 0 ? SOLAR_COLOR : INACTIVE_COLOR, width: 1 + state.solarKw },
      { from: { x: 2, y: 3 }, to: { x: 4, y: 3 }, color: DEMAND_COLOR, width: 1 + state.demandKw },
      { from: { x: 2, y: -3 }, to: { x: 4, y: -3 }, color: state.intervalImportedKwh + state.intervalExportedKwh > 0 ? GRID_COLOR : INACTIVE_COLOR, width: 2 },
    ],
  };
}
