import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
import { scene } from "./scene.ts";
export const ui = defineUI(model, {
  setup: ["serviceMinutes"],
  live: { responderCount: { set: (instance, value) => instance.setResponders(value) } },
  monitors: [
    { label: "Time (min)", value: (state) => state.time },
    { label: "Busy teams", value: (state) => state.busyResponderCount },
    { label: "Waiting calls", value: (state) => state.waitingCallCount },
    { label: "Completed", value: (state) => state.completedCallCount },
  ],
  views: [
    { type: "spatial", label: "Response assignments", data: scene },
    { type: "table", label: "Call ledger", rows: (state) => state.calls },
  ],
});
