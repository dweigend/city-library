import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
import { scene } from "./scene.ts";
export const ui = defineUI(model, {
  monitors: [
    { label: "Time (min)", value: (state) => state.time },
    { label: "Bikes in transit", value: (state) => state.inTransit },
    { label: "Delivered bikes", value: (state) => state.delivered },
    { label: "Total bikes", value: (state) => state.totalBikes },
  ],
  views: [
    { type: "spatial", label: "Station slots and bikes", data: scene },
    { type: "bar", label: "Station inventory", yAxis: { unit: "bikes" }, series: (state) => [{ label: "Bikes", points: state.stations.map((station) => ({ x: station.label, y: station.bikes })) }] },
    { type: "table", label: "Delivery ledger", rows: (state) => state.trips },
  ],
});
