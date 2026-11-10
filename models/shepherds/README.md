# Shepherds

Shepherds find sheep, pick them up, seek herds and release them after the source-specific delay. The carrying and search phases make this a local coordination example rather than optimal herd routing.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Shepherds`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/shepherds/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `sheepCount` | `150` | integer; ≥ 0; ≤ 500 |
| `shepherdCount` | `30` | integer; ≥ 0; ≤ 100 |
| `sheepSpeed` | `0.02` | number; ≥ 0; ≤ 0.2 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setRules`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `herdingEfficiency`, `sheeplessNeighborhoods`, `sheep`, `shepherds`, `cells`.

The [UI binding](ui.ts) presents `Tick`, `Current efficiency (%)`, `Carried sheep`, `Sheep and shepherds`, `Herding efficiency`, `efficiency`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `shepherds` and links any shared checks.
