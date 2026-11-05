import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: [{ field: "seed" }],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/PartitionPermutationDistribution",
    label: "Wilensky (2004) · CC BY-NC-SA 3.0",
  },
  complete: (s) => s.done,
  live: [
    {
      field: "targetTotal",
      label: "Target total",
      value: (s) => s.parameters.targetTotal,
      set: (m, v) => m.setRules({ targetTotal: Number(v) }),
    },
    {
      field: "numSuccesses",
      label: "Number of successes",
      value: (s) => s.parameters.numSuccesses,
      set: (m, v) => m.setRules({ numSuccesses: Number(v) }),
    },
    {
      field: "diminishingSampleSpace",
      label: "Diminishing sample space",
      value: (s) => s.parameters.diminishingSampleSpace,
      set: (m, v) => m.setRules({ diminishingSampleSpace: Boolean(v) }),
    },
    {
      field: "waitAtFull",
      label: "Wait at full",
      value: (s) => s.parameters.waitAtFull,
      set: (m, v) => m.setRules({ waitAtFull: Boolean(v) }),
    },
  ],
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
