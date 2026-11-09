import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  monitors: [{ label: "Study runs", value: state => state.completedRuns }, { label: "Planned runs", value: state => state.plannedRuns }],
  views: [{ type: "table", label: "Run outcomes", rows: state => state.outcomes },
    { type: "table", label: "Replication summaries", rows: state => state.summaries.map(summary => ({
      scenario: summary.scenario,
      mean: typeof summary.mean === "number" ? summary.mean.toFixed(2) : summary.mean,
      sampleSd: typeof summary.sampleSd === "number" ? summary.sampleSd.toFixed(2) : summary.sampleSd,
    })) },
    { type: "bar", label: "Dwelling capacity", yAxis: { label: "Dwelling slots" },
      series: state => [{ label: "Slots", points: state.outcomes.map((outcome, index) => ({ x: `Run ${index + 1}`, y: outcome.slots })) }] }],
});
