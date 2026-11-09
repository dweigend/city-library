/** NetLogo Bidding Market, Wilensky 2017; CC BY-NC-SA 3.0, see NOTICE.md. */
import { Agent, Random, World, run, stats } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
type Amount = "high" | "low";
type Distribution = "even" | "concentrated";
type Behavior = "normal" | "desperate" | "random" | "mix of all";
export interface Parameters {
  seed: number;
  startingMoney: number;
  supplyAmount: Amount;
  supplyDistribution: Distribution;
  demandAmount: Amount;
  demandDistribution: Distribution;
  sellerBehavior: Behavior;
  buyerBehavior: Behavior;
  sellersIgnoreFullBuyers: boolean;
  stars: boolean;
}
export const inputs: Inputs<Parameters> = {
  seed: { kind: "number", default: 1, integer: true },
  startingMoney: { kind: "number", default: 500, min: 0, max: 500, step: 25 },
  supplyAmount: { kind: "choice", default: "high", options: ["high", "low"] },
  supplyDistribution: {
    kind: "choice",
    default: "even",
    options: ["concentrated", "even"],
  },
  demandAmount: { kind: "choice", default: "high", options: ["low", "high"] },
  demandDistribution: {
    kind: "choice",
    default: "even",
    options: ["concentrated", "even"],
  },
  sellerBehavior: {
    kind: "choice",
    default: "normal",
    options: ["normal", "desperate", "random", "mix of all"],
  },
  buyerBehavior: {
    kind: "choice",
    default: "normal",
    options: ["normal", "desperate", "random", "mix of all"],
  },
  sellersIgnoreFullBuyers: { kind: "boolean", default: false },
  stars: { kind: "boolean", default: true },
};
export function changePrice(value: number, change: number) {
  let next = Math.max(0.01, Math.round((1 + change / 100) * value * 100) / 100);
  if (next === value) {
    if (change < 0 && value !== 0.01)
      next = Math.round((value - 0.01) * 100) / 100;
    if (change > 0) next = Math.round((value + 0.01) * 100) / 100;
  }
  return next;
}
type Seller = Agent<{
  kind: "seller";
  index: number;
  money: number;
  itemsForSale: number;
  startingSupply: number;
  askingPrice: number;
  sold: number;
  behavior: Exclude<Behavior, "mix of all">;
}>;
type Buyer = Agent<{
  kind: "buyer";
  index: number;
  money: number;
  wantToBuy: number;
  startingDemand: number;
  willingToPay: number;
  bought: number;
  behavior: Exclude<Behavior, "mix of all">;
}>;
export function create(options: Partial<Parameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.add({ seed: settings.seed }),
    world = World.add({ x: 29, y: 29, boundary: "hard" }, { random });
  const integer = (n: number) => Math.floor(random.number() * n),
    round = (n: number) => Math.round(n * 100) / 100;
  const sellers = () =>
      world.agents.filter(
        (a): a is Seller => (a as Seller | Buyer).kind === "seller",
      ),
    buyers = () =>
      world.agents.filter(
        (a): a is Buyer => (a as Seller | Buyer).kind === "buyer",
      );
  const shuffle = <T>(a: readonly T[]) =>
    random.sample(a, { count: a.length, compatibility: "legacy-shuffle" });
  const amount = (d: Distribution, a: Amount) => {
    const n = a === "high" ? 50 : 25;
    return d === "even"
      ? 1 + integer(n)
      : 1 + Math.floor(-(n / 2) * Math.log(1 - random.number()));
  };
  // NetLogo random rounds a positive fractional bound upward before its integer draw.
  const initial = (n: number) =>
    n === 0 ? 0 : round(n / 2 + integer(Math.ceil(n / 2)));
  const behavior = (b: Behavior): Exclude<Behavior, "mix of all"> =>
    b === "mix of all"
      ? (["normal", "desperate", "random"] as const)[integer(3)]!
      : b;
  let totalSales = 0,
    salesPerTick = 0,
    remainingSupply = 0;
  const edges: { seller: string; buyer: string; sale: boolean }[] = [];
  for (let index = 0; index < 50; index++) {
    const a = (index * 2 * Math.PI) / 50,
      items = amount(settings.supplyDistribution, settings.supplyAmount);
    world.add(
      Agent.add(
        {
          kind: "seller" as const,
          index,
          money: 0,
          itemsForSale: items,
          startingSupply: items,
          askingPrice: initial(100),
          sold: 0,
          behavior: behavior(settings.sellerBehavior),
        },
        { position: { x: 8 * Math.sin(a), y: 8 * Math.cos(a) } },
      ),
    );
  }
  for (let index = 0; index < 50; index++) {
    const a = (index * 2 * Math.PI) / 50,
      want = amount(settings.demandDistribution, settings.demandAmount);
    world.add(
      Agent.add(
        {
          kind: "buyer" as const,
          index,
          money: initial(settings.startingMoney),
          wantToBuy: want,
          startingDemand: want,
          willingToPay: initial(10),
          bought: 0,
          behavior: behavior(settings.buyerBehavior),
        },
        { position: { x: 13 * Math.sin(a), y: 13 * Math.cos(a) } },
      ),
    );
  }
  const startingMoneyActual = buyers().reduce((n, b) => n + b.money, 0);
  function quoteSummary() {
    const asking = sellers()
      .filter((s) => s.itemsForSale > 0)
      .map((s) => s.askingPrice);
    const willing = buyers()
      .filter((b) => b.wantToBuy > 0 && b.money > 0)
      .map((b) => b.willingToPay);
    const sellerSummary = stats.describe(asking);
    const buyerSummary = stats.describe(willing);
    return {
      askingMin: sellerSummary.min ?? 0,
      askingMean: sellerSummary.mean ?? 0,
      askingMax: sellerSummary.max ?? 0,
      willingMin: buyerSummary.min ?? 0,
      willingMean: buyerSummary.mean ?? 0,
      willingMax: buyerSummary.max ?? 0,
      itemsForSale: sellers().reduce((n, s) => n + s.itemsForSale, 0),
      wantToBuy: buyers().reduce((n, b) => n + b.wantToBuy, 0),
    };
  }
  const history: (ReturnType<typeof quoteSummary> & {
    tick: number;
    totalSales: number;
    sellerCash: number;
    averagePrice: number;
    percentMoneyTaken: number;
    percentItemsSold: number;
    percentDemandSatisfied: number;
  })[] = [];
  const sellerCash = () => sellers().reduce((n, s) => n + s.money, 0);
  const percent = (a: number, b: number) => (b === 0 ? null : (100 * a) / b);
  function record() {
    const cash = sellerCash();
    history.push({
      tick: world.tick.value,
      ...quoteSummary(),
      totalSales,
      sellerCash: cash,
      averagePrice: totalSales === 0 ? 0 : round(cash / totalSales),
      percentMoneyTaken: percent(cash, startingMoneyActual) ?? 0,
      percentItemsSold:
        percent(
          totalSales,
          sellers().reduce((n, s) => n + s.startingSupply, 0),
        ) ?? 0,
      percentDemandSatisfied:
        percent(
          totalSales,
          buyers().reduce((n, b) => n + b.startingDemand, 0),
        ) ?? 0,
    });
    if (history.length > 1001) history.splice(1, 1);
  }
  const done = () =>
    sellers().every((s) => s.itemsForSale === 0) ||
    buyers().every((b) => b.money <= 0 || b.wantToBuy <= 0);
  function commerce(b: Buyer, s: Seller) {
    const sale =
      s.itemsForSale > 0 &&
      b.wantToBuy > 0 &&
      s.askingPrice <= b.money &&
      s.askingPrice <= b.willingToPay;
    edges.push({ seller: s.id, buyer: b.id, sale });
    if (sale) {
      salesPerTick++;
      b.wantToBuy--;
      b.money = round(b.money - s.askingPrice);
      if (b.money < 0.01) b.money = 0;
      b.bought++;
      s.itemsForSale--;
      s.money = round(s.money + s.askingPrice);
      s.sold++;
    }
    if (s.behavior === "random")
      s.askingPrice = changePrice(s.askingPrice, integer(11) - 5);
    else if (sale || !settings.sellersIgnoreFullBuyers || b.wantToBuy !== 0)
      s.askingPrice = changePrice(
        s.askingPrice,
        s.behavior === "normal" ? (sale ? 2.5 : -2) : sale ? 0.7 : -5,
      );
    const change =
      b.behavior === "random"
        ? integer(11) - 5
        : b.behavior === "normal"
          ? sale
            ? -2
            : 2.5
          : sale
            ? -0.5
            : 7.5;
    b.willingToPay = Math.min(b.money, changePrice(b.willingToPay, change));
  }
  function go() {
    salesPerTick = 0;
    edges.length = 0;
    const positions = buyers().map((b) => ({ x: b.x, y: b.y }));
    for (const b of shuffle(buyers()))
      b.move({ to: positions[(b.index + 49) % 50]! });
    remainingSupply = sellers().reduce((n, s) => n + s.itemsForSale, 0);
    const offset = 1 + (world.tick.value % 50);
    for (let i = 0; i < 50; i++)
      commerce(buyers()[(i + offset) % 50]!, sellers()[i]!);
    totalSales += salesPerTick;
    if (buyers().some((b) => b.wantToBuy > 0 && b.willingToPay > b.money))
      throw new Error(
        "Cannot have agents that want to pay more than their cash!",
      );
  }
  record();
  return {
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count && !done(); i++) {
        run(world, go);
        record();
      }
    },
    setRules(
      value: Pick<Partial<Parameters>, "sellersIgnoreFullBuyers" | "stars">,
    ) {
      settings = parameters(inputs, { ...settings, ...value });
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        parameters: settings,
        width: 29,
        height: 29,
        sourceMarker: "bidding-market:source-v1",
        done: done(),
        totalSales,
        salesPerTick,
        remainingSupply,
        startingMoneyActual,
        quotes: Object.freeze(quoteSummary()),
        sellerCash: sellerCash(),
        averagePrice: totalSales === 0 ? 0 : round(sellerCash() / totalSales),
        percentMoneyTaken: percent(sellerCash(), startingMoneyActual),
        percentItemsSold: percent(
          totalSales,
          sellers().reduce((n, s) => n + s.startingSupply, 0),
        ),
        percentDemandSatisfied: percent(
          totalSales,
          buyers().reduce((n, b) => n + b.startingDemand, 0),
        ),
        sellers: Object.freeze(
          sellers().map((s) =>
            Object.freeze({
              id: s.id,
              x: s.x,
              y: s.y,
              index: s.index,
              money: s.money,
              itemsForSale: s.itemsForSale,
              startingSupply: s.startingSupply,
              askingPrice: s.askingPrice,
              sold: s.sold,
              behavior: s.behavior,
            }),
          ),
        ),
        buyers: Object.freeze(
          buyers().map((b) =>
            Object.freeze({
              id: b.id,
              x: b.x,
              y: b.y,
              index: b.index,
              money: b.money,
              wantToBuy: b.wantToBuy,
              startingDemand: b.startingDemand,
              willingToPay: b.willingToPay,
              bought: b.bought,
              behavior: b.behavior,
            }),
          ),
        ),
        edges: Object.freeze(edges.map((l) => Object.freeze({ ...l }))),
        history: Object.freeze(history.map((h) => Object.freeze({ ...h }))),
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: "Bidding Market",
  description: "Adaptive bilateral market · Wilensky · CC BY-NC-SA 3.0",
  inputs,
  create,
} satisfies Definition<Parameters, ReturnType<typeof create>>;
