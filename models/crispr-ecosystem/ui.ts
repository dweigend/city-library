import { defineUI, type Observation, type Series, type BarSeries } from "../../ui/index.ts";
import { stats } from "city-library";

import { model } from "./model.ts";

const numbers = new Intl.NumberFormat("en", { maximumFractionDigits: 3 });

const binding = defineUI(model, {
  setup: ["seed", "initialBacteria", "initialViruses", "maxVirusTypes"],
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
      series: virusAbundanceSeries,
    },
    {
      type: "line",
      label: "History",
      series: historySeries,
    },
  ],
});

export { model };
export const sourceMarker =
  "selected-disease-gene-b09:crispr-ecosystem:9414dea313e5f6f7c4496014ef1638d42d020ce84220e4c0a00ea8b1bf1bdec9";
export const ui = { ...binding, model, sourceMarker };

type UIObservation = Observation<typeof model>;

/** Distinct lines stay readable for a handful of types; one gray line tracks the largest remaining type. */
const highlightedVirusTypes = 7;

function virusAbundanceSeries(state: UIObservation): readonly Series[] {
  const peaks = new Map<number, number>();
  for (const sample of state.history)
    for (const { sequence, percentage } of sample.relativeAbundance)
      peaks.set(sequence, Math.max(peaks.get(sequence) ?? 0, percentage));
  const highlighted = [...peaks]
    .sort(([sequenceA, peakA], [sequenceB, peakB]) => peakB - peakA || sequenceA - sequenceB)
    .slice(0, highlightedVirusTypes)
    .map(([sequence]) => sequence);
  const percentage = (sample: UIObservation["history"][number], sequence: number) =>
    sample.relativeAbundance.find((entry) => entry.sequence === sequence)?.percentage ?? 0;
  const lines: Series[] = highlighted.map((sequence) => ({
    label: `Virus ${sequence}`,
    points: state.history.map((sample) => ({ x: sample.tick, y: percentage(sample, sequence) })),
  }));
  if (peaks.size > highlighted.length)
    lines.push({
      label: "Largest other type",
      color: "#8a8a8a",
      points: state.history.map((sample) => ({
        x: sample.tick,
        y: Math.max(0, ...sample.relativeAbundance
          .filter((entry) => !highlighted.includes(entry.sequence))
          .map((entry) => entry.percentage)),
      })),
    });
  return lines;
}

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
            { length: state.parameters.maxVirusTypes + 1 },
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
            { length: state.parameters.maxVirusTypes + 1 },
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
        y: Number(point.bacteria),
      })),
    },
    {
      label: "Viruses",
      color: "#9272b8",
      points: state.history.map((point) => ({
        x: point.tick,
        y: Number(point.viruses),
      })),
    },
  ];
}
