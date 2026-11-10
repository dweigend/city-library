# Interstitial Diffusion

Atoms perform exclusion random walks on a mixed-boundary lattice, with optional constant-concentration reservoirs at the sides. Profile drawing and atom simulation are distinct operations; column concentration is not a continuum PDE solver.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Interstitial Diffusion`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/interstitial-diffusion/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

Use `goMode: "simulate"` for diffusion progress. In `"draw-profile"` mode, `advance(...)` refreshes the initial concentration profile and resets the tick instead of moving atoms. Switch back to simulation after drawing; the simulation stops at its `maxTicks` limit.

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `41` | integer; ≥ 3; ≤ 101 |
| `height` | `201` | integer; ≥ 3; ≤ 301 |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `initialBulkConcentration` | `0.8` | number; ≥ 0; ≤ 1 |
| `initialColumnsPopulated` | `10` | integer; ≥ 0; ≤ 100 |
| `maxTicks` | `1000` | number; ≥ 0; ≤ 1000000 |
| `constantLeftSurface` | `false` | boolean |
| `leftSurfaceConcentration` | `0.7` | number; ≥ 0; ≤ 1 |
| `constantRightSurface` | `false` | boolean |
| `rightSurfaceConcentration` | `0` | number; ≥ 0; ≤ 1 |
| `goMode` | `"simulate"` | `simulate`, `draw-profile` |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setup`, `simulate`, `calcConcentration`, `randomWalk`, `setConstantLeftSurface`, `setConstantRightSurface`, `setRules`, `setProfile`, `drawColumn`, `drawProfile`, `toggleLattice`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `latticeVisible`, `cells`, `atoms`, `lattice`, `profile`, `initialProfile`, `profileAt15`.

The [UI binding](ui.ts) presents `Show/hide lattice atoms`, `Tick`, `Diffusing atoms`, `Concentration profile`, `Lattice and diffusing atoms`, `Diffusing atom`, `Current`, `Initial`, `After 15 ticks`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `interstitial-diffusion` and links any shared checks.
