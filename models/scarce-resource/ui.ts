import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

export const ui = defineUI(model, {
  views: [
    { type: "bar", label: "Allocation", yAxis: { unit: "units" }, series: state => [
      { label: "Units", points: [
        { x: "Stock", y: state.inventory },
        { x: "A", y: state.alice },
        { x: "B", y: state.bob },
        { x: "Unmet", y: state.unmet },
      ] },
    ] },
  ],
  // Playback never allocates (no invented priority), so only the allocation actions apply.
  complete: () => true,
  actions: [
    { label: "Allocate to A", run: instance => { instance.allocate("A"); }, enabled: state => state.inventory > 0 },
    { label: "Allocate to B", run: instance => { instance.allocate("B"); }, enabled: state => state.inventory > 0 },
  ],
  monitors: [
    { label: "Inventory", value: state => state.inventory },
    { label: "A received", value: state => state.alice },
    { label: "B received", value: state => state.bob },
    { label: "Unmet demand", value: state => state.unmet },
  ],
});
