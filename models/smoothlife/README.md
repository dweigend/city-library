# SmoothLife

What happens to the Game of Life when cells are not just alive or dead? Every cell holds a value between 0 and 1. For each cell, the model averages the field over an inner disk and a surrounding ring, then applies smooth birth and survival rules (`minBirth`, `maxBirth`, `minSurvive`, `maxSurvive`). You can paint values onto the field to start your own patterns.

Things to try:

- Paint a small blob and see whether it survives, grows or moves.
- Change `outerRadius` and compare the kinds of patterns.

## Use

Choose **SmoothLife** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/smoothlife/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `128` | integer; ≥ 3; ≤ 256 |
| `height` | `128` | integer; ≥ 3; ≤ 256 |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `innerRadius` | `3` | number; ≥ 0; ≤ 50 |
| `outerRadius` | `9` | number; ≥ 0.5; ≤ 50 |
| `minBirth` | `0.278` | number; ≥ 0; ≤ 1 |
| `maxBirth` | `0.365` | number; ≥ 0; ≤ 1 |
| `minSurvive` | `0.267` | number; ≥ 0; ≤ 1 |
| `maxSurvive` | `0.445` | number; ≥ 0; ≤ 1 |
| `innerStepWidth` | `0.147` | number; ≥ 0.001; ≤ 0.5 |
| `outerStepWidth` | `0.028` | number; ≥ 0.001; ≤ 0.5 |
| `paintValue` | `1` | number; ≥ 0; ≤ 1 |
| `paintRadius` | `3` | number; ≥ 1; ≤ 10 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setCells`, `setRules`, `eraseAll`, `paint`, `setDrawing`, `draw`, `visualizeTransition`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `drawing`, `innerCount`, `outerCount`, `cells`.

## Sources and limits

Adapted from the NetLogo *SmoothLife* model by Head and Wilensky (2017). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

Grid resolution, radii and transition settings define this numerical system; it is not an exact continuous limit of Life. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `smoothlife`.
