# Simple Genetic Algorithm — executed B18 author acceptance

Selected identity: `Sample Models/Computer Science/Simple Genetic Algorithm`. Mechanism: **Tournament search and binary diversity**. Source audit, implementation, headless verification and original/target browser comparison are evidenced here; independent approval remains **pending** (known quota-blocked Argon/high task8194e842, no retry/substitution). This is not final scientific or independent acceptance.

## Identity, versions and public composition

Exact [served source](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Computer%20Science/Simple%20Genetic%20Algorithm.nlogox), archived as [source.nlogox](../../../experiments/simple-genetic-algorithm/source.nlogox), [attribution/license](../../../experiments/simple-genetic-algorithm/NOTICE.md): CC BY-NC-SA 3.0. Source SHA-256 `aa1d94df44a71c7cbe8b02d11a0ac1e027fa19294a0726c1a03913786175c67e`; 51976bytes. Galapagos `90be931773fcf499049247a8aaa1aecbe003654c` matches served bytes; Desktop membership is not used as identity. All Procedures/Widgets/Info/notices were audited; [complete procedure/widget inventory](simple-genetic-algorithm-source.md) and [source contract](../selected-computing-contract.md) retain equations/defaults/topology/order/actions/reporters and source faults.

Target public headless entry: `experiments/simple-genetic-algorithm/model.ts`, `create(options?)`, `advance(count?)`, `read()` plus documented model actions. It composes real public City Library objects/functions; UI imports domain actions and detached snapshots. No transpiled NetLogo, substitute engine, new private generic library or shared core API was introduced.

- Model source SHA-256: `12e4276fc6c7d90bf1ab65d122845b56125e3bc75eaa29c418530daae7be0dc7`.
- Thin UI SHA-256: `856a94c8afe5de2acac09900006e9964e9d3755e582bc7d642cace326363c5ad`.
- Actual browser-loaded model chunk: `http://localhost:3188/chunks/ui-jrjm0cr1.js`, SHA-256 `09d31258f6958dd2f341ca33c2ef362e5b085b768e3a12aef35463f00b9fad1f`, 8705bytes, compiled source marker `experiments/simple-genetic-algorithm/model.ts` checked.

Reference XML declares NetLogo7.0.4; hosted Web engine2.16.1(90be9317) was read from native netlogo-version/modelConfig.version in the final K-Means session. Browser Chromium156.0.0.0; target Bun1.4.2/TypeScript7.0.2/Node26.8.2. [Environment](evidence/environment.json) records the observation basis and exact two-file parent5bc6b16 renderer hashes. Reference RNG is not equated to target Mulberry32 seed1. Content-addressed model-chunk URLs were read back and SHA-256 checked; app.js is a mutable dev-server entry and its refetched hash is supplemental, not a source identity assertion.

## Native setup and measured progress

Native controls at Setup (complete widget code/ranges/defaults in audit):

| Measurement | Observed value |
| --- | --- |
| population-size | `100` |
| mutation-rate | `0` |
| plot-diversity? | `true` |
| crossover-rate | `70` |

Original setup tick0 and progressed tick242:

| Measurement | Observed value |
| --- | --- |
| count turtles | `100` |
| max [fitness] of turtles | `81` |
| mean [fitness] of turtles | `81` |
| diversity | `0` |

Target setup and pending/live inputs:

| Measurement | Observed value |
| --- | --- |
| width | `"100"` |
| seed | `"1"` |
|  | `"5"` |
| live-populationSize | `"100"` |
| live-crossoverRate | `"70"` |
| live-mutationRate | `"0"` |
| live-plotDiversity | `true` |

Target progressed monitor values:

| Measurement | Observed value |
| --- | --- |
| Generation | `"132"` |
| Best fitness | `"84"` |
| Mean fitness | `"84.000"` |
| Worst fitness | `"84"` |
| Diversity | `"0.00000"` |

Population100 starts with100-bit genomes. Each generation snapshots old individuals, tournament-selects three distinct candidates per parent, produces paired one-point crossovers at floor(population×crossoverPercent/200), clones the remainder, removes parents, then mutates and recomputes fitness. No elitism is added. ALL-ONES is a preflight no-tick stop. Both zero-mutation browser runs lost diversity and plateaued (source best81 at242; target best84 at132); target live mutation1% restored diversity0.04071 on the following generation133.

## Executed controls and boundary checks

