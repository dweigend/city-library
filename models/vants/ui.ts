import { defineUI, type Observation, type SpatialData } from "../../ui/index.ts";

import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["width", "height", "seed", "vantCount"],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/Vants",
    label: "Source attribution · Wilensky · CC BY-NC-SA 3.0",
  },
  actions: [
    {
      label: "Reverse step",
      repeat: { label: "Run reverse", intervalMs: 100 },
      run: (instance) => instance.reverse(),
    },
  ],
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    {
      label: "Black cells",
      value: (state) => state.cells.filter((cell) => cell.on).length,
    },
  ],
  views: [
    {
      type: "spatial",
      label: "Virtual Ants · view grows with the trail",
      data: vantsData,
    },
    {
      type: "inspector",
      label: "Vant",
      value: (state, id) => state.agents.find((agent) => agent.id === id),
    },
  ],
});

type UIObservation = Observation<typeof model>;

/**
 * The trail grows from the centre over thousands of steps. The view frames the visited
 * area plus a margin (at least 41 cells) and widens to the whole world as the trail grows.
 */
function vantsData(state: UIObservation): SpatialData {
  const reach = Math.max(
    0,
    ...state.cells.filter((cell) => cell.on).map((cell) => Math.max(Math.abs(cell.x), Math.abs(cell.y))),
    ...state.agents.map((agent) => Math.max(Math.abs(agent.x), Math.abs(agent.y))),
  );
  const wanted = Math.max(minimumFrame, 2 * Math.ceil(reach + frameMargin) + 1);
  const width = Math.min(state.width, wanted);
  const height = Math.min(state.height, wanted);
  return {
    width,
    height,
    cells: state.cells.filter((cell) => Math.abs(cell.x) <= width / 2 && Math.abs(cell.y) <= height / 2).map((cell) => ({
      ...cell,
      color: cell.on ? "#000000" : "#ffffff",
    })),
    agents: state.agents.map((agent) => ({
      ...agent,
      color: "#d73027",
      // Grows with the zoom so an ant stays about one cell wide.
      size: Math.max(minimumAntSize, Math.min(maximumAntSize, (minimumAntSize * state.width) / width / 2)),
      shape: "triangle" as const,
    })),
  };
}

// Odd cell counts keep the centre cell centred; the margin keeps the ants in view.
const minimumFrame = 41;
const frameMargin = 6;
// CSS-pixel ant symbol bounds: the full-world size and the closest-zoom size.
const minimumAntSize = 8;
const maximumAntSize = 18;
