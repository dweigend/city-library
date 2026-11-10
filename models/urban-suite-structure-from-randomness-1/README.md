# Structure from Random Averaging

Can spatial structure grow out of pure noise? Every cell starts with a random activity of 0 or 1. In each step, a cell's new value is the average of itself and its four direct neighbors. With `keepAddingRandomness`, fresh random noise is added after each averaging step.

Shades of gray show each cell's activity relative to the others.

Things to try:

- Run without noise and watch whether the field fades to an even gray.
- Switch on `keepAddingRandomness`. Do lasting patches appear?

## Use

Choose **Structure from Random Averaging** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/urban-suite-structure-from-randomness-1/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `keepAddingRandomness` | `false` | boolean |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setRules`, `setActivities`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `cells`, `activityDistribution`.

## Sources and limits

Adapted from the NetLogo *Urban Suite - Structure from Randomness 1* model by Wilensky (2007). Attribution and license are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

The activity field is abstract; it does not represent measured land use. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `urban-suite-structure-from-randomness-1`.
