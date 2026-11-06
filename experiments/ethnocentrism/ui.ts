import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
const binding = defineUI(model, {
  setup: [{ field: "seed" }, { field: "setup", label: "Initial population" }],
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Social%20Science/Ethnocentrism.nlogox",
    label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0",
  },
  live: [
    {
      field: "immigrantsPerDay",
      label: "Immigrants per day",
      value: (s) => s.parameters.immigrantsPerDay,
      set: (m, v) => m.setParameters({ immigrantsPerDay: Number(v) }),
    },
    {
      field: "initialPtr",
      label: "Initial reproduction probability",
      value: (s) => s.parameters.initialPtr,
      set: (m, v) => m.setParameters({ initialPtr: Number(v) }),
    },
    {
      field: "costOfGiving",
      label: "Cost of giving",
      value: (s) => s.parameters.costOfGiving,
      set: (m, v) => m.setParameters({ costOfGiving: Number(v) }),
    },
    {
      field: "gainOfReceiving",
      label: "Gain of receiving",
      value: (s) => s.parameters.gainOfReceiving,
      set: (m, v) => m.setParameters({ gainOfReceiving: Number(v) }),
    },
    {
      field: "mutationRate",
      label: "Mutation rate",
      value: (s) => s.parameters.mutationRate,
      set: (m, v) => m.setParameters({ mutationRate: Number(v) }),
    },
    {
      field: "deathRate",
      label: "Death rate",
      value: (s) => s.parameters.deathRate,
      set: (m, v) => m.setParameters({ deathRate: Number(v) }),
    },
    {
      field: "immigrantChanceCooperateWithSame",
      label: "Immigrant cooperation with same tag",
      value: (s) => s.parameters.immigrantChanceCooperateWithSame,
      set: (m, v) =>
        m.setParameters({ immigrantChanceCooperateWithSame: Number(v) }),
    },
    {
      field: "immigrantChanceCooperateWithDifferent",
      label: "Immigrant cooperation with different tag",
      value: (s) => s.parameters.immigrantChanceCooperateWithDifferent,
      set: (m, v) =>
        m.setParameters({ immigrantChanceCooperateWithDifferent: Number(v) }),
    },
  ],
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
      value: (s) => (s.turnRatios.coopPercent * 100).toFixed(1) + "%",
    },
  ],
  views: [
    {
      type: "spatial",
      label: "Group tags and cooperation strategies",
      data: (s) => ({
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
          shape: a.cooperateWithSame
            ? ("circle" as const)
            : ("triangle" as const),
          size: a.cooperateWithDifferent ? 8 : 5,
        })),
      }),
    },
    {
      type: "inspector",
      label: "Individual strategy",
      value: (s, id) => {
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
      },
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
