import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  live: { rainMmPerHour: { label: "Rain (mm/h)", set: (instance, value) => instance.setRain(value) } },
  monitors: [{ label: "Hour", value: state => state.tick }, { label: "Stored (m³)", value: state => state.storedM3, format: (value: number) => value.toFixed(2) },
    { label: "Overflow (m³)", value: state => state.overflowM3, format: (value: number) => value.toFixed(2) }, { label: "Capacity crossings", value: state => state.capacityCrossings }],
  views: [{ type: "line", label: "Retention balance", xAxis: { unit: "h" }, yAxis: { unit: "m³" },
    series: state => ["storedM3", "overflowM3", "dischargedM3"].map(key => ({ label: key, points: state.history.map(sample => ({ x: sample.tick, y: sample.values[key]! })) })) }],
});
