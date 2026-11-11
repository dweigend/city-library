# Municipal Finance

A city spends the same money on road repairs every year. Does it matter which roads get fixed first? And what does it cost to skip maintenance for a few years? This model tracks twelve assets, their condition and the city's cash. One step is one year; all amounts are synthetic currency units (CU).

## The mechanism

Each year the city collects taxes, pays for services, and lets every asset wear down a little (some faster than others). The maintenance budget then repairs assets in one of two orders:

- **Worst first:** the asset in the poorest condition gets money first.
- **Preventive:** assets still above 0.4 get money first, starting with the one closest to that line; badly worn assets wait.

The cost rule makes the difference: repairing an asset that has fallen below 0.4 costs twice as much per condition point. The backlog is what it would cost to restore every asset to perfect condition under that rule.

Repair timing changes asset wear and budget use in this deterministic teaching rule. The model has no inspection or hidden condition and does not optimize lifetime cost. The [scientific source dossier](../../docs/scientific-sources.md) records the research comparison and limits.

```ts
import { model } from "./model.ts";

const city = model.create();
city.setPolicy({ repairPriority: "preventive" });
city.advance(30);
console.log(city.read().meanCondition.toFixed(2), city.read().poorAssetCount); // 0.66 3
```

## What to try

- **Repair order:** run 30 years with *worst first*. The same 15 000 CU of maintenance ends with every asset below 0.4 and a mean condition of 0.06, because the money keeps going into double-cost repairs. Switch to *preventive*: the mean stays at 0.66 with only three poor assets.
- **Skip five years:** with preventive repair, set the budget to 0 for five years, then back to 500. The cash pile grows to 3100 CU, but the network never catches up: after 30 years the mean is 0.51 with six poor assets. Try raising the budget after the pause to see what catching up costs.
- Raise the tax rate to fund a bigger budget.

## What you see

- **Asset inventory:** each box is an asset with a green condition bar and its condition below. Red outlines mark late-repair assets; an amber bar above an asset, labeled with the amount, marks this year's repair spending. Both can appear together, so the worst-first default shows where its 500 CU went.
- **Cash and repair backlog:** money in the bank next to the obligation in the streets.
- **Mean asset condition** with the late-repair threshold, and **last year's flows**.

## Limits

No interest, no credit limit, no inspection or uncertainty, no failures or user costs. Wear is deterministic.

See the [contract](contract.md) for exact rules and expected values and the [evidence](evidence/checks.md) for executed checks and revision history. Public scripts: `tests/public-contracts/city-finance/`.
