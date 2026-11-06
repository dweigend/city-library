import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
const switches = [
  "oneNeighbor",
  "twoNeighbors",
  "threeNeighbors",
  "fourNeighbors",
  "fiveNeighbors",
  "sixNeighbors",
] as const;
export const ui = defineUI(model, {
  setup: [{ field: "width" }, { field: "height" }, { field: "seed" }],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/HexCellAggregation",
    label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0",
  },
  complete: (state) => state.done,
  actions: [
    { label: "Read switches", run: (instance) => instance.readSwitches() },
  ],
  live: switches.map((field, index) => ({
    field,
    label: `${index + 1} live neighbors`,
    value: (state: ReturnType<ReturnType<typeof model.create>["read"]>) =>
      state.parameters[field],
    set: (
      instance: ReturnType<typeof model.create>,
      value: string | number | boolean,
    ) => instance.setSwitches({ [field]: value }),
  })),
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    {
      label: "Alive",
      value: (state) => state.cells.filter((cell) => cell.alive).length,
    },
    { label: "Eligible", value: (state) => state.eligibleCount },
    {
      label: "Applied neighbors",
      value: (state) => state.switches.join(", ") || "None",
    },
  ],
  views: [
    {
      type: "spatial",
      label: "Hex cells",
      data: (state) => ({
        width: state.width,
        height: state.height + 1,
        agents: state.cells
          .filter((cell) => cell.alive)
          .map((cell) => ({
            id: cell.id,
            x: cell.x,
            y: cell.displayY,
            color: cell.liveNeighborCount === 6 ? "#d73027" : "#f28e2b",
            size: 4,
          })),
      }),
    },
    {
      type: "inspector",
      label: "Cell",
      value: (state, id) => {
        const cell = state.cells.find((cell) => cell.id === id);
        return cell
          ? {
              x: cell.x,
              y: cell.y,
              alive: cell.alive,
              liveNeighbors: cell.liveNeighborCount,
              eligible: cell.eligible,
              neighbors: cell.neighborIds.length,
            }
          : undefined;
      },
    },
  ],
});
