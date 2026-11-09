import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  monitors: [{ label: "Minute", value: state => state.tick }, { label: "Signal", value: state => state.signal },
    { label: "Waiting", value: state => state.waiting }, { label: "Crossing", value: state => state.crossing }, { label: "Arrived", value: state => state.arrived }],
  views: [{ type: "table", label: "Pedestrians", rows: state => state.people },
    { type: "line", label: "Cohort", xAxis: { unit: "min" }, yAxis: { label: "People" },
      series: state => ["waiting", "crossing", "arrived"].map(key => ({ label: key, points: state.history.map(sample => ({ x: sample.tick, y: sample.values[key]! })) })) }],
});
