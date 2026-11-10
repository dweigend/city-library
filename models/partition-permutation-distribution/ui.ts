import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["seed"],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/PartitionPermutationDistribution",
    label: "Wilensky (2004) · CC BY-NC-SA 3.0",
  },
  complete: (s) => s.done,
  live: {
    targetTotal: {
      set: (m, v) => m.setRules({ targetTotal: v }),
    },
    successCount: {
      label: "Number of successes",
      set: (m, v) => m.setRules({ successCount: v }),
    },
    diminishingSampleSpace: {
      set: (m, v) => m.setRules({ diminishingSampleSpace: v }),
    },
    waitAtFull: {
      set: (m, v) => m.setRules({ waitAtFull: v }),
    },
  },
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Successes", value: (s) => s.successes },
    { label: "Running total", value: (s) => s.runningTotal },
    { label: "Previous addends", value: (s) => s.previous.join(" + ") },
    { label: "Addend", value: (s) => s.addend },
  ],
  views: [
    {
      type: "bar",
      label: "Current addends",
      series: (s) => [
        { label: "Addend", points: s.current.map((y, x) => ({ x: x + 1, y })) },
      ],
    },
    {
      type: "bar",
      label: "Addends",
      series: (s) => [{ label: "Trials", points: s.addendHistogram }],
    },
    {
      type: "bar",
      label: "Addends per total",
      series: (s) => [{ label: "Series", points: s.seriesHistogram }],
    },
  ],
});
