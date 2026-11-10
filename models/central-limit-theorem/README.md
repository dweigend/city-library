# Central Limit Theorem

A finite population supplies samples without replacement, whose sums and means accumulate into separate histograms. Changing sample size changes the sampling distribution, not the shape of the underlying population.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Central Limit Theorem`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/central-limit-theorem/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `sampleSize` | `10` | integer; ≥ 1; ≤ 10 |
| `maxValue` | `28` | integer; ≥ 0; ≤ 30 |
| `alsoSums` | `false` | boolean |
| `showEV` | `true` | boolean |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setup`, `createPopulation`, `preset`, `drawYourOwnPeople`, `setRules`. See their typed arguments in [model.ts](model.ts).

Additional instance accessors: `world`, `grid`. See [model.ts](model.ts) for the returned live references.

Model-specific `read()` fields include `ranger`, `background`, `message`, `population`, `cells`, `people`, `means`, `sums`, `meanHistogram`, `sumHistogram`, `sampleCount`, `expectedValue`, `stdDevMeans`, `stdDevSums`.

The [UI binding](ui.ts) presents `Show expected value`, `Create random people`, `Preset ${n}`, `Tick`, `Population`, `Samples`, `Expected value`, `Std dev means`, `Std dev sums`, `State` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `central-limit-theorem` and links any shared checks.
