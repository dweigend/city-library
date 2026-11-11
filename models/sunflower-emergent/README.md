# Sunflower Spirals

Can a sunflower spiral appear without building in the golden angle? Particles are placed one at a time on successive rings, `ringDist` apart. Each new particle takes the position on its ring with the lowest estimated repulsion from the particles already placed, using the chosen `energyApproximation`.

No angle is prescribed; any spiral comes from this sequential placement.

Things to try:

- Switch `energyApproximation` and compare the spiral patterns.
- Change `ringDist` and count the visible spiral arms.

## Use

Choose **Sunflower Spirals** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/sunflower-emergent/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `ringDist` | `0.2` | number; ≥ 0.01; ≤ 1 |
| `particleSize` | `1.8` | number; ≥ 0.1; ≤ 3 |
| `fixedTemps` | `false` | boolean |
| `showTemps` | `true` | boolean |
| `energyApproximation` | `"inverse-distance"` | `inverse-distance`, `exponential` |
| `alpha` | `3` | number; ≥ 1; ≤ 3 |
| `beta` | `0.6` | number; ≥ 0; ≤ 1 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setParameters`, `potentialEnergy`, `createParticle`, `go`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `temporaryParticleCount`, `particles`, `temporaryParticles`.

## Sources and limits

Adapted from the NetLogo *Sunflower Emergent* model by Wilensky (2009). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

Growth is reduced to point placement with a chosen energy rule; the model does not represent a plant meristem or hormone transport. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `sunflower-emergent`.
