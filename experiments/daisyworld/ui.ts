import type { SpatialData } from "../../ui/index.ts";
import { defineUI, netLogoColor } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["seed", "startBlacks", "startWhites"],
  live: {
    scenario: {
      set: (m, v) => m.setRules({ scenario: v }),
    },
    solarLuminosity: {
      set: (m, v) => m.setRules({ solarLuminosity: v }),
    },
    albedoSurface: {
      set: (m, v) => m.setRules({ albedoSurface: v }),
    },
    albedoBlacks: {
      set: (m, v) => m.setRules({ albedoBlacks: v }),
    },
    albedoWhites: {
      set: (m, v) => m.setRules({ albedoWhites: v }),
    },
    showTempMap: {
      set: (m, v) => m.setRules({ showTempMap: v }),
    },
    showDaisies: {
      set: (m, v) => m.setRules({ showDaisies: v }),
    },
    paintDaisiesAs: {
      set: (m, v) => m.setRules({ paintDaisiesAs: v }),
    },
  },
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/Daisyworld",
    label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0",
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
      value: (s) => s.globalTemperature.toFixed(3),
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
        (["black", "white"] as const).map((key) => ({
          label: key,
          points: s.history.map((p) => ({
            x: p.tick,
            y: p[key],
          })),
        })),
    },
  ],
});

type UIObservation = ReturnType<ReturnType<typeof model.create>["read"]>;

function daisyworldData(s: UIObservation): SpatialData {
  return {
    width: s.width,
    height: s.height,
    cells: s.cells.map((c) => ({
      ...c,
      color: s.parameters.showTempMap
        ? netLogoColor(
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
