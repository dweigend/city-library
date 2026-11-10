# Paths

How do footpaths form across a lawn? Walkers head toward random destinations. Every step they take makes the ground a little more popular (`popularityPerStep`), and popularity fades over time (`popularityDecayRate`). Walkers prefer nearby popular ground within `walkerVisionDist`, and ground that passes `minimumRoutePopularity` becomes a path.

Things to try:

- Raise `popularityDecayRate`. Do fewer paths survive?
- Place buildings with `toggleBuilding` and watch how the paths route around them.

## Use

Choose **Paths** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/paths/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `walkerCount` | `250` | integer; ≥ 0; ≤ 1000 |
| `minimumRoutePopularity` | `80` | number; ≥ 0; ≤ 100 |
| `walkerVisionDist` | `10` | number; ≥ 0; ≤ 30 |
| `popularityDecayRate` | `4` | number; ≥ 0; ≤ 100 |
| `popularityPerStep` | `20` | number; ≥ 0; ≤ 100 |
| `showPopularity` | `false` | boolean |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `step`, `snapshot`, `setParameters`, `toggleBuilding`, `bestWayTo`, `becomeMorePopular`, `walkTowardsGoal`, `moveWalkers`, `decayPopularity`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `cells`, `walkers`, `buildings`.

## Sources and limits

Adapted from the NetLogo *Paths* model by Grider and Wilensky (2015). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](original.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

Popularity and thresholds are path-formation assumptions, not construction costs or an optimal network. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `paths`.
