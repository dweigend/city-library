# Expected Value

A walker selects values from a configured tile population and records sample totals and cumulative means. Correlated movement and the tile distribution matter; the output is not an independent-sample experiment under every setting.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Expected Value`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/expected-value/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

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

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `clearSelection`, `setDisplay`. See their typed arguments in [model.ts](model.ts).

Additional instance accessors: `world`, `grid`. See [model.ts](model.ts) for the returned live references.

Model-specific `read()` fields include `expectedValue`, `populationCounts`, `populationPercentages`, `calculation`, `totalHistogram`, `cumulativeMeans`, `sampleTotal`, `mean`, `runs`, `totals`, `values`, `walker`, `cells`.

The [UI binding](ui.ts) presents `Ratio ${i} units`, `Die numbers`, `Clear selection`, `Tick`, `Expected value`, `Runs`, `This sample total`, `Mean of samples`, `Calculation`, `Tiles` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

The [catalog ledger](../catalog/progress.json) owns acceptance stages for `expected-value` and links the retained checks.
