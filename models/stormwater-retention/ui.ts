import { defineUI, netLogoColor, type Observation, type SpatialData } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  live: { rainMmPerHour: { label: "Rain (mm/h)", set: (instance, value) => instance.setRain(value) } },
  monitors: [{ label: "Hour", value: state => state.tick }, { label: "Stored (m³)", value: state => state.storedM3, format: (value: number) => value.toFixed(2) },
    { label: "Overflow (m³)", value: state => state.overflowM3, format: (value: number) => value.toFixed(2) }, { label: "Capacity crossings", value: state => state.capacityCrossings }],
  views: [
    { type: "spatial", label: "Catchment → basin · blue stored water / red overflow", data: retentionData },
    { type: "line", label: "Retention balance", xAxis: { unit: "h" }, yAxis: { unit: "m³" },
      series: state => ["storedM3", "overflowM3", "dischargedM3"].map(key => ({ label: key, points: state.history.map(sample => ({ x: sample.tick, y: sample.values[key]! })) })) },
  ],
});

type State = Observation<typeof model>;
const BASIN_BLOCK_COUNT = 40;
const CATCHMENT_X_OFFSET = -5;
const WATER_COLOR = netLogoColor(105);
const INACTIVE_COLOR = netLogoColor(8);
const OVERFLOW_COLOR = netLogoColor(15);

function retentionData(state: State): SpatialData {
  const storedBlocks = Math.round(state.storedM3 / state.parameters.capacityM3 * BASIN_BLOCK_COUNT);
  // The true catchment grid is offset beside a normalized volume gauge; basin dimensions are schematic.
  return {
    width: 18, height: 14, showLabels: true,
    cells: [
      ...state.catchment.fields.map(field => ({ id: field.id, x: field.x + CATCHMENT_X_OFFSET, y: field.y,
        color: state.parameters.rainMmPerHour > 0 ? WATER_COLOR : INACTIVE_COLOR })),
      ...Array.from({ length: BASIN_BLOCK_COUNT }, (_, index) => ({ id: `basin-block:${index}`,
        x: index % 4 - 0.5, y: Math.floor(index / 4) - 4.5,
        color: index < storedBlocks ? WATER_COLOR : INACTIVE_COLOR })),
    ],
    agents: [
      { id: "inflow", x: -7, y: 2.5, size: 3, label: `In ${state.intervalInflowM3.toFixed(2)} m³` },
      { id: "capacity", x: -1, y: 5.3, size: 3, label: `Capacity ${state.parameters.capacityM3} m³` },
      { id: "overflow", x: 2.5, y: 2.5, size: 3, color: OVERFLOW_COLOR, label: `Spill ${state.intervalOverflowM3.toFixed(2)} m³` },
      { id: "drainage", x: 3, y: -4, size: 3, color: WATER_COLOR, label: `Drain ${state.intervalDischargedM3.toFixed(2)} m³` },
    ],
    segments: [
      { from: { x: -3.5, y: 0 }, to: { x: -1, y: 0 }, color: state.intervalInflowM3 > 0 ? WATER_COLOR : INACTIVE_COLOR, width: 3 },
      { from: { x: 3, y: -4 }, to: { x: 5, y: -4 }, color: state.intervalDischargedM3 > 0 ? WATER_COLOR : INACTIVE_COLOR, width: 3 },
      { from: { x: 3, y: 4.5 }, to: { x: 5, y: 3 }, color: state.intervalOverflowM3 > 0 ? OVERFLOW_COLOR : INACTIVE_COLOR, width: 3 },
    ],
  };
}
