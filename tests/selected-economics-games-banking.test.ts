import { describe, expect, test } from "bun:test";
import { create as cashFlow } from "../experiments/cash-flow/model.ts";
import { create as reserves } from "../experiments/bank-reserves/model.ts";
import {
  create as basic,
  sentence,
} from "../experiments/prisoners-dilemma-basic/model.ts";
import {
  create as iterated,
  payoff,
  strategyAction,
} from "../experiments/prisoners-dilemma-two-person-iterated/model.ts";
import {
  create as bar,
  bestStrategy,
  predictAttendance,
} from "../experiments/el-farol/model.ts";
import { Random } from "city-library";

describe("selected economics source-specific banks and games", () => {
  test("Cash Flow preserves signed negative-availability loans, rather than silently clamping", () => {
    const model = cashFlow({ people: 0, reserves: 0 });
    model.setAccounts([
      { x: 0, y: 0, wallet: -5, savings: 0, loans: 20 },
      { x: 1, y: 1, wallet: 0, savings: 10, loans: 0 },
    ]);
    model.bankBalanceSheet();
    expect(model.read().bankToLoan).toBe(-10);
    const id = model.read().people[0]!.id;
    const identity = model.read().moneyTotal - model.read().loansTotal;
    model.balanceBooks(id);
    const after = model.read();
    expect(after.people[0]!.wallet).toBe(-15);
    expect(after.people[0]!.loans).toBe(10);
    expect(after.bankToLoan).toBe(0);
    expect(after.moneyTotal - after.loansTotal).toBe(identity);
  });
  test("partial repayment withdraws then repays the wallet, and report reads do not mutate state", () => {
    const model = cashFlow({ people: 0 });
    model.setAccounts([{ x: 0, y: 0, wallet: 0, savings: 3, loans: 5 }]);
    model.balanceBooks(model.read().people[0]!.id);
    expect(model.read().people[0]).toMatchObject({
      wallet: 0,
      savings: 0,
      loans: 2,
    });
    const a = model.read();
    expect(model.read()).toEqual(a);
    expect(Object.isFrozen(a.people[0])).toBe(true);
  });
  test("Bank Reserves phases and sticky colors retain source distinctions", () => {
    const model = reserves({ people: 0 });
    model.setAccounts([{ x: 0, y: 0, wallet: 0, savings: 11, loans: 0 }]);
    const id = model.read().people[0]!.id;
    model.updateAppearance(id);
    expect(model.read().people[0]!.color).toBe("#38a339");
    model.withdrawFromSavings(id, 11);
    model.updateAppearance(id);
    expect(model.read().people[0]!.color).toBe("#38a339");
    expect(model.read().people[0]!.wealth).toBe(0);
    model.advance(2);
    expect(model.read().bankDeposits).toBe(0);
    model.advance();
    expect(model.read().bankDeposits).toBe(11);
  });
  test("Cash Flow starts with 0/10 wallets, Bank Reserves with 1..10 and empty initial class counters", () => {
    const cash = cashFlow(),
      bank = reserves();
    expect(cash.read().people.length).toBe(473);
    expect(
      cash.read().people.every((p) => p.wallet === 0 || p.wallet === 10),
    ).toBe(true);
    expect(cash.read().middleClass).toBe(473);
    expect(bank.read().people.length).toBe(57);
    expect(
      bank.read().people.every((p) => p.wallet >= 1 && p.wallet <= 10),
    ).toBe(true);
    expect(bank.read().middleClass).toBe(0);
    bank.advance();
    expect(bank.read().middleClass).toBe(57);
    expect(bank.read().wealthHistogram.every((p) => p.y === 0)).toBe(true);
  });
  test("one-shot outcome action always reinitializes choices and uses no native clock", () => {
    expect(sentence(true, true).years).toBe(1);
    expect(sentence(false, true).years).toBe(0);
    expect(sentence(true, false).years).toBe(5);
    expect(sentence(false, false).years).toBe(3);
    const model = basic({ partnerSilenceKnown: true, partnerSilent: true });
    model.answer();
    expect(model.read().years).toBe(1);
    model.setRules({ partnerSilent: false });
    model.answer();
    expect(model.read().years).toBe(5);
    expect(model.read().nativeTick).toBeNull();
    expect(model.read().rounds).toBe(2);
  });
  test("iterated payoffs and strategy memories preserve delayed retaliation", () => {
    expect([
      payoff(false, false),
      payoff(true, false),
      payoff(false, true),
      payoff(true, true),
    ]).toEqual([3, 5, 0, 1]);
    const random = Random.add();
    expect(
      strategyAction(
        "tit-for-two-tats",
        { defectNow: false, partnerDefected: true, partnerDefectedPast: false },
        random,
      ),
    ).toBe(false);
    expect(
      strategyAction(
        "unforgiving",
        { defectNow: true, partnerDefected: false, partnerDefectedPast: false },
        random,
      ),
    ).toBe(true);
    const model = iterated({
      humanStrategy: "defect",
      computerStrategy: "tit-for-two-tats",
    });
    model.advance(2);
    expect(model.read().human.score).toBe(13);
    expect(model.read().computer.score).toBe(3);
    model.advance();
    expect(model.read().human.score).toBe(14);
    expect(model.read().computer.score).toBe(4);
    expect(model.read().computer.averageScore).toBe(1);
  });
  test("El Farol uses unclamped linear predictions and bounded last-tie-wins retrospective selection", () => {
    expect(predictAttendance([-1, -1], [100])).toBe(-200);
    expect(
      bestStrategy(
        [
          [0.5, 0],
          [0, 1],
        ],
        [50, 50],
        1,
      ).selected,
    ).toBe(1);
    const high = bestStrategy(
      [
        [100, 0],
        [200, 0],
      ],
      [100, 100],
      1,
      1,
    );
    expect(high.selected).toBe(1);
    expect(high.prediction).toBe(20000);
    expect(() => predictAttendance([1], [1])).toThrow(RangeError);
  });
  test("El Farol canonical occupancy, attendance history, immutable strategies and deterministic independent instances", () => {
    const a = bar({ seed: 12 }),
      b = bar({ seed: 12 });
    const strategy = a.read().people[0]!.strategies;
    expect(a.read().people.every((p) => !p.attend)).toBe(true);
    expect(a.read().attendance).toBe(a.read().history[0]!);
    a.advance(20);
    expect(b.read().tick).toBe(0);
    b.advance(20);
    const current = a.read();
    expect(current.people[0]!.strategies).toEqual(strategy);
    expect(current.attendance).toBe(
      current.people.filter((p) => p.attend).length,
    );
    expect(current.history[0]).toBe(current.attendance);
    expect(new Set(current.people.map((p) => `${p.x},${p.y}`)).size).toBe(100);
    expect(current.history).toEqual(b.read().history);
    expect(a.read().randomState).toEqual(current.randomState);
  });
});
