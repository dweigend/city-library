import { defineUI, type Observation, type SpatialData } from "../../ui/index.ts";

import { model } from "./model.ts";
const binding = defineUI(model, {
  setup: ["seed", { field: "setup", label: "Initial population" }],
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Social%20Science/Ethnocentrism.nlogox",
    label: "Source attribution · Wilensky · CC BY-NC-SA 3.0",
  },
  live: {
    immigrantsPerDay: {
      set: (m, v) => m.setParameters({ immigrantsPerDay: v }),
    },
    initialPtr: {
      label: "Initial reproduction probability",
      set: (m, v) => m.setParameters({ initialPtr: v }),
    },
    costOfGiving: {
      set: (m, v) => m.setParameters({ costOfGiving: v }),
    },
    gainOfReceiving: {
      set: (m, v) => m.setParameters({ gainOfReceiving: v }),
    },
    mutationRate: {
      set: (m, v) => m.setParameters({ mutationRate: v }),
    },
    deathRate: {
      set: (m, v) => m.setParameters({ deathRate: v }),
    },
    immigrantChanceCooperateWithSame: {
      label: "Immigrant cooperation with same tag",
      set: (m, v) => m.setParameters({ immigrantChanceCooperateWithSame: v }),
    },
    immigrantChanceCooperateWithDifferent: {
      label: "Immigrant cooperation with different tag",
      set: (m, v) =>
        m.setParameters({ immigrantChanceCooperateWithDifferent: v }),
    },
  },
  actions: [
    { label: "Setup empty", run: (m) => m.setupEmpty() },
    { label: "Setup full", run: (m) => m.setupFull() },
  ],
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Population", value: (s) => s.agents.length },
    { label: "Encounters", value: (s) => s.turn.meet },
    {
      label: "Cooperation",
      value: (s) => s.turnRatios.coopPercent,
      format: (value: number) => (value * 100).toFixed(1) + "%",
    },
  ],
  views: [
    {
      type: "spatial",
      label: "Group tags and cooperation strategies",
      data: groupTagsAndCooperationStrategiesData,
    },
    {
      type: "inspector",
      label: "Individual strategy",
      value: individualStrategyInspector,
    },
    {
      type: "line",
      label: "Strategy counts",
      series: (s) =>
        (["cc", "cd", "dc", "dd"] as const).map((key, i) => ({
          label: key.toUpperCase(),
          color: ["#40914b", "#d64c4c", "#bd8c42", "#777777"][i]!,
          points: s.history.map((p) => ({ x: p.tick, y: p[key] })),
        })),
    },
  ],
});

export { model };
export const sourceMarker =
  "selected-social-b02:ethnocentrism:366bca9cfe1417bf6ff6c456581573d91bcf9e252dd8f6a0afa80954edd3dc81";

/** Public headless definition and provenance remain inspectable in the loaded binding. */
export const ui = { ...binding, model, sourceMarker };

type UIObservation = Observation<typeof model>;

function groupTagsAndCooperationStrategiesData(s: UIObservation): SpatialData {
  return {
    width: s.width,
    height: s.height,
    agents: s.agents.map((a) => ({
      id: a.id,
      x: a.x - 25,
      y: a.y - 25,
      label:
        (a.cooperateWithSame ? "C" : "D") +
        (a.cooperateWithDifferent ? "C" : "D"),
      color: ["#d64c4c", "#3d7ec4", "#d1b72e", "#3e9a58"][a.tag]!,
      shape: a.cooperateWithSame ? ("circle" as const) : ("triangle" as const),
      size: a.cooperateWithDifferent ? 8 : 5,
    })),
  };
}

function individualStrategyInspector(
  s: UIObservation,
  id: string | null,
): Readonly<Record<string, string | number | boolean>> | undefined {
  const a = s.agents.find((a) => a.id === id);
  return a
    ? {
        who: a.who,
        tag: a.tag,
        cooperateWithSame: a.cooperateWithSame,
        cooperateWithDifferent: a.cooperateWithDifferent,
        reproductionProbability: a.ptr,
      }
    : undefined;
}
