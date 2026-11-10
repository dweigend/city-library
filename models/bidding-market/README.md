# Bidding Market

Can prices settle without an auctioneer? Buyers walk from seller to seller. A buyer pays when a seller's asking price is within what the buyer is willing to pay, and both adjust their expectations after each success or failure. Supply, demand and how they are spread, as well as the behavior of buyers and sellers, are set with the choice inputs.

Things to try:

- Set `supplyAmount` low and `demandAmount` high. How do asking prices move?
- Compare different `sellerBehavior` values with the same seed.

## Use

Choose **Bidding Market** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/bidding-market/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `startingMoney` | `500` | number; ≥ 0; ≤ 500 |
| `supplyAmount` | `"high"` | `high`, `low` |
| `supplyDistribution` | `"even"` | `concentrated`, `even` |
| `demandAmount` | `"high"` | `low`, `high` |
| `demandDistribution` | `"even"` | `concentrated`, `even` |
| `sellerBehavior` | `"normal"` | `normal`, `desperate`, `random`, `mixed` |
| `buyerBehavior` | `"normal"` | `normal`, `desperate`, `random`, `mixed` |
| `sellersIgnoreFullBuyers` | `false` | boolean |
| `stars` | `true` | boolean |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setRules`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `saleCount`, `saleCountPerTick`, `remainingSupplyItemCount`, `startingMoneyActual`, `quotes`, `sellerCash`, `averagePrice`, `percentMoneyTaken`, `percentItemsSold`, `percentDemandSatisfied`, `sellers`, `buyers`, `edges`.

## Sources and limits

Adapted from the NetLogo *Bidding Market* model by Baker and Wilensky (2017). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

Completed trades, quotes and unfilled demand are separate observations; a stable price in a run is not proof of market equilibrium. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

The [catalog ledger](../catalog/progress.json) records the acceptance stages for `bidding-market`.
