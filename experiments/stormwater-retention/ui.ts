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
function retentionData(state: State): SpatialData {
  const storedBlocks = Math.round(state.storedM3 / state.parameters.capacityM3 * 40);
  // The true catchment grid is offset beside a normalized volume gauge; basin dimensions are schematic.
  return {
    width: 18, height: 14, showLabels: true,
    cells: [
      ...state.catchment.fields.map(field => ({ id: field.id, x: field.x - 5, y: field.y,
        color: netLogoColor(state.parameters.rainMmPerHour > 0 ? 105 : 8) })),
      ...Array.from({ length: 40 }, (_, index) => ({ id: `basin-block:${index}`,
        x: index % 4 - 0.5, y: Math.floor(index / 4) - 4.5,
        color: netLogoColor(index < storedBlocks ? 105 : 8) })),
    ],
    agents: [
      { id: "inflow", x: -7, y: 2.5, size: 3, label: `In ${state.intervalInflowM3.toFixed(2)} m³` },
      { id: "capacity", x: -1, y: 5.3, size: 3, label: `Capacity ${state.parameters.capacityM3} m³` },
      { id: "overflow", x: 2.5, y: 2.5, size: 3, color: netLogoColor(15), label: `Spill ${state.intervalOverflowM3.toFixed(2)} m³` },
      { id: "drainage", x: 3, y: -4, size: 3, color: netLogoColor(105), label: `Drain ${state.intervalDischargedM3.toFixed(2)} m³` },
    ],
    segments: [
      { from: { x: -3.5, y: 0 }, to: { x: -1, y: 0 }, color: netLogoColor(state.intervalInflowM3 > 0 ? 105 : 8), width: 3 },
      { from: { x: 3, y: -4 }, to: { x: 5, y: -4 }, color: netLogoColor(state.intervalDischargedM3 > 0 ? 105 : 8), width: 3 },
      { from: { x: 3, y: 4.5 }, to: { x: 5, y: 3 }, color: netLogoColor(state.intervalOverflowM3 > 0 ? 15 : 8), width: 3 },
    ],
  };
}
