import { defineUI, netLogoColor, type Observation, type SpatialData } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  monitors: [{ label: "Hour", value: state => state.tick }, { label: "Stored (kWh)", value: state => state.energyKwh },
    { label: "Grid import (kWh)", value: state => state.importedKwh }, { label: "Reserve crossings", value: state => state.reserveCrossings },
    { label: "Last crossing (h)", value: state => state.lastCrossingHour },
    { label: "Flow interval", value: state => state.tick === 0 ? "Initial rates" : `${state.tick - 1}–${state.tick} h` }],
  views: [
    { type: "spatial", label: "Battery and hourly flows · fill rounded to 0.25 kWh", data: microgridData },
    { type: "line", label: "Stored energy", xAxis: { unit: "h" }, yAxis: { unit: "kWh" },
      series: state => [{ label: "Battery", points: state.history.map(sample => ({ x: sample.tick, y: sample.values.energyKwh! })) }] },
  ],
});

type State = Observation<typeof model>;
function microgridData(state: State): SpatialData {
  // Fixed diagram coordinates express connections and a storage gauge, not geography.
  const reserveY = -5 + state.reserveKwh;
  return {
    width: 18, height: 12, showLabels: true,
    cells: Array.from({ length: 40 }, (_, index) => ({
      id: `battery-block:${index}`, x: index % 4 - 1.5, y: Math.floor(index / 4) - 4.5,
      color: netLogoColor(index < Math.round(state.energyKwh / state.capacityKwh * 40) ? 55 : 8),
    })),
    agents: [
      { id: "solar", x: -6, y: 3, size: 14 + state.solarKw * 2, color: netLogoColor(45) },
      { id: "solar-label", x: -8, y: 4.5, size: 2, label: `Solar ${state.solarKw} kW` },
      { id: "demand", x: 4, y: 3, size: 14 + state.demandKw * 2, color: netLogoColor(25), label: `Load ${state.demandKw} kW` },
      { id: "grid", x: 4, y: -3, size: 14, color: netLogoColor(105) },
      { id: "grid-import-label", x: 3, y: -1.8, size: 2, label: `In ${state.intervalImportedKwh.toFixed(1)} kWh` },
      { id: "grid-export-label", x: 3, y: -4.3, size: 2, label: `Out ${state.intervalExportedKwh.toFixed(1)} kWh` },
      { id: "reserve", x: -7.5, y: reserveY, size: 3, color: netLogoColor(15), label: `Reserve ${state.reserveKwh} kWh` },
    ],
    segments: [
      { from: { x: -2, y: reserveY }, to: { x: 2, y: reserveY }, color: netLogoColor(15), width: 2 },
      { from: { x: -6, y: 3 }, to: { x: -2, y: 3 }, color: netLogoColor(state.solarKw > 0 ? 45 : 8), width: 1 + state.solarKw },
      { from: { x: 2, y: 3 }, to: { x: 4, y: 3 }, color: netLogoColor(25), width: 1 + state.demandKw },
      { from: { x: 2, y: -3 }, to: { x: 4, y: -3 }, color: netLogoColor(state.intervalImportedKwh + state.intervalExportedKwh > 0 ? 105 : 8), width: 2 },
    ],
  };
}
