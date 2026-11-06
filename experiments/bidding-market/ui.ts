import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: [
    { field: "seed" },
    { field: "startingMoney", label: "Starting money" },
    { field: "supplyAmount", label: "Supply amount" },
    { field: "supplyDistribution", label: "Supply distribution" },
    { field: "demandAmount", label: "Demand amount" },
    { field: "demandDistribution", label: "Demand distribution" },
    { field: "sellerBehavior", label: "Seller behavior" },
    { field: "buyerBehavior", label: "Buyer behavior" },
  ],
  live: [
    {
      field: "sellersIgnoreFullBuyers",
      label: "Ignore full buyers",
      value: (s) => s.parameters.sellersIgnoreFullBuyers,
      set: (m, v) => m.setRules({ sellersIgnoreFullBuyers: Boolean(v) }),
    },
    {
      field: "stars",
      label: "Sale markers",
      value: (s) => s.parameters.stars,
      set: (m, v) => m.setRules({ stars: Boolean(v) }),
    },
  ],
  complete: (s) => s.done,
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Social%20Science/Economics/Bidding%20Market.nlogox",
    label: "Original NetLogo model · Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Sales", value: (s) => s.totalSales },
    { label: "Average price", value: (s) => s.averagePrice },
    {
      label: "Money taken (%)",
      value: (s) => s.percentMoneyTaken ?? "Undefined",
    },
    {
      label: "Items sold (%)",
      value: (s) => s.percentItemsSold ?? "Undefined",
    },
    {
      label: "Demand met (%)",
      value: (s) => s.percentDemandSatisfied ?? "Undefined",
    },
  ],
  views: [
    {
      type: "spatial",
      label: "Buyers and sellers",
      data: (s) => ({
        width: 29,
        height: 29,
        agents: [
          ...s.sellers.map((t) => ({
            ...t,
            color: t.itemsForSale > 0 ? "#447abd" : "#666666",
            label: String(t.itemsForSale),
            size: 5 + Math.sqrt(t.itemsForSale),
          })),
          ...s.buyers.map((t) => ({
            ...t,
            color: t.wantToBuy > 0 ? "#cb7641" : "#666666",
            label: String(t.wantToBuy),
            size: 5 + Math.sqrt(t.bought),
          })),
        ],
        segments: s.links.map((l) => ({
          from: s.sellers.find((t) => t.id === l.seller)!,
          to: s.buyers.find((t) => t.id === l.buyer)!,
          color: l.sale ? "#d9b52f" : "#426795",
          width: l.sale && s.parameters.stars ? 2 : 1,
        })),
      }),
    },
    {
      type: "line",
      label: "Seller asking prices",
      series: (s) =>
        (["askingMin", "askingMean", "askingMax"] as const).map((key) => ({
          label: key
            .replace(/^(asking|willing)/, "")
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .replace(/^./, (value) => value.toUpperCase()),
          points: s.history.map((h) => ({ x: h.tick, y: h[key] })),
        })),
    },
    {
      type: "line",
      label: "Buyer willing to pay",
      series: (s) =>
        (["willingMin", "willingMean", "willingMax"] as const).map((key) => ({
          label: key
            .replace(/^(asking|willing)/, "")
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .replace(/^./, (value) => value.toUpperCase()),
          points: s.history.map((h) => ({ x: h.tick, y: h[key] })),
        })),
    },
    {
      type: "line",
      label: "Items",
      series: (s) =>
        (["itemsForSale", "wantToBuy", "totalSales"] as const).map((key) => ({
          label: key
            .replace(/^(asking|willing)/, "")
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .replace(/^./, (value) => value.toUpperCase()),
          points: s.history.map((h) => ({ x: h.tick, y: h[key] })),
        })),
    },
    {
      type: "line",
      label: "Market outcomes",
      series: (s) => [
        {
          label: "Money taken (%)",
          points: s.history.map((h) => ({ x: h.tick, y: h.percentMoneyTaken })),
        },
        {
          label: "Items sold (%)",
          points: s.history.map((h) => ({ x: h.tick, y: h.percentItemsSold })),
        },
        {
          label: "Demand met (%)",
          points: s.history.map((h) => ({
            x: h.tick,
            y: h.percentDemandSatisfied,
          })),
        },
      ],
    },
    {
      type: "line",
      label: "Average price",
      series: (s) => [
        {
          label: "Price",
          points: s.history.map((h) => ({ x: h.tick, y: h.averagePrice })),
        },
      ],
    },
  ],
});
