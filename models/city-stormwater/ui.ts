import { defineUI, indexedColor, scientificPalette, type Observation, type SpatialAgent, type SpatialData, type SpatialSegment } from "../../ui/index.ts";
import { model } from "./model.ts";

const colors = {
  rain: indexedColor(95),
  sealed: indexedColor(4),
  pervious: indexedColor(55),
  soil: indexedColor(35),
  water: indexedColor(105),
  outlet: indexedColor(65),
  overflow: indexedColor(15),
  outline: scientificPalette.neutral,
};

export const ui = defineUI(model, {
  setup: [
    { field: "retentionCapacityM3", label: "Basin volume (m³)" },
    { field: "outletM3PerHour", label: "Outlet (m³/h)" },
  ],
  live: {
    stormPattern: { label: "Storms", set: (instance, value) => instance.setStormPattern(value) },
    rainMmPerHour: { label: "Rain during storms (mm/h)", set: (instance, value) => instance.setRain(value) },
    infiltrationMmPerHour: { label: "Infiltration of dry soil (mm/h)", set: (instance, value) => instance.setInfiltration(value) },
  },
  monitors: [
    { label: "Hour", value: state => state.tick },
    { label: "Raining next hour", value: state => state.isRainingNextHour ? "Yes" : "No" },
    { label: "Basin (m³)", value: state => state.storedM3, format: (value: number) => value.toFixed(1) },
    { label: "Overflow total (m³)", value: state => state.overflowM3, format: (value: number) => value.toFixed(1) },
    { label: "Soil water (m³)", value: state => state.soilStorageM3, format: (value: number) => value.toFixed(1) },
  ],
  views: [
    { type: "spatial", label: "Catchment in the last hour · gray sealed (share above each plot), green pervious · brown bar below = soil water (mm) · blue basin · brown runoff, green outlet, red overflow · line width ∝ m³/h", data: catchmentScene },
    { type: "line", label: "Hydrograph · m³ in each completed hour", xAxis: { label: "Hour" }, yAxis: { unit: "m³/h" },
      series: state => [
        hourlySeries(state, "Rain", colors.rain, "intervalRainM3"),
        hourlySeries(state, "Runoff", colors.soil, "intervalRunoffM3"),
        hourlySeries(state, "Outlet", colors.outlet, "intervalDischargedM3"),
        hourlySeries(state, "Overflow", colors.overflow, "intervalOverflowM3"),
      ] },
    { type: "line", label: "Water held back · basin and soil", xAxis: { label: "Hour" }, yAxis: { unit: "m³" },
      series: state => [
        { label: "Basin", color: colors.water, points: state.history.map(sample => ({ x: sample.tick, y: sample.values.storedM3! })) },
        { label: "Soil", color: colors.pervious, points: state.history.map(sample => ({ x: sample.tick, y: sample.values.soilStorageM3! })) },
      ] },
    { type: "table", label: "Cumulative water balance", rows: state => [
      { Term: "Rain", "m³": state.rainM3.toFixed(2) },
      { Term: "Held in soil", "m³": state.soilStorageM3.toFixed(2) },
      { Term: "Percolated", "m³": state.percolatedM3.toFixed(2) },
      { Term: "Held in basin", "m³": state.storedM3.toFixed(2) },
      { Term: "Outlet", "m³": state.dischargedM3.toFixed(2) },
      { Term: "Overflow", "m³": state.overflowM3.toFixed(2) },
      { Term: "Residual", "m³": Math.abs(state.balanceErrorM3) < 1e-6 ? "≈ 0 (< 1e-6)" : state.balanceErrorM3.toExponential(1) },
    ] },
  ],
});

type State = Observation<typeof model>;
const plotWidth = 2.0;
const plotHeight = 1.4;
const plotCenters = [{ x: -3.85, y: 0.9 }, { x: -1.2, y: 0.9 }];
const basin = { x: 2.1, y: 0, width: 1.5, height: 2.4 };

