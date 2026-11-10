# Wealth Distribution

Agents seek grain, spend it according to metabolism and are replaced after starvation or age-related death. Grain holdings and replacement endowments illustrate resource-mediated inequality rather than wages, inherited capital or finance.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Wealth Distribution`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/wealth-distribution/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `people` | `250` | integer; ≥ 2; ≤ 1000 |
| `maxVision` | `5` | integer; ≥ 1; ≤ 15 |
| `metabolismMax` | `15` | integer; ≥ 1; ≤ 25 |
| `bestLand` | `10` | integer; ≥ 5; ≤ 25 |
| `minLife` | `1` | integer; ≥ 1; ≤ 100 |
| `maxLife` | `83` | integer; ≥ 1; ≤ 100 |
| `growthInterval` | `1` | integer; ≥ 1; ≤ 10 |
| `growthAmount` | `4` | integer; ≥ 1; ≤ 10 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setRules`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `peopleCount`, `totalWealth`, `classes`, `gini`, `lorenz`, `agents`, `cells`.

The [UI binding](ui.ts) presents `Maximum vision`, `Maximum metabolism`, `Minimum life`, `Maximum life`, `Tick`, `People`, `Total wealth`, `Gini`, `Selected`, `Resources and wealth classes` and further views or controls.

## Sources and acceptance

Attribution and rights: [adaptation comments](model.ts) and the retained source notices. Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `wealth-distribution` and links any shared checks.
