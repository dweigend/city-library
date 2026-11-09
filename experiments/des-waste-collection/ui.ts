import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  monitors: [
    { label: "Time (min)", value: (state) => state.time },
    { label: "Remaining load", value: (state) => state.remaining },
    { label: "On truck", value: (state) => state.carried },
    { label: "Delivered", value: (state) => state.delivered },
  ],
  views: [
    { type: "spatial", label: "Collection sites and truck", data: (state) => ({ width: 6, height: 4, agents: [
      ...state.fields.map((field) => ({ id: field.id, x: field.x, y: field.y, label: String(field.waste) })),
      { ...state.truck, label: `Truck: ${state.carried}`, shape: "triangle" },
    ] }) },
    { type: "line", label: "Depot deliveries", xAxis: { unit: "min" }, yAxis: { unit: "load units" }, series: (state) => [{ label: "Delivered", points: state.history }] },
  ],
});
