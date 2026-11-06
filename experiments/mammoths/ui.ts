import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: [
    { field: "seed" },
    { field: "numberOfMammoths" },
    { field: "numberOfHumans" },
  ],
  live: (
    [
      "mammothBirthRate",
      "humanBirthRate",
      "mammothSpeed",
      "humanSpeed",
      "oddsOfKilling",
      "climateChangeDecayChance",
    ] as const
  ).map((field) => ({
    field,
    value: (s) => s.parameters[field],
    set: (m, value) => m.setParameters({ [field]: Number(value) }),
  })),
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Biology/Evolution/Mammoths.nlogox",
    label: "NetLogo Mammoths · Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    { label: "Months", value: (s) => s.tick },
    { label: "Years", value: (s) => s.years },
    { label: "Mammoths", value: (s) => s.mammoths.length },
    { label: "Humans", value: (s) => s.humans.length },
    { label: "Hunting deaths", value: (s) => s.mammothsKilledByHumans },
    { label: "Climate deaths", value: (s) => s.mammothsKilledByClimateChange },
  ],
  views: [
    {
      type: "spatial",
      label: "Americas habitat",
      data: (s) => ({
        width: s.width,
        height: s.height,
        cells: s.cells.map((c) => ({
          ...c,
          color:
            c.terrain === "ocean"
              ? "#245eaa"
              : c.terrain === "changed"
                ? "#a7d67c"
                : "#329b32",
        })),
        agents: [
          ...s.mammoths.map((a) => ({ ...a, color: "#8c541f", size: 5 })),
          ...s.humans.map((a) => ({ ...a, color: "#ffdf00", size: 4 })),
        ],
      }),
    },
    {
      type: "line",
      label: "Populations",
      series: (s) =>
        (["mammoths", "humans"] as const).map((key) => ({
          label: key,
          color: key === "mammoths" ? "#8c541f" : "#b8a600",
          points: s.history.map((p) => ({ x: p.tick, y: p[key] })),
        })),
    },
    {
      type: "line",
      label: "Cause of mammoth deaths",
      series: (s) =>
        (["hunting", "climate"] as const).map((key) => ({
          label: key,
          color: key === "hunting" ? "#b8a600" : "#329b32",
          points: s.history.map((p) => ({ x: p.tick, y: p[key] })),
        })),
    },
    {
      type: "inspector",
      label: "Resident",
      value: (s, id) => {
        const a = [...s.mammoths, ...s.humans].find((a) => a.id === id);
        return a
          ? {
              breed: a.breed,
              ageMonths: a.age,
              settled: a.settled,
              sourceX: a.originalX,
              sourceY: a.originalY,
            }
          : undefined;
      },
    },
  ],
});
