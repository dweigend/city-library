# Expected Value

How can uncertain single outcomes give a predictable average? Tiles hold values from 0 to 6, mixed according to `ratio0` … `ratio6`. The expected value follows from these ratios. A walker moves across the tiles and collects `sampleSize` values per sample; the model records sample totals and the running mean.

Things to try:

- Compare the running mean with the expected value after many samples.
- Change `sampleSize`. How does the spread of the sample totals change?

## Use

Choose **Expected Value** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/expected-value/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `ratio0` | `0` | integer; ≥ 0; ≤ 10 |
| `ratio1` | `1` | integer; ≥ 0; ≤ 10 |
| `ratio2` | `6` | integer; ≥ 0; ≤ 10 |
| `ratio3` | `5` | integer; ≥ 0; ≤ 10 |
| `ratio4` | `0` | integer; ≥ 0; ≤ 10 |
| `ratio5` | `4` | integer; ≥ 0; ≤ 10 |
| `ratio6` | `0` | integer; ≥ 0; ≤ 10 |
| `sampleSize` | `10` | integer; ≥ 1; ≤ 20 |
| `setupApart` | `true` | boolean |
| `blackOut` | `false` | boolean |
| `dieNums` | `false` | boolean |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `clearSelection`, `setDisplay`. Their typed arguments are in [model.ts](model.ts).

Live references: `world`, `grid`. [model.ts](model.ts) describes what they return.

Model-specific `read()` fields include `expectedValue`, `populationCounts`, `populationPercentages`, `calculation`, `totalHistogram`, `cumulativeMeans`, `sampleTotal`, `mean`, `runCount`, `totals`, `values`, `walker`, `cells`.

## Sources and limits

Adapted from the NetLogo *Expected Value* model by Abrahamson and Wilensky (2004). Attribution and license are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

The walker's path makes neighboring samples correlated, so not every setting is an experiment with independent samples. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

The [catalog ledger](../catalog/progress.json) records the acceptance stages for `expected-value`.
