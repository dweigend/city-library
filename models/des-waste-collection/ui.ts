import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
import { scene } from "./scene.ts";
export const ui = defineUI(model, {
  monitors: [
    { label: "Time (min)", value: (state) => state.time },
    { label: "Remaining load", value: (state) => state.remaining },
    { label: "On truck", value: (state) => state.carried },
    { label: "Delivered", value: (state) => state.delivered },
  ],
  views: [
    { type: "spatial", label: "Collection patches and truck", data: scene },
    { type: "line", label: "Depot deliveries", xAxis: { unit: "min" }, yAxis: { unit: "load units" }, series: (state) => [{ label: "Delivered", points: state.history }] },
  ],
});
