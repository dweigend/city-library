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
      label: "Hex cells · view grows with the aggregate",
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

/**
 * Hexagons in offset columns: every second column sits half a cell lower, so each
 * live cell is one filled tile that touches its six neighbours.
 */
function hexCellsData(state: UIObservation): SpatialData {
  const alive = state.cells.filter((cell) => cell.alive);
  const reach = Math.max(0, ...alive.map((cell) => Math.max(Math.abs(cell.x), Math.abs(cell.displayY))));
  const frame = framedExtent(reach, state.width);
  return {
    width: frame,
    height: frame + 1,
    cells: alive.map((cell) => ({
      id: cell.id,
      x: cell.x,
      y: cell.displayY,
      color: cell.liveNeighborCount === 6 ? "#d73027" : "#f28e2b",
    })),
    agents: [],
    description: `${alive.length} live hexagonal cells; red cells have six live neighbours.`,
  };
}

/**
 * An odd cell count around the centre cell that holds the aggregate with a margin,
 * at least a third of the world and at most all of it.
 */
function framedExtent(reach: number, worldWidth: number) {
  const wanted = Math.max(Math.ceil(worldWidth / 3), 2 * (reach + frameMargin) + 1);
  const odd = wanted % 2 === 0 ? wanted + 1 : wanted;
  return Math.min(worldWidth, odd);
}

// Cells of empty space kept around the aggregate.
const frameMargin = 4;

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
