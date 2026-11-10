import { defineUI, indexedColor, type Observation, type SpatialData } from "../../ui/index.ts";
import { model } from "./model.ts";

export const ui = defineUI(model, {
  complete: state => state.done,
  monitors: [
    { label: "Study runs", value: state => state.completedRunCount },
    { label: "Planned runs", value: state => state.plannedRunCount },
  ],
  views: [
    { type: "spatial", label: "Six density runs · colored block = dwelling slot (aggregate schematic)", data: zoningData },
    {
      type: "bar",
      label: "Dwelling capacity",
      yAxis: { label: "Dwelling slots" },
      series: state => [{
        label: "Slots",
        points: state.outcomes.map((outcome, index) => ({ x: `Run ${index + 1}`, y: outcome.slotCount })),
      }],
    },
    {
      type: "table",
      label: "Replication summaries",
      rows: state => state.summaries.map(summary => ({
        scenario: summary.scenario,
        mean: typeof summary.mean === "number" ? summary.mean.toFixed(2) : summary.mean,
        sampleStandardDeviation: typeof summary.sampleStandardDeviation === "number" ? summary.sampleStandardDeviation.toFixed(2) : summary.sampleStandardDeviation,
      })),
    },
  ],
});

type ZoningObservation = Observation<typeof model>;

/** Aggregate slots are grouped into schematic buildings; no parcel geography/order is inferred. */
export function zoningData(state: ZoningObservation): SpatialData {
  const panelHeight = Math.max(...state.runPlan.map(run => run.cap)) + PANEL_VERTICAL_PADDING;
  // Few parcels must not collapse the whole canvas into a narrow strip: the
  // six captions still need two readable columns beside their capacity stacks.
  const minimumPanelWidth = panelHeight * PANEL_ROWS / PANEL_COLUMNS;
  const panelWidth = Math.max(
    state.parameters.parcelCount * PARCEL_SPACING + PANEL_HORIZONTAL_PADDING,
    minimumPanelWidth,
  );
  const width = panelWidth * PANEL_COLUMNS;
  const height = panelHeight * PANEL_ROWS;
  const cells = [];
  const agents = [];
  const firstScenario = state.runPlan[0]?.scenarioId;
  for (const [run, planned] of state.runPlan.entries()) {
    const panelLeft = -width / 2 + (run % PANEL_COLUMNS) * panelWidth;
    const left = panelLeft + 1;
    const panelTop = height / 2 - Math.floor(run / PANEL_COLUMNS) * panelHeight;
    const bottom = panelTop - panelHeight + 1;
    const outcome = state.outcomes[run];
    const cap = planned.cap;
    agents.push({
      id: `view:run:${run}`,
      // Keep the full pending caption inside its panel at narrow viewports.
      x: panelLeft,
      y: panelTop - CAPTION_INSET,
      label: `Run ${run + 1} · cap ${cap}${outcome ? ` · ${outcome.slotCount}` : " · pending"}`,
      size: 2,
      color: CAPTION_COLOR,
    });
    for (let parcel = 0; parcel < state.parameters.parcelCount; parcel += 1) {
      cells.push({
        id: `view:parcel:${run}:${parcel}`,
        x: left + parcel * PARCEL_SPACING,
        y: bottom,
        color: PARCEL_BASE_COLOR,
      });
      // Every successful parcel contributes cap slots. This count groups aggregate
      // capacity into a schematic, without identifying the original buildable parcels.
      if (!outcome || parcel >= outcome.slotCount / cap) continue;
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
const CAPTION_INSET = 2.5;
const CAPTION_COLOR = indexedColor(5);
const PARCEL_BASE_COLOR = indexedColor(8);
const BASE_CAP_COLOR = indexedColor(105);
const HIGHER_CAP_COLOR = indexedColor(55);
