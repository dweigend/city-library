# Particle Swarm Optimization

Particles combine personal-best and global-best memory while moving over a toroidal objective landscape. Inertia, attraction and random draws define the search; a good observed value is not a proof of global optimality.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Particle Swarm Optimization`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/particle-swarm-optimization/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `201` | integer; ≥ 3; ≤ 301 |
| `height` | `201` | integer; ≥ 3; ≤ 301 |
| `seed` | `1` | integer |
| `landscapeSmoothness` | `20` | integer; ≥ 0; ≤ 100 |
| `populationSize` | `50` | integer; ≥ 1; ≤ 100 |
| `particleInertia` | `0.98` | number; ≥ 0; ≤ 1 |
| `particleSpeedLimit` | `10` | integer; ≥ 1; ≤ 20 |
| `attractionToPersonalBest` | `2` | number; ≥ 0; ≤ 2 |
| `attractionToGlobalBest` | `1` | number; ≥ 0; ≤ 2 |
| `highlightMode` | `"none"` | `none`, `best-found`, `true-best` |
| `trailsMode` | `"none"` | `none`, `tails`, `traces` |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setScenario`, `updateBests`, `moveParticles`, `setParameters`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `globalBestValue`, `globalBestX`, `globalBestY`, `trueBest`, `complete`, `particles`, `cells`, `landscape`, `trails`.

The [UI binding](ui.ts) presents `Particles`, `Inertia`, `Speed limit`, `Personal attraction`, `Global attraction`, `Highlight`, `Trails`, `Tick`, `Best value found`, `Search landscape` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `particle-swarm-optimization` and links any shared checks.
