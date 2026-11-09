import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

export const ui = defineUI(model, {
  actions: [
    { label: "Produce crate", run: (instance) => instance.produce() },
    { label: "Collect crate", run: (instance) => instance.collect(), enabled: (state) => state.stored > 0 },
  ],
  monitors: [
    { label: "Time (min)", value: (state) => state.tick },
    { label: "Produced", value: (state) => state.produced },
    { label: "Stored", value: (state) => state.stored },
    { label: "Blocked producers", value: (state) => state.blocked },
    { label: "Collected", value: (state) => state.collected },
  ],
  views: [
    { type: "line", label: "Crates in buffer", xAxis: { label: "Time", unit: "min" }, yAxis: { label: "Crates" }, series: (state) => [{ label: "Stored", points: state.history }] },
    { type: "table", label: "Collection ledger", rows: (state) => state.deliveries },
  ],
});
