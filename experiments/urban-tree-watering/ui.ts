import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  live: { dailyLiters: { label: "Daily water (L)", set: (instance, value) => instance.setDailyLiters(value) } },
  monitors: [{ label: "Day", value: state => state.tick }, { label: "Used today (L)", value: state => state.wateredLiters },
    { label: "Total water (L)", value: state => state.totalWaterLiters }],
  views: [{ type: "table", label: "Tree moisture", rows: state => state.trees },
    { type: "line", label: "Mean moisture", xAxis: { unit: "day" }, yAxis: { unit: "L" },
      series: state => [{ label: "Moisture", points: state.history.map(sample => ({ x: sample.tick, y: sample.values.meanMoisture! })) }] }],
});
