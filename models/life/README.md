# Game of Life

How can a fixed local rule create structures that seem to move with purpose? This is Conway's Game of Life on a wrapping grid. A dead cell with exactly three living neighbors is born; a living cell with two or three living neighbors survives; every other cell dies or stays dead. All cells are counted first, then changed together. You can start with random cells (`initialDensity`) or draw your own.

Things to try:

- Draw a glider and follow it across the wrapping edges.
- Compare several `initialDensity` values. How long does activity last?

## Use

Choose **Game of Life** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/life/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `101` | integer; ≥ 3; ≤ 301 |
| `height` | `101` | integer; ≥ 3; ≤ 301 |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `initialDensity` | `35` | number; ≥ 0; ≤ 100 |
| `initialization` | `"random"` | `random`, `blank` |
| `foreground` | `"#660f40"` | text |
| `background` | `"#d2ece4"` | text |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setCells`, `setCell`, `setDrawing`, `beginBrush`, `moveBrush`, `endBrush`, `setColors`, `recolor`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `cells`, `counts`, `density`, `drawing`, `brush`.

## Sources and limits

Adapted from the NetLogo *Life* model by Wilensky (1998). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

The rule is deterministic; only the initial pattern varies. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `life`.
