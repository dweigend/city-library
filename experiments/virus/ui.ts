import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

const binding = defineUI(model, {
  setup: [{ field: "seed" }, { field: "numberPeople" }],
  live: [
    {
      field: "infectiousness",
      value: (state) => state.parameters.infectiousness,
      set: (instance, value) =>
        instance.setParameters({ infectiousness: Number(value) }),
    },
    {
      field: "chanceRecover",
      value: (state) => state.parameters.chanceRecover,
      set: (instance, value) =>
        instance.setParameters({ chanceRecover: Number(value) }),
    },
    {
      field: "duration",
      value: (state) => state.parameters.duration,
      set: (instance, value) =>
        instance.setParameters({ duration: Number(value) }),
    },
    {
      field: "turtleShape",
      value: (state) => state.parameters.turtleShape,
      set: (instance, value) =>
        instance.setParameters({
          turtleShape: value === "circle" ? "circle" : "person",
        }),
    },
  ],
  actions: [],
  complete: (state) => state.stopped,
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Biology/Virus.nlogox",
    label: "Original NetLogo model · source notices",
  },
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    { label: "Infected %", value: (state) => state.percentInfected },
    { label: "Immune %", value: (state) => state.percentImmune },
  ],
  views: [
    {
      type: "spatial",
      label: "Virus",
      data: (state) => ({
        width: state.width,
        height: state.height,
        agents: state.agents.map((agent) => ({
          ...agent,
          shape:
            agent.shape === "person"
              ? ("triangle" as const)
              : ("circle" as const),
          size: 5,
        })),
      }),
    },
    {
      type: "line",
      label: "History",
      series: (state) => [
        {
          label: "Population",
          color: "#408dde",
          points: state.history.map((point) => ({
            x: point.tick,
            y: Number(point.population),
          })),
        },
        {
          label: "Infected %",
          color: "#df4545",
          points: state.history.map((point) => ({
            x: point.tick,
            y: Number(point.infected),
          })),
        },
        {
          label: "Immune %",
          color: "#888888",
          points: state.history.map((point) => ({
            x: point.tick,
            y: Number(point.immune),
          })),
        },
      ],
    },
  ],
});

export { model };
export const sourceMarker =
  "selected-disease-gene-b09:virus:43e370765de7a5601d5b39e40904372016289974c24c94de32634132c3692683";
export const ui = { ...binding, model, sourceMarker };
