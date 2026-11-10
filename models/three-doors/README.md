# Three Doors

Contestants choose a door, observe the host reveal an unchosen losing door, and retain or switch their choice. The host's constrained information and reveal rule are essential to the Monty Hall comparison.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Three Doors`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/three-doors/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `number` | `300` | integer; ≥ 1; ≤ 1000 |
| `gradation` | `false` | boolean |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Additional instance accessors: `world`. See [model.ts](model.ts) for the returned live references.

Model-specific `read()` fields include `racers`.

The [UI binding](ui.ts) presents `Racers`, `Tick`, `State`, `Race`, `Switching and wins`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `three-doors` and links any shared checks.
