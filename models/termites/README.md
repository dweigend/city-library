# Termites

Termites search for chips, carry them and seek places to deposit them near other chips. Searches can resume across bounded work sweeps; a sweep is not automatically a completed source tick.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Termites`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/termites/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

One `advance(1)` performs one bounded activation sweep and increments `work`; searches resume from each termite’s `phase`. The observation deliberately reports `tick: null`: use `work` and individual `cycles` to distinguish scheduled work from completed pickup/deposit cycles.

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `number` | `400` | integer; ≥ 1; ≤ 2000 |
| `density` | `20` | integer; ≥ 0; ≤ 100 |

## Actions and observations

Use `advance(...)` for bounded work sweeps and `read()` for observations; this model does not report a source tick.

Model-specific `read()` fields include `work`, `chipCount`, `carryingCount`, `termites`, `cells`.

The [UI binding](ui.ts) presents `Work sweeps`, `Chips on ground`, `Carrying`, `Wood chips and termites`, `Termite`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `termites` and links any shared checks.
