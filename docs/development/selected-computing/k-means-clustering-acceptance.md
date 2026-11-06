# K-Means Clustering — executed B18 author acceptance

Selected identity: `Sample Models/Computer Science/K-Means Clustering`. Mechanism: **Lloyd assignment with native tolerance**. Source audit, implementation, headless verification and original/target browser comparison are evidenced here; independent approval remains **pending** (known quota-blocked Argon/high task8194e842, no retry/substitution). This is not final scientific or independent acceptance.

## Identity, versions and public composition

Exact [served source](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Computer%20Science/K-Means%20Clustering.nlogox), archived as [source.nlogox](../../../experiments/k-means-clustering/source.nlogox), [attribution/license](../../../experiments/k-means-clustering/NOTICE.md): CC BY-NC-SA 3.0. Source SHA-256 `fdffc0ac8c8d8b25286039bb9ec53648bb7c12d8829600e5d56185980ba572c6`; 50238bytes. Galapagos `90be931773fcf499049247a8aaa1aecbe003654c` matches served bytes; Desktop membership is not used as identity. All Procedures/Widgets/Info/notices were audited; [complete procedure/widget inventory](k-means-clustering-source.md) and [source contract](../selected-computing-contract.md) retain equations/defaults/topology/order/actions/reporters and source faults.

Target public headless entry: `experiments/k-means-clustering/model.ts`, `create(options?)`, `advance(count?)`, `read()` plus documented model actions. It composes real public City Library objects/functions; UI imports domain actions and detached snapshots. No transpiled NetLogo, substitute engine, new private generic library or shared core API was introduced.

- Model source SHA-256: `1425e5e34fdf18c4ae23e6f9fedee8b7b8937014c6ebd271c3b4f2fd6af908ef`.
- Thin UI SHA-256: `af0110dcf6425a67af1fab69182a7c8958400f7b0387c9ab19d1fdf475b27190`.
- Actual browser-loaded model chunk: `http://localhost:3188/chunks/ui-9ce08ahm.js`, SHA-256 `cf1a6e404dcef96324ec23f7410383db0f69a1efcea3fe90c668437752043722`, 9227bytes, compiled source marker `experiments/k-means-clustering/model.ts` checked.

Reference XML declares NetLogo7.0.4; hosted Web engine2.16.1(90be9317) was read from native netlogo-version/modelConfig.version in the final K-Means session. Browser Chromium156.0.0.0; target Bun1.4.2/TypeScript7.0.2/Node26.8.2. [Environment](evidence/environment.json) records the observation basis and exact two-file parent5bc6b16 renderer hashes. Reference RNG is not equated to target Mulberry32 seed1. Content-addressed model-chunk URLs were read back and SHA-256 checked; app.js is a mutable dev-server entry and its refetched hash is supplemental, not a source identity assertion.

## Native setup and measured progress

Native controls at Setup (complete widget code/ranges/defaults in audit):

| Measurement | Observed value |
| --- | --- |
| num-centroids | `7` |
| num-clusters | `7` |
| num-data-points | `138` |

Original setup tick0 and progressed tick6:

| Measurement | Observed value |
| --- | --- |
| count data-points | `140` |
| count centroids | `7` |
| any-centroids-moved? | `false` |
| mean [square-deviation] of centroids | `1279.1863770210039` |

Target setup and pending/live inputs:

| Measurement | Observed value |
| --- | --- |
| seed | `"1"` |
| numDataPoints | `"138"` |
|  | `"5"` |
| live-numClusters | `"7"` |
| live-numCentroids | `"7"` |

Target progressed monitor values:

| Measurement | Observed value |
| --- | --- |
| Tick | `"4"` |
| Points | `"140"` |
| Mean centroid SSE | `"577.064"` |

Native138requested points across7clusters round EACH cluster to20, giving140points in both browsers. Centroids independently sample data (duplicates allowed). Assign points and Update centroids are non-ticking source actions; go clears moved, assigns before moving, retains empty centroids and uses strict movement>.1for continuation while still moving smaller distances. Source stopped at6; target at4 with mean centroid SSE577.064. Source monitor called Total is actually mean centroid SSE. Target live plot multiplier changed7→5 without changing140points/tick4; Reset centroids preserved data and reset tick before reconverging at9.

## Executed controls and boundary checks

