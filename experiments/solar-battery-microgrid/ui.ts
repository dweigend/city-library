import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  monitors: [{ label: "Hour", value: state => state.tick }, { label: "Stored (kWh)", value: state => state.energyKwh },
    { label: "Grid import (kWh)", value: state => state.importedKwh }, { label: "Reserve crossings", value: state => state.reserveCrossings },
    { label: "Last crossing (h)", value: state => state.lastCrossingHour }],
  views: [{ type: "line", label: "Stored energy", xAxis: { unit: "h" }, yAxis: { unit: "kWh" },
    series: state => [{ label: "Battery", points: state.history.map(sample => ({ x: sample.tick, y: sample.values.energyKwh! })) }] }],
});
