import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  monitors: [
    { label: "Time (min)", value: (state) => state.time },
    { label: "Bikes in transit", value: (state) => state.inTransit },
    { label: "Delivered bikes", value: (state) => state.delivered },
    { label: "Total bikes", value: (state) => state.totalBikes },
  ],
  views: [
    { type: "spatial", label: "Stations and truck", data: (state) => ({ width: 8, height: 4, agents: [
      ...state.stations.map((station) => ({ id: station.id, x: station.x, y: station.y, label: `${station.label}: ${station.bikes}` })),
      { ...state.truck, label: "Truck", shape: "triangle" },
    ] }) },
    { type: "bar", label: "Station inventory", yAxis: { unit: "bikes" }, series: (state) => [{ label: "Bikes", points: state.stations.map((station) => ({ x: station.label, y: station.bikes })) }] },
    { type: "table", label: "Delivery ledger", rows: (state) => state.trips },
  ],
});
