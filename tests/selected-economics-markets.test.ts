import { describe, expect, test } from "bun:test";
import { Random } from "city-library";
import {
  create as fruit,
  genomeTraits,
} from "../models/fruit-wars/model.ts";
import {
  create as book,
  floorToUnit,
} from "../models/limited-order-book/model.ts";
import {
  create as bidding,
  changePrice,
} from "../models/bidding-market/model.ts";
import { create as stores } from "../models/hotellings-law/model.ts";
import { create as traffic } from "../models/braess-paradox/model.ts";

describe("selected market and foraging source mechanisms", () => {
  test("Fruit traits derive from all four genome partitions and extinction stops before another tick", () => {
    const genome = Array<number>(240).fill(0);
    genome.fill(1, 0, 20);
    genome.fill(1, 60, 95);
    genome.fill(1, 120, 127);
    genome.fill(1, 180, 191);
    expect(genomeTraits(genome)).toEqual({
      intelligence: 20,
      speed: 15,
      strength: 25,
      reactiveAggression: 7,
      proactiveAggression: 11,
    });
    expect(() => genomeTraits([0, 1])).toThrow();
    const f = fruit({
      initialForagers: 1,
      initialFruitBushes: 0,
      bushGrowthChance: 0,
      maxAge: 1,
    });
    f.advance(50);
    expect(f.read().tick).toBe(2);
    expect(f.read().ageDeathCount).toBe(1);
    expect(f.read().deathCount).toBe(0); // declared native global is never incremented
    expect(f.read().strength).toBeNull(); // explicit empty-plot adaptation
  });

  test("Fruit world wraps and observations do not draw or expose mutable genomes", () => {
    const f = fruit({ seed: 7 });
    f.advance(100);
    const first = f.read();
    expect(f.read().randomState).toEqual(first.randomState);
    expect(
      first.foragers.every(
        (a) => a.x >= -32.5 && a.x < 32.5 && a.y >= -32.5 && a.y < 32.5,
      ),
    ).toBe(true);
    expect(Object.isFrozen(first.foragers[0]!.genome)).toBe(true);
    expect(first.bushes.every((b) => b.x % 3 === 0 && b.y % 3 === 0)).toBe(
      true,
    );
  });

  test("Orderbook equal quotes never cross; strict quotes trade at the lower ask and conserve assets", () => {
    const equal = book({ honestTraders: 2, cunningTraders: 0 });
    equal.submitOrder(0, true, 10, 1);
    equal.submitOrder(1, false, 10, 1);
    equal.matchmakeAll();
    expect(equal.read().latestAmount).toBe(0);
    expect(equal.read().bids.length).toBe(1);
    expect(equal.read().asks.length).toBe(1);
    const crossed = book({ honestTraders: 2, cunningTraders: 0 });
    const before = crossed.read();
    crossed.submitOrder(0, true, 12, 1);
    crossed.submitOrder(1, false, 10, 1);
    crossed.matchmakeAll();
    const after = crossed.read();
    expect(after.latestAmount).toBe(1);
    expect(after.latestPrice).toBe(10);
    expect(after.traders[0]!.cash).toBe(before.traders[0]!.cash - 10);
    expect(after.traders[1]!.cash).toBe(before.traders[1]!.cash + 10);
    expect(after.traders[0]!.stockpile).toBe(before.traders[0]!.stockpile + 1);
    expect(after.traders[1]!.stockpile).toBe(before.traders[1]!.stockpile - 1);
    expect(after.tick).toBe(0); // source matching procedure itself does not tick
    expect(floorToUnit(0.2999, 0.01)).toBe(0.29);
  });

  test("Orderbook utility is deliberately pre-match and source no-trade failure does not tick", () => {
    const b = book();
    const before = b.read();
    b.advance();
    expect(b.read().traders.map((t) => t.utility)).toEqual(
      before.traders.map((t) => t.utility),
    );
    expect(
      b
        .read()
        .traders.some((t) => t.cash + t.belief * t.stockpile !== t.utility),
    ).toBe(true);
    const isolated = book({ honestTraders: 1, cunningTraders: 0 });
    expect(() => isolated.advance()).toThrow("division by zero");
    expect(isolated.read().tick).toBe(0);
    expect(() => isolated.submitOrder(0, true, 0, 1)).toThrow();
  });

  test("Bidding odd starting-money uses the native ceil integer bound", () => {
    const market = bidding({ startingMoney: 25, seed: 1 });
    const random = Random.create({ seed: 1 });
    // Source setup: 50 even-distribution sellers consume supply and ask draws.
    for (let i = 0; i < 100; i++) random.number();
    random.number(); // First buyer demand precedes its money draw.
    const expected = 12.5 + random.number({ max: 13, integer: true });
    expect(market.read().buyers[0]!.money).toBe(expected);
    expect(
      market
        .read()
        .buyers.every((buyer) => buyer.money >= 12.5 && buyer.money <= 24.5),
    ).toBe(true);
  });

  test("Bidding first pairing changes quotes without selling; cent rounding cannot freeze a quote", () => {
    const m = bidding();
    const first = m.read();
    m.advance();
    const second = m.read();
    expect(second.totalSales).toBe(0);
    expect(second.remainingSupply).toBe(
      first.sellers.reduce((n, s) => n + s.itemsForSale, 0),
    );
    expect(second.sellers[0]!.askingPrice).toBe(
      changePrice(first.sellers[0]!.askingPrice, -2),
    );
    expect(second.buyers[0]!.willingToPay).toBe(
      changePrice(first.buyers[0]!.willingToPay, 2.5),
    );
    expect(changePrice(0.01, 2.5)).toBe(0.02);
    expect(changePrice(0.01, -2)).toBe(0.01);
    const emptyWallets = bidding({ startingMoney: 0 });
    emptyWallets.advance(20);
    expect(emptyWallets.read().tick).toBe(0);
    expect(emptyWallets.read().done).toBe(true);
  });

  test("Bidding conserves goods and demand under random/concentrated mechanisms", () => {
    const m = bidding({
      supplyDistribution: "concentrated",
      demandDistribution: "concentrated",
      sellerBehavior: "mix of all",
      buyerBehavior: "mix of all",
      seed: 42,
    });
    const initial = m.read();
    m.advance(300);
    const after = m.read();
    expect(after.totalSales).toBe(
      after.sellers.reduce((n, s) => n + s.sold, 0),
    );
    expect(after.totalSales).toBe(
      after.buyers.reduce((n, b) => n + b.bought, 0),
    );
    expect(after.sellers.reduce((n, s) => n + s.itemsForSale + s.sold, 0)).toBe(
      initial.sellers.reduce((n, s) => n + s.itemsForSale, 0),
    );
    expect(after.buyers.reduce((n, b) => n + b.wantToBuy + b.bought, 0)).toBe(
      initial.buyers.reduce((n, b) => n + b.wantToBuy, 0),
    );
    expect(
      after.buyers.every((b) => b.wantToBuy === 0 || b.willingToPay <= b.money),
    ).toBe(true);
  });

  test("Hotelling consumers partition shares and pricing-only leaves all coordinates fixed", () => {
    const h = stores({ rules: "pricing-only" });
    const initial = h.read();
    h.advance(3);
    const after = h.read();
    expect(after.consumers.length).toBe(1681);
    expect(after.stores.reduce((n, s) => n + s.areaCount, 0)).toBe(1681);
    expect(after.stores.map((s) => [s.x, s.y])).toEqual(
      initial.stores.map((s) => [s.x, s.y]),
    );
    const randomBefore = after.randomState;
    h.read();
    expect(h.read().randomState).toEqual(randomBefore);
    h.setRules({ rules: "moving-only" });
    const prices = h.read().stores.map((s) => s.price);
    h.advance();
    expect(h.read().stores.map((s) => s.price)).toEqual(prices);
  });

  test("Braess strict spawn timing, road-type semantics and all three policies execute", () => {
    for (const mode of [
      "Probabilistic Greedy",
      "Empirical Analytical",
      "Best Known /w Random Deviation",
    ] as const) {
      const b = traffic({ mode });
      b.advance(26);
      expect(b.read().carsSpawned).toBe(0);
      b.advance();
      expect(b.read().carsSpawned).toBe(1);
      expect(b.read().commuters[0]!.ticksHere).toBe(2);
      expect(
        b.read().cells.find((p) => p.x === 0 && p.y === 22)?.roadType,
      ).toBe(1);
      expect(b.read().cells.find((p) => p.x === -22 && p.y === 0)?.delay).toBe(
        10,
      );
      b.advance(1500);
      const after = b.read();
      expect(after.completed).toBeGreaterThan(0);
      expect(after.carsSpawned).toBe(after.completed + after.commuters.length);
      expect(
        after.commuters.every(
          (a) => Number.isInteger(a.x) && Number.isInteger(a.y),
        ),
      ).toBe(true);
    }
  });

  test("Braess closing middle road waits for its existing commuters, then prevents further middle routes", () => {
    const b = traffic({ mode: "Empirical Analytical" });
    b.advance(100);
    expect(b.read().commuters.some((a) => a.route === 2)).toBe(true);
    b.setRules({ middleOn: false });
    b.advance();
    expect(b.read().middlePrev).toBe(true);
    b.advance(1800);
    expect(b.read().middlePrev).toBe(false);
    expect(b.read().commuters.some((a) => a.route === 2)).toBe(false);
  });
});
