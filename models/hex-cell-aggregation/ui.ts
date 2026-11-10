import { defineUI, type Observation, type SpatialData } from "../../ui/index.ts";

import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["width", "height", "seed"],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/HexCellAggregation",
    label: "Source attribution · Wilensky · CC BY-NC-SA 3.0",
  },
  complete: (state) => state.done,
  actions: [
    { label: "Read switches", run: (instance) => instance.readSwitches() },
  ],
  change: (instance, changes) => instance.setSwitches(changes),
  live: {
    oneNeighbor: {
      label: "1 live neighbors",
    },
    twoNeighbors: {
      label: "2 live neighbors",
    },
    threeNeighbors: {
      label: "3 live neighbors",
    },
    fourNeighbors: {
      label: "4 live neighbors",
    },
    fiveNeighbors: {
      label: "5 live neighbors",
    },
    sixNeighbors: {
      label: "6 live neighbors",
    },
  },
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
      data: hexCellsData,
    },
    {
      type: "inspector",
      label: "Cell",
      value: cellInspector,
    },
  ],
});

type UIObservation = Observation<typeof model>;

function hexCellsData(state: UIObservation): SpatialData {
  return {
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
  };
}

function cellInspector(
  state: UIObservation,
  id: string | null,
): Readonly<Record<string, string | number | boolean>> | undefined {
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
}
