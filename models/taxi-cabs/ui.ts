import { defineUI, type Observation, type SpatialData, type Series } from "../../ui/index.ts";
import { stats } from "city-library";

import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["seed", "numTaxicab"],
  live: {
    lengthOfGreenLight: {
      set: (instance, value) =>
        instance.setParameters({ lengthOfGreenLight: value }),
    },
    lengthOfTimePeriod: {
      set: (instance, value) =>
        instance.setParameters({ lengthOfTimePeriod: value }),
    },
    waitTimeMean: {
      set: (instance, value) => instance.setParameters({ waitTimeMean: value }),
    },
    waitTimeSd: {
      set: (instance, value) => instance.setParameters({ waitTimeSd: value }),
    },
    firstPassengerCost: {
      set: (instance, value) =>
        instance.setParameters({ firstPassengerCost: value }),
    },
    eachAdditionalPassengerCost: {
      set: (instance, value) =>
        instance.setParameters({ eachAdditionalPassengerCost: value }),
    },
    eachGridCost: {
      set: (instance, value) => instance.setParameters({ eachGridCost: value }),
    },
    eachTickCost: {
      set: (instance, value) => instance.setParameters({ eachTickCost: value }),
    },
    "prob-cbd-cbd-AM": {
      label: "cbd · cbd · AM",
      group: "AM",
      set: (instance, value) =>
        instance.setParameters({ "prob-cbd-cbd-AM": value }),
    },
    "prob-res-com-AM": {
      label: "res · com · AM",
      group: "AM",
      set: (instance, value) =>
        instance.setParameters({ "prob-res-com-AM": value }),
    },
    "prob-res-cbd-AM": {
      label: "res · cbd · AM",
      group: "AM",
      set: (instance, value) =>
        instance.setParameters({ "prob-res-cbd-AM": value }),
    },
    "prob-res-res-AM": {
      label: "res · res · AM",
      group: "AM",
      set: (instance, value) =>
        instance.setParameters({ "prob-res-res-AM": value }),
    },
    "prob-com-res-AM": {
      label: "com · res · AM",
      group: "AM",
      set: (instance, value) =>
        instance.setParameters({ "prob-com-res-AM": value }),
    },
    "prob-com-cbd-AM": {
      label: "com · cbd · AM",
      group: "AM",
      set: (instance, value) =>
        instance.setParameters({ "prob-com-cbd-AM": value }),
    },
    "prob-com-com-AM": {
      label: "com · com · AM",
      group: "AM",
      set: (instance, value) =>
        instance.setParameters({ "prob-com-com-AM": value }),
    },
    "prob-cbd-res-AM": {
      label: "cbd · res · AM",
      group: "AM",
      set: (instance, value) =>
        instance.setParameters({ "prob-cbd-res-AM": value }),
    },
    "prob-cbd-com-AM": {
      label: "cbd · com · AM",
      group: "AM",
      set: (instance, value) =>
        instance.setParameters({ "prob-cbd-com-AM": value }),
    },
    "prob-cbd-cbd-MD": {
      label: "cbd · cbd · MD",
      group: "MD",
      set: (instance, value) =>
        instance.setParameters({ "prob-cbd-cbd-MD": value }),
    },
    "prob-cbd-com-MD": {
      label: "cbd · com · MD",
      group: "MD",
      set: (instance, value) =>
        instance.setParameters({ "prob-cbd-com-MD": value }),
    },
    "prob-cbd-res-MD": {
      label: "cbd · res · MD",
      group: "MD",
      set: (instance, value) =>
        instance.setParameters({ "prob-cbd-res-MD": value }),
    },
    "prob-com-com-MD": {
      label: "com · com · MD",
      group: "MD",
      set: (instance, value) =>
        instance.setParameters({ "prob-com-com-MD": value }),
    },
    "prob-com-cbd-MD": {
      label: "com · cbd · MD",
      group: "MD",
      set: (instance, value) =>
        instance.setParameters({ "prob-com-cbd-MD": value }),
    },
    "prob-com-res-MD": {
      label: "com · res · MD",
      group: "MD",
      set: (instance, value) =>
        instance.setParameters({ "prob-com-res-MD": value }),
    },
    "prob-res-res-MD": {
      label: "res · res · MD",
      group: "MD",
      set: (instance, value) =>
        instance.setParameters({ "prob-res-res-MD": value }),
    },
    "prob-res-cbd-MD": {
      label: "res · cbd · MD",
      group: "MD",
      set: (instance, value) =>
        instance.setParameters({ "prob-res-cbd-MD": value }),
    },
    "prob-res-com-MD": {
      label: "res · com · MD",
      group: "MD",
      set: (instance, value) =>
        instance.setParameters({ "prob-res-com-MD": value }),
    },
    "prob-res-res-PM": {
      label: "res · res · PM",
      group: "PM",
      set: (instance, value) =>
        instance.setParameters({ "prob-res-res-PM": value }),
    },
    "prob-com-res-PM": {
      label: "com · res · PM",
      group: "PM",
      set: (instance, value) =>
        instance.setParameters({ "prob-com-res-PM": value }),
    },
    "prob-com-cbd-PM": {
      label: "com · cbd · PM",
      group: "PM",
      set: (instance, value) =>
        instance.setParameters({ "prob-com-cbd-PM": value }),
    },
    "prob-com-com-PM": {
      label: "com · com · PM",
      group: "PM",
      set: (instance, value) =>
        instance.setParameters({ "prob-com-com-PM": value }),
    },
    "prob-cbd-res-PM": {
      label: "cbd · res · PM",
      group: "PM",
      set: (instance, value) =>
        instance.setParameters({ "prob-cbd-res-PM": value }),
    },
    "prob-cbd-com-PM": {
      label: "cbd · com · PM",
      group: "PM",
      set: (instance, value) =>
        instance.setParameters({ "prob-cbd-com-PM": value }),
    },
    "prob-cbd-cbd-PM": {
      label: "cbd · cbd · PM",
      group: "PM",
      set: (instance, value) =>
        instance.setParameters({ "prob-cbd-cbd-PM": value }),
    },
    "prob-res-com-PM": {
      label: "res · com · PM",
      group: "PM",
      set: (instance, value) =>
        instance.setParameters({ "prob-res-com-PM": value }),
    },
    "prob-res-cbd-PM": {
      label: "res · cbd · PM",
      group: "PM",
      set: (instance, value) =>
        instance.setParameters({ "prob-res-cbd-PM": value }),
    },
    "prob-res-cbd-EVE": {
      label: "res · cbd · EVE",
      group: "EVE",
      set: (instance, value) =>
        instance.setParameters({ "prob-res-cbd-EVE": value }),
    },
    "prob-res-com-EVE": {
      label: "res · com · EVE",
      group: "EVE",
      set: (instance, value) =>
        instance.setParameters({ "prob-res-com-EVE": value }),
    },
    "prob-cbd-cbd-EVE": {
      label: "cbd · cbd · EVE",
      group: "EVE",
      set: (instance, value) =>
        instance.setParameters({ "prob-cbd-cbd-EVE": value }),
    },
    "prob-cbd-com-EVE": {
      label: "cbd · com · EVE",
      group: "EVE",
      set: (instance, value) =>
        instance.setParameters({ "prob-cbd-com-EVE": value }),
    },
    "prob-cbd-res-EVE": {
      label: "cbd · res · EVE",
      group: "EVE",
      set: (instance, value) =>
        instance.setParameters({ "prob-cbd-res-EVE": value }),
    },
    "prob-com-com-EVE": {
      label: "com · com · EVE",
      group: "EVE",
      set: (instance, value) =>
        instance.setParameters({ "prob-com-com-EVE": value }),
    },
    "prob-com-cbd-EVE": {
      label: "com · cbd · EVE",
      group: "EVE",
      set: (instance, value) =>
        instance.setParameters({ "prob-com-cbd-EVE": value }),
    },
    "prob-com-res-EVE": {
      label: "com · res · EVE",
      group: "EVE",
      set: (instance, value) =>
        instance.setParameters({ "prob-com-res-EVE": value }),
    },
    "prob-res-res-EVE": {
      label: "res · res · EVE",
      group: "EVE",
      set: (instance, value) =>
        instance.setParameters({ "prob-res-res-EVE": value }),
    },
    "prob-res-cbd-EM": {
      label: "res · cbd · EM",
      group: "EM",
      set: (instance, value) =>
        instance.setParameters({ "prob-res-cbd-EM": value }),
    },
    "prob-res-res-EM": {
      label: "res · res · EM",
      group: "EM",
      set: (instance, value) =>
        instance.setParameters({ "prob-res-res-EM": value }),
    },
    "prob-res-com-EM": {
      label: "res · com · EM",
      group: "EM",
      set: (instance, value) =>
        instance.setParameters({ "prob-res-com-EM": value }),
    },
    "prob-cbd-cbd-EM": {
      label: "cbd · cbd · EM",
      group: "EM",
      set: (instance, value) =>
        instance.setParameters({ "prob-cbd-cbd-EM": value }),
    },
    "prob-cbd-com-EM": {
      label: "cbd · com · EM",
      group: "EM",
      set: (instance, value) =>
        instance.setParameters({ "prob-cbd-com-EM": value }),
    },
    "prob-cbd-res-EM": {
      label: "cbd · res · EM",
      group: "EM",
      set: (instance, value) =>
        instance.setParameters({ "prob-cbd-res-EM": value }),
    },
    "prob-com-com-EM": {
      label: "com · com · EM",
      group: "EM",
      set: (instance, value) =>
        instance.setParameters({ "prob-com-com-EM": value }),
    },
    "prob-com-cbd-EM": {
      label: "com · cbd · EM",
      group: "EM",
      set: (instance, value) =>
        instance.setParameters({ "prob-com-cbd-EM": value }),
    },
    "prob-com-res-EM": {
      label: "com · res · EM",
      group: "EM",
      set: (instance, value) =>
        instance.setParameters({ "prob-com-res-EM": value }),
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
