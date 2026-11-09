import { defineUI, netLogoColor, type Observation, type SpatialData } from "../../ui/index.ts";
import { model } from "./model.ts";

export const ui = defineUI(model, {
  monitors: [{ label: "Minute", value: state => state.tick }, { label: "Signal", value: state => state.signal },
    { label: "Waiting", value: state => state.waiting }, { label: "Crossing", value: state => state.crossing }, { label: "Arrived", value: state => state.arrived }],
  views: [
    { type: "spatial", label: "Crossing · waiting → crosswalk → arrived (schematic)", data: crossingData },
    { type: "line", label: "Cohort", xAxis: { unit: "min" }, yAxis: { label: "People" },
      series: state => ["waiting", "crossing", "arrived"].map(key => ({ label: key, points: state.history.map(sample => ({ x: sample.tick, y: sample.values[key]! })) })) },
  ],
});

type CrossingObservation = Observation<typeof model>;

/** The model has discrete stages, so these lane positions illustrate stages, not walking dynamics. */
export function crossingData(state: CrossingObservation): SpatialData {
  const height = Math.max(8, Math.ceil(state.people.length / 4) * 0.65 + 3);
  const cells = [];
  for (let y = -Math.floor(height / 2); y <= Math.floor(height / 2); y += 1) {
    for (const x of [-1, 0, 1]) cells.push({ id: `view:road:${x}:${y}`, x, y, color: netLogoColor(3) });
  }
  for (const x of [-1, 0, 1]) for (const y of [-2, 0, 2])
    cells.push({ id: `view:stripe:${x}:${y}`, x, y, color: netLogoColor(9) });
  const centers = { waiting: -4.5, crossing: 0, arrived: 4.5 };
  const agents = state.people.map((person, index) => ({
    id: person.id, x: centers[person.stage] + ((index % 4) - 1.5) * 0.45,
    y: Math.floor(state.people.length / 4) * 0.3 - Math.floor(index / 4) * 0.65,
    color: netLogoColor(person.stage === "waiting" ? 25 : person.stage === "crossing" ? 105 : 55), size: 11,
  }));
  agents.push({ id: "view:signal", x: -2.5, y: height / 2 - 1, color: netLogoColor(state.signal === "green" ? 55 : 15), size: 26 });
  return { width: 14, height, cells, agents };
}
