import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

export const ui = defineUI(model, {
  views: [],
  actions: [
    { label: "Reserve A", run: instance => { instance.reserve("A"); } },
    { label: "Reserve B", run: instance => { instance.reserve("B"); } },
    { label: "Start A", run: instance => { instance.start("A"); } },
    { label: "Start B", run: instance => { instance.start("B"); } },
    { label: "Cancel A", run: instance => { instance.cancel("A"); } },
    { label: "Cancel B", run: instance => { instance.cancel("B"); } },
    { label: "Fail", run: instance => { instance.fail(); } },
    { label: "Repair", run: instance => { instance.repair(); } },
    { label: "Complete A", run: instance => { instance.complete("A"); } },
    { label: "Complete B", run: instance => { instance.complete("B"); } },
  ],
  monitors: [
    { label: "Time (h)", value: state => state.tick },
    { label: "Phase", value: state => state.phase },
    { label: "Occupant", value: state => state.occupant ?? "None" },
    { label: "Inventory", value: state => state.inventory },
    { label: "Available", value: state => state.available },
    { label: "Consumed", value: state => state.consumed },
    { label: "Repair ready at (h)", value: state => state.readyAt },
    { label: "Completed", value: state => state.completed },
  ],
});
