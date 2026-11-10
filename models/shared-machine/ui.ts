import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

export const ui = defineUI(model, {
  views: [
    { type: "bar", label: "Material", yAxis: { unit: "units" }, series: state => [
      { label: "Units", points: [
        { x: "Stock", y: state.inventoryUnitCount },
        { x: "Free", y: state.availableUnitCount },
        { x: "Used", y: state.consumedUnitCount },
      ] },
    ] },
  ],
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
    { label: "Inventory", value: state => state.inventoryUnitCount },
    { label: "Available", value: state => state.availableUnitCount },
    { label: "Consumed", value: state => state.consumedUnitCount },
    { label: "Repair ready at (h)", value: state => state.readyAt },
    { label: "Completed", value: state => state.completedJobCount },
  ],
});
