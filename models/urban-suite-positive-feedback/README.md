# Urban Suite - Positive Feedback

Do increasing returns turn small differences into large ones? Every cell has an activity value. In each step the activity is raised to the power `alpha`, optionally after averaging over the neighborhood, and then divided by the current maximum, so the most active cell is always 1.

Things to try:

- Compare `alpha` below 1, at 1 and above 1.
- Switch `mooreNeighborhood` on and off with the same seed.

## Use

Choose **Urban Suite - Positive Feedback** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/urban-suite-positive-feedback/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `alpha` | `1.1` | number; ≥ 0; ≤ 2 |
| `mooreNeighborhood` | `false` | boolean |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setRules`, `setActivities`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `cells`, `activityDistribution`.

## Sources and limits

Adapted from the NetLogo *Urban Suite - Positive Feedback* model by Wilensky (2007). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

Normalization keeps only relative comparisons; nothing like a population or a budget is conserved. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

The [catalog ledger](../catalog/progress.json) records the acceptance stages for `urban-suite-positive-feedback`.
