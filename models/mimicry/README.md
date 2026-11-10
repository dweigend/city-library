# Mimicry

Can a harmless butterfly benefit from looking like a bad-tasting one? Birds hunt butterflies and remember the colors of unpleasant prey for `memoryDuration` steps, up to `memorySize` colors. Butterflies reproduce, and their offspring sometimes change color with `mutationRate`.

Birds avoid colors they remember, so a color that resembles defended prey can be eaten less often.

Things to try:

- Set `memorySize` to 0. Does color still matter?
- Raise `mutationRate` and follow how the color mix of the harmless butterflies changes.

## Use

Choose **Mimicry** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/mimicry/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `memoryDuration` | `30` | integer; ≥ 0; ≤ 40 |
| `mutationRate` | `5` | number; ≥ 0; ≤ 100 |
| `memorySize` | `3` | integer; ≥ 0; ≤ 10 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setup`, `birdsMove`, `butterfliesMove`, `butterfliesGetEaten`, `birdsForget`, `butterfliesReproduce`, `setParameters`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `monarchColor`, `viceroyColor`, `birds`, `monarchs`, `viceroys`.

## Sources and limits

Adapted from the NetLogo *Mimicry* model by Wilensky (1997). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

Bird memory and the color space are simplified. The model illustrates selection through predator learning, not the history of a particular pair of species. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `mimicry`.
