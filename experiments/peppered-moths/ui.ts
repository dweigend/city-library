import { defineUI, netLogoColor } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: [{ field: "seed" }],
  live: (
    ["numMoths", "speed", "mutation", "selection", "cyclePollution"] as const
  ).map((field) => ({
    field,
    value: (s) => s.parameters[field],
    set: (m, value) =>
      m.setParameters({
        [field]: field === "cyclePollution" ? Boolean(value) : Number(value),
      }),
  })),
  actions: [
    { label: "Pollute", run: (m) => m.polluteWorld() },
    { label: "Clean up", run: (m) => m.cleanUpWorld() },
  ],
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Biology/Evolution/Peppered%20Moths.nlogox",
    label: "NetLogo Peppered Moths · Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Light", value: (s) => s.lightMoths },
    { label: "Medium", value: (s) => s.mediumMoths },
    { label: "Dark", value: (s) => s.darkMoths },
    { label: "Pollution (%)", value: (s) => s.pollutionPercent },
  ],
  views: [
    {
      type: "spatial",
      label: "Moths and pollution",
      data: (s) => ({
        width: s.width,
        height: s.height,
        cells: s.cells.map((c) => ({ ...c, color: netLogoColor(c.color) })),
        agents: s.moths.map((a) => ({
          ...a,
          color: netLogoColor(a.color),
          size: 6,
        })),
      }),
    },
    {
      type: "line",
      label: "Color populations",
      series: (s) =>
        (["light", "medium", "dark", "pollution"] as const).map((key) => ({
          label: key,
          color:
            key === "light"
              ? "#888888"
              : key === "medium"
                ? "#4575b4"
                : key === "dark"
                  ? "#d73027"
                  : "#7b6db0",
          points: s.history.map((p) => ({ x: p.tick, y: p[key] })),
        })),
    },
    {
      type: "inspector",
      label: "Moth",
      value: (s, id) => {
        const a = s.moths.find((a) => a.id === id);
        return a ? { age: a.age, color: a.color } : undefined;
      },
    },
  ],
});
