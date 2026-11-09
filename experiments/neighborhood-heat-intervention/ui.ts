import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  live: { shadeCooling: { set: (instance, value) => instance.setShadeCooling(value) } },
  monitors: [{ label: "Tick", value: state => state.tick }, { label: "Mean heat index", value: state => state.meanHeat, format: (value: number) => value.toFixed(2) }],
  views: [{ type: "table", label: "Neighborhood fields", rows: state => state.fields },
    { type: "line", label: "Mean heat index", yAxis: { label: "Index units" },
      series: state => [{ label: "Mean heat", points: state.history.map(sample => ({ x: sample.tick, y: sample.values.meanHeat! })) }] }],
});
