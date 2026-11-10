import { defineUI, indexedColor, type Observation, type SpatialData } from "../../ui/index.ts";

import { model, type Strategy } from "./model.ts";
const colors: Record<Strategy, string> = {
  random: "#399557",
  piagetian: "#3675db",
  vygotskiian: "#d83838",
  "piaget-vygotsky": "#858585",
};
const binding = defineUI(model, {
  setup: ["seed", { field: "playerCount", label: "Players" }],
  change: (instance, changes) => instance.setParameters(changes),
  live: {
    strategy: {},
    attemptCountPerRun: {},
    randomizeStrategyEachRun: {},
    stopAfterEachRun: {},
    trails: {},
    zpd: {},
    vygotskiianNeighborCount: {},
    moveError: {},
  },
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Psychology/Piaget-Vygotsky%20Game.nlogox",
    label: "Source attribution · Wilensky · CC BY-NC-SA 3.0",
  },
  complete: (s) => s.stopped,
  actions: [
    { label: "Next run", run: (m) => m.advance(), enabled: (s) => s.stopped },
  ],
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Attempt", value: (s) => s.attemptCount },
    { label: "Strategy", value: (s) => s.strategy },
    {
      label: "Mean distance",
      value: (s) => s.meanScore,
      format: (value: number) => value.toFixed(3),
    },
  ],
  views: [
    {
      type: "spatial",
      label: "Target throws",
      data: targetThrowsData,
    },
    {
      type: "line",
      label: "Average distance from target",
      series: (s) =>
        (["random", "piagetian", "vygotskiian", "piaget-vygotsky"] as const).map(
          (strategy) => ({
            label: strategy,
            color: colors[strategy],
            points: s.history
              .filter((p) => p.strategy === strategy && p.attempt > 0)
              .map((p) => ({ x: p.attempt, y: p.meanScore })),
          }),
        ),
    },
    {
      type: "bar",
      label: "Strategy averages",
      series: (s) =>
        s.strategyAverages.map((a, i) => ({
          label: a.strategy,
          color: colors[a.strategy],
          points: a.mean === null ? [] : [{ x: i, y: a.mean }],
        })),
    },
    {
      type: "inspector",
      label: "Selected player",
      value: (s, id) => s.players.find((p) => p.id === id),
    },
  ],
});

export { model };


/** Public headless definition and provenance remain inspectable in the loaded binding. */
export const ui = { ...binding, model };

type UIObservation = Observation<typeof model>;

function targetThrowsData(s: UIObservation): SpatialData {
  return {
    width: s.width,
    height: s.height,
    cells: s.cells.map((c) => ({
      ...c,
      color: c.target ? colors[s.strategy] : indexedColor(c.trailColor),
    })),
    agents: s.players.map((p) => ({
      ...p,
      size: 8,
      shape: "triangle" as const,
      color: indexedColor(p.color),
    })),
  };
}
