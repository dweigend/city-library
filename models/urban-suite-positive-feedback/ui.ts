import { defineUI, indexedColor } from "../../ui/index.ts";
import { model } from "./model.ts";

export const ui = defineUI(model, {
  setup: ["seed"],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/UrbanSuite-PositiveFeedback",
    label: "Source attribution · Wilensky · CC BY-NC-SA 3.0",
  },
  live: {
    alpha: {
      set: (instance, value) => instance.setRules({ alpha: value }),
    },
    mooreNeighborhood: {
      set: (instance, value) => instance.setRules({ mooreNeighborhood: value }),
    },
  },
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    {
      label: "Maximum activity",
      value: (state) => state.maxActivity.toPrecision(6),
    },
    {
      label: "Total activity",
      value: (state) => state.totalActivity.toPrecision(6),
    },
  ],
  views: [
    {
      type: "inspector",
      label: "Selected",
      value: (state, id) => state.cells.find((cell) => cell.id === id),
    },
    {
      type: "grid",
      label: "Activity",
      data: (state) => ({
        width: state.width,
        height: state.height,
        cells: state.cells.map((cell) => ({
          id: cell.id,
          x: cell.x,
          y: cell.y,
          color: indexedColor(9.9 * cell.activity),
        })),
      }),
    },
    {
      type: "line",
      label: "Activity distribution · descending rank",
      series: (state) => [
        {
          label: "Activity",
          points: state.activityDistribution.map((value, index) => ({
            x: index,
            y: value,
          })),
        },
      ],
    },
  ],
});