Original performed actions: setup, step, go start, go pause, setup reset. Setup after the run reset tick to0. [Original raw readbacks](evidence/simple-genetic-algorithm-original.json) pin settings, source SHA, actual ticks, reporters and code errors. [Supplementary original parameter/actions](evidence/original-parameter-actions.json) retain additional native switch/chooser/limit/reset tests; PageRank method switch is in its primary record. K-Means additionally has [single native go](evidence/k-means-single-command.json). Models without a native single-step button use Command Center go (Robby/Factory/Annealing) or their native split assignment/update actions plus single go (K-Means); no nonexistent native Reset/Step button is claimed. Source Setup is the reset operation.

Target performed actions: Setup, 1 step, Run, Pause, 100 steps × 1, Mutation rate1percent live, 1 step, Setup resets model. [Target raw readbacks](evidence/simple-genetic-algorithm-target.json) retain Setup, single step, progressed state, live actions and Setup-reset values, all four viewport/theme combinations, actual chunk digests and diagnostics. Completion disables target step/play controls for K-Means and PSO; other models retain their audited terminal rules. Atomic invalid inputs, no-tick actions, observation purity, deterministic target replay and source scientific equations are exercised by the frozen scripts and focused tests, not inferred from screenshots.

Every original and target was run in the real shared T3 Chromium browser. The coordinator inspected actual setup/progress images and readback; target desktop1440×1100 and mobile390×844 CSS pixels were inspected in light/dark. PNG dimensions may be downsampled desktop1280wide or device-scale mobile780wide; viewport metadata is authoritative. Canvas getImageData before capture is the documented raster workaround; theme changes settle across two animation frames. Two partial dark rasters (Dining/Factory) were replaced by explicit seed1 replays and forced1441→1440resize; their recapture JSONs preserve the corrected basis. No source-only browser approval or cross-RNG trajectory identity is claimed.

## Paired screenshot evidence

| State | NetLogo Web original | City Library target |
| --- | --- | --- |
| Setup | ![Original setup](evidence/simple-genetic-algorithm-original-setup.png) | ![Target setup](evidence/simple-genetic-algorithm-target-setup-desktop-light.png) |
| Progress | ![Original progress](evidence/simple-genetic-algorithm-original-progress.png) | ![Target progress](evidence/simple-genetic-algorithm-target-progress-desktop-light.png) |

Target [desktop dark](evidence/simple-genetic-algorithm-target-desktop-dark.png), [mobile light](evidence/simple-genetic-algorithm-target-mobile-light.png), [mobile dark](evidence/simple-genetic-algorithm-target-mobile-dark.png). Those later captures may include explicitly recorded live actions/reset-centroid/trial scenarios, rather than pretending to be the same scientific tick as the paired default-progress frame. Full finite bar/scatter pair labels and model/canonical state readbacks were inspected; charts are not statistical validation.

## Adaptations, diagnostics and remaining approval

The root explicitly accepted the public model hammingDistance as a bounded binary-genotype scientific equation, not a private generic sequence library. Five scientific values plus empty/unequal/sparse/nonbinary/nonfinite rejection are supplementary tests; frozen scripts are unchanged. Width is a setup extension with native100default. Source fractional Hamming distances and floor(N²/4) normalization are preserved. History is bounded1001samples; target logical IDs and rendering draws differ.

Recorded original codeRuntimeErrors/codeCompilerErrors are empty in these default runs. No target application error or failed request was observed; some Chromium captures logged the expected Canvas2D willReadFrequently performance warning after getImageData. The retained target diagnostics include the tab's cumulative console entries and should not be mistaken for per-model unique errors. All target stages reported no horizontal document overflow. Source-derived potential errors and deliberately injected headless failures are distinguished from executed browser failures above.

[Final slice checks](evidence/final-slice-checks.log): all four TypeScript projects,35focused tests/6679assertions, all five frozen examples and their unchanged SHA-256 checks passed after final fixes. [Full author check](evidence/author-checks.log) passed336tests/22613assertions,120registered existing scripts,build and packed consumer before the late native-control/UI-only fixes; the final affected checks were repeated. Parent owns global registration and the newer integrated-core regression. No unexecuted new-package/lint check is claimed.

Scientific framing and exactly three verified publications are reused from the existing [research dossier](../../research/netlogo-web/simple-genetic-algorithm.md), with its original access/metadata limitations. No duplicate literature task or new scientific validation was performed. Required independent Argon/high approval remains pending; author fixes and coordinator boundary decisions are not independent approval.
