import { defineUI, type Observation, type SpatialData } from "../../ui/index.ts";

import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["seed", "mammothCount", "humanCount"],
  change: (instance, changes) => instance.setParameters(changes),
  live: {
    mammothBirthRate: {},
    humanBirthRate: {},
    mammothSpeed: {},
    humanSpeed: {},
    oddsOfKilling: {},
    climateChangeDecayChance: {},
  },
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Biology/Evolution/Mammoths.nlogox",
    label: "Source attribution · Mammoths · Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    { label: "Months", value: (s) => s.tick },
    { label: "Years", value: (s) => s.years },
    { label: "Mammoths", value: (s) => s.mammoths.length },
    { label: "Humans", value: (s) => s.humans.length },
    { label: "Hunting deaths", value: (s) => s.humanKilledMammothCount },
    { label: "Climate deaths", value: (s) => s.climateKilledMammothCount },
  ],
  views: [
    {
      type: "spatial",
      label: "Americas habitat",
      data: americasHabitatData,
    },
    {
      type: "line",
      label: "Populations",
      series: (s) =>
        (["mammothCount", "humanCount"] as const).map((key) => ({
          label: key === "mammothCount" ? "Mammoths" : "Humans",
          color: key === "mammothCount" ? "#8c541f" : "#b8a600",
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
      value: residentInspector,
    },
  ],
});

type UIObservation = Observation<typeof model>;

function americasHabitatData(s: UIObservation): SpatialData {
  return {
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
  };
}

function residentInspector(
  s: UIObservation,
  id: string | null,
): Readonly<Record<string, string | number | boolean>> | undefined {
  const a = [...s.mammoths, ...s.humans].find((a) => a.id === id);
  return a
    ? {
        group: a.group,
        ageMonths: a.age,
        settled: a.settled,
        sourceX: a.originalX,
        sourceY: a.originalY,
      }
    : undefined;
}
