# Stochastic Patchwork

Independent colored fields create a population from which sample means are recorded. Population colors, sample size and the finite recording window distinguish the data distribution from the distribution of means.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Stochastic Patchwork`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/stochastic-patchwork/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `blockSide` | `3` | integer; ≥ 1; ≤ 17 |
| `targetPercent` | `50` | integer; ≥ 0; ≤ 100 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setRules`. See their typed arguments in [model.ts](model.ts).

Additional instance accessors: `world`, `grid`. See [model.ts](model.ts) for the returned live references.

Model-specific `read()` fields include `targetCount`, `cells`, `samples`, `histogram`.

The [UI binding](ui.ts) presents `Target color (%)`, `Tick`, `Target color`, `Patchwork`, `Color distribution`, `Occurrences`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

The [catalog ledger](../catalog/progress.json) owns acceptance stages for `stochastic-patchwork` and links the retained checks.
