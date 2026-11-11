# Bank Reserves

How does a reserve requirement limit lending? People make random payments, then settle with one bank: they deposit surplus cash, withdraw savings or borrow when short. The bank may lend only what exceeds the required `reserves` share of deposits. The model tracks deposits, loans, reserves and the resulting money supply, along with wealth classes.

Things to try:

- Set `reserves` to 100 and then to a low value. Compare the money supply.
- Follow `bankToLoan` over time. When does the bank run out of lendable money?

## Use

Choose **Bank Reserves** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/bank-reserves/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `personCount` | `57` | integer; ≥ 0; ≤ 200 |
| `reserves` | `52` | number; ≥ 0; ≤ 100 |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setup`, `depositToSavings`, `withdrawFromSavings`, `takeOutLoan`, `repayLoan`, `balanceBooks`, `bankBalanceSheet`, `pollClass`, `updateAppearance`, `doBusiness`, `setRules`, `setAccounts`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `phase`, `bankDeposits`, `bankLoans`, `bankReserves`, `bankToLoan`, `richPersonCount`, `poorPersonCount`, `middleClassPersonCount`, `meanWealth`, `people`, `wealthHistogram`, `histogramRange`.

## Sources and limits

Adapted from the NetLogo *Bank Reserves* model by Wilensky (1998). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

Reserve requirements here drive a stipulated lending mechanism; this is not an empirical account of how modern banks create credit. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

The [catalog ledger](../catalog/progress.json) records the acceptance stages for `bank-reserves`.
