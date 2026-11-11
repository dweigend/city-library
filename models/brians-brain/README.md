# Brian's Brain

What does a resting phase do to a cellular automaton? Cells are firing, refractory or resting. Each generation, firing cells become refractory, refractory cells rest, and resting cells fire when exactly two of their eight neighbors are firing. Start from random cells or draw your own.

Things to try:

- Draw two adjacent firing cells and follow them.
- Change `initialDensity` and compare how long activity lasts.

## Use

Choose **Brian's Brain** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/brians-brain/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `87` | integer; ≥ 3; ≤ 501 |
| `height` | `115` | integer; ≥ 3; ≤ 501 |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `initialization` | `"random"` | `blank`, `random` |
| `initialDensity` | `0.3` | number; ≥ 0; ≤ 1 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setupBlank`, `setupRandom`, `setInitialDensity`, `setCells`, `setDrawing`, `beginBrush`, `moveBrush`, `endBrush`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `drawing`, `brush`, `counts`, `cells`.

## Sources and limits

Adapted from the NetLogo *Brian's Brain* model by Wilensky (2002). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

This is an excitable cellular rule, not a model of real neurons. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `brians-brain`.
