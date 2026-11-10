import { defineUI, indexedColor, type Observation } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["seed"],
  live: {
    memoryDuration: {
      set: (m, value) => m.setParameters({ memoryDuration: value }),
    },
    mutationRate: {
      set: (m, value) => m.setParameters({ mutationRate: value }),
    },
    memorySize: {
      set: (m, value) => m.setParameters({ memorySize: value }),
    },
  },
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Biology/Evolution/Mimicry.nlogox",
    label: "Source attribution · Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Monarchs", value: (s) => s.monarchs.length },
    { label: "Viceroys", value: (s) => s.viceroys.length },
    ...(["monarchColor", "viceroyColor"] as const).flatMap((group) =>
      (["min", "mean", "max"] as const).map((metric) => ({
        label: `${group === "monarchColor" ? "Monarch color" : "Viceroy color"} ${metric}`,
        value: (s: Observation<typeof model>) => s[group][metric] ?? "N/A",
        format: (value: number | string) =>
          typeof value === "number" ? String(Number(value.toFixed(3))) : value,
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
          color: a.group === "bird" ? "#666666" : indexedColor(a.color),
          size: a.group === "bird" ? 7 : 5,
          shape:
            a.group === "bird" ? ("triangle" as const) : ("circle" as const),
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
          ? { group: a.group, color: a.color, memory: JSON.stringify(a.memory) }
          : undefined;
      },
    },
  ],
});
