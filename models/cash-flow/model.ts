/** NetLogo Cash Flow (Wilensky, 1998), CC BY-NC-SA 3.0; see NOTICE.md.
 * Explicit source banking procedures. Signed loans deliberately preserve the native negative-availability quirk.
 */
import { Agent, Grid, Random, World, run, stats } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface BankParameters {
  people: number;
  reserves: number;
  seed: number;
}
export const inputs: Inputs<BankParameters> = {
  people: { kind: "number", default: 473, min: 0, max: 500, integer: true },
  reserves: { kind: "number", default: 21, min: 0, max: 100 },
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
};
export interface Account {
  wallet: number;
  savings: number;
  loans: number;
  wealth: number;
  color: string;
  tempLoan: number;
  customer: string | null;
}
export interface AccountFixture {
  x: number;
  y: number;
  wallet: number;
  savings: number;
  loans: number;
  heading?: number;
}
export function create(options: Partial<BankParameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const space = { x: 17, y: 17, boundary: "wrap" as const };
  const world = World.create(space, { random });
  const grid = Grid.create(space);
  world.add(grid);
  type Person = ReturnType<typeof Agent.add<Account>>;
  const people = () => world.agents as readonly Person[];
  let bankDeposits = 0,
    bankLoans = 0,
    bankReserves = 0,
    bankToLoan = 0;
  let rich = 0,
    poor = 0,
    middleClass = 0;
  let histogramRange: [number, number] = [-50, 50];
  let wealthHistogram: readonly Readonly<{ x: number; y: number }>[] = [];
  const history: Readonly<{
    tick: number;
    rich: number;
    poor: number;
    middleClass: number;
    savingsTotal: number;
    walletsTotal: number;
    loansTotal: number;
    moneyTotal: number;
  }>[] = [];
  const sum = (key: "wallet" | "savings" | "loans") =>
    people().reduce((n, p) => n + p[key], 0);
  function totals() {
    const savingsTotal = sum("savings"),
      walletsTotal = sum("wallet"),
      loansTotal = sum("loans");
    return {
      savingsTotal,
      walletsTotal,
      loansTotal,
      moneyTotal: savingsTotal + walletsTotal,
    };
  }
  function person(id: string) {
    const p = people().find((p) => p.id === id);
    if (!p) throw new RangeError("Unknown person.");
    return p;
  }
  function amount(value: number) {
    if (!Number.isFinite(value)) throw new RangeError("Amount must be finite.");
    return value;
  }
  function pollClass() {
    rich = people().filter((p) => p.savings > 10).length;
    poor = people().filter((p) => p.loans > 10).length;
    middleClass = people().length - rich - poor;
  }
  function bankBalanceSheet() {
    bankDeposits = sum("savings");
    bankLoans = sum("loans");
    bankReserves = (settings.reserves / 100) * bankDeposits;
    bankToLoan = bankDeposits - (bankReserves + bankLoans);
  }
  function depositToSavings(id: string, value: number) {
    const p = person(id),
      n = amount(value);
    p.wallet -= n;
    p.savings += n;
  }
  function withdrawFromSavings(id: string, value: number) {
    const p = person(id),
      n = amount(value);
    p.wallet += n;
    p.savings -= n;
  }
  function takeOutLoan(id: string, value: number) {
    const p = person(id),
      n = amount(value);
    p.loans += n;
    p.wallet += n;
    bankToLoan -= n;
  }
  function repayLoan(id: string, value: number) {
    const p = person(id),
      n = amount(value);
    p.loans -= n;
    p.wallet -= n;
    bankToLoan += n;
  }
  function balanceBooks(id: string) {
    const p = person(id);
    if (p.wallet < 0) {
      if (p.savings >= -p.wallet) withdrawFromSavings(id, -p.wallet);
      else {
        if (p.savings > 0) withdrawFromSavings(id, p.savings);
        p.tempLoan = bankToLoan;
        takeOutLoan(id, p.tempLoan >= -p.wallet ? -p.wallet : p.tempLoan);
      }
    } else depositToSavings(id, p.wallet);
    if (p.loans > 0 && p.savings > 0) {
      if (p.savings >= p.loans) {
        withdrawFromSavings(id, p.loans);
        repayLoan(id, p.loans);
      } else {
        withdrawFromSavings(id, p.savings);
        repayLoan(id, p.wallet);
      }
    }
  }
  function updateAppearance(id: string) {
    const p = person(id);
    p.color = "#8d8d8d";
    if (p.savings > 10) p.color = "#38a339";
    if (p.loans > 10) p.color = "#d43b36";
    p.wealth = p.savings - p.loans;
  }
  function doBusiness(id: string) {
    const p = person(id);
    p.rotate(random.number({ max: 360, integer: true }));
    p.move(1);
    if (p.savings > 0 || p.wallet > 0 || bankToLoan > 0) {
      const field = grid.fieldAt(p)!;
      const candidates = grid
        .agentsAt(field, { source: people() })
        .filter((q) => q !== p);
      const customer = random.sample(candidates)[0];
      p.customer = customer?.id ?? null;
      if (customer && random.number({ max: 2, integer: true }) === 0) {
        const payment = random.number({ max: 2, integer: true }) === 0 ? 5 : 2;
        customer.wallet += payment;
        p.wallet -= payment;
      }
    }
  }
  function record() {
    history.push(
      Object.freeze({
        tick: world.tick.value,
        rich,
        poor,
        middleClass,
        ...totals(),
      }),
    );
    if (history.length > 1001) history.splice(1, 1);
    const wealth = people().map((p) => p.wealth);
    // Native hist pen runs before its average pen changes the range, so use the previous range.
    const [low, high] = histogramRange;
    const edges = Array.from(
      { length: 11 },
      (_, i) => low + ((high - low) * i) / 10,
    );
    const bins = stats.histogram(
      wealth.filter((v) => v < high),
      { edges },
    );
    wealthHistogram = Object.freeze(
      bins.counts.map((n, i) => Object.freeze({ x: edges[i]!, y: n })),
    );
    const summary = stats.describe(wealth);
    const min = Math.floor((summary.min ?? 0) + 0.5),
      max = Math.floor((summary.max ?? 0) + 0.5);
    histogramRange = [min, min < max ? max : min + 1];
  }
  function addPerson(f: AccountFixture) {
    const p = Agent.add<Account>(
      {
        wallet: f.wallet,
        savings: f.savings,
        loans: f.loans,
        wealth: 0,
        color: "#8d8d8d",
        tempLoan: 0,
        customer: null,
      },
      {
        position: { x: f.x, y: f.y },
        orientation: {
          heading: f.heading ?? random.number({ max: 360, integer: true }),
        },
      },
    );
    world.add(p);
    updateAppearance(p.id);
    return p;
  }
  function setup() {
    for (const p of [...people()]) p.delete();
    rich = poor = middleClass = 0;
    bankDeposits = bankLoans = bankReserves = bankToLoan = 0;
    history.length = 0;
    histogramRange = [-50, 50];
    wealthHistogram = [];
    for (let i = 0; i < settings.people; i++)
      addPerson({
        x: random.number({ min: -8.5, max: 8.5 }),
        y: random.number({ min: -8.5, max: 8.5 }),
        wallet: 10 * random.number({ max: 2, integer: true }),
        savings: 0,
        loans: 0,
      });
    pollClass();
    world.tick.reset();
    record();
  }
  function go() {
    for (const p of random.sample(people(), {
      count: people().length,
      algorithm: "fisher-yates-descending",
    }))
      doBusiness(p.id);
    for (const p of random.sample(people(), {
      count: people().length,
      algorithm: "fisher-yates-descending",
    })) {
      balanceBooks(p.id);
      updateAppearance(p.id);
    }
    bankBalanceSheet();
    pollClass();
  }
  setup();
  return {
    setup,
    depositToSavings,
    withdrawFromSavings,
    takeOutLoan,
    repayLoan,
    balanceBooks,
    bankBalanceSheet,
    pollClass,
    updateAppearance,
    doBusiness,
    setRules(changes: Partial<Pick<BankParameters, "reserves">>) {
      settings = parameters(inputs, { ...settings, ...changes });
    },
    setAccounts(fixtures: readonly AccountFixture[]) {
      if (
        !Array.isArray(fixtures) ||
        fixtures.some(
          (f) =>
            ![f.x, f.y, f.wallet, f.savings, f.loans, f.heading ?? 0].every(
              Number.isFinite,
            ) ||
            Math.abs(f.x) >= 8.5 ||
            Math.abs(f.y) >= 8.5,
        )
      )
        throw new RangeError("Expected finite in-world account fixtures.");
      for (const p of [...people()]) p.delete();
      for (const f of fixtures) addPerson(f);
      bankDeposits =
        bankLoans =
        bankReserves =
        bankToLoan =
        rich =
        poor =
        middleClass =
          0;
      world.tick.reset();
      history.length = 0;
      histogramRange = [-50, 50];
      wealthHistogram = [];
      record();
    },
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i++) {
        run(world, go);
        record();
      }
    },
    read() {
      const wealth = people().map((p) => p.wealth);
      return Object.freeze({
        sourceMarker: "cash-flow:source-v1",
        tick: world.tick.value,
        phase: "Business → balance books → bank sheet",
        width: 17,
        height: 17,
        parameters: settings,
        bankDeposits,
        bankLoans,
        bankReserves,
        bankToLoan,
        rich,
        poor,
        middleClass,
        ...totals(),
        meanWealth: stats.describe(wealth).mean,
        people: Object.freeze(
          people().map((p) =>
            Object.freeze({
              id: p.id,
              x: p.x,
              y: p.y,
              heading: p.heading,
              wallet: p.wallet,
              savings: p.savings,
              loans: p.loans,
              wealth: p.wealth,
              color: p.color,
              tempLoan: p.tempLoan,
              customer: p.customer,
            }),
          ),
        ),
        wealthHistogram,
        histogramRange: Object.freeze([...histogramRange]),
        history: Object.freeze([...history]),
        randomState: random.state,
        done: false,
      });
    },
  };
}
export const model = {
  title: "Cash Flow",
  description: "Source banking phases · Uri Wilensky · CC BY-NC-SA 3.0",
  inputs,
  create,
} satisfies Definition<BankParameters, ReturnType<typeof create>>;
