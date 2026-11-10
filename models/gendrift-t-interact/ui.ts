import { defineUI, indexedColor, type Observation, type SpatialData } from "../../ui/index.ts";

import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["seed", "number", "colors"],
  actions: [
    { label: "Setup preserving walls", run: (m) => m.setup() },
    {
      label: "Place walls",
      run: (m) => m.setWallMode("place"),
      pressed: (s) => s.wallMode === "place",
    },
    {
      label: "Remove walls",
      run: (m) => m.setWallMode("remove"),
      pressed: (s) => s.wallMode === "remove",
    },
    { label: "Remove all walls", run: (m) => m.removeAllWalls() },
  ],
  drawing: {
    toggleLabel: "Draw walls",
    enabled: () => true,
    intent: (m, intent) => {
      if (intent.phase !== "end") m.drawWall(intent.position.y);
    },
  },
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Biology/Evolution/Genetic%20Drift/GenDrift%20T%20interact.nlogox",
    label: "Source attribution · Wilensky · CC BY-NC-SA 3.0",
  },
  complete: (s) => s.done,
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    {
      label: "Most populous (%)",
      value: (s) => s.maxPercent,
      format: (value: number) => String(Number(value.toFixed(2))),
    },
  ],
  views: [
    {
      type: "spatial",
      label: "Genetic drift and walls",
      data: geneticDriftAndWallsData,
    },
    {
      type: "line",
      label: "Agent populations",
      series: (s) =>
        [5, 15, 25, 35, 45, 55, 65, 125, 85, 95].map((c, i) => ({
          label: `Color ${c}`,
          color: indexedColor(c),
          points: s.history.map((p) => ({ x: p.tick, y: p.counts[i]! })),
        })),
    },
    {
      type: "inspector",
      label: "Selected agent",
      value: (s, id) => s.agents.find((a) => a.id === id),
    },
  ],
});

type UIObservation = Observation<typeof model>;

function geneticDriftAndWallsData(s: UIObservation): SpatialData {
  return {
    width: s.width,
    height: s.height,
    cells: s.cells.map((c) => ({
      ...c,
      color: c.wall ? "#ffffff" : "#000000",
    })),
    agents: s.agents.map((a) => ({
      ...a,
      color: indexedColor(a.colorNumber),
      size: 6,
      shape: "triangle" as const,
    })),
  };
}
