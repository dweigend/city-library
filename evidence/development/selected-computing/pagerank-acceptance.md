# PageRank — executed B18 author acceptance

Selected identity: `Sample Models/Computer Science/PageRank`. Mechanism: **Diffusion and cumulative random surfers**. Source audit, implementation, headless verification and original/target browser comparison are evidenced here; independent approval remains **pending** (known quota-blocked Argon/high task8194e842, no retry/substitution). This is not final scientific or independent acceptance.

## Identity, versions and public composition

Exact [served source](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Computer%20Science/PageRank.nlogox), archived as [source.nlogox](../../../experiments/pagerank/source.nlogox), [attribution/license](../../../experiments/pagerank/NOTICE.md): CC BY-NC-SA 3.0. Source SHA-256 `6a4ec440d110460a3af4bbca59212bf14dc0db11378eeee1691d910a5d362703`; 57655bytes. Galapagos `90be931773fcf499049247a8aaa1aecbe003654c` matches served bytes; Desktop membership is not used as identity. All Procedures/Widgets/Info/notices were audited; [complete procedure/widget inventory](pagerank-source.md) and [source contract](../../../docs/development/selected-computing-contract.md) retain equations/defaults/topology/order/actions/reporters and source faults.

Target public headless entry: `experiments/pagerank/model.ts`, `create(options?)`, `advance(count?)`, `read()` plus documented model actions. It composes real public City Library objects/functions; UI imports domain actions and detached snapshots. No transpiled NetLogo, substitute engine, new private generic library or shared core API was introduced.

- Model source SHA-256: `68f9b99be159c862c21efb46136f75faed9933a80ad76f981e6ad7834476ecdd`.
- Thin UI SHA-256: `1a0247a88875204635afe091b710e1872519afbb3b9c38f484cc337ad6148b82`.
- Actual browser-loaded model chunk: `http://localhost:3188/chunks/ui-rysd2tvg.js`, SHA-256 `26622db0caf03741d26f2ab30fd933dd8eb281d80f51bbd278c42259004af997`, 11913bytes, compiled source marker `experiments/pagerank/model.ts` checked.

Reference XML declares NetLogo7.0.4; hosted Web engine2.16.1(90be9317) was read from native netlogo-version/modelConfig.version in the final K-Means session. Browser Chromium156.0.0.0; target Bun1.4.2/TypeScript7.0.2/Node26.8.2. [Environment](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/environment.json) records the observation basis and exact two-file parent5bc6b16 renderer hashes. Reference RNG is not equated to target Mulberry32 seed1. Content-addressed model-chunk URLs were read back and SHA-256 checked; app.js is a mutable dev-server entry and its refetched hash is supplemental, not a source identity assertion.

## Native setup and measured progress

Native controls at Setup (complete widget code/ranges/defaults in audit):

| Measurement | Observed value |
| --- | --- |
| damping-factor | `0.85` |
| calculation-method | `"random-surfer"` |
| watch-surfers? | `true` |
| number-of-surfers | `5` |
| network-choice | `"Example 1"` |
| show-page-ranks? | `true` |

Original setup tick0 and progressed tick212:

| Measurement | Observed value |
| --- | --- |
| count pages | `11` |
| count links | `17` |
| total-rank | `1` |
| max-rank | `0.3594339622641509` |
| sum [visits] of pages | `1060` |
| count surfers | `5` |

Target setup and pending/live inputs:

| Measurement | Observed value |
| --- | --- |
| networkChoice | `"Example 1"` |
| seed | `"1"` |
|  | `"5"` |
| live-calculationMethod | `"random-surfer"` |
| live-dampingFactor | `"0.85"` |
| live-numberOfSurfers | `"5"` |
| live-watchSurfers | `true` |
| live-showPageRanks | `true` |

Target progressed monitor values:

| Measurement | Observed value |
| --- | --- |
| Tick | `"102"` |
| Total rank | `"1.000000"` |
| Maximum rank | `"0.398039"` |
| Surfers | `"5"` |

Example1creates the exact11pages/17directed edges; Example2has7pages/18edges; preferential attachment creates100pages/196edges. Diffusion stages old ranks, redistributes dangling rank to ALL pages, then applies damping. Random surfers increment visits on the OLD page before following/teleporting; resizing the live population preserves cumulative visits. The original at212 had1060visits/5surfers and total rank1; switching to diffusion removed surfers while retaining visits. The target at102 had5surfers/rank1; its diffusion step103 similarly removed surfers and retained visits.

