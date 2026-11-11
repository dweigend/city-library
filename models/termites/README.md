# Termites

How can wandering individuals sort scattered material into piles without a plan? Termites walk randomly over a field of wood chips. A termite that bumps into a chip picks it up, wanders on and drops it next to another chip it finds. Because every drop changes what later termites encounter, chips can gradually collect into fewer, larger piles.

Piles are never protected: termites can take chips from them again, so piles can shrink, merge or move.

Things to try:

- Change `termiteCount` and compare how quickly the number of separate piles drops.
- Lower `density`. Do fewer chips still end up in a few piles?

## Use

Choose **Termites** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/termites/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

One `advance(1)` performs one bounded activation sweep and increments `work`; searches resume from each termite’s `phase`. The observation deliberately reports `tick: null`: use `work` and individual `cycles` to distinguish scheduled work from completed pickup/deposit cycles.

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `termiteCount` | `400` | integer; ≥ 1; ≤ 2000 |
| `density` | `20` | integer; ≥ 0; ≤ 100 |

## Actions and observations

Call `advance()` for bounded work sweeps and `read()` for a detached snapshot; this model does not report a source tick.

Model-specific `read()` fields include `work`, `chipCount`, `carryingCount`, `termites`, `cells`.

## Sources and limits

Adapted from the NetLogo *Termites* model by Wilensky (1997). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

The rules abstract picking up and dropping; they are not an account of real termite building. Pile formation shows decentralized coordination under these rules, with no guarantee of convergence within a given time. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `termites`.
