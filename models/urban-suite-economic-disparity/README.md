# Rich and Poor Residential Choice

Do rich and poor households sort into different parts of a city? Every step, new rich and poor residents arrive and test `testCount` sites. Poor residents weigh price more (`poorPricePriority`), rich residents weigh quality (`richQualityPriority`). Where they settle, they change local price and quality, and jobs move toward valuable land. Residents leave with `deathRate`.

Things to try:

- Set both priorities to 0. Does the city still separate?
- Increase `maxJobCount` and follow where jobs settle.

## Use

Choose **Rich and Poor Residential Choice** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/urban-suite-economic-disparity/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `testCount` | `15` | integer; ≥ 0; ≤ 30 |
| `residentsPerJob` | `100` | integer; ≥ 0; ≤ 500 |
| `poorPersonCountPerStep` | `5` | integer; ≥ 0; ≤ 15 |
| `richPersonCountPerStep` | `5` | integer; ≥ 0; ≤ 15 |
| `poorPricePriority` | `0` | number; ≥ -1; ≤ 1 |
| `richQualityPriority` | `0` | number; ≥ -1; ≤ 1 |
| `maxJobCount` | `10` | integer; ≥ 5; ≤ 20 |
| `deathRate` | `4` | integer; ≥ 0; ≤ 15 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setRules`, `setViewMode`, `setAgents`, `setLand`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `counter`, `viewMode`, `agents`, `cells`, `counts`, `medianTravelDistance`, `utilityRanges`.

## Sources and limits

Adapted from the NetLogo *Urban Suite - Economic Disparity* model by Felsen and Wilensky (2007). Attribution and license are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

Two income levels and the assumed pull of jobs toward valuable land are propositions, not calibrated urban laws. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

The [catalog ledger](../catalog/progress.json) records the acceptance stages for `urban-suite-economic-disparity`.
