# Forest Fire

Fire spreads only from the old burning membership to orthogonal tree neighbors, then becomes fading embers. Empty cells interrupt the front; the forest has no wind, fuel variation or regrowth.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Forest Fire`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/fire/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `251` | integer; ≥ 3; ≤ 301 |
| `height` | `251` | integer; ≥ 3; ≤ 301 |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `density` | `57` | integer; ≥ 0; ≤ 99 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setForest`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `cells`, `initialTrees`, `burnedTrees`, `percentBurned`, `counts`.

The [UI binding](ui.ts) presents `Tick`, `Burned (%)`, `Fires`, `Embers`, `Forest`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `fire` and links any shared checks.
