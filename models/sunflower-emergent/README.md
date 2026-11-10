# Sunflower Emergent

New particles are placed on successive rings by comparing approximate repulsive energy. Spiral structure follows this sequential placement rule, without specifying a golden angle or modeling complete plant development.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Sunflower Emergent`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/sunflower-emergent/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

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

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setParameters`, `potentialEnergy`, `createParticle`, `go`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `temporaryParticleCount`, `particles`, `temporaryParticles`.

The [UI binding](ui.ts) presents `Tick`, `Particles`, `Temporary candidates`, `Sunflower Emergent`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `sunflower-emergent` and links any shared checks.
