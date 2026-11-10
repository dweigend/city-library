# Consumer Choice

Consumers combine personal experience, information from network neighbors and normative utility when choosing between two products. Fixed behavioral weights and this two-product market do not estimate real demand or strategic pricing.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Consumer Choice`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/consumer-choice/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `consumerCount` | `100` | integer; ≥ 0; ≤ 1000 |
| `avgConnections` | `5` | integer; ≥ 0; ≤ 10 |
| `initialOrangePercent` | `50` | number; ≥ 0; ≤ 100 |
| `normInfluence` | `0.15` | number; ≥ 0; ≤ 1 |
| `informationExchange` | `0.05` | number; ≥ 0; ≤ 1 |
| `exploration` | `0.01` | number; ≥ 0; ≤ 1 |
| `qualityOrange` | `0.5` | number; ≥ 0; ≤ 1 |
| `qualityBlue` | `0.5` | number; ≥ 0; ≤ 1 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setParameters`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `consumers`, `edges`.

The [UI binding](ui.ts) presents `Consumers`, `Average connections`, `Initial orange (%)`, `Orange quality`, `Blue quality`, `Tick`, `Orange`, `Blue`, `Clustering`, `Consumer connections` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `consumer-choice` and links any shared checks.
