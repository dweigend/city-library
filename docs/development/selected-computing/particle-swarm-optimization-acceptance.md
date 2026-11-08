# Particle Swarm Optimization — executed B18 author acceptance

Selected identity: `Sample Models/Computer Science/Particle Swarm Optimization`. Mechanism: **Toroidal discrete-landscape swarm**. Source audit, implementation, headless verification and original/target browser comparison are evidenced here; independent approval remains **pending** (known quota-blocked Argon/high task8194e842, no retry/substitution). This is not final scientific or independent acceptance.

## Identity, versions and public composition

Exact [served source](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Computer%20Science/Particle%20Swarm%20Optimization.nlogox), archived as [source.nlogox](../../../experiments/particle-swarm-optimization/source.nlogox), [attribution/license](../../../experiments/particle-swarm-optimization/NOTICE.md): CC BY-NC-SA 3.0. Source SHA-256 `d03ded09553798a66fa7c70ee9aef25d5852dba403cdf388c4bcd2dd7a3b6d0e`; 51522bytes. Galapagos `90be931773fcf499049247a8aaa1aecbe003654c` matches served bytes; Desktop membership is not used as identity. All Procedures/Widgets/Info/notices were audited; [complete procedure/widget inventory](particle-swarm-optimization-source.md) and [source contract](../selected-computing-contract.md) retain equations/defaults/topology/order/actions/reporters and source faults.

Target public headless entry: `experiments/particle-swarm-optimization/model.ts`, `create(options?)`, `advance(count?)`, `read()` plus documented model actions. It composes real public City Library objects/functions; UI imports domain actions and detached snapshots. No transpiled NetLogo, substitute engine, new private generic library or shared core API was introduced.

- Model source SHA-256: `1dc56229d66b9bf4f1957b3711604589cb86ae3e152fe5a7a9dead733bacac1f`.
- Thin UI SHA-256: `ea64e7af64cff2f82e42f339b528fdfd28446887370b4a8062b4caad110fb3a0`.
- Actual browser-loaded model chunk: `http://localhost:3188/chunks/ui-1vhzhptb.js`, SHA-256 `e4055f95d3b0d5ec5ec8b3a4bed85e2c99944b7c60b9162e59fc771d17a68fac`, 12249bytes, compiled source marker `experiments/particle-swarm-optimization/model.ts` checked.

Reference XML declares NetLogo7.0.4; hosted Web engine2.16.1(90be9317) was read from native netlogo-version/modelConfig.version in the final K-Means session. Browser Chromium156.0.0.0; target Bun1.4.2/TypeScript7.0.2/Node26.8.2. [Environment](evidence/environment.json) records the observation basis and exact two-file parent5bc6b16 renderer hashes. Reference RNG is not equated to target Mulberry32 seed1. Content-addressed model-chunk URLs were read back and SHA-256 checked; app.js is a mutable dev-server entry and its refetched hash is supplemental, not a source identity assertion.

## Native setup and measured progress

Native controls at Setup (complete widget code/ranges/defaults in audit):

| Measurement | Observed value |
| --- | --- |
| landscape-smoothness | `20` |
| population-size | `50` |
| particle-inertia | `0.98` |
| particle-speed-limit | `10` |
| attraction-to-personal-best | `2` |
| attraction-to-global-best | `1` |
| highlight-mode | `"None"` |
| trails-mode | `"None"` |

Original setup tick0 and progressed tick19:

| Measurement | Observed value |
| --- | --- |
| count turtles | `50` |
| global-best-val | `1` |
| max [personal-best-val] of turtles | `1` |
| max [val] of patches | `1` |

Target setup and pending/live inputs:

| Measurement | Observed value |
| --- | --- |
| seed | `"1"` |
| width | `"201"` |
| height | `"201"` |
| landscapeSmoothness | `"20"` |
| populationSize | `"50"` |
|  | `"5"` |
| live-particleInertia | `"0.98"` |
| live-particleSpeedLimit | `"10"` |
| live-attractionToPersonalBest | `"2"` |
| live-attractionToGlobalBest | `"1"` |
| live-highlightMode | `"None"` |
| live-trailsMode | `"None"` |

Target progressed monitor values:

| Measurement | Observed value |
| --- | --- |
| Tick | `"12"` |
| Best value found | `"1.00000"` |

The native201² torus is initialized with uniform fields,20public Grid diffusion passes, normalization and one unique optimum1. Fifty particles use public normal velocities. Global best stays0atSetup. Each go updates all personal memories and then global best from current positions; optimum detection stops before movement/tick. Inertia.98, distinct random x/y attractions, axis speed limits and wrapped facing followed by Euclidean magnitude are preserved. Original found1at19ticks; target found1at12 and disabled stepping. A separate target reset with Traces/True best progressed10ticks and rendered paths/marker.