## Executed controls and boundary checks

Original performed actions: setup, step, go start, go pause, calculation-method select diffusion, step, setup reset. Setup after the run reset tick to0. [Original raw readbacks](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/pagerank-original.json) pin settings, source SHA, actual ticks, reporters and code errors. [Supplementary original parameter/actions](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/original-parameter-actions.json) retain additional native switch/chooser/limit/reset tests; PageRank method switch is in its primary record. K-Means additionally has [single native go](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/k-means-single-command.json). Models without a native single-step button use Command Center go (Robby/Factory/Annealing) or their native split assignment/update actions plus single go (K-Means); no nonexistent native Reset/Step button is claimed. Source Setup is the reset operation.

Target performed actions: Setup, 1 step, Run, Pause, 100 steps × 1, Calculation method diffusion, 1 step, Setup resets model. [Target raw readbacks](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/pagerank-target.json) retain Setup, single step, progressed state, live actions and Setup-reset values, all four viewport/theme combinations, actual chunk digests and diagnostics. Completion disables target step/play controls for K-Means and PSO; other models retain their audited terminal rules. Atomic invalid inputs, no-tick actions, observation purity, deterministic target replay and source scientific equations are exercised by the frozen scripts and focused tests, not inferred from screenshots.

Every original and target was run in the real shared T3 Chromium browser. The coordinator inspected actual setup/progress images and readback; target desktop1440×1100 and mobile390×844 CSS pixels were inspected in light/dark. PNG dimensions may be downsampled desktop1280wide or device-scale mobile780wide; viewport metadata is authoritative. Canvas getImageData before capture is the documented raster workaround; theme changes settle across two animation frames. Two partial dark rasters (Dining/Factory) were replaced by explicit seed1 replays and forced1441→1440resize; their recapture JSONs preserve the corrected basis. No source-only browser approval or cross-RNG trajectory identity is claimed.

## Paired screenshot evidence

| State | NetLogo Web original | City Library target |
| --- | --- | --- |
| Setup | ![Original setup](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/pagerank-original-setup.png) | ![Target setup](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/pagerank-target-setup-desktop-light.png) |
| Progress | ![Original progress](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/pagerank-original-progress.png) | ![Target progress](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/pagerank-target-progress-desktop-light.png) |

Target [desktop dark](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/pagerank-target-desktop-dark.png), [mobile light](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/pagerank-target-mobile-light.png), [mobile dark](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/pagerank-target-mobile-dark.png). Those later captures may include explicitly recorded live actions/reset-centroid/trial scenarios, rather than pretending to be the same scientific tick as the paired default-progress frame. Full finite bar/scatter pair labels and model/canonical state readbacks were inspected; charts are not statistical validation.

## Adaptations, diagnostics and remaining approval

The graph layout is presentation-owned rather than the native300layout-spring iterations; canonical graph topology/ranks remain headless. Watch surfers uses traveled-edge colors, page counts and a table instead of independently moving surfer sprites. Page size follows rank share and ranks remain optionally labeled. No convergence stop is introduced. All network variants and dangling/synchronous barriers are tested; rendered trajectories are not seed-identical.

Recorded original codeRuntimeErrors/codeCompilerErrors are empty in these default runs. No target application error or failed request was observed; some Chromium captures logged the expected Canvas2D willReadFrequently performance warning after getImageData. The retained target diagnostics include the tab's cumulative console entries and should not be mistaken for per-model unique errors. All target stages reported no horizontal document overflow. Source-derived potential errors and deliberately injected headless failures are distinguished from executed browser failures above.

[Final slice checks](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/final-slice-checks.log): all four TypeScript projects,35focused tests/6679assertions, all five frozen examples and their unchanged SHA-256 checks passed after final fixes. [Full author check](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/author-checks.log) passed336tests/22613assertions,120registered existing scripts,build and packed consumer before the late native-control/UI-only fixes; the final affected checks were repeated. Parent owns global registration and the newer integrated-core regression. No unexecuted new-package/lint check is claimed.

Scientific framing and exactly three verified publications are reused from the existing [research dossier](../../../docs/research/netlogo-web/pagerank.md), with its original access/metadata limitations. No duplicate literature task or new scientific validation was performed. Required independent Argon/high approval remains pending; author fixes and coordinator boundary decisions are not independent approval.
