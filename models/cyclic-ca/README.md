# Cyclic CA

Cells switch toward a cyclic successor state when the selected neighborhood meets a threshold. Neighborhood geometry, state count and periodic boundaries determine which waves can propagate.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Cyclic CA`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/cyclic-ca/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `201` | integer; ≥ 3; ≤ 501 |
| `height` | `201` | integer; ≥ 3; ≤ 501 |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `preset` | `"none"` | 22 named choices; see `inputs.preset` |
| `neighborhood` | `"moore"` | `moore`, `von-neumann` |
| `radius` | `3` | integer; ≥ 1; ≤ 6 |
| `stateCount` | `3` | integer; ≥ 2; ≤ 14 |
| `threshold` | `3` | integer; ≥ 1; ≤ 168 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setThreshold`, `setCells`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `colorList`, `neighborCount`, `warning`, `cells`.

The [UI binding](ui.ts) presents `Tick`, `Neighbors`, `States`, `Threshold`, `Status`, `Cells`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `cyclic-ca` and links any shared checks.
