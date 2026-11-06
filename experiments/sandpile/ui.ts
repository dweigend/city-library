import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: [
    { field: "width" },
    { field: "height" },
    { field: "seed" },
    { field: "initial" },
  ],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/Sandpile",
    label: "Original NetLogo model · Weintrop et al. / Wilensky · CC0",
  },
  live: [
    {
      field: "grainsPerField",
      label: "Grains per field",
      value: (s) => s.parameters.grainsPerField,
      set: (m, v) => m.setLive({ grainsPerField: Number(v) }),
    },
    {
      field: "dropLocation",
      label: "Drop location",
      value: (s) => s.parameters.dropLocation,
      set: (m, v) =>
        m.setLive({ dropLocation: v as "center" | "random" | "mouse-click" }),
    },
    {
      field: "animateAvalanches",
      label: "Highlight avalanches",
      value: (s) => s.parameters.animateAvalanches,
      set: (m, v) => m.setLive({ animateAvalanches: Boolean(v) }),
    },
  ],
  actions: [
    { label: "Setup random", run: (m) => m.setupRandom() },
    { label: "Setup uniform", run: (m) => m.setupUniform() },
    { label: "Clear size and lifetime data", run: (m) => m.clearData() },
    {
      label: "Explore",
      run: (m) => m.setExploreMode(!m.read().exploreMode),
      pressed: (s) => s.exploreMode,
    },
  ],
  drawing: {
    toggleLabel: "Interact",
    enabled: (s) =>
      s.exploreMode || s.parameters.dropLocation === "mouse-click",
    intent: (m, i) => {
      if (i.phase === "end") return;
      const s = m.read(),
        x = Math.round(i.position.x),
        y = Math.round(i.position.y);
      if (Math.abs(x) > (s.width - 1) / 2 || Math.abs(y) > (s.height - 1) / 2)
        return;
      if (s.exploreMode) m.exploreAt(x, y);
      else if (i.phase === "begin") m.dropAt(x, y);
    },
  },
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Average", value: (s) => s.average.toFixed(4) },
    { label: "Last avalanche size", value: (s) => s.sizes.at(-1) ?? 0 },
    { label: "Last avalanche lifetime", value: (s) => s.lifetimes.at(-1) ?? 0 },
  ],
  views: [
    {
      type: "grid",
      label: "Pile",
      data: (s) => ({
        width: s.width,
        height: s.height,
        cells: s.cells.map((c) => ({
          ...c,
          color: c.explored
            ? "#43d36b"
            : s.parameters.animateAvalanches && c.fired
              ? "#ef4040"
              : (["#000000", "#032b63", "#105ab4", "#5388d3"][c.n] ??
                "#ffffff"),
        })),
      }),
    },
    {
      type: "line",
      label: "Average grain count",
      series: (s) => [
        {
          label: "Average",
          points: s.history.map((p) => ({ x: p.tick, y: p.average })),
        },
      ],
    },
    {
      type: "scatter",
      label: "Avalanche sizes (log10)",
      series: (s) => [{ label: "Log count", points: s.sizePlot }],
    },
    {
      type: "scatter",
      label: "Avalanche lifetimes (log10)",
      series: (s) => [{ label: "Log count", points: s.lifetimePlot }],
    },
  ],
});
