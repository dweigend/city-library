import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["seed"],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/Birthdays",
    label: "Source attribution · Uri Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Successes", value: (s) => s.successCount },
    {
      label: "Success rate (%)",
      value: (s) => s.successRate,
      format: (value: number) => value.toFixed(2),
    },
  ],
  views: [
    {
      type: "table",
      label: "Room",
      rows: (s) =>
        s.people.map((p) => ({ Birthday: p.date, Match: p.matched })),
    },
    {
      type: "line",
      label: "Success rate (%)",
      series: (s) => [
        {
          label: "Success rate",
          points: s.history.map((p) => ({ x: p.tick, y: p.successRate })),
        },
      ],
    },
  ],
});
