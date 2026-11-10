# Path Formation

Travelers pursue destinations while reinforcing the popularity of fields they cross and favoring established routes. Popularity and thresholds are path-formation assumptions rather than construction costs or a global network optimum.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Path Formation`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/paths/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

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

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `step`, `snapshot`, `setParameters`, `toggleBuilding`, `bestWayTo`, `becomeMorePopular`, `walkTowardsGoal`, `moveWalkers`, `decayPopularity`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `cells`, `walkers`, `buildings`.

The [UI binding](ui.ts) presents `Tick`, `Walkers`, `Buildings`, `Paths`, `ModelField`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](original.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `paths` and links any shared checks.
