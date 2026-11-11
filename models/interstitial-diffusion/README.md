# Interstitial Diffusion

How do small atoms move through the gaps of a crystal? Small atoms sit between host atoms and try random jumps to neighboring gaps; a jump succeeds only if the gap is empty. Optional reservoirs at the left and right surfaces keep a constant concentration there. You can draw your own starting profile in `draw-profile` mode before simulating.

Things to try:

- Switch on `constantLeftSurface` and watch the profile fill in from the left.
- Draw a step profile, then simulate and compare with the default start.

## Use

Choose **Interstitial Diffusion** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/interstitial-diffusion/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

Use `goMode: "simulate"` for diffusion progress. In `"draw-profile"` mode, `advance(...)` refreshes the initial concentration profile and resets the tick instead of moving atoms. Switch back to simulation after drawing; the simulation stops at its `maxTicks` limit.

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `41` | integer; ≥ 3; ≤ 101 |
| `height` | `201` | integer; ≥ 3; ≤ 301 |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `initialBulkConcentration` | `0.8` | number; ≥ 0; ≤ 1 |
| `initialPopulatedColumnCount` | `10` | integer; ≥ 0; ≤ 100 |
| `maxTicks` | `1000` | number; ≥ 0; ≤ 1000000 |
| `constantLeftSurface` | `false` | boolean |
| `leftSurfaceConcentration` | `0.7` | number; ≥ 0; ≤ 1 |
| `constantRightSurface` | `false` | boolean |
| `rightSurfaceConcentration` | `0` | number; ≥ 0; ≤ 1 |
| `goMode` | `"simulate"` | `simulate`, `draw-profile` |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setup`, `simulate`, `calcConcentration`, `randomWalk`, `setConstantLeftSurface`, `setConstantRightSurface`, `setRules`, `setProfile`, `drawColumn`, `drawProfile`, `toggleLattice`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `latticeVisible`, `cells`, `atoms`, `lattice`, `profile`, `initialProfile`, `profileAt15`.

## Sources and limits

Adapted from the NetLogo *Interstitial Diffusion* model by Kelter, Emery and Wilensky (2025). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

Column concentrations come from random walks with exclusion; this is not a continuum diffusion solver. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `interstitial-diffusion`.
