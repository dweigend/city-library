import { defineUI, indexedColor, type Observation, type SpatialData } from "../../ui/index.ts";

import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["seed", "initialBlackDaisyCount", "initialWhiteDaisyCount"],
  change: (instance, changes) => instance.setRules(changes),
  live: {
    scenario: {},
    solarLuminosity: {},
    albedoSurface: {},
    albedoBlacks: {},
    albedoWhites: {},
    showTempMap: {},
    showDaisies: {},
    paintDaisiesAs: {},
  },
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/Daisyworld",
    label: "Source attribution · Wilensky · CC BY-NC-SA 3.0",
  },
  drawing: {
    toggleLabel: "Paint daisies",
    enabled: () => true,
    intent: (m, intent) => {
      if (intent.phase !== "end")
        m.paint(
          intent.position.x,
          intent.position.y,
          m.read().parameters.paintDaisiesAs,
        );
    },
  },
  actions: [
    {
      label: "Remove all daisies",
      run: (m) => m.removeAllDaisies(),
    },
  ],
  monitors: [
    {
      label: "Tick",
      value: (s) => s.tick,
    },
    {
      label: "Global temperature",
      value: (s) => s.globalTemperature,
      format: (value: number) => value.toFixed(3),
    },
    {
      label: "Black daisies",
      value: (s) => s.blackCount,
    },
    {
      label: "White daisies",
      value: (s) => s.whiteCount,
    },
  ],
  views: [
    {
      type: "spatial",
      label: "Daisyworld",
      data: daisyworldData,
    },
    {
      type: "line",
      label: "Luminosity",
      series: (s) => [
        {
          label: "solar luminosity",
          points: s.history.map((p) => ({
            x: p.tick,
            y: p.luminosity,
          })),
        },
      ],
    },
    {
      type: "line",
      label: "Global temperature",
      series: (s) => [
        {
          label: "temperature",
          points: s.history.map((p) => ({
            x: p.tick,
            y: p.temperature,
          })),
        },
      ],
    },
    {
      type: "line",
      label: "Population",
      series: (s) =>
        (["blackDaisyCount", "whiteDaisyCount"] as const).map((key) => ({
          label: key === "blackDaisyCount" ? "Black" : "White",
          points: s.history.map((p) => ({
            x: p.tick,
            y: p[key],
          })),
        })),
    },
  ],
});

type UIObservation = Observation<typeof model>;

function daisyworldData(s: UIObservation): SpatialData {
  return {
    width: s.width,
    height: s.height,
    cells: s.cells.map((c) => ({
      ...c,
      color: s.parameters.showTempMap
        ? indexedColor(
            10 + 9.999 * Math.max(0, Math.min(1, (c.temperature + 50) / 160)),
          )
        : "#8d8d8d",
    })),
    agents: s.parameters.showDaisies
      ? s.daisies.map((a) => ({
          ...a,
          color: a.kind === "black" ? "#000000" : "#ffffff",
          size: 6,
        }))
      : [],
  };
}
