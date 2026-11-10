import { defineUI, type Observation, type SpatialData } from "../../ui/index.ts";

import { model } from "./model.ts";
const binding = defineUI(model, {
  setup: [
    "seed",
    { field: "number", label: "People" },
    { field: "groupCount", label: "Groups" },
  ],
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Social%20Science/Party.nlogox",
    label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0",
  },
  live: {
    tolerance: {
      label: "Opposite-sex tolerance (%)",
      set: (m, v) => m.setParameters({ tolerance: v }),
    },
  },
  complete: (s) => s.stopped,
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Happy", value: (s) => s.happyCount },
    { label: "Single-sex groups", value: (s) => s.boringGroups },
  ],
  views: [
    {
      type: "spatial",
      label: "Party groups",
      data: partyGroupsData,
    },
    {
      type: "inspector",
      label: "Person",
      value: (s, id) => {
        const a = s.people.find((a) => a.id === id);
        return a
          ? { who: a.who, sex: a.sex, group: a.group, happy: a.happy }
          : undefined;
      },
    },
    {
      type: "line",
      label: "Number happy",
      series: (s) => [
        {
          label: "Happy",
          color: "#40914b",
          points: s.history.map((p) => ({ x: p.tick, y: p.happyCount })),
        },
      ],
    },
    {
      type: "line",
      label: "Single-sex groups",
      series: (s) => [
        {
          label: "Single-sex groups",
          color: "#cc5555",
          points: s.history.map((p) => ({ x: p.tick, y: p.boringGroups })),
        },
      ],
    },
  ],
});

export { model };
export const sourceMarker =
  "selected-social-b02:party:a86f4b7e1d631f69bf9db2a4ff54d77387a8de802487d536c3f0c1f984ebf272";

/** Public headless definition and provenance remain inspectable in the loaded binding. */
export const ui = { ...binding, model, sourceMarker };

type UIObservation = Observation<typeof model>;

function partyGroupsData(s: UIObservation): SpatialData {
  return {
    width: s.width + 12,
    height: s.height,
    showLabels: true,
    agents: [
      ...s.people.map((a) => ({
        id: a.id,
        x: a.x + 39.5,
        y: a.y,
        color: a.sex === "female" ? "#dc70b5" : "#4281cd",
        size: 8,
        shape: "circle" as const,
      })),
      ...s.groups.map((g) => ({
        id: g.id,
        x: g.x + 39.5,
        y: 0,
        label: String(g.count),
        color: g.boring ? "#888888" : "#b8b8b8",
        size: 3,
        shape: "circle" as const,
      })),
    ],
  };
}
