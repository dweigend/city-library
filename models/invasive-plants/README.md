# Invasive Plants

How do spreading weeds and repeated treatment interact across neighboring land? Each cell holds an infestation level and a resistance value. Infested cells produce seeds that spread up to `spreadDistance` cells away. When infestation passes `weedKillerThreshold`, weed killer is applied with the chosen effectiveness, and part of it also reaches neighboring cells.

You can draw infestation or resistance directly onto the map with the draw tools to set up your own scenarios.

Things to try:

- Change `weedKillerThreshold` and compare how much of the land stays infested.
- Draw a strip of high resistance and see whether it slows the spread.

## Use

Choose **Invasive Plants** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/invasive-plants/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

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

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `paint`, `draw`, `drawingTick`, `clearFields`, `clearPlots`, `setRules`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `aggregateInfestation`, `seeds`, `cells`, `histogram`.

## Sources and limits

Adapted from the NetLogo *Invasive Plants* model by Mongkhonvanit and Wilensky (2025). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

Infestation is an abstract scale, not a measured density, and the model leaves out individual seeds, crop economics and chemical transport. Comparing treatments shows consequences of the chosen rules, not field effectiveness or pesticide safety. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `invasive-plants`.