## Executed controls and boundary checks

Original performed actions: setup, step, go start, go pause, setup reset. Setup after the run reset tick to0. [Original raw readbacks](evidence/particle-swarm-optimization-original.json) pin settings, source SHA, actual ticks, reporters and code errors. [Supplementary original parameter/actions](evidence/original-parameter-actions.json) retain additional native switch/chooser/limit/reset tests; PageRank method switch is in its primary record. K-Means additionally has [single native go](evidence/k-means-single-command.json). Models without a native single-step button use Command Center go (Robby/Factory/Annealing) or their native split assignment/update actions plus single go (K-Means); no nonexistent native Reset/Step button is claimed. Source Setup is the reset operation.

Target performed actions: Setup, 1 step, Run, Pause, 100 steps × 1, Highlight True best live, Trails Traces live, Setup retains selected visualization parameters, 10 steps draw Traces, Setup resets model. [Target raw readbacks](evidence/particle-swarm-optimization-target.json) retain Setup, single step, progressed state, live actions and Setup-reset values, all four viewport/theme combinations, actual chunk digests and diagnostics. Completion disables target step/play controls for K-Means and PSO; other models retain their audited terminal rules. Atomic invalid inputs, no-tick actions, observation purity, deterministic target replay and source scientific equations are exercised by the frozen scripts and focused tests, not inferred from screenshots.

Every original and target was run in the real shared T3 Chromium browser. The coordinator inspected actual setup/progress images and readback; target desktop1440×1100 and mobile390×844 CSS pixels were inspected in light/dark. PNG dimensions may be downsampled desktop1280wide or device-scale mobile780wide; viewport metadata is authoritative. Canvas getImageData before capture is the documented raster workaround; theme changes settle across two animation frames. Two partial dark rasters (Dining/Factory) were replaced by explicit seed1 replays and forced1441→1440resize; their recapture JSONs preserve the corrected basis. No source-only browser approval or cross-RNG trajectory identity is claimed.

## Paired screenshot evidence

| State | NetLogo Web original | City Library target |
| --- | --- | --- |
| Setup | ![Original setup](evidence/particle-swarm-optimization-original-setup.png) | ![Target setup](evidence/particle-swarm-optimization-target-setup-desktop-light.png) |
| Progress | ![Original progress](evidence/particle-swarm-optimization-original-progress.png) | ![Target progress](evidence/particle-swarm-optimization-target-progress-desktop-light.png) |

Target [desktop dark](evidence/particle-swarm-optimization-target-desktop-dark.png), [mobile light](evidence/particle-swarm-optimization-target-mobile-light.png), [mobile dark](evidence/particle-swarm-optimization-target-mobile-dark.png). Those later captures may include explicitly recorded live actions/reset-centroid/trial scenarios, rather than pretending to be the same scientific tick as the paired default-progress frame. Full finite bar/scatter pair labels and model/canonical state readbacks were inspected; charts are not statistical validation.

## Adaptations, diagnostics and remaining approval

Highlight is a canonical optimum marker instead of native watch camera perspective. Shared segment rendering connects recorded wrapped endpoints directly, so a boundary-crossing trace may span the canvas instead of using native split pen strokes; movement/state is correct and this is a visualization adaptation. Particle colors are unified instead of consuming source rendering color draws. Hard/torus geometry and normal draws use public library functions. Histories2001/trails20000caps are explicit; no scientific distribution-equivalence study is claimed.

Recorded original codeRuntimeErrors/codeCompilerErrors are empty in these default runs. No target application error or failed request was observed; some Chromium captures logged the expected Canvas2D willReadFrequently performance warning after getImageData. The retained target diagnostics include the tab's cumulative console entries and should not be mistaken for per-model unique errors. All target stages reported no horizontal document overflow. Source-derived potential errors and deliberately injected headless failures are distinguished from executed browser failures above.

[Final slice checks](evidence/final-slice-checks.log): all four TypeScript projects,35focused tests/6679assertions, all five frozen examples and their unchanged SHA-256 checks passed after final fixes. [Full author check](evidence/author-checks.log) passed336tests/22613assertions,120registered existing scripts,build and packed consumer before the late native-control/UI-only fixes; the final affected checks were repeated. Parent owns global registration and the newer integrated-core regression. No unexecuted new-package/lint check is claimed.

Scientific framing and exactly three verified publications are reused from the existing [research dossier](../../research/netlogo-web/particle-swarm-optimization.md), with its original access/metadata limitations. No duplicate literature task or new scientific validation was performed. Required independent Argon/high approval remains pending; author fixes and coordinator boundary decisions are not independent approval.
