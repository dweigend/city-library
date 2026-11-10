# Bidding Market

Buyers meet sellers with finite demand and supply, transact against quotes and adjust price expectations. Seller cash, quote ranges and unfilled demand distinguish successful trades from a claim of market equilibrium.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Bidding Market`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/bidding-market/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `startingMoney` | `500` | number; ≥ 0; ≤ 500 |
| `supplyAmount` | `"high"` | `high`, `low` |
| `supplyDistribution` | `"even"` | `concentrated`, `even` |
| `demandAmount` | `"high"` | `low`, `high` |
| `demandDistribution` | `"even"` | `concentrated`, `even` |
| `sellerBehavior` | `"normal"` | `normal`, `desperate`, `random`, `mix of all` |
| `buyerBehavior` | `"normal"` | `normal`, `desperate`, `random`, `mix of all` |
| `sellersIgnoreFullBuyers` | `false` | boolean |
| `stars` | `true` | boolean |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setRules`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `totalSales`, `salesPerTick`, `remainingSupply`, `startingMoneyActual`, `quotes`, `sellerCash`, `averagePrice`, `percentMoneyTaken`, `percentItemsSold`, `percentDemandSatisfied`, `sellers`, `buyers`, `edges`.

The [UI binding](ui.ts) presents `Ignore full buyers`, `Sale markers`, `Tick`, `Sales`, `Average price`, `Money taken (%)`, `Items sold (%)`, `Demand met (%)`, `Buyers and sellers`, `Seller asking prices` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

The [catalog ledger](../catalog/progress.json) owns acceptance stages for `bidding-market` and links the retained checks.
