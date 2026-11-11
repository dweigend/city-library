# Rumor Mill

How does closeness shape the spread of news? Each cell either knows the rumor or not. In every step, each informed cell tells one random neighbor, among four or, with `eightMode`, eight. Cells informed in this step start telling only in the next one. The rumor starts in one cell or in a random clique (`setup`, `initClique`).

Things to try:

- Compare four and eight neighbors. How many steps until everyone knows?
- Watch how often cells hear the rumor again after they already know it.

## Use

Choose **Rumor Mill** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/rumor-mill/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `setup` | `"one"` | `one`, `random` |
| `initClique` | `0.1` | number; ≥ 0; ≤ 10 |
| `eightMode` | `false` | boolean |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `seedOne`, `seedRandom`, `hearAt`, `setColorMode`, `setParameters`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `colorMode`, `cells`.

## Sources and limits

Adapted from the NetLogo *Rumor Mill* model (© 1997 Uri Wilensky). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

A grid neighborhood is not a measured social network. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `rumor-mill`.
