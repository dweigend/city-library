import { stats } from "city-library";
import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

const numbers = new Intl.NumberFormat("en", { maximumFractionDigits: 3 });

const binding = defineUI(model, {
  setup: [
    { field: "seed" },
    { field: "initialBacteria" },
    { field: "initialViruses" },
    { field: "maxVirusTypes" },
  ],
  live: [
    {
      field: "infectionChance",
      value: (state) => state.parameters.infectionChance,
      set: (instance, value) =>
        instance.setParameters({ infectionChance: Number(value) }),
    },
    {
      field: "spacerLossChance",
      value: (state) => state.parameters.spacerLossChance,
      set: (instance, value) =>
        instance.setParameters({ spacerLossChance: Number(value) }),
    },
    {
      field: "crispr",
      value: (state) => state.parameters.crispr,
      set: (instance, value) =>
        instance.setParameters({ crispr: Boolean(value) }),
    },
    {
      field: "plottedVirus",
      value: (state) => state.parameters.plottedVirus,
      set: (instance, value) =>
        instance.setParameters({ plottedVirus: Number(value) }),
    },
  ],
  actions: [
    { label: "Plot new virus", run: (instance) => instance.plotNewVirus() },
  ],
  complete: (state) => state.stopped,
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Biology/CRISPR/CRISPR%20Ecosystem.nlogox",
    label: "Original NetLogo model · source notices",
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
      series: (state) => [
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
      ],
    },
    {
      type: "bar",
      label: "Sequence histogram",
      series: (state) => [
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
      ],
    },
    {
      type: "bar",
      label: "Array length histogram",
      series: (state) => [
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
      ],
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
      series: (state) => [
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
      ],
    },
  ],
});

export { model };
export const sourceMarker =
  "selected-disease-gene-b09:crispr-ecosystem:9414dea313e5f6f7c4496014ef1638d42d020ce84220e4c0a00ea8b1bf1bdec9";
export const ui = { ...binding, model, sourceMarker };
