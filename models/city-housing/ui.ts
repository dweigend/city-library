import { defineUI, indexedColor, scientificPalette, type Observation, type SpatialAgent, type SpatialData } from "../../ui/index.ts";
import { model, type IncomeGroup } from "./model.ts";

const groupColors: Record<IncomeGroup, string> = {
  low: indexedColor(25),
  middle: indexedColor(105),
  high: indexedColor(125),
};
// Mid gray stays visible on light and dark chart backgrounds.
const rentColor = indexedColor(5);
const commissionSize = 3;

export const ui = defineUI(model, {
  setup: [
    { field: "householdCount", label: "Households" },
    { field: "initialHomeCount", label: "Homes at start" },
    { field: "maxHomeCount", label: "Maximum homes (building sites)" },
    { field: "initialRent", label: "Initial rent (currency/month)" },
    { field: "targetVacancyRate", label: "Target vacancy (share)" },
    { field: "constructionRent", label: "Rent that starts construction (currency/month)" },
  ],
  live: {
    housingAllowance: {
      label: "Allowance for low incomes (currency/month)",
      set: (instance, value) => instance.setHousingAllowance(value),
    },
  },
  actions: [{
    label: `Commission ${commissionSize} public homes`,
    run: instance => instance.commissionHomes(commissionSize),
    enabled: state => state.homeCount + state.pipelineCount + commissionSize <= state.parameters.maxHomeCount,
  }],
  monitors: [
    { label: "Month", value: state => state.tick },
    { label: "Rent (currency/month)", value: state => state.rent, format: (value: number) => value.toFixed(2) },
    { label: "Housed", value: state => state.housedHouseholdCount },
    { label: "Searching", value: state => state.searchingHouseholdCount },
    { label: "Displaced this month", value: state => state.displacedThisStepCount },
    { label: "Vacant homes", value: state => state.vacantHomeCount },
    { label: "Under construction", value: state => state.pipelineCount },
  ],
  views: [
    { type: "spatial", label: "Homes and searching households · fill = tenant income: orange low, blue middle, magenta high · white outline vacant, amber outline under construction, small gray squares free building sites · circles searching, diamonds displaced", data: housingScene },
    { type: "line", label: "Bids and posted rent by household income · both axes in currency/month",
      xAxis: { label: "Household income", unit: "currency/month" }, yAxis: { label: "Bid or rent" },
      series: state => [
        { label: "Household bid", color: groupColors.middle, points: state.households.map(household => ({ x: household.income, y: household.bid })) },
        { label: "Posted rent", color: rentColor, points: [
          { x: state.households[0]!.income, y: state.rent },
          { x: state.households.at(-1)!.income, y: state.rent },
        ] },
      ] },
    { type: "line", label: "Housed households by income group", xAxis: { label: "Month" }, yAxis: { label: "Households" },
      series: state => [
        { label: "Low", color: groupColors.low, points: state.history.map(sample => ({ x: sample.tick, y: sample.values.housedLowIncomeCount! })) },
        { label: "Middle", color: groupColors.middle, points: state.history.map(sample => ({ x: sample.tick, y: sample.values.housedMiddleIncomeCount! })) },
        { label: "High", color: groupColors.high, points: state.history.map(sample => ({ x: sample.tick, y: sample.values.housedHighIncomeCount! })) },
      ] },
    { type: "line", label: "Posted rent · currency/month", xAxis: { label: "Month" }, yAxis: { label: "Rent" },
      series: state => [{ label: "Rent", color: rentColor, points: state.history.map(sample => ({ x: sample.tick, y: sample.values.rent! })) }] },
    { type: "inspector", label: "Selected home or household", value: inspect },
  ],
});

type State = Observation<typeof model>;
const columns = 12;
const rowHeight = 0.9;

