import { defineUI, netLogoColor } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: [{ field: "seed" }],
  live: (["memoryDuration", "mutationRate", "memorySize"] as const).map(
    (field) => ({
      field,
      value: (s) => s.parameters[field],
      set: (m, value) => m.setParameters({ [field]: Number(value) }),
    }),
  ),
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Biology/Evolution/Mimicry.nlogox",
    label: "NetLogo Mimicry · Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Monarchs", value: (s) => s.monarchs.length },
    { label: "Viceroys", value: (s) => s.viceroys.length },
    ...(["monarchColor", "viceroyColor"] as const).flatMap((group) =>
      (["min", "mean", "max"] as const).map((metric) => ({
        label: `${group === "monarchColor" ? "Monarch color" : "Viceroy color"} ${metric}`,
        value: (s: ReturnType<ReturnType<typeof model.create>["read"]>) =>
          s[group][metric] ?? "N/A",
      })),
    ),
  ],
  views: [
    {
      type: "spatial",
      label: "Birds and butterflies",
      data: (s) => ({
        width: s.width,
        height: s.height,
        agents: [...s.monarchs, ...s.viceroys, ...s.birds].map((a) => ({
          ...a,
          color: a.breed === "bird" ? "#666666" : netLogoColor(a.color),
          size: a.breed === "bird" ? 7 : 5,
          shape:
            a.breed === "bird" ? ("triangle" as const) : ("circle" as const),
        })),
      }),
    },
    {
      type: "line",
      label: "Butterfly populations",
      series: (s) =>
        (["monarchs", "viceroys"] as const).map((key) => ({
          label: key === "monarchs" ? "Monarchs" : "Viceroys",
          color: key === "monarchs" ? "#d73027" : "#4575b4",
          points: s.history.map((p) => ({ x: p.tick, y: p[key] })),
        })),
    },
    {
      type: "line",
      label: "Mean butterfly colors",
      series: (s) =>
        (["monarchMeanColor", "viceroyMeanColor"] as const).map((key) => ({
          label: key === "monarchMeanColor" ? "Monarchs" : "Viceroys",
          color: key === "monarchMeanColor" ? "#d73027" : "#4575b4",
          points: s.history.flatMap((p) =>
            p[key] === undefined ? [] : [{ x: p.tick, y: p[key]! }],
          ),
        })),
    },
    {
      type: "inspector",
      label: "Bird memory",
      value: (s, id) => {
        const a = [...s.birds, ...s.monarchs, ...s.viceroys].find(
          (a) => a.id === id,
        );
        return a
          ? { breed: a.breed, color: a.color, memory: JSON.stringify(a.memory) }
          : undefined;
      },
    },
  ],
});
