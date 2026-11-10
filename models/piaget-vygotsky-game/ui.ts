import { defineUI, indexedColor, type Observation, type SpatialData } from "../../ui/index.ts";

import { model, type Strategy } from "./model.ts";
const colors: Record<Strategy, string> = {
  Random: "#399557",
  Piagetian: "#3675db",
  Vygotskiian: "#d83838",
  "P-V": "#858585",
};
const binding = defineUI(model, {
  setup: ["seed", { field: "numberOfPlayers", label: "Players" }],
  change: (instance, changes) => instance.setParameters(changes),
  live: {
    strategy: {},
    attemptsPerRun: {},
    randomizeStrategyEachRun: {},
    stopAfterEachRun: {},
    trails: {},
    zpd: {},
    vygotskiianNeighbors: {},
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
    { label: "Attempt", value: (s) => s.attempts },
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
        (["Random", "Piagetian", "Vygotskiian", "P-V"] as const).map(
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
export const sourceMarker =
  "selected-social-b02:piaget-vygotsky-game:f0020ad932d3667cc9e5b710018366515484172bd10814aa4b1f2575f2db84c1";

/** Public headless definition and provenance remain inspectable in the loaded binding. */
export const ui = { ...binding, model, sourceMarker };

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
