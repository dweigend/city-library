import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

export const ui = defineUI(model, {
  setup: [
    "width",
    "height",
    "seed",
    { field: "density", label: "Density (%)" },
  ],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/Segregation",
    label: "Source attribution · Uri Wilensky · CC BY-NC-SA 3.0",
  },
  complete: (state) => state.done,
  live: {
    similarWanted: {
      label: "Similar neighbors wanted (%)",
      set: (instance, value) => instance.setRules({ similarWanted: value }),
    },
  },
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    { label: "Residents", value: (state) => state.counts.population },
    { label: "Unhappy", value: (state) => state.counts.unhappy },
    {
      label: "Unhappy (%)",
      value: (state) => state.percentUnhappy,
      format: (value: number) => value.toFixed(1),
    },
    {
      label: "Similar (%)",
      value: (state) => state.percentSimilar,
      format: (value: number) => value.toFixed(1),
    },
    {
      label: "State",
      value: (state) =>
        state.stopReason === "no-vacancy"
          ? "No vacancy"
          : state.done
            ? "All happy"
            : "Active",
    },
  ],
  views: [
    {
      type: "inspector",
      label: "Selected",
      value: (state, selectedId) =>
        state.residents.find((resident) => resident.id === selectedId),
    },
    {
      type: "grid",
      label: "Neighborhood",
      data: (state) => ({
        width: state.width,
        height: state.height,
        cells: state.residents.map((resident) => ({
          id: resident.id,
          x: resident.x,
          y: resident.y,
          color: resident.group === "blue" ? "#355fa5" : "#d97719",
        })),
      }),
    },
    {
      type: "line",
      label: "Similar neighbors (%)",
      series: (state) => [
        {
          label: "Similar (%)",
          color: "#355fa5",
          points: state.history.map((point) => ({
            x: point.tick,
            y: point.percentSimilar,
          })),
        },
      ],
    },
    {
      type: "line",
      label: "Unhappy residents",
      series: (state) => [
        {
          label: "Unhappy",
          color: "#d97719",
          points: state.history.map((point) => ({
            x: point.tick,
            y: point.unhappy,
          })),
        },
      ],
    },
  ],
});
