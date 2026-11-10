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
    label: "Source attribution · Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Latest price", value: (s) => s.latestPrice, format: twoDecimals },
    { label: "Latest volume ($)", value: (s) => s.latestVolume, format: twoDecimals },
    { label: "Price to date", value: (s) => s.priceToDate, format: twoDecimals },
    { label: "Total cash", value: (s) => s.globalCash, format: twoDecimals },
    { label: "Circulating tokens", value: (s) => s.globalTokens },
    { label: "Total utilities", value: (s) => s.totalUtility, format: twoDecimals },
    { label: "Average utilities", value: (s) => s.averageUtility ?? "Undefined", format: twoDecimalsOrText },
    { label: "Average honest utility", value: (s) => s.averageHonestUtility ?? "Undefined", format: twoDecimalsOrText },
    { label: "Average cunning utility", value: (s) => s.averageCunningUtility ?? "Undefined", format: twoDecimalsOrText },
    { label: "Cunning / honest (%)", value: (s) => s.cunningHonestPercent ?? "Undefined", format: twoDecimalsOrText },
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
      label: "Order book by price level",
      rows: orderBookLevels,
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

/**
 * The conventional price ladder: open orders grouped by side and price, asks above bids,
 * both sorted from high to low price so the spread sits in the middle.
 */
function orderBookLevels(s: UIObservation) {
  const levels = new Map<string, { side: "Ask" | "Bid"; price: number; orders: number; quantity: number }>();
  for (const order of s.orders) {
    if (order.removed) continue;
    const side = order.buySide ? "Bid" : "Ask";
    // Group by the displayed cent price so float noise never splits one level.
    const key = `${side}:${order.price.toFixed(2)}`;
    const level = levels.get(key) ?? { side, price: order.price, orders: 0, quantity: 0 };
    level.orders += 1;
    level.quantity += order.remaining;
    levels.set(key, level);
  }
  const sideOrder = { Ask: 0, Bid: 1 };
  return [...levels.values()]
    .sort((a, b) => sideOrder[a.side] - sideOrder[b.side] || b.price - a.price)
    .map((level) => ({ side: level.side, price: level.price.toFixed(2), quantity: level.quantity, orders: level.orders }));
}

function twoDecimals(value: number) {
  return value.toFixed(2);
}

function twoDecimalsOrText(value: number | string) {
  return typeof value === "number" ? value.toFixed(2) : value;
}
