import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
import { parcelScene } from "./scene.ts";

export const ui = defineUI(model, {
  actions: [{ label: "Add parcel", run: (instance) => instance.addParcel() }],
  monitors: [
    { label: "Time (min)", value: (state) => state.time },
    { label: "Depot queue", value: (state) => state.queuedParcelCount },
    { label: "Blocked senders", value: (state) => state.blockedParcelCount },
    { label: "Van occupied", value: (state) => state.busyVanCount },
    { label: "Delivered", value: (state) => state.deliveredParcelCount },
  ],
  views: [
    { type: "spatial", label: "Depot and van journey", data: parcelScene },
    { type: "line", label: "Cumulative deliveries", xAxis: { label: "Time", unit: "min" }, yAxis: { label: "Parcels" }, series: (state) => [{ label: "Delivered", points: state.history }] },
    { type: "table", label: "Parcel ledger", rows: (state) => state.parcels },
  ],
});
