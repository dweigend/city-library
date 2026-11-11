# Random Combinations and Permutations

Does order matter when you guess a random pattern? You choose a target pattern of colors or dice faces. The model then draws random patterns and counts two kinds of matches: exact matches in the same order (permutations) and matches with the same elements in any order (combinations).

Things to try:

- Use dice with a target of two different faces. How do the two match counts compare?
- Choose a target with repeated faces. What happens to the ratio between the two counts?

## Use

Choose **Random Combinations and Permutations** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/random-combinations-and-permutations/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `width` | `3` | integer; ≥ 1; ≤ 5 |
| `height` | `1` | integer; ≥ 1; ≤ 2 |
| `choiceCount` | `2` | integer; ≥ 2; ≤ 6 |
| `dice` | `true` | boolean |
| `singleSuccess` | `false` | boolean |
| `analysisType` | `"both"` | `combination`, `permutations`, `both` |
| `bars` | `true` | boolean |
| `sampleSize` | `1000` | integer; ≥ 100; ≤ 100000 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `createCombi`, `finishCombi`, `assignColorOrImage`, `selectAt`, `hideReveal`, `setRules`. Their typed arguments are in [model.ts](model.ts).

Live references: `world`. [model.ts](model.ts) describes what they return.

Model-specific `read()` fields include `squares`, `distributionSeries`, `original`, `guesses`, `exists`, `abortCreate`, `hidden`, `creating`, `stepCount`, `combinationSuccessCount`, `permutationSuccessCount`, `samplesCounter`, `attemptCount`, `allCombiMatch`, `allPermisMatch`, `instructions`, `choiceCounts`, `combiSamples`, `permisSamples`, `combiMean`, `permisMean`, `ratio`.

## Sources and limits

Adapted from the NetLogo *Random Combinations and Permutations* model by Abrahamson and Wilensky (2004). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

Ordered and unordered matches are different events; the counts estimate their probabilities from a finite sample. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `random-combinations-and-permutations`.
