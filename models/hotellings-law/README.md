# Hotelling's Law

Why do competing shops often open next to each other? Consumers on a line or a plane (`layout`) buy from the store with the lowest combined travel and purchase cost. In each step, stores test whether a small move or a price change would win them more customers, as allowed by `rules`.

Things to try:

- Use two stores on the line and watch where they end up.
- Compare `rules` that allow only moving, only pricing or both.

## Use

Choose **Hotelling's Law** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/hotellings-law/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `storeCount` | `3` | integer; ≥ 2; ≤ 10 |
| `layout` | `"plane"` | `plane`, `line` |
| `rules` | `"normal"` | `normal`, `moving-only`, `pricing-only` |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setRules`, `chooseStoreAt`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `stores`, `consumers`.

## Sources and limits

Adapted from the NetLogo *Hotelling's Law* model by Ottino, Stonedahl and Wilensky (2009). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

Market share follows from the stipulated consumer choice, not a measured demand curve. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `hotellings-law`.
