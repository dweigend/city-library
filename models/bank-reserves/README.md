# Bank Reserves

Payments, personal balance-book settlement and the bank balance sheet occupy separate phases. Reserve requirements constrain the stipulated lending mechanism; these rules are not an empirical account of modern bank credit creation.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Bank Reserves`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/bank-reserves/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `people` | `57` | integer; ≥ 0; ≤ 200 |
| `reserves` | `52` | number; ≥ 0; ≤ 100 |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setup`, `depositToSavings`, `withdrawFromSavings`, `takeOutLoan`, `repayLoan`, `balanceBooks`, `bankBalanceSheet`, `pollClass`, `updateAppearance`, `doBusiness`, `setRules`, `setAccounts`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `phase`, `bankDeposits`, `bankLoans`, `bankReserves`, `bankToLoan`, `rich`, `poor`, `middleClass`, `meanWealth`, `people`, `wealthHistogram`, `histogramRange`.

The [UI binding](ui.ts) presents `Mean wealth`, `Tick`, `Next phase`, `Savings total`, `Wallets total`, `Loans total`, `Money total`, `Bank reserves`, `Bank to loan`, `Rich` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

The [catalog ledger](../catalog/progress.json) owns acceptance stages for `bank-reserves` and links the retained checks.
