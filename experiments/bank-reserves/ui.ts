import { defineUI, type Observation, type Series } from "../../ui/index.ts";

import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["people", "seed"],
  live: {
    reserves: {
      set: (m, value) => m.setRules({ reserves: value }),
    },
  },
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Social%20Science/Economics/Unverified/Bank%20Reserves.nlogox",
    label: "Original NetLogo model · Uri Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    { label: "Mean wealth", value: (s) => s.meanWealth ?? "Undefined" },
    { label: "Tick", value: (s) => s.tick },
    { label: "Next phase", value: (s) => s.phase },
    { label: "Savings total", value: (s) => s.savingsTotal },
    { label: "Wallets total", value: (s) => s.walletsTotal },
    { label: "Loans total", value: (s) => s.loansTotal },
    { label: "Money total", value: (s) => s.moneyTotal },
    { label: "Bank reserves", value: (s) => s.bankReserves },
    { label: "Bank to loan", value: (s) => s.bankToLoan },
    { label: "Rich", value: (s) => s.rich },
    { label: "Middle class", value: (s) => s.middleClass },
    { label: "Poor", value: (s) => s.poor },
  ],
  views: [
    {
      type: "spatial",
      label: "People",
      data: (s) => ({
        width: s.width,
        height: s.height,
        agents: s.people.map((p) => ({
          id: p.id,
          x: p.x,
          y: p.y,
          color: p.color,
          size: 8,
        })),
      }),
    },
    {
      type: "line",
      label: "Income distribution",
      series: incomeDistributionSeries,
    },
    {
      type: "line",
      label: "Money and loans",
      series: (s) => [
        {
          label: "Money",
          points: s.history.map((p) => ({ x: p.tick, y: p.moneyTotal })),
        },
        {
          label: "Loans",
          color: "#d43b36",
          points: s.history.map((p) => ({ x: p.tick, y: p.loansTotal })),
        },
      ],
    },
    {
      type: "line",
      label: "Savings and wallets",
      series: savingsAndWalletsSeries,
    },
    {
      type: "line",
      label: "Wealth distribution",
      series: (s) => [
        { label: "People", color: "#315bd5", points: s.wealthHistogram },
      ],
    },
    {
      type: "inspector",
      label: "Account",
      value: (s, id) => {
        const p = s.people.find((p) => p.id === id);
        return p && { ...p, customer: p.customer ?? "None" };
      },
    },
  ],
});

type UIObservation = Observation<typeof model>;

function incomeDistributionSeries(s: UIObservation): readonly Series[] {
  return [
    {
      label: "Rich",
      color: "#38a339",
      points: s.history.map((p) => ({ x: p.tick, y: p.rich })),
    },
    {
      label: "Middle",
      color: "#8d8d8d",
      points: s.history.map((p) => ({ x: p.tick, y: p.middleClass })),
    },
    {
      label: "Poor",
      color: "#d43b36",
      points: s.history.map((p) => ({ x: p.tick, y: p.poor })),
    },
  ];
}

function savingsAndWalletsSeries(s: UIObservation): readonly Series[] {
  return [
    {
      label: "Savings",
      color: "#315bd5",
      points: s.history.map((p) => ({ x: p.tick, y: p.savingsTotal })),
    },
    {
      label: "Wallets",
      color: "#38a339",
      points: s.history.map((p) => ({ x: p.tick, y: p.walletsTotal })),
    },
  ];
}
