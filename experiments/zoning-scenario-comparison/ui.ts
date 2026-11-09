import { defineUI, netLogoColor, type Observation, type SpatialData } from "../../ui/index.ts";
import { model } from "./model.ts";

export const ui = defineUI(model, {
  monitors: [{ label: "Study runs", value: state => state.completedRuns }, { label: "Planned runs", value: state => state.plannedRuns }],
  views: [
    { type: "spatial", label: "Six density runs · colored block = dwelling slot (aggregate schematic)", data: zoningData },
    { type: "bar", label: "Dwelling capacity", yAxis: { label: "Dwelling slots" },
      series: state => [{ label: "Slots", points: state.outcomes.map((outcome, index) => ({ x: `Run ${index + 1}`, y: outcome.slots })) }] },
    { type: "table", label: "Replication summaries", rows: state => state.summaries.map(summary => ({
      scenario: summary.scenario,
      mean: typeof summary.mean === "number" ? summary.mean.toFixed(2) : summary.mean,
      sampleSd: typeof summary.sampleSd === "number" ? summary.sampleSd.toFixed(2) : summary.sampleSd,
    })) },
  ],
});

type ZoningObservation = Observation<typeof model>;

/** Aggregate slots are grouped into schematic buildings; no parcel geography/order is inferred. */
export function zoningData(state: ZoningObservation): SpatialData {
  const panelWidth = state.parameters.parcels * 1.25 + 2;
  const captionInset = 1.5;
  const panelHeight = Math.max(...state.runPlan.map(run => run.cap)) + 5;
  const width = panelWidth * 2;
  const height = panelHeight * 3;
  const cells = [];
  const agents = [];
  const firstScenario = state.runPlan[0]?.scenarioId;
  for (const [run, planned] of state.runPlan.entries()) {
    const left = -width / 2 + (run % 2) * panelWidth + 1;
    const panelTop = height / 2 - Math.floor(run / 2) * panelHeight;
    const bottom = panelTop - panelHeight + 1;
    const outcome = state.outcomes[run];
    const cap = planned.cap;
    agents.push({ id: `view:run:${run}`, x: left, y: panelTop - captionInset,
      label: `Run ${run + 1} · cap ${cap}${outcome ? ` · ${outcome.slots}` : " · pending"}`, size: 2, color: netLogoColor(5) });
    for (let parcel = 0; parcel < state.parameters.parcels; parcel += 1) {
      cells.push({ id: `view:parcel:${run}:${parcel}`, x: left + parcel * 1.25, y: bottom, color: netLogoColor(8) });
      if (!outcome || parcel >= outcome.slots / cap) continue;
      for (let floor = 0; floor < cap; floor += 1) cells.push({
        id: `view:slot:${run}:${parcel}:${floor}`, x: left + parcel * 1.25, y: bottom + floor + 1,
        color: netLogoColor(planned.scenarioId === firstScenario ? 105 : 55),
      });
    }
  }
  return { width, height, cells, agents, showLabels: true };
}
