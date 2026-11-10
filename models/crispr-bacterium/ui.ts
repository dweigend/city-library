import { defineUI, type Observation, type BarSeries, type Series } from "../../ui/index.ts";
import { stats } from "city-library";

import { model } from "./model.ts";

const binding = defineUI(model, {
  setup: ["seed", "initialArraySize", "maxVirusTypeCount"],
  change: (instance, changes) => instance.setParameters(changes),
  live: {
    guideUnbindChance: {},
    processivity: {},
    crisprFunction: {},
    labels: {},
  },
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
    label: "Source attribution · source notices",
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
      series: guideAndSpacerSequencesSeries,
    },
    {
      type: "line",
      label: "History",
      series: historySeries,
    },
  ],
});

export { model };

export const ui = { ...binding, model };

type UIObservation = Observation<typeof model>;

function guideAndSpacerSequencesSeries(
  state: UIObservation,
): readonly BarSeries[] {
  return [
    {
      label: "Guides",
      points: stats
        .histogram(state.guideSequences, {
          edges: Array.from(
            { length: state.parameters.maxVirusTypeCount + 1 },
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
            { length: state.parameters.maxVirusTypeCount + 1 },
            (_, i) => i - 0.5,
          ),
        })
        .counts.map((count, sequence) => ({ x: sequence, y: count })),
    },
  ];
}

function historySeries(state: UIObservation): readonly Series[] {
  return [
    {
      label: "Cas9",
      color: "#35a85b",
      points: state.history.map((point) => ({
        x: point.tick,
        y: Number(point.cas9Count),
      })),
    },
    {
      label: "Guides",
      color: "#2db5a4",
      points: state.history.map((point) => ({
        x: point.tick,
        y: Number(point.guideCount),
      })),
    },
    {
      label: "Cas1/2",
      color: "#d18b34",
      points: state.history.map((point) => ({
        x: point.tick,
        y: Number(point.dimerCount),
      })),
    },
    {
      label: "Viruses",
      color: "#df4545",
      points: state.history.map((point) => ({
        x: point.tick,
        y: Number(point.virusCount),
      })),
    },
  ];
}
