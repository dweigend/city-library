import { defineUI, type Observation, type SpatialData, type Series } from "../../ui/index.ts";
import { stats } from "city-library";

import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["seed", "numTaxicab"],
  change: (instance, changes) => instance.setParameters(changes),
  live: {
    lengthOfGreenLight: {},
    lengthOfTimePeriod: {},
    waitTimeMean: {},
    waitTimeSd: {},
    firstPassengerCost: {},
    eachAdditionalPassengerCost: {},
    eachGridCost: {},
    eachTickCost: {},
    "prob-cbd-cbd-AM": {
      label: "cbd · cbd · AM",
      group: "AM",
    },
    "prob-res-com-AM": {
      label: "res · com · AM",
      group: "AM",
    },
    "prob-res-cbd-AM": {
      label: "res · cbd · AM",
      group: "AM",
    },
    "prob-res-res-AM": {
      label: "res · res · AM",
      group: "AM",
    },
    "prob-com-res-AM": {
      label: "com · res · AM",
      group: "AM",
    },
    "prob-com-cbd-AM": {
      label: "com · cbd · AM",
      group: "AM",
    },
    "prob-com-com-AM": {
      label: "com · com · AM",
      group: "AM",
    },
    "prob-cbd-res-AM": {
      label: "cbd · res · AM",
      group: "AM",
    },
    "prob-cbd-com-AM": {
      label: "cbd · com · AM",
      group: "AM",
    },
    "prob-cbd-cbd-MD": {
      label: "cbd · cbd · MD",
      group: "MD",
    },
    "prob-cbd-com-MD": {
      label: "cbd · com · MD",
      group: "MD",
    },
    "prob-cbd-res-MD": {
      label: "cbd · res · MD",
      group: "MD",
    },
    "prob-com-com-MD": {
      label: "com · com · MD",
      group: "MD",
    },
    "prob-com-cbd-MD": {
      label: "com · cbd · MD",
      group: "MD",
    },
    "prob-com-res-MD": {
      label: "com · res · MD",
      group: "MD",
    },
    "prob-res-res-MD": {
      label: "res · res · MD",
      group: "MD",
    },
    "prob-res-cbd-MD": {
      label: "res · cbd · MD",
      group: "MD",
    },
    "prob-res-com-MD": {
      label: "res · com · MD",
      group: "MD",
    },
    "prob-res-res-PM": {
      label: "res · res · PM",
      group: "PM",
    },
    "prob-com-res-PM": {
      label: "com · res · PM",
      group: "PM",
    },
    "prob-com-cbd-PM": {
      label: "com · cbd · PM",
      group: "PM",
    },
    "prob-com-com-PM": {
      label: "com · com · PM",
      group: "PM",
    },
    "prob-cbd-res-PM": {
      label: "cbd · res · PM",
      group: "PM",
    },
    "prob-cbd-com-PM": {
      label: "cbd · com · PM",
      group: "PM",
    },
    "prob-cbd-cbd-PM": {
      label: "cbd · cbd · PM",
      group: "PM",
    },
    "prob-res-com-PM": {
      label: "res · com · PM",
      group: "PM",
    },
    "prob-res-cbd-PM": {
      label: "res · cbd · PM",
      group: "PM",
    },
    "prob-res-cbd-EVE": {
      label: "res · cbd · EVE",
      group: "EVE",
    },
    "prob-res-com-EVE": {
      label: "res · com · EVE",
      group: "EVE",
    },
    "prob-cbd-cbd-EVE": {
      label: "cbd · cbd · EVE",
      group: "EVE",
    },
    "prob-cbd-com-EVE": {
      label: "cbd · com · EVE",
      group: "EVE",
    },
    "prob-cbd-res-EVE": {
      label: "cbd · res · EVE",
      group: "EVE",
    },
    "prob-com-com-EVE": {
      label: "com · com · EVE",
      group: "EVE",
    },
    "prob-com-cbd-EVE": {
      label: "com · cbd · EVE",
      group: "EVE",
    },
    "prob-com-res-EVE": {
      label: "com · res · EVE",
      group: "EVE",
    },
    "prob-res-res-EVE": {
      label: "res · res · EVE",
      group: "EVE",
    },
    "prob-res-cbd-EM": {
      label: "res · cbd · EM",
      group: "EM",
    },
    "prob-res-res-EM": {
      label: "res · res · EM",
      group: "EM",
    },
    "prob-res-com-EM": {
      label: "res · com · EM",
      group: "EM",
    },
    "prob-cbd-cbd-EM": {
      label: "cbd · cbd · EM",
      group: "EM",
    },
    "prob-cbd-com-EM": {
      label: "cbd · com · EM",
      group: "EM",
    },
    "prob-cbd-res-EM": {
      label: "cbd · res · EM",
      group: "EM",
    },
    "prob-com-com-EM": {
      label: "com · com · EM",
      group: "EM",
    },
    "prob-com-cbd-EM": {
      label: "com · cbd · EM",
      group: "EM",
    },
    "prob-com-res-EM": {
      label: "com · res · EM",
      group: "EM",
    },
  },
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Social%20Science/Taxi%20Cabs.nlogox",
    label: "Original NetLogo model · Dongping and Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    { label: "Time of day", value: (state) => state.currentPhase },
    { label: "Waiting passengers", value: (state) => state.passengers.length },
    {
      label: "Occupied cabs",
      value: (state) => state.occupiedCabs,
    },
    {
      label: "Total income ($)",
      value: (state) => state.totalIncome,
      format: (value: number) => value.toFixed(2),
    },
  ],
  views: [
    {
      type: "spatial",
      label: "Taxi service",
      data: taxiServiceData,
    },
    {
      type: "line",
      label: "Taxicabs travelling distance",
      series: taxicabsTravellingDistanceSeries,
    },
    {
      type: "bar",
      label: "Trip income distribution ($)",
      series: (state) => [
        { label: "Completed trips", points: histogram(state.tripIncomes) },
      ],
    },
    {
      type: "bar",
      label: "Trip distance distribution (grids)",
      series: (state) => [
        { label: "Completed trips", points: histogram(state.tripDistances) },
      ],
    },
    {
      type: "bar",
      label: "Trip duration distribution (ticks)",
      series: (state) => [
        { label: "Completed trips", points: histogram(state.tripDurations) },
      ],
    },
    {
      type: "inspector",
      label: "Cab",
      value: (state, id) => {
        const cab = state.cabs.find((candidate) => candidate.id === id);
        if (!cab) return undefined;
        const { tripDistances, tripIncomes, tripDurations, ...details } = cab;
        return details;
      },
    },
  ],
});

