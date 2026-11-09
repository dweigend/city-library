import { defineUI, type Observation, type Series } from "../../ui/index.ts";

import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: [
    "seed",
    "tradePrecision",
    "honestTraders",
    "cunningTraders",
    "initialCash",
    "initialTokens",
    "initialBelief",
  ],
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Social%20Science/Economics/Limited%20Order%20Book.nlogox",
    label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Latest price", value: (s) => s.latestPrice },
    { label: "Latest volume ($)", value: (s) => s.latestVolume },
    { label: "Price to date", value: (s) => s.priceToDate },
    { label: "Total cash", value: (s) => s.globalCash },
    { label: "Circulating tokens", value: (s) => s.globalTokens },
    { label: "Total utilities", value: (s) => s.totalUtility },
    {
      label: "Average utilities",
      value: (s) => s.averageUtility ?? "Undefined",
    },
    {
      label: "Average honest utility",
      value: (s) => s.averageHonestUtility ?? "Undefined",
    },
    {
      label: "Average cunning utility",
      value: (s) => s.averageCunningUtility ?? "Undefined",
    },
    {
      label: "Cunning / honest (%)",
      value: (s) => s.cunningHonestPercent ?? "Undefined",
    },
  ],
  views: [
    {
      type: "spatial",
      label: "Traders",
      data: (s) => ({
        width: 41,
        height: 41,
        agents: s.traders.map((t) => ({
          ...t,
          color: t.strategy === "honest" ? "#447abd" : "#cb7641",
          label: String(t.stockpile),
          size: 10,
        })),
      }),
    },
    {
      type: "line",
      label: "Trading prices",
      series: tradingPricesSeries,
    },
    {
      type: "line",
      label: "Average utility gain (%)",
      series: averageUtilityGainSeries,
    },
    {
      type: "table",
      label: "Orders",
      rows: (s) =>
        s.orders
          .filter((o) => !o.removed)
          .map((o) => ({
            side: o.buySide ? "Bid" : "Ask",
            owner: o.owner,
            price: o.price,
            remaining: o.remaining,
            pending: o.pending,
          })),
    },
  ],
});

type UIObservation = Observation<typeof model>;

function tradingPricesSeries(s: UIObservation): readonly Series[] {
  return [
    {
      label: "Latest",
      points: s.history
        .filter((h) => h.tick > 0)
        .map((h) => ({ x: h.tick, y: h.latestPrice })),
    },
    {
      label: "Recent",
      points: s.history.map((h) => ({ x: h.tick, y: h.recentPrice })),
    },
    {
      label: "To date",
      points: s.history.map((h) => ({ x: h.tick, y: h.priceToDate })),
    },
  ];
}

function averageUtilityGainSeries(s: UIObservation): readonly Series[] {
  return [
    {
      label: "Everyone",
      points: s.history.flatMap((h) =>
        h.everyoneGain === null ? [] : [{ x: h.tick, y: h.everyoneGain }],
      ),
    },
    {
      label: "Honest",
      points: s.history.flatMap((h) =>
        h.honestGain === null || !Number.isFinite(h.honestGain)
          ? []
          : [{ x: h.tick, y: h.honestGain }],
      ),
    },
    {
      label: "Cunning",
      points: s.history.flatMap((h) =>
        h.cunningGain === null || !Number.isFinite(h.cunningGain)
          ? []
          : [{ x: h.tick, y: h.cunningGain }],
      ),
    },
  ];
}
