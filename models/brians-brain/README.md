# Brian's Brain

Each synchronous generation changes firing cells to refractory, refractory cells to resting, and resting cells to firing when exactly two neighbors fire. Drawing changes the initial or current field; this is an excitable cellular rule, not a physiological neuron model.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Brian's Brain`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/brians-brain/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `87` | integer; ≥ 3; ≤ 501 |
| `height` | `115` | integer; ≥ 3; ≤ 501 |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `initialization` | `"random"` | `blank`, `random` |
| `initialDensity` | `0.3` | number; ≥ 0; ≤ 1 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setupBlank`, `setupRandom`, `setInitialDensity`, `setCells`, `setDrawing`, `beginBrush`, `moveBrush`, `endBrush`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `drawing`, `brush`, `counts`, `cells`.

The [UI binding](ui.ts) presents `Setup blank`, `Setup random`, `Draw firing`, `Draw refractory`, `Tick`, `Firing`, `Refractory`, `Cells`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `brians-brain` and links any shared checks.
