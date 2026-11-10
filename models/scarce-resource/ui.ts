import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

export const ui = defineUI(model, {
  views: [],
  complete: state => state.inventory === 0,
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
