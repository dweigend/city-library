# Limited Order Book

Limit orders enter a book and trade only when the source's strict crossing condition holds. Quotes, completed trades and unfilled orders are different observations; the mechanism does not reproduce a particular exchange's matching engine.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Limited Order Book`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/limited-order-book/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `tradePrecision` | `0` | integer; ≥ 0; ≤ 3 |
| `honestTraders` | `50` | integer; ≥ 0; ≤ 100 |
| `cunningTraders` | `50` | integer; ≥ 0; ≤ 100 |
| `initialCash` | `1000` | integer; ≥ 0; ≤ 2000 |
| `initialTokens` | `50` | integer; ≥ 0; ≤ 200 |
| `initialBelief` | `25` | integer; ≥ 0; ≤ 100 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `submitOrder`, `matchmakeAll`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `tradeUnit`, `globalTokens`, `globalCash`, `latestAmount`, `latestVolume`, `latestPrice`, `totalAmount`, `totalVolume`, `bestBidPrice`, `bestAskPrice`, `recentPrice`, `recentAmount`, `recentVolume`, `recentChange`, `priceToDate`, `averageUtility`, `averageHonestUtility`, `averageCunningUtility`, `cunningHonestPercent`, `totalUtility`, `traders`, `orders`, `bids`, `asks`.

The [UI binding](ui.ts) presents `Tick`, `Latest price`, `Latest volume ($)`, `Price to date`, `Total cash`, `Circulating tokens`, `Total utilities`, `Average utilities`, `Average honest utility`, `Average cunning utility` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `limited-order-book` and links any shared checks.
