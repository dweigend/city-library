import { defineUI, netLogoColor } from "../../ui/index.ts";
import { model } from "./model.ts";

export const ui = defineUI(model, {
  setup: [{ field: "seed" }],
  source: { url: "https://ccl.northwestern.edu/netlogo/models/UrbanSuite-StructurefromRandomness2", label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0" },
  live: [{ field: "threshold", label: "Threshold", value: state => state.parameters.threshold, set: (instance, value) => instance.setRules({ threshold: Number(value) }) }],
  monitors: [
    { label: "Tick", value: state => state.tick },
    { label: "Above now", value: state => state.counts.currentAboveThreshold },
    { label: "Activated", value: state => state.counts.activated },
    { label: "Mean potential", value: state => state.meanPotential.toPrecision(6) },
    { label: "Max potential", value: state => state.maxPotential.toPrecision(6) },
  ],
  views: [
    { type: "inspector", label: "Selected", value: (state, id) => state.cells.find(cell => cell.id === id) },
    { type: "grid", label: "Persistent activation", data: state => ({ width: state.width, height: state.height,
      cells: state.cells.map(cell => ({ id: cell.id, x: cell.x, y: cell.y, color: netLogoColor(cell.colorNumber) })),
    }) },
    { type: "line", label: "Cells above threshold · current predicate", series: state => [
      { label: "Currently above", points: state.history.map(point => ({ x: point.tick, y: point.counts.currentAboveThreshold })) },
    ] },
    { type: "line", label: "Potential · maximum and mean × 10", series: state => [
      { label: "Maximum", points: state.history.map(point => ({ x: point.tick, y: point.maxPotential })) },
      { label: "Mean × 10", points: state.history.map(point => ({ x: point.tick, y: point.meanPotentialTimesTen })) },
    ] },
  ],
});
