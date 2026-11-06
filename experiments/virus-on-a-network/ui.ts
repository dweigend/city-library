import type { Series } from "../../ui/index.ts";
import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

export const ui = defineUI(model, {
  setup: [
    "seed",
    { field: "numberOfNodes", label: "Nodes" },
    { field: "averageNodeDegree", label: "Mean degree" },
    { field: "initialOutbreakSize", label: "Initial infected" },
  ],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/VirusonaNetwork",
    label: "Original NetLogo model · Stonedahl and Wilensky · CC BY-NC-SA 3.0",
  },
  complete: (state) => state.done,
  live: {
    spreadChance: {
      label: "Spread chance (%)",
      set: (instance, value) => instance.setRules({ spreadChance: value }),
    },
    recoveryChance: {
      label: "Recovery chance (%)",
      set: (instance, value) => instance.setRules({ recoveryChance: value }),
    },
    resistanceChance: {
      label: "Gain resistance (%)",
      set: (instance, value) => instance.setRules({ resistanceChance: value }),
    },
    checkFrequency: {
      label: "Check frequency (ticks)",
      set: (instance, value) => instance.setRules({ checkFrequency: value }),
    },
  },
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    { label: "Susceptible", value: (state) => state.counts.susceptible },
    { label: "Infected", value: (state) => state.counts.infected },
    { label: "Resistant", value: (state) => state.counts.resistant },
  ],
  views: [
    {
      type: "inspector",
      label: "Selected",
      value: (state, selected) =>
        state.nodes.find((node) => node.id === selected),
    },
    {
      type: "network",
      label: "Network",
      nodes: (state) =>
        state.nodes.map((node) => ({
          id: node.id,
          label: String(node.index),
          color:
            node.status === "infected"
              ? "#c84332"
              : node.status === "resistant"
                ? "#888888"
                : "#355fa5",
          size: 10,
        })),
      edges: (state) => state.edges,
    },
    {
      type: "line",
      label: "Network status (%)",
      series: networkStatusSeries,
    },
  ],
});

type UIObservation = ReturnType<ReturnType<typeof model.create>["read"]>;

function networkStatusSeries(state: UIObservation): readonly Series[] {
  return [
    {
      label: "Susceptible",
      color: "#355fa5",
      points: state.history.map((point) => ({
        x: point.tick,
        y: point.susceptible,
      })),
    },
    {
      label: "Infected",
      color: "#c84332",
      points: state.history.map((point) => ({
        x: point.tick,
        y: point.infected,
      })),
    },
    {
      label: "Resistant",
      color: "#888888",
      points: state.history.map((point) => ({
        x: point.tick,
        y: point.resistant,
      })),
    },
  ];
}
