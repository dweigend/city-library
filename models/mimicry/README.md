# Mimicry

Predators remember unpleasant prey colors while butterfly reproduction and color variation change the prey population. A simplified memory and color space illustrate learning-mediated selection, not a verified history of a particular mimic pair.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Mimicry`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/mimicry/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `memoryDuration` | `30` | integer; ≥ 0; ≤ 40 |
| `mutationRate` | `5` | number; ≥ 0; ≤ 100 |
| `memorySize` | `3` | integer; ≥ 0; ≤ 10 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setup`, `birdsMove`, `butterfliesMove`, `butterfliesGetEaten`, `birdsForget`, `butterfliesReproduce`, `setParameters`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `monarchColor`, `viceroyColor`, `birds`, `monarchs`, `viceroys`.

The [UI binding](ui.ts) presents `Tick`, `Monarchs`, `Viceroys`, `${group === `, `Birds and butterflies`, `Butterfly populations`, `Mean butterfly colors`, `Bird memory`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `mimicry` and links any shared checks.
