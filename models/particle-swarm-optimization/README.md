# Particle Swarm Optimization

How can a swarm share discoveries to find the highest point of a landscape? Each particle has a position and a velocity. It remembers the best point it has seen, and the swarm shares the best point anyone has seen. Every step, particles keep part of their velocity (`particleInertia`) and are pulled toward both best points with random strength.

Things to try:

- Set `attractionToGlobalBest` to 0. Does the swarm still converge?
- Make the landscape rougher with lower `landscapeSmoothness`. How often does the swarm settle on a lower peak?

## Use

Choose **Particle Swarm Optimization** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/particle-swarm-optimization/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

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

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setScenario`, `updateBests`, `moveParticles`, `setParameters`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `globalBestValue`, `globalBestX`, `globalBestY`, `trueBest`, `complete`, `particles`, `cells`, `landscape`, `trails`.

## Sources and limits

Adapted from the NetLogo *Particle Swarm Optimization* model by Stonedahl and Wilensky (2008). Attribution and license are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

A good value found in a run is not proof that the global optimum was found. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `particle-swarm-optimization`.
