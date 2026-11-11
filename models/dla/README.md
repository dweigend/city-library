# Diffusion-Limited Aggregation

How do branching clusters grow from wandering particles? A seed sits in the middle. Particles wander randomly, turning by up to `wiggleAngle`, and stick when they touch the cluster. New walkers replace those that attach, up to `maxParticleCount` at a time.

Things to try:

- Lower `wiggleAngle` so particles walk straighter. How does the shape change?
- Compare `useWholeWorld` on and off.

## Use

Choose **Diffusion-Limited Aggregation** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/dla/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `171` | integer; ≥ 9; ≤ 301 |
| `height` | `171` | integer; ≥ 9; ≤ 301 |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `maxParticleCount` | `100` | integer; ≥ 1; ≤ 300 |
| `wiggleAngle` | `60` | number; ≥ 0; ≤ 360 |
| `useWholeWorld` | `true` | boolean |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setup`, `makeNewAgent`, `wander`, `setRules`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `radius`, `cells`, `agents`.

## Sources and limits

Adapted from the NetLogo *DLA* model by Wilensky (1997). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

The pattern depends on the finite world and stopping rule; resemblance to natural aggregates is not a calibration. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `dla`.