Original performed actions: Assign Points, Update Centroids, Find Clusters (go), Find Clusters (go) pause after convergence, Reset centroids. Setup after the run reset tick to0. [Original raw readbacks](evidence/k-means-clustering-original.json) pin settings, source SHA, actual ticks, reporters and code errors. [Supplementary original parameter/actions](evidence/original-parameter-actions.json) retain additional native switch/chooser/limit/reset tests; PageRank method switch is in its primary record. K-Means additionally has [single native go](evidence/k-means-single-command.json). Models without a native single-step button use Command Center go (Robby/Factory/Annealing) or their native split assignment/update actions plus single go (K-Means); no nonexistent native Reset/Step button is claimed. Source Setup is the reset operation.

Target performed actions: Setup, 1 step, Run, Pause, 100 steps × 1, Generated clusters / plot multiplier5 live, Assign points, Update centroids, Reset centroids, Setup resets model. [Target raw readbacks](evidence/k-means-clustering-target.json) retain Setup, single step, progressed state, live actions and Setup-reset values, all four viewport/theme combinations, actual chunk digests and diagnostics. Completion disables target step/play controls for K-Means and PSO; other models retain their audited terminal rules. Atomic invalid inputs, no-tick actions, observation purity, deterministic target replay and source scientific equations are exercised by the frozen scripts and focused tests, not inferred from screenshots.

Every original and target was run in the real shared T3 Chromium browser. The coordinator inspected actual setup/progress images and readback; target desktop1440×1100 and mobile390×844 CSS pixels were inspected in light/dark. PNG dimensions may be downsampled desktop1280wide or device-scale mobile780wide; viewport metadata is authoritative. Canvas getImageData before capture is the documented raster workaround; theme changes settle across two animation frames. Two partial dark rasters (Dining/Factory) were replaced by explicit seed1 replays and forced1441→1440resize; their recapture JSONs preserve the corrected basis. No source-only browser approval or cross-RNG trajectory identity is claimed.

## Paired screenshot evidence

| State | NetLogo Web original | City Library target |
| --- | --- | --- |
| Setup | ![Original setup](evidence/k-means-clustering-original-setup.png) | ![Target setup](evidence/k-means-clustering-target-setup-desktop-light.png) |
| Progress | ![Original progress](evidence/k-means-clustering-original-progress.png) | ![Target progress](evidence/k-means-clustering-target-progress-desktop-light.png) |

Target [desktop dark](evidence/k-means-clustering-target-desktop-dark.png), [mobile light](evidence/k-means-clustering-target-mobile-light.png), [mobile dark](evidence/k-means-clustering-target-mobile-dark.png). Those later captures may include explicitly recorded live actions/reset-centroid/trial scenarios, rather than pretending to be the same scientific tick as the paired default-progress frame. Full finite bar/scatter pair labels and model/canonical state readbacks were inspected; charts are not statistical validation.

## Adaptations, diagnostics and remaining approval

The target caches stochastic tie-based SSE at actions so read remains RNG-neutral; native monitor/plot reads can themselves draw ties. Plot samples retain the native update-before-tick/extra-tick behavior and the live numClusters multiplier. The UI correction exposes this dual setup-generation/live-plot parameter as one live control; new Setup uses it for generation. Shared triangles replace native centroid crosses. Hard-boundary cluster excursion errors are explicit; no clipping/empty-cluster repair/k-means++ is added. History2001samples is bounded.

Recorded original codeRuntimeErrors/codeCompilerErrors are empty in these default runs. No target application error or failed request was observed; some Chromium captures logged the expected Canvas2D willReadFrequently performance warning after getImageData. The retained target diagnostics include the tab's cumulative console entries and should not be mistaken for per-model unique errors. All target stages reported no horizontal document overflow. Source-derived potential errors and deliberately injected headless failures are distinguished from executed browser failures above.

[Final slice checks](evidence/final-slice-checks.log): all four TypeScript projects,35focused tests/6679assertions, all five frozen examples and their unchanged SHA-256 checks passed after final fixes. [Full author check](evidence/author-checks.log) passed336tests/22613assertions,120registered existing scripts,build and packed consumer before the late native-control/UI-only fixes; the final affected checks were repeated. Parent owns global registration and the newer integrated-core regression. No unexecuted new-package/lint check is claimed.

Scientific framing and exactly three verified publications are reused from the existing [research dossier](../../research/netlogo-web/k-means-clustering.md), with its original access/metadata limitations. No duplicate literature task or new scientific validation was performed. Required independent Argon/high approval remains pending; author fixes and coordinator boundary decisions are not independent approval.
