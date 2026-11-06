import { stats } from "city-library";
import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
import type { TaxiParameters } from "./parameters.ts";

type LiveKey = Exclude<keyof TaxiParameters, "seed" | "numTaxicab">;
const liveKeys = (Object.keys(model.inputs) as (keyof TaxiParameters)[]).filter(
  (key): key is LiveKey => key !== "seed" && key !== "numTaxicab",
);

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

const binding = defineUI(model, {
  setup: [{ field: "seed" }, { field: "numTaxicab" }],
  live: liveKeys.map((field) => ({
    field,
    label: field.startsWith("prob-")
      ? field.slice(5).replaceAll("-", " · ")
      : undefined,
    value: (state) => state.parameters[field],
    set: (instance, value) =>
      instance.setParameters({ [field]: Number(value) }),
  })),
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
      value: (state) => state.cabs.filter((cab) => !cab.vacancy).length,
    },
    {
      label: "Total income ($)",
      value: (state) =>
        state.cabs.reduce((sum, cab) => sum + cab.totalIncome, 0).toFixed(2),
    },
  ],
  views: [
    {
      type: "spatial",
      label: "Taxi service",
      data: (state) => ({
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
      }),
    },
    {
      type: "line",
      label: "Taxicabs travelling distance",
      series: (state) => [
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
      ],
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
export const sourceMarker =
  "selected-transport-b04:taxi-cabs:150f739ec217fbb199d86eca783922a79acceeb6504e44add1921d934d3d4a30";
export const ui = {
  ...binding,
  model,
  sourceMarker,
  mount(container: HTMLElement) {
    const mounted = binding.mount(container);
    const live = container.querySelector(".live-controls");
    if (live) {
      const demand = document.createElement("details");
      const summary = document.createElement("summary");
      summary.textContent = "Spatial flow parameters";
      demand.append(summary);
      for (const phase of ["AM", "MD", "PM", "EVE", "EM"]) {
        const group = document.createElement("details");
        const title = document.createElement("summary");
        title.textContent = phase;
        group.append(title);
        for (const label of [...live.querySelectorAll("label")]) {
          const input = label.querySelector("input");
          if (
            input?.name.startsWith("live-prob-") &&
            input.name.endsWith(`-${phase}`)
          )
            group.append(label);
        }
        demand.append(group);
      }
      live.append(demand);
    }
    return mounted;
  },
};
