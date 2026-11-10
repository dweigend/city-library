import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
import { bufferScene } from "./scene.ts";

export const ui = defineUI(model, {
  actions: [
    { label: "Produce crate", run: (instance) => instance.produce() },
    { label: "Collect crate", run: (instance) => instance.collect(), enabled: (state) => state.storedLotCount > 0 },
  ],
  monitors: [
    { label: "Time (min)", value: (state) => state.tick },
    { label: "Produced", value: (state) => state.producedLotCount },
    { label: "Stored", value: (state) => state.storedLotCount },
    { label: "Blocked producers", value: (state) => state.blockedLotCount },
    { label: "Collected", value: (state) => state.collectedLotCount },
  ],
  views: [
    { type: "spatial", label: "Crates and bounded buffer", data: bufferScene },
    { type: "line", label: "Crates in buffer", xAxis: { label: "Time", unit: "min" }, yAxis: { label: "Crates" }, series: (state) => [{ label: "Stored", points: state.history }] },
    { type: "table", label: "Collection ledger", rows: (state) => state.deliveries },
  ],
});
