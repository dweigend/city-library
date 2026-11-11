import { defineUI, indexedColor, type Observation } from "../../ui/index.ts";
import { model } from "./model.ts";

const residentColor = indexedColor(105);
const householdColor = indexedColor(65);
const birthColor = indexedColor(55);
const deathColor = indexedColor(15);
const migrationColor = indexedColor(25);
const pulseSize = 100;

export const ui = defineUI(model, {
  setup: [{ field: "initialPopulation", label: "Initial residents (people)" }],
  change: (instance, changes) => instance.setPolicy(changes),
  live: {
    birthRate: { label: "Births per resident aged 20–39 / year", group: "Births and deaths" },
    deathRate: { label: "Mortality under 65 / year", group: "Births and deaths" },
    elderlyDeathRate: { label: "Mortality 65+ / year", group: "Births and deaths" },
    annualMigration: { label: "Requested net migration / year", group: "Migration and households" },
    migrationLimit: { label: "Annual migration bound", group: "Migration and households" },
    householdSize: { label: "Maximum household size", group: "Migration and households" },
  },
  actions: [{
    label: `Schedule pulse of ${pulseSize} immigrants aged 25`,
    run: instance => instance.scheduleImmigrationPulse(pulseSize),
    enabled: state => state.pendingImmigrationPulse + pulseSize <= 10_000,
  }],
  monitors: [
    { label: "Year", value: state => state.tick },
    { label: "Residents", value: state => state.populationCount },
    { label: "Households", value: state => state.householdCount },
    { label: "Aged 65+ (%)", value: state => state.elderlyShare * 100, format: (value: number) => value.toFixed(1) },
    { label: "Pending pulse", value: state => state.pendingImmigrationPulse },
    { label: "Accounting error", value: state => state.accountingError },
  ],
  views: [
    {
      type: "bar", label: "Age structure · residents by 5-year band",
      xAxis: { label: "Age band", unit: "years" }, yAxis: { label: "Residents" },
      series: state => [{ label: "Residents", color: residentColor,
        points: state.ageBands.map(band => ({ x: band.label, y: band.residentCount })) }],
    },
    {
      type: "bar", label: "Annual flows · residents per completed year (bars start at zero)",
      xAxis: { label: "Year" }, yAxis: { label: "Residents / year" },
      series: state => [
        flowSeries(state, "Births", birthColor, "birthCount"),
        flowSeries(state, "Deaths", deathColor, "deathCount"),
        flowSeries(state, "Net migration", migrationColor, "netMigration"),
      ],
    },
    {
      type: "line", label: "Residents and household demand", xAxis: { label: "Year" }, yAxis: { label: "Count" },
      series: state => [
        { label: "Residents", color: residentColor, points: state.history.map(sample => ({ x: sample.tick, y: sample.values.populationCount! })) },
        { label: "Households", color: householdColor, points: state.history.map(sample => ({ x: sample.tick, y: sample.values.householdCount! })) },
      ],
    },
    {
      type: "bar", label: "Anonymous households by size",
      xAxis: { label: "Residents per household" }, yAxis: { label: "Households" },
      series: state => [{ label: "Households", color: householdColor,
        points: state.householdsBySize.map(group => ({ x: group.size, y: group.householdCount })) }],
    },
  ],
});

type State = Observation<typeof model>;

/** Annual flows exist only for completed years; the setup sample is not an interval. */
function flowSeries(state: State, label: string, color: string, key: "birthCount" | "deathCount" | "netMigration") {
  return { label, color, points: state.history.filter(sample => sample.tick > 0)
    .map(sample => ({ x: sample.tick, y: sample.values[key]! })) };
}
