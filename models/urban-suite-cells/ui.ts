import { defineUI, indexedColor } from "../../ui/index.ts";
import { model } from "./model.ts";

export const ui = defineUI(model, {
  setup: ["seed"],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/UrbanSuite-Cells",
    label: "Source attribution · Wilensky · CC BY-NC-SA 3.0",
  },
  actions: [
    { label: "40 steps", run: (instance) => instance.advance(40) },
    { label: "Random seed", run: (instance) => instance.addRandomSeed() },
    {
      label: "Cycle colors",
      repeat: { label: "Keep cycling colors", intervalMs: 100 },
      run: (instance) => instance.cycleColors(),
    },
  ],
  change: (instance, changes) => instance.setRules(changes),
  live: {
    neighborhood: {},
    countRule: {
      label: "Neighbor count",
    },
    probability: {
      label: "Activation probability (%)",
    },
    ageLimit: {},
  },
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    { label: "On cells", value: (state) => state.counts.on },
  ],
  views: [
    {
      type: "inspector",
      label: "Selected",
      value: (state, id) => state.cells.find((cell) => cell.id === id),
    },
    {
      type: "grid",
      label: "Cells",
      data: (state) => ({
        width: state.width,
        height: state.height,
        cells: state.cells.map((cell) => ({
          id: cell.id,
          x: cell.x,
          y: cell.y,
          color: indexedColor(cell.colorNumber),
        })),
      }),
    },
    // Original plots before tick; omit setup and project completed tick n onto source x=n−1.
    {
      type: "line",
      label: "On cells · source step index",
      series: (state) => [
        {
          label: "On cells",
          points: state.history
            .filter((point) => point.tick > 0)
            .map((point) => ({ x: point.tick - 1, y: point.on })),
        },
      ],
    },
  ],
});