export { model };

function histogram(values: readonly number[]) {
  const maximum = Math.max(
    300,
    Math.ceil(Math.max(0, ...values) / 10) * 10 + 10,
  );
  const edges = Array.from(
    { length: 31 },
    (_, index) => (index * maximum) / 30,
  );
  const distribution = stats.histogram(values, { edges });
  return distribution.counts.map((count, index) => ({
    x: (edges[index]! + edges[index + 1]!) / 2,
    y: count,
  }));
}

type UIObservation = Observation<typeof model>;

function taxiServiceData(state: UIObservation): SpatialData {
  return {
    width: state.width,
    height: state.height,
    cells: state.cells,
    agents: [
      ...state.cabs.map((cab) => ({
        ...cab,
        size: 8,
        shape: "triangle" as const,
      })),
      ...state.passengers.map((passenger) => ({
        ...passenger,
        size: 4,
        color: "#eeeeee",
      })),
    ],
  };
}

function taxicabsTravellingDistanceSeries(
  state: UIObservation,
): readonly Series[] {
  return [
    {
      label: "Total miles",
      points: state.history.map((point) => ({
        x: point.tick,
        y: point.totalMiles,
      })),
    },
    {
      label: "Business miles",
      color: "#358a3c",
      points: state.history.map((point) => ({
        x: point.tick,
        y: point.businessMiles,
      })),
    },
    {
      label: "Dead miles",
      color: "#dd3434",
      points: state.history.map((point) => ({
        x: point.tick,
        y: point.deadMiles,
      })),
    },
  ];
}

export const sourceMarker =
  "selected-transport-b04:taxi-cabs:150f739ec217fbb199d86eca783922a79acceeb6504e44add1921d934d3d4a30";
