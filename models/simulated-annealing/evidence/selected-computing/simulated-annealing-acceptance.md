# Simulated Annealing — executed B18 author acceptance

Selected identity: `Sample Models/Computer Science/Unverified/Simulated Annealing`. Mechanism: **Anisotropic swaps with temperature-only acceptance**. Source audit, implementation, headless verification and original/target browser comparison are evidenced here; independent approval remains **pending** (known quota-blocked Argon/high task8194e842, no retry/substitution). This is not final scientific or independent acceptance.

## Identity, versions and public composition

Exact [served source](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Computer%20Science/Unverified/Simulated%20Annealing.nlogox), archived as [source.nlogox](https://github.com/dweigend/city-library/blob/23693e90e199512faf68a04c9a2198b9eb50463b/experiments/simulated-annealing/source.nlogox), [attribution/license](https://github.com/dweigend/city-library/blob/23693e90e199512faf68a04c9a2198b9eb50463b/experiments/simulated-annealing/NOTICE.md): CC BY-NC-SA 3.0. Source SHA-256 `ca4208f3c66a516874234d4f1670ebc20919f9b32a656a84a878a9a41304f6cb`; 43947bytes. Galapagos `90be931773fcf499049247a8aaa1aecbe003654c` matches served bytes; Desktop membership is not used as identity. All Procedures/Widgets/Info/notices were audited; [complete procedure/widget inventory](simulated-annealing-source.md) and [source contract](https://github.com/dweigend/city-library/blob/23693e90e199512faf68a04c9a2198b9eb50463b/docs/development/selected-computing-contract.md) retain equations/defaults/topology/order/actions/reporters and source faults.

Target public headless entry: `experiments/simulated-annealing/model.ts`, `create(options?)`, `advance(count?)`, `read()` plus documented model actions. It composes real public City Library objects/functions; UI imports domain actions and detached snapshots. No transpiled NetLogo, substitute engine, new private generic library or shared core API was introduced.

- Model source SHA-256: `215547ccdf64729ea10ad6c65c206e4cae3ab9c57dc594a736c22ea2b259c4c1`.
- Thin UI SHA-256: `e4b902697d3057f4e507f7198961eef5aec2fa21577de1b57a1f861dcb6196c0`.
- Actual browser-loaded model chunk: `http://localhost:3188/chunks/ui-wts9w3eg.js`, SHA-256 `a304e961d6fecdbe190e25678723da02e0acbe22447c5e4942da86b22291fc1a`, 7839bytes, compiled source marker `experiments/simulated-annealing/model.ts` checked.

Reference XML declares NetLogo7.0.4; hosted Web engine2.16.1(90be9317) was read from native netlogo-version/modelConfig.version in the final K-Means session. Browser Chromium156.0.0.0; target Bun1.4.2/TypeScript7.0.2/Node26.8.2. [Environment](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/environment.json) records the observation basis and exact two-file parent5bc6b16 renderer hashes. Reference RNG is not equated to target Mulberry32 seed1. Content-addressed model-chunk URLs were read back and SHA-256 checked; app.js is a mutable dev-server entry and its refetched hash is supplemental, not a source identity assertion.

## Native setup and measured progress

Native controls at Setup (complete widget code/ranges/defaults in audit):

| Measurement | Observed value |
| --- | --- |
| cooling-rate | `1` |
| swap-radius | `1` |
| accept-equal-changes? | `false` |

Original setup tick0 and progressed tick671:

| Measurement | Observed value |
| --- | --- |
| temperature | `0.0011781906582980285` |
| global-energy | `464` |
| sum [brightness] of patches | `450` |

Target setup and pending/live inputs:

| Measurement | Observed value |
| --- | --- |
| width | `"30"` |
| height | `"30"` |
| seed | `"1"` |
|  | `"5"` |
| live-coolingRate | `"1"` |
| live-swapRadius | `"1"` |
| live-acceptEqualChanges | `false` |

Target progressed monitor values:

| Measurement | Observed value |
| --- | --- |
| Tick | `"672"` |
| Temperature | `"0.00116641"` |
| Global energy | `"356"` |
| Accepted / attempted | `"53077 / 672000"` |

The30² torus starts with450bright patches. Every tick makes exactly1000sequential proposals; inclusive-radius candidate sets include self and equal-brightness choices are no-ops. Energy penalizes vertical disagreement and horizontal agreement, double-counting undirected neighbors. Worsening acceptance is uniform<TEMPERATURE, not exp(−delta/T). Rejected swaps restore both values; cooling happens once after proposals. Source at671 hadT0.0011781906583/E464; target observed672 after one extra Run cycle, T0.00116641/E356 with672000attempts. These values obey their respective .99^tick cooling; they are not matching stochastic outcomes.

## Executed controls and boundary checks

Original performed actions: setup, go start, go pause, setup reset. Setup after the run reset tick to0. [Original raw readbacks](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/simulated-annealing-original.json) pin settings, source SHA, actual ticks, reporters and code errors. [Supplementary original parameter/actions](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/original-parameter-actions.json) retain additional native switch/chooser/limit/reset tests; PageRank method switch is in its primary record. K-Means additionally has [single native go](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/k-means-single-command.json). Models without a native single-step button use Command Center go (Robby/Factory/Annealing) or their native split assignment/update actions plus single go (K-Means); no nonexistent native Reset/Step button is claimed. Source Setup is the reset operation.

Target performed actions: Setup, 1 step, Run, Pause, 100 steps × 1, 569 additional cycles; observed672 after one extra Run cycle before Pause, Accept equal changes on live, Setup resets model. [Target raw readbacks](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/simulated-annealing-target.json) retain Setup, single step, progressed state, live actions and Setup-reset values, all four viewport/theme combinations, actual chunk digests and diagnostics. Completion disables target step/play controls for K-Means and PSO; other models retain their audited terminal rules. Atomic invalid inputs, no-tick actions, observation purity, deterministic target replay and source scientific equations are exercised by the frozen scripts and focused tests, not inferred from screenshots.

Every original and target was run in the real shared T3 Chromium browser. The coordinator inspected actual setup/progress images and readback; target desktop1440×1100 and mobile390×844 CSS pixels were inspected in light/dark. PNG dimensions may be downsampled desktop1280wide or device-scale mobile780wide; viewport metadata is authoritative. Canvas getImageData before capture is the documented raster workaround; theme changes settle across two animation frames. Two partial dark rasters (Dining/Factory) were replaced by explicit seed1 replays and forced1441→1440resize; their recapture JSONs preserve the corrected basis. No source-only browser approval or cross-RNG trajectory identity is claimed.

## Paired screenshot evidence

| State | NetLogo Web original | City Library target |
| --- | --- | --- |
| Setup | ![Original setup](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/simulated-annealing-original-setup.png) | ![Target setup](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/simulated-annealing-target-setup-desktop-light.png) |
| Progress | ![Original progress](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/simulated-annealing-original-progress.png) | ![Target progress](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/simulated-annealing-target-progress-desktop-light.png) |

Target [desktop dark](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/simulated-annealing-target-desktop-dark.png), [mobile light](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/simulated-annealing-target-mobile-light.png), [mobile dark](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/simulated-annealing-target-mobile-dark.png). Those later captures may include explicitly recorded live actions/reset-centroid/trial scenarios, rather than pretending to be the same scientific tick as the paired default-progress frame. Full finite bar/scatter pair labels and model/canonical state readbacks were inspected; charts are not statistical validation.

## Adaptations, diagnostics and remaining approval

Width/height/seed are explicit setup extensions with native30/30defaults; half initialization requires an even cell count. There is no artificial temperature stop. Source equal-change switch and target switch were exercised live without a tick. Public energyAt/attemptSwap use the same transition as advance and permit exact frozen rollback/temperature tests. History is bounded2001samples; binary cell palette represents the native brightness states.

Recorded original codeRuntimeErrors/codeCompilerErrors are empty in these default runs. No target application error or failed request was observed; some Chromium captures logged the expected Canvas2D willReadFrequently performance warning after getImageData. The retained target diagnostics include the tab's cumulative console entries and should not be mistaken for per-model unique errors. All target stages reported no horizontal document overflow. Source-derived potential errors and deliberately injected headless failures are distinguished from executed browser failures above.

[Final slice checks](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/final-slice-checks.log): all four TypeScript projects,35focused tests/6679assertions, all five frozen examples and their unchanged SHA-256 checks passed after final fixes. [Full author check](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/author-checks.log) passed336tests/22613assertions,120registered existing scripts,build and packed consumer before the late native-control/UI-only fixes; the final affected checks were repeated. Parent owns global registration and the newer integrated-core regression. No unexecuted new-package/lint check is claimed.

Scientific framing and exactly three verified publications are reused from the existing [research dossier](https://github.com/dweigend/city-library/blob/23693e90e199512faf68a04c9a2198b9eb50463b/docs/research/netlogo-web/simulated-annealing.md), with its original access/metadata limitations. No duplicate literature task or new scientific validation was performed. Required independent Argon/high approval remains pending; author fixes and coordinator boundary decisions are not independent approval.
