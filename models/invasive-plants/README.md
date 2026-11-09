# Invasive Plants

Plants generate and disperse seeds across a resistance field, while targeted herbicide changes infestation and runoff. Drawing infestation or resistance is an explicit intervention on an abstract landscape rather than a calibrated land-management prescription.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Invasive Plants`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/invasive-plants/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `initialDensity` | `0.01` | number; ≥ 0; ≤ 1 |
| `initialResistanceShape` | `"plus"` | `none`, `plus`, `circle` |
| `seedProductionRate` | `0.05` | number; ≥ 0; ≤ 1 |
| `spreadDistance` | `1` | number; ≥ 0; ≤ 10 |
| `weedKillerThreshold` | `66` | integer; ≥ 0; ≤ 100 |
| `weedKillerEffectiveness` | `0.95` | number; ≥ 0; ≤ 1 |
| `weedKillerRate` | `5` | integer; ≥ 0; ≤ 30 |
| `drawMode` | `"resistance"` | `infestation`, `resistance` |
| `drawValue` | `100` | integer; ≥ 0; ≤ 100 |
| `showSeeds` | `true` | boolean |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `paint`, `draw`, `drawingTick`, `clearFields`, `clearPlots`, `setRules`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `aggregateInfestation`, `seeds`, `cells`, `histogram`.

The [UI binding](ui.ts) presents `Clear fields`, `Clear plots`, `Drawing tick`, `Draw clock`, `Year`, `Aggregate infestation`, `Seeds`, `Infestation, resistance and seeds`, `Selected field`, `Infestation` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `invasive-plants` and links any shared checks.
