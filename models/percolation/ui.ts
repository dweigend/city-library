import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
const colors = {
  soil: "#9b6530",
  rock: "#727272",
  oil: "#ff2424",
  saturated: "#000000",
};
export const ui = defineUI(model, {
  setup: ["width", "height", "seed"],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/Percolation",
    label: "Source attribution · Uri Wilensky · CC BY-NC-SA 3.0",
  },
  complete: (state) => state.done,
  live: {
    porosity: {
      set: (model, value) => model.setRules({ porosity: value }),
    },
  },
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    { label: "Total oil", value: (state) => state.totalOil },
    { label: "Front", value: (state) => state.counts.frontFieldCount },
    { label: "Current row", value: (state) => state.currentRow },
  ],
  views: [
    {
      type: "grid",
      label: "Soil",
      data: (state) => ({
        width: state.width,
        height: state.height,
        cells: state.cells.map((cell) => ({
          ...cell,
          color: colors[cell.kind],
        })),
      }),
    },
    {
      type: "line",
      label: "Saturated soil",
      series: (state) => [
        {
          label: "Total oil",
          points: state.history.map((point) => ({
            x: point.tick,
            y: point.totalOil,
          })),
        },
      ],
    },
    {
      type: "line",
      label: "Percolating oil",
      series: (state) => [
        {
          label: "Front",
          color: "#ff2424",
          points: state.history.map((point) => ({
            x: point.tick,
            y: point.frontFieldCount,
          })),
        },
      ],
    },
  ],
});
