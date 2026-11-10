import { defineUI, indexedColor, type Observation, type SpatialData } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  live: { shiftedShare: { label: "Shifted share", set: (instance, value) => instance.setShiftedShare(value) } },
  monitors: [
    { label: "Hour", value: state => state.tick },
    { label: "Demand (kW)", value: state => state.demandKw, format: (value: number) => value.toFixed(2) },
    { label: "Energy (kWh)", value: state => state.energyKwh, format: (value: number) => value.toFixed(2) },
  ],
  views: [
    { type: "spatial", label: "Identical households · size = load · blue base / orange appliances", data: householdsData },
    { type: "line", label: "Hourly demand", xAxis: { label: "Time", unit: "h" }, yAxis: { unit: "kW" },
      series: state => [{ label: "Demand", points: state.history.map(sample => ({ x: sample.tick, y: sample.values.demandKw! })) }] },
    { type: "inspector", label: "Household load", value: (state, selected) => selected?.startsWith("household:")
      ? { household: Number(selected.slice(10)) + 1, hour: state.demandHour, demandKw: state.householdDemandKw }
      : undefined },
  ],
});

type State = Observation<typeof model>;
function householdsData(state: State): SpatialData {
  // A display arrangement of identical aggregate loads, not physical house locations.
  const columns = Math.min(maximumHouseColumns, state.parameters.households);
  const rows = Math.ceil(state.parameters.households / columns);
  const loadFraction = (state.householdDemandKw - state.householdBaseKw) / (state.householdPeakKw - state.householdBaseKw);
  const homes = Array.from({ length: state.parameters.households }, (_, index) => ({
    id: `household:${index}`, x: index % columns - (columns - 1) / 2,
    y: (rows - 1) / 2 - Math.floor(index / columns),
    color: loadFraction > 0 ? applianceLoadColor : baseLoadColor, size: baseLoadSize + applianceLoadSize * loadFraction,
  }));
  return {
    width: columns + 2, height: Math.max(4, rows + 2), showLabels: false,
    agents: homes,
    segments: homes.flatMap(home => houseOutline(home.x, home.y)),
  };
}
function houseOutline(x: number, y: number) {
  // The closed outline has a fixed first point and typed coordinate pairs.
  const [first, ...remaining] = houseCorners;
  let previous: readonly [number, number] = first;
  return remaining.map(point => {
    const segment = {
      from: { x: x + previous[0], y: y + previous[1] },
      to: { x: x + point[0], y: y + point[1] },
    };
    previous = point;
    return segment;
  });
}

const maximumHouseColumns = 10;
const baseLoadColor = indexedColor(105);
const applianceLoadColor = indexedColor(25);
const baseLoadSize = 7;
const applianceLoadSize = 13;
const houseCorners = [
  [-0.35, -0.3], [0.35, -0.3], [0.35, 0.2],
  [0, 0.45], [-0.35, 0.2], [-0.35, -0.3],
] as const;
