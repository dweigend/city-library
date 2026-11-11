# Central Limit Theorem

Why do sample means look more regular than the population they come from? A population of people has values from 0 to `maxValue`; you can use a preset shape or draw your own. The model draws samples of `sampleSize` people without replacement and records their means (and, with `alsoSums`, their sums) in a histogram.

Things to try:

- Draw a lopsided population and compare the histogram of means for sample sizes 1 and 10.
- Use `preset` and compare different population shapes at the same sample size.

## Use

Choose **Central Limit Theorem** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/central-limit-theorem/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `sampleSize` | `10` | integer; ≥ 1; ≤ 10 |
| `maxValue` | `28` | integer; ≥ 0; ≤ 30 |
| `alsoSums` | `false` | boolean |
| `showEV` | `true` | boolean |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setup`, `createPopulation`, `preset`, `drawYourOwnPeople`, `setRules`. Their typed arguments are in [model.ts](model.ts).

Live references: `world`, `grid`. [model.ts](model.ts) describes what they return.

Model-specific `read()` fields include `ranger`, `background`, `message`, `population`, `cells`, `people`, `means`, `sums`, `meanHistogram`, `sumHistogram`, `sampleCount`, `expectedValue`, `stdDevMeans`, `stdDevSums`.

## Sources and limits

Adapted from the NetLogo *Central Limit Theorem* model by Abrahamson and Wilensky (2005). Attribution and license are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

Changing the sample size changes the distribution of means, not the population. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `central-limit-theorem`.
