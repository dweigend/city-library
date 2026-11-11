# Cash Flow

How do everyday payments and bank rules shape who has money? People move around and make random payments to each other. After each round of payments they settle their accounts with one bank: surplus cash goes into savings, shortfalls are covered by withdrawing savings or taking out loans, as far as the bank's reserves allow. The model sorts people into rich, middle class and poor and tracks the money totals.

Things to try:

- Raise `reserves`. What happens to the total loans and the money supply?
- Change `personCount` and compare the share of poor people.

## Use

Choose **Cash Flow** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/cash-flow/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `personCount` | `473` | integer; ≥ 0; ≤ 500 |
| `reserves` | `21` | number; ≥ 0; ≤ 100 |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setup`, `depositToSavings`, `withdrawFromSavings`, `takeOutLoan`, `repayLoan`, `balanceBooks`, `bankBalanceSheet`, `pollClass`, `updateAppearance`, `doBusiness`, `setRules`, `setAccounts`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `phase`, `bankDeposits`, `bankLoans`, `bankReserves`, `bankToLoan`, `richPersonCount`, `poorPersonCount`, `middleClassPersonCount`, `meanWealth`, `people`, `wealthHistogram`, `histogramRange`.

## Sources and limits

Adapted from the NetLogo *Cash Flow* model by Wilensky (1998). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

The banking phases and reserve rule are explicit assumptions; the plots do not describe a real financial system. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

The [catalog ledger](../catalog/progress.json) records the acceptance stages for `cash-flow`.
