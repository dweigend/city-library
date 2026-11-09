import { defineUI, type Observation, type GridData } from "../../ui/index.ts";

import { model } from "./model.ts";
const binding = defineUI(model, {
  setup: ["seed", { field: "setup", label: "Initial sources" }],
  live: {
    initClique: {
      label: "Initial clique (%)",
      set: (m, v) => m.setParameters({ initClique: v }),
    },
    eightMode: {
      label: "Eight neighbors",
      set: (m, v) => m.setParameters({ eightMode: v }),
    },
  },
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Social%20Science/Rumor%20Mill.nlogox",
    label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0",
  },
  complete: (s) => s.stopped,
  actions: [
    { label: "Seed center", run: (m) => m.seedOne() },
    { label: "Seed random", run: (m) => m.seedRandom() },
    {
      label: "Color: normal",
      run: (m) => m.setColorMode("normal"),
      pressed: (s) => s.colorMode === "normal",
    },
    {
      label: "Color: when heard",
      run: (m) => m.setColorMode("when-heard"),
      pressed: (s) => s.colorMode === "when-heard",
    },
    {
      label: "Color: times heard",
      run: (m) => m.setColorMode("times-heard"),
      pressed: (s) => s.colorMode === "times-heard",
    },
  ],
  drawing: {
    toggleLabel: "Spread rumor",
    enabled: () => true,
    intent: (m, intent) => {
      if (intent.phase !== "end")
        m.hearAt({
          x: Math.max(-50, Math.min(50, Math.floor(intent.position.x + 0.5))),
          y: Math.max(-50, Math.min(50, Math.floor(intent.position.y + 0.5))),
        });
    },
  },
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    {
      label: "Clique (%)",
      value: (s) => s.percent,
      format: (value: number) => value.toFixed(3),
    },
    { label: "Times heard", value: (s) => s.totalHeard },
  ],
  views: [
    {
      type: "grid",
      label: "Rumor spread",
      data: rumorSpreadData,
    },
    {
      type: "line",
      label: "Rumor spread (%)",
      series: (s) => [
        {
          label: "Informed",
          color: "#d83838",
          points: s.history.map((p) => ({ x: p.tick, y: p.percent })),
        },
      ],
    },
    {
      type: "line",
      label: "Successive differences",
      series: (s) => [
        {
          label: "Newly informed",
          color: "#d83838",
          points: s.history.map((p) => ({ x: p.tick, y: p.difference })),
        },
      ],
    },
    {
      type: "line",
      label: "Successive ratios",
      series: (s) => [
        {
          label: "Ratio",
          color: "#d83838",
          points: s.history.map((p) => ({ x: p.tick, y: p.ratio })),
        },
      ],
    },
    {
      type: "inspector",
      label: "Selected patch",
      value: (s, id) => s.cells.find((c) => c.id === id),
    },
  ],
});

export { model };
export const sourceMarker =
  "selected-social-b02:rumor-mill:4807e040a21562f9feaa2bf5a99c6819f26918b0cd76e0460af802d980521b63";

/** Public headless definition and provenance remain inspectable in the loaded binding. */
export const ui = { ...binding, model, sourceMarker };

type UIObservation = Observation<typeof model>;

function rumorSpreadData(s: UIObservation): GridData {
  return {
    width: s.width,
    height: s.height,
    cells: s.cells.map((c) => ({
      ...c,
      color:
        s.colorMode === "normal"
          ? c.timesHeard > 0
            ? "#dd3434"
            : "#355bd5"
          : s.colorMode === "when-heard"
            ? c.firstHeard < 0
              ? "#000000"
              : `hsl(55 90% ${Math.max(8, 95 - (c.firstHeard / 101) * 90)}%)`
            : `hsl(135 65% ${Math.min(85, (c.timesHeard / 101) * 85)}%)`,
    })),
  };
}
