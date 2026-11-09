# Selected grid batch source and composition audit

Author audit, 2026-11-05. Scope is exactly Fire (B11), Life (B19), Percolation (B11), without substituting similarly named variants. Selection/progress/research remain coordinator-owned. Research verification and independent approval are pending.

## Exact provenance

All three archives are unchanged NetLogo **7.0.4**, from Galapagos `90be931773fcf499049247a8aaa1aecbe003654c` under `public/modelslib/`. Procedures, all Widgets, full Info and complete licensing notices were read. None requires an extension, include or external asset. Local SHA-256 and the exact string loaded by the real browser match:

| Canonical selected path | Archive SHA-256 |
| --- | --- |
| Sample Models/Earth Science/Fire | `0a2420e463481fb2cd7791aacdc068735db0d900c14d3fece0a93a085246b171` |
| Sample Models/Computer Science/Cellular Automata/Life | `fa55f68a3f00b9aba56b384954db875e6d3b55ea318384eecae0561c36892802` |
| Sample Models/Earth Science/Percolation | `61523cdd4661611bdfb14fdb812c1c6601c9befb27a2ab0a1802766724062e3a` |

Fire copyright 1997 Uri Wilensky; Life and Percolation copyright 1998 Uri Wilensky. Original/adapted rules: CC BY-NC-SA 3.0. Each experiment's NOTICE and full archived Info retain citations, conversion history, grant acknowledgments, commercial-license contact and original license terms. Independent library/UI licensing is not changed by these notices.

## Reuse and ownership decision

The local public `Grid`, `Random`, `World`, `run`, existing canonical parameter descriptors and step validation provide the entire required domain closure. They already define topology, stable cell identity, field storage, deterministic streams and successful tick accounting. A separate cellular-automata library would add a competing state/topology owner; transpiling NetLogo would obscure the public composition. No new core capability, model-private generic library, dependency or storage owner was introduced.

Each readable `model.ts` exports `create`, `inputs`, `model` and inferred instance actions. Named procedures compose public operations. Grid fields exclusively own live terrain/cells; phase-local arrays merely observe old membership or neighbor counts. UI adapters project frozen observations and dispatch actions. No domain rules live in canvas/compose. Each instance owns its World/Random/Grid, immutable parameter record and detached history (initial sample plus latest 1000 completed steps). All observations are frozen and RNG-pure. Atomic fixture validation precedes mutations and rejects sparse/accessor entries without evaluating getters.

The five public model examples were already frozen at `242cc12`. The commit exists locally and the Fire script matches its frozen hash. All five current accepted bytes are verified with `examples/netlogo-grid-batch/SHA256SUMS`. They were not modified. No core expansion required another example phase. UI author tasks were committed before shared UI runtime in `bf81461`; `ui/authoring.types.ts` SHA-256 is `582f46047116471b61562553c8da98afb54f5a0fb58924447132886e9d2a628c`.

## Fire procedures and adaptations

`setup` fills independent trees, unconditionally ignites the whole left column, excludes setup ignitions from both initial/cumulative tree counters, resets tick/history. `ignite` changes canonical field status/color. `spreadAndFade` snapshots old fires, visits only public face-neighbors, converts old fires to embers and fades all current embers by 0.3. New fires neither propagate nor fade in their birth step. Final color below 11.5 stays on the burned field. Preflight stop applies only after both fires and embers are gone; the last fading step still ticks.

Default 251×251, hard x/y, density 57 integer percent (0..99), setup-only. Monitor is cumulative burned/initial ×100; no source plot. Target stationary phases replace source stationary turtle identities with field status; no occupancy is stored twice. Fire retains the exact fade lifetime but uses an approximate CSS red interpolation. The optional display-only heading draws and scientifically irrelevant ask shuffles are omitted. `percentBurned=0` guards zero initial trees instead of source division by zero. Explicit seed, bounded dimensions and `setForest` are target reproducibility/fixture additions.

## Life procedures and adaptations

Default 101×101 torus, random initial density 35% (0..100 step 0.1); blank/random setup are represented by an initialization choice and Setup. `nextGeneration` snapshots all old Moore-neighbor totals before changing any fields. Three neighbors causes birth, two retains state **and current cell color**, all others cause death. Every successful generation ticks, including a blank board and stable patterns. There is no terminal rule. Density is a fraction, not percent; there is no source plot.

`setCells` and exact-center `setCell` are atomic same-tick interventions. `setDrawing`/`beginBrush`/`moveBrush`/`endBrush` own one paint/erase latch chosen from the first cell's living state until release. Shared UI emits neutral intents only; native pointer capture, cancellation and keyboard support are presentation mechanics. Mouse and touch share that route. Keyboard arrows/Home/End select, Enter/Space draw, and a selected-cell toggle supplies a tap alternative.

Foreground/background CSS defaults `#660f40`/`#d2ece4` match the browser's representation of source numeric colors 123/79. Numeric NetLogo colors are replaced by six-digit CSS values. `setColors` changes future birth/death colors; existing colors change only through birth/death or `recolor`, including retained two-neighbor survivor colors. This preserves source palette timing rather than applying a silent global recolor. Seed/dimension controls, deterministic fixtures, Mulberry RNG and omission of order-independent shuffles are explicit additions/adaptations.

## Percolation procedures and adaptations

Default 150×221, hard x / wrapped y, source column/row 0..149/0..220. Public centered Grid coordinates are translated by the first field's origin; checkerboard parity uses source indices. Odd target heights preserve the source top-row phase. `setup` makes odd-parity soil, other cells rock, odd-column top oil; totalOil starts at zero.

`percolate` snapshots and shuffles current-row parents; each visits existing southwest/southeast Grid targets in shuffled order. Brown soil gets a fresh entry draw on every attempt until success changes it immediately. A second parent may retry a failed destination; this is not a pre-sampled mask or one-trial-per-destination update. Each parent becomes saturated and increments totalOil once. `wrapOil` moves the bottom row through public wrapped lookup to the top **before bottom-front activation**, restores lower checkerboard and continues cumulative depth/counts. Empty-front preflight does not tick; extinction's completed step does.

Porosity is live, default 60.5%, range 0..99 step 0.5. `setRules` never resurrects an empty front. `setFront` is a validated deterministic setup fixture. Source plots track cumulative totalOil and current-row red count; both target charts use recorded post-step history and the initial sample. Histories are bounded to prevent unbounded observation storage. Mulberry, omitted order-independent resets and source y-test `one-of` draws change trajectories; no identical-seed or scientific distribution-equivalence claim is made.

See [browser/shell evidence and remaining gates](selected-grid-batch-report.md) and [shared interaction contract](https://github.com/dweigend/city-library/blob/23693e90e199512faf68a04c9a2198b9eb50463b/docs/development/selected-grid-batch-interaction-contract.md).
