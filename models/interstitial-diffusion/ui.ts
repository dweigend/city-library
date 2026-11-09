import { defineUI, type Observation, type Series, type SpatialData } from "../../ui/index.ts";

import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: [
    "width",
    "height",
    "seed",
    "initialBulkConcentration",
    "initialColumnsPopulated",
  ],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/InterstitialDiffusion",
    label: "Original NetLogo model · Uri Wilensky · CC BY-NC-SA 3.0",
  },
  live: {
    maxTicks: {
      set: (m, v) => m.setRules({ maxTicks: v }),
    },
    constantLeftSurface: {
      set: (m, v) => m.setRules({ constantLeftSurface: v }),
    },
    leftSurfaceConcentration: {
      set: (m, v) => m.setRules({ leftSurfaceConcentration: v }),
    },
    constantRightSurface: {
      set: (m, v) => m.setRules({ constantRightSurface: v }),
    },
    rightSurfaceConcentration: {
      set: (m, v) => m.setRules({ rightSurfaceConcentration: v }),
    },
    goMode: {
      set: (m, v) => m.setRules({ goMode: v }),
    },
  },
  actions: [
    { label: "Show/hide lattice atoms", run: (m) => m.toggleLattice() },
  ],
  drawing: {
    enabled: (s) => s.parameters.goMode === "draw-profile",
    intent: (m, event) => {
      if (event.phase !== "end")
        m.drawProfile(event.position.x, event.position.y);
    },
  },
  complete: (s) => s.done,
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Diffusing atoms", value: (s) => s.atoms.length },
  ],
  views: [
    {
      type: "line",
      label: "Concentration profile",
      series: concentrationProfileSeries,
    },
    {
      type: "spatial",
      label: "Lattice and diffusing atoms",
      data: latticeAndDiffusingAtomsData,
    },
    {
      type: "inspector",
      label: "Diffusing atom",
      value: (s, id) => s.atoms.find((a) => a.id === id),
    },
  ],
});

type UIObservation = Observation<typeof model>;

function concentrationProfileSeries(s: UIObservation): readonly Series[] {
  return [
    {
      label: "Current",
      color: "#a39600",
      points: s.profile.map((p) => ({ x: p.x, y: p.concentration })),
    },
    {
      label: "Initial",
      color: "#d491ce",
      points: s.initialProfile.map((p) => ({ x: p.x, y: p.concentration })),
    },
    ...(s.profileAt15
      ? [
          {
            label: "After 15 ticks",
            color: "#909090",
            points: s.profileAt15.map((p) => ({
              x: p.x,
              y: p.concentration,
            })),
          },
        ]
      : []),
  ];
}

function latticeAndDiffusingAtomsData(s: UIObservation): SpatialData {
  return {
    width: s.width,
    height: s.height,
    cells: s.cells.map((c) => ({ ...c, color: "#000000" })),
    segments:
      s.parameters.goMode === "draw-profile"
        ? s.profile.slice(1).map((p, i) => ({
            from: {
              x: s.profile[i]!.x,
              y: (s.height - 1) / 2 - 25 + 25 * s.profile[i]!.concentration,
            },
            to: {
              x: p.x,
              y: (s.height - 1) / 2 - 25 + 25 * p.concentration,
            },
            color: "#eedb00",
            width: 2,
          }))
        : [],
    agents: [
      ...(s.latticeVisible
        ? s.lattice.map((a) => ({
            ...a,
            color: "#355fa5",
            size: 7,
            shape: "circle" as const,
          }))
        : []),
      ...s.atoms.map((a) => ({
        ...a,
        color: "#eedb00",
        size: 3,
        shape: "circle" as const,
      })),
    ],
  };
}