function catchmentScene(state: State): SpatialData {
  const scale = Math.max(1, state.areaM2 * state.parameters.rainMmPerHour / 1000);
  const width = (volume: number) => volume <= 1e-9 ? 0 : 1 + 7 * Math.min(1, volume / scale);
  const agents: SpatialAgent[] = [];
  const segments: SpatialSegment[] = [];
  const labels: { x: number; y: number; text: string }[] = [];
  state.plots.forEach((plot, index) => {
    const center = plotCenters[index]!;
    const sealedWidth = plotWidth * plot.imperviousShare;
    const left = center.x - plotWidth / 2;
    agents.push(
      { id: `${plot.id}:sealed`, x: left + sealedWidth / 2, y: center.y, shape: "rectangle", extent: { width: sealedWidth, height: plotHeight }, color: colors.sealed, selectable: false },
      { id: plot.id, x: left + sealedWidth + (plotWidth - sealedWidth) / 2, y: center.y, shape: "rectangle", extent: { width: plotWidth - sealedWidth, height: plotHeight }, color: colors.pervious, selectable: false },
      { id: `${plot.id}:soil`, x: center.x, y: center.y - 1.0, shape: "rectangle", extent: { width: plotWidth, height: 0.22 }, filled: false, stroke: colors.soil, strokeWidth: 1.5, selectable: false },
    );
    if (plot.soilFillFraction > 0) agents.push({ id: `${plot.id}:soil-fill`, x: left + plotWidth * plot.soilFillFraction / 2, y: center.y - 1.0,
      shape: "rectangle", extent: { width: plotWidth * plot.soilFillFraction, height: 0.18 }, color: colors.soil, selectable: false });
    if (state.intervalRainM3 > 0) {
      for (let drop = 0; drop < 6; drop += 1) {
        const x = left + 0.2 + drop * 0.32;
        segments.push({ from: { x, y: center.y + 1.25 }, to: { x: x - 0.08, y: center.y + 0.9 }, color: colors.rain, width: 2 });
      }
    }
    // Runoff drops beside the plot's labels, then runs in its own lane below every plot to the basin, so it never crosses another plot.
    const laneY = -0.85 - index * 0.25;
    const dropX = center.x + plotWidth / 2 - 0.15;
    const runoffWidth = width(plot.intervalRunoffM3);
    segments.push(
      { from: { x: dropX, y: center.y - 1.15 }, to: { x: dropX, y: laneY }, color: colors.soil, width: runoffWidth },
      { from: { x: dropX, y: laneY }, to: { x: basin.x - basin.width / 2, y: laneY }, color: colors.soil, width: runoffWidth },
    );
    labels.push({ x: center.x, y: center.y + 1.5, text: `${Math.round(plot.imperviousShare * 100)}%` },
      { x: center.x - 0.15, y: center.y - 1.4, text: `${plot.soilStorageMm.toFixed(0)} mm` });
  });
  const bottom = basin.y - basin.height / 2;
  agents.push({ id: "basin", x: basin.x, y: basin.y, shape: "rectangle", extent: { width: basin.width, height: basin.height }, filled: false, stroke: colors.outline, strokeWidth: 2, selectable: false });
  if (state.fillFraction > 0) agents.unshift({ id: "basin:water", x: basin.x, y: bottom + basin.height * state.fillFraction / 2, shape: "rectangle",
    extent: { width: basin.width - 0.1, height: basin.height * state.fillFraction }, color: colors.water, selectable: false });
  segments.push(
    { from: { x: basin.x + basin.width / 2, y: bottom + 0.2 }, to: { x: 4.6, y: bottom - 0.3 }, color: colors.outlet, width: width(state.intervalDischargedM3) },
    { from: { x: basin.x + basin.width / 2, y: basin.y + basin.height / 2 }, to: { x: 4.6, y: basin.y + basin.height / 2 + 0.5 }, color: colors.overflow, width: width(state.intervalOverflowM3) },
  );
  labels.push(
    { x: basin.x - 0.65, y: basin.y + basin.height / 2 + 0.3, text: `Basin ${state.storedM3.toFixed(0)}/${state.parameters.retentionCapacityM3} m³` },
    { x: basin.x + 1.5, y: bottom - 0.6, text: `Outlet ${state.intervalDischargedM3.toFixed(1)}` },
    { x: basin.x + 1.4, y: basin.y + basin.height / 2 + 0.85, text: `Overflow ${state.intervalOverflowM3.toFixed(1)}` },
  );
  return {
    width: 10, height: 5.2, agents, segments, labels,
    description: `Hour ${state.tick}: rain ${state.intervalRainM3.toFixed(1)} m³, runoff ${state.intervalRunoffM3.toFixed(1)} m³, basin ${state.storedM3.toFixed(1)} of ${state.parameters.retentionCapacityM3} m³, outlet ${state.intervalDischargedM3.toFixed(1)} m³, overflow ${state.intervalOverflowM3.toFixed(1)} m³.`,
  };
}

function hourlySeries(state: State, label: string, color: string, key: "intervalRainM3" | "intervalRunoffM3" | "intervalDischargedM3" | "intervalOverflowM3") {
  return { label, color, points: state.history.filter(sample => sample.tick > 0).map(sample => ({ x: sample.tick, y: sample.values[key]! })) };
}
