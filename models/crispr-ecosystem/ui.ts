import { defineUI, type Observation, type Series, type BarSeries } from "../../ui/index.ts";
import { stats } from "city-library";

import { model } from "./model.ts";

const numbers = new Intl.NumberFormat("en", { maximumFractionDigits: 3 });

const binding = defineUI(model, {
  setup: ["seed", "initialBacteriumCount", "initialVirusCount", "maxVirusTypeCount"],
  change: (instance, changes) => instance.setParameters(changes),
  live: {
    infectionChance: {},
    spacerLossChance: {},
    crispr: {},
    plottedVirus: {},
  },
  actions: [
    { label: "Plot new virus", run: (instance) => instance.plotNewVirus() },
  ],
  complete: (state) => state.stopped,
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Biology/CRISPR/CRISPR%20Ecosystem.nlogox",
    label: "Source attribution · source notices",
  },
  monitors: [
    {
      label: "Mean array length",
      value: (state) =>
        state.averageArrayLength === null
          ? "n/a"
          : numbers.format(state.averageArrayLength),
    },
    {
      label: "Array standard deviation",
      value: (state) =>
        state.stdDevArrayLength === null
          ? "n/a"
          : numbers.format(state.stdDevArrayLength),
    },
    {
      label: "Focal virus %",
      value: (state) => numbers.format(state.focalVirusPercent),
    },
    {
      label: "Focal array %",
      value: (state) => numbers.format(state.focalArrayPercent),
    },
    { label: "Tick", value: (state) => state.tick },
    { label: "Bacteria", value: (state) => state.bacteriaCount },
    { label: "Viruses", value: (state) => state.virusCount },
  ],
  views: [
    {
      type: "spatial",
      label: "CRISPR Ecosystem",
      data: (state) => ({
        width: state.width,
        height: state.height,
        agents: state.agents.map((agent) => ({ ...agent, size: 5 })),
        cells: state.cells,
      }),
    },
    {
      type: "line",
      label: "CRISPR-virus coevolution",
      series: cRISPRVirusCoevolutionSeries,
    },
    {
      type: "bar",
      label: "Sequence histogram",
      series: sequenceHistogramSeries,
    },
    {
      type: "bar",
      label: "Array length histogram",
      series: arrayLengthHistogramSeries,
    },
    {
      type: "line",
      label: "Virus relative abundance",
      series: (state) =>
        (state.history.at(-1)?.relativeAbundance ?? []).map(({ sequence }) => ({
          label: `Virus ${sequence}`,
          points: state.history.map((p) => ({
            x: p.tick,
            y:
              p.relativeAbundance.find((x) => x.sequence === sequence)
                ?.percentage ?? 0,
          })),
        })),
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

function cRISPRVirusCoevolutionSeries(state: UIObservation): readonly Series[] {
  return [
    {
      label: "Virus %",
      points: state.coevolutionHistory.map((p) => ({
        x: p.tick,
        y: p.focalVirusPercent,
      })),
    },
    {
      label: "Array %",
      points: state.coevolutionHistory.map((p) => ({
        x: p.tick,
        y: p.focalArrayPercent,
      })),
    },
  ];
}

function sequenceHistogramSeries(state: UIObservation): readonly BarSeries[] {
  return [
    {
      label: "Viruses",
      points: stats
        .histogram(state.virusSequences, {
          edges: Array.from(
            { length: state.parameters.maxVirusTypeCount + 1 },
            (_, i) => i - 0.5,
          ),
        })
        .counts.map((y, x) => ({ x, y })),
    },
    {
      label: "Arrays",
      points: stats
        .histogram(state.arraySequences, {
          edges: Array.from(
            { length: state.parameters.maxVirusTypeCount + 1 },
            (_, i) => i - 0.5,
          ),
        })
        .counts.map((y, x) => ({ x, y })),
    },
  ];
}

function arrayLengthHistogramSeries(
  state: UIObservation,
): readonly BarSeries[] {
  return [
    {
      label: "Arrays",
      points: stats
        .histogram(state.arrayLengths, {
          edges: Array.from(
            { length: Math.max(1, ...state.arrayLengths) + 2 },
            (_, i) => i - 0.5,
          ),
        })
        .counts.map((y, x) => ({ x, y })),
    },
  ];
}

function historySeries(state: UIObservation): readonly Series[] {
  return [
    {
      label: "Bacteria",
      color: "#db9a35",
      points: state.history.map((point) => ({
        x: point.tick,
        y: Number(point.bacteriumCount),
      })),
    },
    {
      label: "Viruses",
      color: "#9272b8",
      points: state.history.map((point) => ({
        x: point.tick,
        y: Number(point.virusCount),
      })),
    },
  ];
}
