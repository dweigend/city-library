# Falling Sand

How do falling grains build a pile? Grains drop from spouts at the top (`spacing`, `releaseChance`). A grain falls into the empty cell below; if that is blocked, it slides diagonally down to the left or right, chosen at random when both are free. Every step reads the old field first and then moves all grains.

Things to try:

- Change `spacing` and watch how neighboring piles merge.
- Lower `releaseChance`. Does the pile shape change?

## Use

Choose **Falling Sand** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/sand/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `81` | integer; ≥ 5; ≤ 201 |
| `height` | `81` | integer; ≥ 5; ≤ 201 |
| `seed` | `1` | integer |
| `releaseChance` | `100` | number; ≥ 0; ≤ 100 |
| `spacing` | `3` | integer; ≥ 2; ≤ 15 |
| `density` | `10` | number; ≥ 0; ≤ 50 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setup`, `spout`, `moveAllSand`, `dumpSand`, `setLive`, `setSand`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `surfaceY`, `spoutY`, `cells`.

## Sources and limits

Adapted from the NetLogo *Sand* model by Wilensky (1996). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

The pile shape comes from a cellular rule, not from a granular-mechanics simulation. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `sand`.
