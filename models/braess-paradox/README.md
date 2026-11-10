# Braess' Paradox

Commuters select routes, move through congestion-dependent fields and feed completed travel times back into route choice. The middle route can change collective outcomes; the paradox depends on demand and the chosen cost rules.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Braess' Paradox`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/braess-paradox/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `middleOn` | `true` | boolean |
| `spawnRate` | `10` | integer; ≥ 1; ≤ 10 |
| `smoothing` | `10` | integer; ≥ 1; ≤ 10 |
| `mode` | `"Probabilistic Greedy"` | `Best Known /w Random Deviation`, `Empirical Analytical`, `Probabilistic Greedy` |
| `randomness` | `16` | integer; ≥ 0; ≤ 100 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setRules`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `travelTime`, `top`, `bottom`, `middle`, `spawnTime`, `middlePrev`, `avg`, `carsSpawned`, `completed`, `topProb`, `bottomProb`, `middleProb`, `routeCounts`, `commuters`, `cells`.

The [UI binding](ui.ts) presents `Middle road`, `Route choice`, `Tick`, `Active commuters`, `Cars spawned`, `Completed`, `Last travel time`, `Average travel time`, `Road congestion and commuters`, `Travel time (ticks / 450)` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `braess-paradox` and links any shared checks.
