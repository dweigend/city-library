# Urban Pollution and Health

Can trees offset the pollution of power plants? Power plants keep polluting their surroundings, pollution spreads, and trees remove it nearby. People move around, lose health in polluted areas, plant trees with `plantingRate` and have children with `birthRate` when healthy.

Things to try:

- Add power plants (`powerPlantCount`). Does the population survive?
- Raise `plantingRate` and compare the pollution level over time.

## Use

Choose **Urban Pollution and Health** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/urban-suite-pollution/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `initialPersonCount` | `30` | integer; ≥ 0; ≤ 100 |
| `powerPlantCount` | `2` | integer; ≥ 0; ≤ 20 |
| `birthRate` | `0.1` | number; ≥ 0; ≤ 0.2 |
| `plantingRate` | `0.05` | number; ≥ 0; ≤ 0.1 |
| `pollutingRate` | `3` | integer; ≥ 0; ≤ 5 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setRules`, `setPeople`, `setTrees`, `setEnvironment`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `people`, `trees`, `cells`, `counts`, `totalPollution`.

## Sources and limits

Adapted from the NetLogo *Urban Suite - Pollution* model by Felsen and Wilensky (2007). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

Pollution and health are abstract measures, not air-quality units or health risk estimates. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `urban-suite-pollution`.
