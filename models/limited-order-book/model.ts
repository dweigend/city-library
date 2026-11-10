/** NetLogo Limited Order Book, Wilensky 2021, CC BY-NC-SA 3.0. */
import { Agent, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface Parameters {
  seed: number;
  tradePrecision: number;
  honestTraders: number;
  cunningTraders: number;
  initialCash: number;
  initialTokens: number;
  initialBelief: number;
}
export const inputs: Inputs<Parameters> = {
  seed: { kind: "number", default: 1, integer: true },
  tradePrecision: { kind: "number", default: 0, min: 0, max: 3, integer: true },
  honestTraders: {
    kind: "number",
    default: 50,
    min: 0,
    max: 100,
    integer: true,
  },
  cunningTraders: {
    kind: "number",
    default: 50,
    min: 0,
    max: 100,
    integer: true,
  },
  initialCash: {
    kind: "number",
    default: 1000,
    min: 0,
    max: 2000,
    integer: true,
  },
  initialTokens: {
    kind: "number",
    default: 50,
    min: 0,
    max: 200,
    integer: true,
  },
  initialBelief: {
    kind: "number",
    default: 25,
    min: 0,
    max: 100,
    integer: true,
  },
};
type Trader = Agent<{
  strategy: "honest" | "cunning";
  cash: number;
  stockpile: number;
  belief: number;
  utility: number;
  initialUtility: number;
  index: number;
}>;
interface Order {
  owner: Trader;
  buySide: boolean;
  price: number;
  quantity: number;
  remaining: number;
  pending: boolean;
  removed: boolean;
  index: number;
}
export function floorToUnit(value: number, unit: number) {
  if (!Number.isFinite(value) || !Number.isFinite(unit) || unit <= 0)
    throw new RangeError("Finite amount and positive unit required.");
  return Math.floor(value / unit) * unit;
}
export function create(options: Partial<Parameters> = {}) {
  const settings = parameters(inputs, options),
    random = Random.create({ seed: settings.seed }),
    world = World.create({ x: 41, y: 41, boundary: "hard" }, { random });
  const traders = () => world.agents as readonly Trader[];
  const orders: Order[] = [];
  let asks: Order[] = [],
    bids: Order[] = [];
  const tradeUnit = 10 ** -settings.tradePrecision;
  let latestAmount = 0,
    latestVolume = 0,
    latestPrice = 0,
    totalAmount = 0,
    totalVolume = 0,
    bestBidPrice = 0,
    bestAskPrice = 0,
    recentPrice = 0,
    recentAmount = 0,
    recentVolume = 0,
    recentChange = 0,
    priceToDate = 0;
  const amount = (n: number) => Math.floor(random.number() * n) * 0.5 + n * 0.5;
  const shuffle = <T>(a: readonly T[]) =>
    random.sample(a, { count: a.length, algorithm: "fisher-yates-descending" });
  for (
    let index = 0;
    index < settings.honestTraders + settings.cunningTraders;
    index++
  ) {
    const a =
        (index * 2 * Math.PI) /
        (settings.honestTraders + settings.cunningTraders),
      cash = amount(settings.initialCash),
      stockpile = amount(settings.initialTokens),
      belief = amount(settings.initialBelief),
      utility = cash + belief * stockpile;
    const t = Agent.create(
      {
        strategy:
          index < settings.honestTraders
            ? ("honest" as const)
            : ("cunning" as const),
        cash,
        stockpile,
        belief,
        utility,
        initialUtility: utility,
        index,
      },
      { position: { x: 18 * Math.sin(a), y: 18 * Math.cos(a) } },
    );
    world.add(t);
    for (const buySide of [true, false])
      orders.push({
        owner: t,
        buySide,
        price: 0,
        quantity: 0,
        remaining: 0,
        pending: false,
        removed: true,
        index: orders.length,
      });
  }
  const globalTokens = Math.max(
      1,
      traders().reduce((n, t) => n + t.stockpile, 0),
    ),
    globalCash = Math.max(
      1,
      traders().reduce((n, t) => n + t.cash, 0),
    );
  const history: {
    tick: number;
    latestPrice: number;
    recentPrice: number;
    priceToDate: number;
    honestGain: number | null;
    cunningGain: number | null;
    everyoneGain: number | null;
    totalUtility: number;
  }[] = [];
  const gain = (strategy: "honest" | "cunning") => {
    const ts = traders().filter((t) => t.strategy === strategy);
    return ts.length
      ? ts.reduce(
          (n, t) =>
            n +
            (t.initialUtility === 0
              ? NaN
              : 100 * (t.utility / t.initialUtility - 1)),
          0,
        ) / ts.length
      : null;
  };
  function averageUtility(strategy?: "honest" | "cunning") {
    const selected = traders().filter(
      (t) => strategy === undefined || t.strategy === strategy,
    );
    return selected.length
      ? selected.reduce((sum, t) => sum + t.utility, 0) / selected.length
      : null;
  }
  function everyoneGain() {
    const selected = traders();
    if (!selected.length || selected.some((t) => t.initialUtility === 0))
      return null;
    return (
      selected.reduce(
        (sum, t) => sum + (t.utility / t.initialUtility) * 100 - 100,
        0,
      ) / selected.length
    );
  }
  function record() {
    history.push({
      tick: world.tick.value,
      latestPrice,
      recentPrice,
      priceToDate,
      honestGain: gain("honest"),
      cunningGain: gain("cunning"),
      everyoneGain: everyoneGain(),
      totalUtility: traders().reduce((n, t) => n + t.utility, 0),
    });
    if (history.length > 1001) history.splice(1, 1);
  }
  function submitOrder(
    index: number,
    buySide: boolean,
    price: number,
    quantity: number,
  ) {
    if (!Number.isInteger(index) || !traders()[index])
      throw new RangeError("Unknown trader.");
    if (!Number.isFinite(price) || price <= 0)
      throw new RangeError("Price cannot go below zero!");
    if (!Number.isFinite(quantity) || quantity <= 0)
      throw new RangeError("Quantity cannot go below zero!");
    const o = orders.find(
      (o) => o.owner === traders()[index] && o.buySide === buySide,
    )!;
    Object.assign(o, {
      removed: false,
      pending: true,
      price,
      quantity,
      remaining: quantity,
    });
  }
  function remove(o: Order) {
    bids = bids.filter((x) => x !== o);
    asks = asks.filter((x) => x !== o);
    o.pending = false;
    o.removed = true;
  }
  function executeOrder(bid: Order, ask: Order) {
    const bidder = bid.owner,
      asker = ask.owner,
      price = Math.min(bid.price, ask.price),
      maxBuy = floorToUnit(bidder.cash / price, tradeUnit);
    if (maxBuy <= 0) {
      remove(bid);
      return;
    }
    if (asker.stockpile <= 0) {
      remove(ask);
      return;
    }
    const amount = Math.min(
      bid.remaining,
      ask.remaining,
      maxBuy,
      asker.stockpile,
    );
    bidder.cash -= amount * price;
    bidder.stockpile += amount;
    asker.cash += amount * price;
    asker.stockpile -= amount;
    latestAmount += amount;
    totalAmount += amount;
    latestVolume += amount * price;
    totalVolume += amount * price;
    for (const o of new Set([bid, ask])) {
      o.remaining -= amount;
      if (o.remaining === 0) remove(o);
    }
  }
  function calculateBestOrder(fallback: number) {
    const live = orders.filter((o) => !o.removed);
    bestBidPrice = live
      .filter((o) => o.buySide)
      .reduce((n, o) => Math.max(n, o.price), -Infinity);
    if (bestBidPrice === -Infinity) bestBidPrice = fallback * 0.999;
    bestAskPrice = live
      .filter((o) => !o.buySide)
      .reduce((n, o) => Math.min(n, o.price), Infinity);
    if (bestAskPrice === Infinity) bestAskPrice = fallback * 1.001;
  }
  function matchmake(o: Order) {
    o.pending = false;
    if (o.buySide) {
      if (o.price < bestAskPrice) {
        o.removed = true;
        return;
      }
      while (asks.length && asks[0]!.price < o.price) {
        executeOrder(o, asks[0]!);
        if (o.removed) return;
      }
    } else {
      if (o.price > bestBidPrice) {
        o.removed = true;
        return;
      }
      while (bids.length && bids[0]!.price > o.price) {
        executeOrder(bids[0]!, o);
        if (o.removed) return;
      }
    }
    const book = o.buySide ? bids : asks;
    let index = 0;
    while (
      index < book.length &&
      (o.buySide ? book[index]!.price > o.price : book[index]!.price < o.price)
    )
      index++;
    book.splice(index, 0, o);
  }
  function matchmakeAll() {
    latestAmount = 0;
    latestVolume = 0;
    calculateBestOrder(0);
    for (const o of shuffle(orders.filter((o) => !o.removed && o.pending)))
      matchmake(o);
    if (latestAmount > 0) latestPrice = latestVolume / latestAmount;
  }
  function calculateInfo(previousPrice: number) {
    if (previousPrice === 0) {
      recentChange = 0;
      recentAmount = latestAmount;
      recentVolume = latestVolume;
      recentPrice = latestPrice;
    } else if (latestAmount > 0) {
      recentChange =
        0.9 * recentChange + 0.1 * Math.log(latestPrice / previousPrice);
      recentAmount = 0.9 * recentAmount + 0.1 * latestAmount;
      recentVolume = 0.9 * recentVolume + 0.1 * latestVolume;
      recentPrice = recentVolume / recentAmount;
    } else recentChange *= 0.9;
    // Preserve the native scenario failure rather than inventing a price when no trade ever occurred.
    if (totalAmount === 0)
      throw new Error(
        "Source calculate-info: division by zero (total-amount = 0).",
      );
    priceToDate = totalVolume / totalAmount;
  }
  function go() {
    const previous = latestPrice;
    asks = [];
    bids = [];
    for (const t of shuffle(traders())) {
      let buy = t.belief,
        sell = t.belief + 0.01;
      if (t.strategy === "cunning") {
        if (bestAskPrice !== 0 && bestAskPrice < buy) buy = bestAskPrice;
        if (bestBidPrice > sell) sell = bestBidPrice;
      }
      if (t.cash >= buy) submitOrder(t.index, true, buy, 1);
      if (t.stockpile > 0) submitOrder(t.index, false, sell, 1);
      t.utility = t.cash + t.belief * t.stockpile;
    }
    matchmakeAll();
    calculateInfo(previous);
    if (bids.length && asks.length) {
      bestBidPrice = bids[0]!.price;
      bestAskPrice = asks[0]!.price;
    } else calculateBestOrder(latestPrice);
  }
  record();
  return {
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i++) {
        run(world, go);
        record();
      }
    },
    submitOrder,
    matchmakeAll,
    read() {
      return Object.freeze({
        tick: world.tick.value,
        width: 41,
        height: 41,
        sourceMarker: "limited-order-book:source-v1",
        parameters: settings,
        done: false,
        tradeUnit,
        globalTokens,
        globalCash,
        latestAmount,
        latestVolume,
        latestPrice,
        totalAmount,
        totalVolume,
        bestBidPrice,
        bestAskPrice,
        recentPrice,
        recentAmount,
        recentVolume,
        recentChange,
        priceToDate,
        averageUtility: averageUtility(),
        averageHonestUtility: averageUtility("honest"),
        averageCunningUtility: averageUtility("cunning"),
        cunningHonestPercent: averageUtility("honest")
          ? (100 * (averageUtility("cunning") ?? 0)) / averageUtility("honest")!
          : null,
        totalUtility: traders().reduce((n, t) => n + t.utility, 0),
        traders: Object.freeze(
          traders().map((t) =>
            Object.freeze({
              id: t.id,
              index: t.index,
              x: t.x,
              y: t.y,
              strategy: t.strategy,
              cash: t.cash,
              stockpile: t.stockpile,
              belief: t.belief,
              utility: t.utility,
              initialUtility: t.initialUtility,
            }),
          ),
        ),
        orders: Object.freeze(
          orders.map((o) =>
            Object.freeze({
              index: o.index,
              owner: o.owner.id,
              buySide: o.buySide,
              price: o.price,
              remaining: o.remaining,
              quantity: o.quantity,
              pending: o.pending,
              removed: o.removed,
            }),
          ),
        ),
        bids: Object.freeze(bids.map((o) => o.index)),
        asks: Object.freeze(asks.map((o) => o.index)),
        history: Object.freeze(history.map((h) => Object.freeze({ ...h }))),
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: "Limit Order Book",
  description: "Traders post buy and sell limit orders; trades occur when prices cross. Wilensky, CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<Parameters, ReturnType<typeof create>>;
