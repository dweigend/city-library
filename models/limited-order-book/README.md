# Limit Order Book

How do simple trading strategies and an order book produce a market price? Traders hold cash and tokens and believe the token is worth some value. They place buy and sell limit orders in a shared book; an order trades only when it crosses the best opposite quote. Honest traders always quote around their belief; cunning traders improve their quotes toward the best price already in the book.

Things to try:

- Remove all cunning traders. How does the trade price behave?
- Change `tradePrecision` and compare the number of completed trades.

## Use

Choose **Limit Order Book** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/limited-order-book/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `tradePrecision` | `0` | integer; ≥ 0; ≤ 3 |
| `honestTraderCount` | `50` | integer; ≥ 0; ≤ 100 |
| `cunningTraderCount` | `50` | integer; ≥ 0; ≤ 100 |
| `initialCash` | `1000` | integer; ≥ 0; ≤ 2000 |
| `initialTokens` | `50` | integer; ≥ 0; ≤ 200 |
| `initialBelief` | `25` | integer; ≥ 0; ≤ 100 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `submitOrder`, `matchmakeAll`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `tradeUnit`, `globalTokens`, `globalCash`, `latestAmount`, `latestVolume`, `latestPrice`, `totalAmount`, `totalVolume`, `bestBidPrice`, `bestAskPrice`, `recentPrice`, `recentAmount`, `recentVolume`, `recentChange`, `priceToDate`, `averageUtility`, `averageHonestUtility`, `averageCunningUtility`, `cunningHonestPercent`, `totalUtility`, `traders`, `orders`, `bids`, `asks`.

## Sources and limits

Adapted from the NetLogo *Limited Order Book* model by Chen and Wilensky (2021). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

Quotes, completed trades and unfilled orders are different observations. The matching rule does not reproduce a real exchange. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `limited-order-book`.
