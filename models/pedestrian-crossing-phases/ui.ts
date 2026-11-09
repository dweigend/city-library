import { defineUI, netLogoColor, type Observation, type SpatialData } from "../../ui/index.ts";
import { model } from "./model.ts";

export const ui = defineUI(model, {
  complete: state => state.done,
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
  const height = Math.max(minimumViewHeight, Math.ceil(state.people.length / cohortColumns) * rowSpacing + 3);
  const cells = [];
  for (let y = -Math.floor(height / 2); y <= Math.floor(height / 2); y += 1) {
    const isStripe = stripeRows.includes(y);
    for (const x of roadColumns) {
      cells.push({
        id: `view:${isStripe ? "stripe" : "road"}:${x}:${y}`,
        x,
        y,
        color: isStripe ? stripeColor : roadColor,
      });
    }
  }
  const agents = state.people.map((person, index) => ({
    id: person.id, x: stageCenters[person.stage] + ((index % cohortColumns) - 1.5) * columnSpacing,
    y: Math.floor(state.people.length / cohortColumns) * 0.3 - Math.floor(index / cohortColumns) * rowSpacing,
    color: stageColors[person.stage], size: 11,
  }));
  agents.push({ id: "view:signal", x: -2.5, y: height / 2 - 1, color: state.signal === "green" ? greenSignalColor : redSignalColor, size: 26 });
  return { width: 14, height, cells, agents };
}

const roadColumns = [-1, 0, 1];
const stripeRows: readonly number[] = [-2, 0, 2];
const roadColor = netLogoColor(3);
const stripeColor = netLogoColor(9);
const stageCenters = { waiting: -4.5, crossing: 0, arrived: 4.5 };
const stageColors = {
  waiting: netLogoColor(25),
  crossing: netLogoColor(105),
  arrived: netLogoColor(55),
};
const greenSignalColor = netLogoColor(55);
const redSignalColor = netLogoColor(15);

const minimumViewHeight = 8;
const cohortColumns = 4;
const rowSpacing = 0.65;
const columnSpacing = 0.45;
