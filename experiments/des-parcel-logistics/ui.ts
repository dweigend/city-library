import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

export const ui = defineUI(model, {
  actions: [{ label: "Add parcel", run: (instance) => instance.addParcel() }],
  monitors: [
    { label: "Time (min)", value: (state) => state.time },
    { label: "Depot queue", value: (state) => state.queued },
    { label: "Blocked senders", value: (state) => state.blocked },
    { label: "Van occupied", value: (state) => state.vanBusy },
    { label: "Delivered", value: (state) => state.delivered },
  ],
  views: [
    { type: "network", label: "Delivery network", nodes: (state) => state.nodes, edges: (state) => state.edges },
    { type: "line", label: "Cumulative deliveries", xAxis: { label: "Time", unit: "min" }, yAxis: { label: "Parcels" }, series: (state) => [{ label: "Delivered", points: state.history }] },
    { type: "table", label: "Parcel ledger", rows: (state) => state.parcels },
  ],
});
