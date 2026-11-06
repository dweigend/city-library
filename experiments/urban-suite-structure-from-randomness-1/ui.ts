import { defineUI, netLogoColor } from "../../ui/index.ts";
import { model } from "./model.ts";

export const ui = defineUI(model, {
  setup: [{ field: "seed" }],
  source: { url: "https://ccl.northwestern.edu/netlogo/models/UrbanSuite-StructurefromRandomness1", label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0" },
  live: [{ field: "keepAddingRandomness", label: "Keep adding randomness", value: state => state.parameters.keepAddingRandomness, set: (instance, value) => instance.setRules({ keepAddingRandomness: Boolean(value) }) }],
  monitors: [
    { label: "Tick", value: state => state.tick },
    { label: "Total activity", value: state => state.totalActivity.toPrecision(6) },
    { label: "Max |activity|", value: state => state.maxAbsoluteActivity.toPrecision(6) },
  ],
  views: [
    { type: "inspector", label: "Selected", value: (state, id) => state.cells.find(cell => cell.id === id) },
    { type: "grid", label: "Activity", data: state => ({ width: state.width, height: state.height,
      cells: state.cells.map(cell => ({ id: cell.id, x: cell.x, y: cell.y, color: netLogoColor(cell.colorNumber) })),
    }) },
    { type: "line", label: "Activity distribution · descending rank", series: state => [
      { label: "Activity", points: state.activityDistribution.map((value, index) => ({ x: index, y: value })) },
    ] },
  ],
});
