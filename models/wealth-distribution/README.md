# Wealth Distribution

Can unequal wealth arise without inheritance? People move over a landscape where grain grows, best on a few fertile spots. Each person looks up to their individual vision, moves toward the richest visible cell, harvests it and eats grain according to an individual metabolism. A person who starves or reaches their life span is replaced by a new one with a random starting endowment.

Things to try:

- Lower `maxVision` and compare the spread of wealth.
- Raise `growthAmount`. Does more grain reduce inequality?

## Use

Choose **Wealth Distribution** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/wealth-distribution/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `personCount` | `250` | integer; ≥ 2; ≤ 1000 |
| `maxVision` | `5` | integer; ≥ 1; ≤ 15 |
| `metabolismMax` | `15` | integer; ≥ 1; ≤ 25 |
| `bestLand` | `10` | integer; ≥ 5; ≤ 25 |
| `minLife` | `1` | integer; ≥ 1; ≤ 100 |
| `maxLife` | `83` | integer; ≥ 1; ≤ 100 |
| `growthInterval` | `1` | integer; ≥ 1; ≤ 10 |
| `growthAmount` | `4` | integer; ≥ 1; ≤ 10 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setRules`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `personCount`, `totalWealth`, `classes`, `gini`, `lorenz`, `agents`, `cells`.

## Sources and limits

Adapted from the NetLogo *Wealth Distribution* model by Wilensky (1998). Attribution and adaptation notes are in the comments of [model.ts](model.ts) and the retained source notices; the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

Grain holdings stand in for wealth. Wages, inherited capital and finance are not part of the model. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `wealth-distribution`.
