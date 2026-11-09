# Random Combinations and Permutations

Repeated random draws are compared with a user-selected pattern either with or without regard to order. Ordered permutations and unordered combinations are distinct events and have different matching frequencies.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Random Combinations and Permutations`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/random-combinations-and-permutations/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `width` | `3` | integer; ≥ 1; ≤ 5 |
| `height` | `1` | integer; ≥ 1; ≤ 2 |
| `choices` | `2` | integer; ≥ 2; ≤ 6 |
| `dice` | `true` | boolean |
| `singleSuccess` | `false` | boolean |
| `analysisType` | `"both"` | `combination`, `permutations`, `both` |
| `bars` | `true` | boolean |
| `sampleSize` | `1000` | integer; ≥ 100; ≤ 100000 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `createCombi`, `finishCombi`, `assignColorOrImage`, `selectAt`, `hideReveal`, `setRules`. See their typed arguments in [model.ts](model.ts).

Additional instance accessors: `world`. See [model.ts](model.ts) for the returned live references.

Model-specific `read()` fields include `squares`, `distributionSeries`, `original`, `guesses`, `exists`, `abortCreate`, `hidden`, `creating`, `countSteps`, `countCombiSuccesses`, `countPermisSuccesses`, `samplesCounter`, `attempts`, `allCombiMatch`, `allPermisMatch`, `instructions`, `choiceCounts`, `combiSamples`, `permisSamples`, `combiMean`, `permisMean`, `ratio`.

The [UI binding](ui.ts) presents `Create Combi`, `Finish Combi`, `Hide / Reveal`, `Search attempts`, `Steps in sample`, `Samples`, `Combination successes`, `Permutation successes`, `Mean combination`, `Mean permutations` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `random-combinations-and-permutations` and links any shared checks.
