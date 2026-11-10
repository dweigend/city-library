import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

export const ui = defineUI(model, {
  views: [
    { type: "bar", label: "Allocation", yAxis: { unit: "units" }, series: state => [
      { label: "Units", points: [
        { x: "Stock", y: state.inventoryUnitCount },
        { x: "A", y: state.aliceReceivedUnitCount },
        { x: "B", y: state.bobReceivedUnitCount },
        { x: "Unmet", y: state.unmetUnitCount },
      ] },
    ] },
  ],
  complete: state => state.inventoryUnitCount === 0,
  actions: [
    { label: "Allocate to A", run: instance => { instance.allocate("A"); }, enabled: state => state.inventoryUnitCount > 0 },
    { label: "Allocate to B", run: instance => { instance.allocate("B"); }, enabled: state => state.inventoryUnitCount > 0 },
  ],
  monitors: [
    { label: "Inventory", value: state => state.inventoryUnitCount },
    { label: "A received", value: state => state.aliceReceivedUnitCount },
    { label: "B received", value: state => state.bobReceivedUnitCount },
    { label: "Unmet demand", value: state => state.unmetUnitCount },
  ],
});
