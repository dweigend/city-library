import { defineUI, netLogoColor } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: [
    { field: "seed" },
    { field: "numberOfStores", label: "Stores" },
    { field: "layout", label: "Layout" },
  ],
  live: [
    {
      field: "rules",
      label: "Rules",
      value: (s) => s.parameters.rules,
      set: (m, v) =>
        m.setRules({ rules: v as "normal" | "moving-only" | "pricing-only" }),
    },
  ],
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Social%20Science/Economics/Hotelling's%20Law.nlogox",
    label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Consumers", value: (s) => s.consumers.length },
  ],
  views: [
    {
      type: "spatial",
      label: "Stores and market areas",
      data: (s) => ({
        width: s.width,
        height: s.height,
        cells: s.consumers.map((c) => ({
          ...c,
          color: netLogoColor(
            (s.stores.find((t) => t.id === c.preferredStore)?.color ?? 0) + 2,
          ),
        })),
        agents: s.stores.map((t) => ({
          ...t,
          color: netLogoColor(t.color),
          label: String(t.price),
          size: 12,
        })),
      }),
    },
    {
      type: "line",
      label: "Market area history",
      series: (s) =>
        s.stores.map((t, i) => ({
          label: `Store ${i + 1}`,
          color: netLogoColor(t.color),
          points: s.history.map((h) => ({
            x: h.tick,
            y: h.stores.find((x) => x.id === t.id)?.areaCount ?? 0,
          })),
        })),
    },
    {
      type: "line",
      label: "Revenue history",
      series: (s) =>
        s.stores.map((t, i) => ({
          label: `Store ${i + 1}`,
          color: netLogoColor(t.color),
          points: s.history.map((h) => ({
            x: h.tick,
            y: h.stores.find((x) => x.id === t.id)?.revenue ?? 0,
          })),
        })),
    },
    {
      type: "bar",
      label: "Market shares",
      series: (s) => [
        {
          label: "Consumers",
          points: s.stores.map((t, i) => ({ x: i, y: t.areaCount })),
        },
      ],
    },
    {
      type: "line",
      label: "Store prices",
      series: (s) =>
        s.stores.map((t, i) => ({
          label: `Store ${i + 1}`,
          color: netLogoColor(t.color),
          points: s.history.map((h) => ({
            x: h.tick,
            y: h.stores.find((x) => x.id === t.id)?.price ?? 0,
          })),
        })),
    },
  ],
});
