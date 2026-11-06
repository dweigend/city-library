import { stats } from "city-library";
import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

const binding = defineUI(model, {
  setup: [
    { field: "seed" },
    { field: "initialArraySize" },
    { field: "maxVirusTypes" },
  ],
  live: [
    {
      field: "guideUnbindChance",
      value: (state) => state.parameters.guideUnbindChance,
      set: (instance, value) =>
        instance.setParameters({ guideUnbindChance: Number(value) }),
    },
    {
      field: "processivity",
      value: (state) => state.parameters.processivity,
      set: (instance, value) =>
        instance.setParameters({ processivity: Number(value) }),
    },
    {
      field: "crisprFunction",
      value: (state) => state.parameters.crisprFunction,
      set: (instance, value) =>
        instance.setParameters({ crisprFunction: Number(value) }),
    },
    {
      field: "labels",
      value: (state) => state.parameters.labels,
      set: (instance, value) =>
        instance.setParameters({ labels: Boolean(value) }),
    },
  ],
  actions: [
    {
      label: "Common infection",
      run: (instance) => instance.commonInfection(),
    },
    {
      label: "Random infection",
      run: (instance) => instance.randomInfection(),
    },
  ],
  complete: (state) => state.stopped,
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Biology/CRISPR/CRISPR%20Bacterium.nlogox",
    label: "Original NetLogo model · source notices",
  },
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    { label: "RNAP", value: (state) => state.rnapCount },
    { label: "Cas9", value: (state) => state.cas9Count },
    { label: "Guides", value: (state) => state.guideCount },
    { label: "Viruses", value: (state) => state.virusCount },
    { label: "Event", value: (state) => state.virusEvent },
  ],
  views: [
    {
      type: "spatial",
      label: "CRISPR Bacterium",
      data: (state) => ({
        width: state.width,
        height: state.height,
        agents: state.agents.map((agent) => ({ ...agent, size: 5 })),
        cells: state.cells,
      }),
    },
    {
      type: "bar",
      label: "Guide and spacer sequences",
      series: (state) => [
        {
          label: "Guides",
          points: stats
            .histogram(state.guideSequences, {
              edges: Array.from(
                { length: state.parameters.maxVirusTypes + 1 },
                (_, i) => i - 0.5,
              ),
            })
            .counts.map((count, sequence) => ({ x: sequence, y: count })),
        },
        {
          label: "Array",
          points: stats
            .histogram(state.array, {
              edges: Array.from(
                { length: state.parameters.maxVirusTypes + 1 },
                (_, i) => i - 0.5,
              ),
            })
            .counts.map((count, sequence) => ({ x: sequence, y: count })),
        },
      ],
    },
    {
      type: "line",
      label: "History",
      series: (state) => [
        {
          label: "Cas9",
          color: "#35a85b",
          points: state.history.map((point) => ({
            x: point.tick,
            y: Number(point.cas9),
          })),
        },
        {
          label: "Guides",
          color: "#2db5a4",
          points: state.history.map((point) => ({
            x: point.tick,
            y: Number(point.guides),
          })),
        },
        {
          label: "Cas1/2",
          color: "#d18b34",
          points: state.history.map((point) => ({
            x: point.tick,
            y: Number(point.dimers),
          })),
        },
        {
          label: "Viruses",
          color: "#df4545",
          points: state.history.map((point) => ({
            x: point.tick,
            y: Number(point.viruses),
          })),
        },
      ],
    },
  ],
});

export { model };
export const sourceMarker =
  "selected-disease-gene-b09:crispr-bacterium:e87977797048bf809aa58a41d6dc746c59d6d5e0ba94957db2996815725f4813";
export const ui = { ...binding, model, sourceMarker };
