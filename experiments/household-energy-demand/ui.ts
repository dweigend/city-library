import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  live: { shiftedShare: { label: "Shifted share", set: (instance, value) => instance.setShiftedShare(value) } },
  monitors: [
    { label: "Hour", value: state => state.tick },
    { label: "Demand (kW)", value: state => state.demandKw, format: (value: number) => value.toFixed(2) },
    { label: "Energy (kWh)", value: state => state.energyKwh, format: (value: number) => value.toFixed(2) },
  ],
  views: [{ type: "line", label: "Hourly demand", xAxis: { label: "Time", unit: "h" }, yAxis: { unit: "kW" },
    series: state => [{ label: "Demand", points: state.history.map(sample => ({ x: sample.tick, y: sample.values.demandKw! })) }] }],
});
