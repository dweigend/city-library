import { defineUI, netLogoColor, type Observation, type SpatialData } from "../../ui/index.ts";
import { model } from "./model.ts";

export const ui = defineUI(model, {
  complete: state => state.done,
  monitors: [
    { label: "Study runs", value: state => state.completedRuns },
    { label: "Planned runs", value: state => state.plannedRuns },
  ],
  views: [
    { type: "spatial", label: "Six density runs · colored block = dwelling slot (aggregate schematic)", data: zoningData },
    {
      type: "bar",
      label: "Dwelling capacity",
      yAxis: { label: "Dwelling slots" },
      series: state => [{
        label: "Slots",
        points: state.outcomes.map((outcome, index) => ({ x: `Run ${index + 1}`, y: outcome.slots })),
      }],
    },
    {
      type: "table",
      label: "Replication summaries",
      rows: state => state.summaries.map(summary => ({
        scenario: summary.scenario,
        mean: typeof summary.mean === "number" ? summary.mean.toFixed(2) : summary.mean,
        sampleSd: typeof summary.sampleSd === "number" ? summary.sampleSd.toFixed(2) : summary.sampleSd,
      })),
    },
  ],
});

type ZoningObservation = Observation<typeof model>;

/** Aggregate slots are grouped into schematic buildings; no parcel geography/order is inferred. */
export function zoningData(state: ZoningObservation): SpatialData {
  const panelWidth = state.parameters.parcels * PARCEL_SPACING + PANEL_HORIZONTAL_PADDING;
  const panelHeight = Math.max(...state.runPlan.map(run => run.cap)) + PANEL_VERTICAL_PADDING;
  const width = panelWidth * PANEL_COLUMNS;
  const height = panelHeight * PANEL_ROWS;
  const cells = [];
  const agents = [];
  const firstScenario = state.runPlan[0]?.scenarioId;
  for (const [run, planned] of state.runPlan.entries()) {
    const left = -width / 2 + (run % PANEL_COLUMNS) * panelWidth + 1;
    const panelTop = height / 2 - Math.floor(run / PANEL_COLUMNS) * panelHeight;
    const bottom = panelTop - panelHeight + 1;
    const outcome = state.outcomes[run];
    const cap = planned.cap;
    agents.push({
      id: `view:run:${run}`,
      x: left,
      y: panelTop - CAPTION_INSET,
      label: `Run ${run + 1} · cap ${cap}${outcome ? ` · ${outcome.slots}` : " · pending"}`,
      size: 2,
      color: CAPTION_COLOR,
    });
    for (let parcel = 0; parcel < state.parameters.parcels; parcel += 1) {
      cells.push({
        id: `view:parcel:${run}:${parcel}`,
        x: left + parcel * PARCEL_SPACING,
        y: bottom,
        color: PARCEL_BASE_COLOR,
      });
      // Every successful parcel contributes cap slots. This count groups aggregate
      // capacity into a schematic, without identifying the original buildable parcels.
      if (!outcome || parcel >= outcome.slots / cap) continue;
      for (let floor = 0; floor < cap; floor += 1) {
        cells.push({
          id: `view:slot:${run}:${parcel}:${floor}`,
          x: left + parcel * PARCEL_SPACING,
          y: bottom + floor + 1,
          color: planned.scenarioId === firstScenario ? BASE_CAP_COLOR : HIGHER_CAP_COLOR,
        });
      }
    }
  }
  return { width, height, cells, agents, showLabels: true };
}

const PANEL_COLUMNS = 2;
const PANEL_ROWS = 3;
const PARCEL_SPACING = 1.25;
const PANEL_HORIZONTAL_PADDING = 2;
const PANEL_VERTICAL_PADDING = 5;
const CAPTION_INSET = 1.5;
const CAPTION_COLOR = netLogoColor(5);
const PARCEL_BASE_COLOR = netLogoColor(8);
const BASE_CAP_COLOR = netLogoColor(105);
const HIGHER_CAP_COLOR = netLogoColor(55);