function housingScene(state: State): SpatialData {
  // Fixed layout per run: rows for every possible home and household, so the canvas never jumps.
  const homeRows = Math.ceil(state.parameters.maxHomeCount / columns);
  const searchRows = Math.ceil(state.parameters.householdCount / columns);
  const height = 2.2 + (homeRows + searchRows) * rowHeight;
  const top = height / 2;
  const searchTop = top - 1.6 - homeRows * rowHeight;
  const householdsById = new Map(state.households.map(household => [household.id, household]));
  const homeAgents: SpatialAgent[] = state.homes.map((home, index) => {
    const occupant = home.occupantId === null ? undefined : householdsById.get(home.occupantId);
    return {
      id: home.id, ...homePosition(index, top), shape: "rectangle", extent: { width: 0.85, height: 0.65 },
      color: occupant ? groupColors[occupant.incomeGroup] : scientificPalette.neutral,
      filled: occupant !== undefined, stroke: occupant ? undefined : scientificPalette.neutral, strokeWidth: 1.5,
    };
  });
  const pipelineAgents: SpatialAgent[] = state.pipeline.map((entry, index) => ({
    id: entry.id, ...homePosition(state.homes.length + index, top), shape: "rectangle", extent: { width: 0.85, height: 0.65 },
    filled: false, stroke: scientificPalette.waiting, strokeWidth: 2, selectable: false,
  }));
  // Remaining sites up to the maximum number of homes, where commissioned or market homes can still be built.
  const siteAgents: SpatialAgent[] = Array.from({ length: state.parameters.maxHomeCount - state.homes.length - state.pipeline.length }, (_, index) => ({
    id: `site-${index + 1}`, ...homePosition(state.homes.length + state.pipeline.length + index, top), shape: "rectangle", extent: { width: 0.3, height: 0.24 },
    filled: false, stroke: scientificPalette.unavailable, strokeWidth: 1, selectable: false,
  }));
  const searching = state.households.filter(household => household.status !== "housed");
  const searchingAgents: SpatialAgent[] = searching.map((household, index) => ({
    id: household.id, x: -5.5 + index % columns, y: searchTop - Math.floor(index / columns) * rowHeight, size: 13,
    color: groupColors[household.incomeGroup], shape: household.status === "displaced" ? "diamond" : "circle",
  }));
  const displacedCount = searching.filter(household => household.status === "displaced").length;
  return {
    width: 13, height,
    labels: [
      { x: 0, y: top - 0.35, text: `${state.homeCount - state.vacantHomeCount} occupied · ${state.vacantHomeCount} vacant · ${state.pipelineCount} building · ${siteAgents.length} free sites` },
      { x: 0, y: searchTop + 0.65, text: `${searching.length} searching · ${displacedCount} displaced` },
    ],
    agents: [...homeAgents, ...pipelineAgents, ...siteAgents, ...searchingAgents],
    description: `${state.homeCount} homes, ${state.housedHouseholdCount} occupied, ${state.vacantHomeCount} vacant, ${state.pipelineCount} under construction. ${searching.length} households searching, ${displacedCount} of them displaced. Rent ${state.rent.toFixed(0)} per month.`,
  };
}

function homePosition(index: number, top: number) {
  return { x: -5.5 + index % columns, y: top - 1.0 - Math.floor(index / columns) * rowHeight };
}

function inspect(state: State, selected: string | null): Record<string, string | number> | undefined {
  const home = state.homes.find(candidate => candidate.id === selected);
  const householdId = home ? home.occupantId : selected;
  const household = state.households.find(candidate => candidate.id === householdId);
  if (home && !household) return { home: home.id, status: "Vacant", "Posted rent": state.rent.toFixed(2) };
  if (!household) return undefined;
  return {
    household: household.id,
    "Income group": household.incomeGroup,
    status: household.status,
    home: household.homeId ?? "None",
    "Income / month": household.income,
    "Bid / month": household.bid.toFixed(2),
    "Posted rent": state.rent.toFixed(2),
    allowance: household.receivesAllowance ? "Yes" : "No",
  };
}
