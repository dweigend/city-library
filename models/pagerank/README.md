# PageRank

How can links decide which pages matter? Pages and directed links form a small web (`networkChoice`). PageRank can be computed in two ways (`calculationMethod`): rank flows along links in repeated rounds (diffusion), or random surfers follow links and occasionally jump to a random page. `dampingFactor` is the chance to follow a link instead of jumping.

Things to try:

- Compare both methods on the same network. How close are the results after many steps?
- Lower `dampingFactor`. Do the ranks become more equal?

## Use

Choose **PageRank** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/pagerank/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `networkChoice` | `"example-1"` | `example-1`, `example-2`, `preferential-attachment` |
| `calculationMethod` | `"random-surfer"` | `diffusion`, `random-surfer` |
| `dampingFactor` | `0.85` | number; ≥ 0; ≤ 1 |
| `surferCount` | `5` | integer; ≥ 1; ≤ 100 |
| `watchSurfers` | `true` | boolean |
| `showPageRanks` | `true` | boolean |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `diffuse`, `surf`, `globals`, `setParameters`, `setScenario`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `pages`, `edges`, `surfers`.

## Sources and limits

Adapted from the NetLogo *PageRank* model by Stonedahl and Wilensky (2009). Attribution and license are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

A short surfer history need not match the rank vector, and the treatment of pages without outgoing links shapes the result. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `pagerank`.
