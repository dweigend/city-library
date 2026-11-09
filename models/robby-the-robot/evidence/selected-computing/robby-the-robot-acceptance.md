# Robby the Robot — executed B18 author acceptance

Selected identity: `Sample Models/Computer Science/Robby the Robot`. Mechanism: **Full genetic robot strategies**. Source audit, implementation, headless verification and original/target browser comparison are evidenced here; independent approval remains **pending** (known quota-blocked Argon/high task8194e842, no retry/substitution). This is not final scientific or independent acceptance.

## Identity, versions and public composition

Exact [served source](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Computer%20Science/Robby%20the%20Robot.nlogox), archived as [source.nlogox](https://github.com/dweigend/city-library/blob/23693e90e199512faf68a04c9a2198b9eb50463b/experiments/robby-the-robot/source.nlogox), [attribution/license](https://github.com/dweigend/city-library/blob/23693e90e199512faf68a04c9a2198b9eb50463b/experiments/robby-the-robot/NOTICE.md): CC0. Source SHA-256 `ecaa2ce7c1d195fe6383354fc790025aa5c9d239f25f99f0fed71e04eaaf8d19`; 65162bytes. Galapagos `90be931773fcf499049247a8aaa1aecbe003654c` matches served bytes; Desktop membership is not used as identity. All Procedures/Widgets/Info/notices were audited; [complete procedure/widget inventory](robby-the-robot-source.md) and [source contract](https://github.com/dweigend/city-library/blob/23693e90e199512faf68a04c9a2198b9eb50463b/docs/development/selected-computing-contract.md) retain equations/defaults/topology/order/actions/reporters and source faults.

Target public headless entry: `experiments/robby-the-robot/model.ts`, `create(options?)`, `advance(count?)`, `read()` plus documented model actions. It composes real public City Library objects/functions; UI imports domain actions and detached snapshots. No transpiled NetLogo, substitute engine, new private generic library or shared core API was introduced.

- Model source SHA-256: `6e3a1677da2bee8c8d79d10f494ced74c23e3ad7bfaaf2cbc0bc71b86607950e`.
- Thin UI SHA-256: `6f54dcd6dff82080090377613ff76af5d3b4aec2245c447a93b11b58c9fa4778`.
- Actual browser-loaded model chunk: `http://localhost:3188/chunks/ui-sv89acxh.js`, SHA-256 `5b64d6cfb72ea767f0cece5da6e8a028b959f29ab8d19a083a9777f0685304b7`, 15390bytes, compiled source marker `experiments/robby-the-robot/model.ts` checked.

Reference XML declares NetLogo7.0.4; hosted Web engine2.16.1(90be9317) was read from native netlogo-version/modelConfig.version in the final K-Means session. Browser Chromium156.0.0.0; target Bun1.4.2/TypeScript7.0.2/Node26.8.2. [Environment](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/environment.json) records the observation basis and exact two-file parent5bc6b16 renderer hashes. Reference RNG is not equated to target Mulberry32 seed1. Content-addressed model-chunk URLs were read back and SHA-256 checked; app.js is a mutable dev-server entry and its refetched hash is supplemental, not a source identity assertion.

## Native setup and measured progress

Native controls at Setup (complete widget code/ranges/defaults in audit):

| Measurement | Observed value |
| --- | --- |
| population-size | `100` |
| mutation-rate | `0.01` |
| number-of-generations | `100` |

Original setup tick0 and progressed tick19:

| Measurement | Observed value |
| --- | --- |
| count individuals | `100` |
| best-fitness | `15` |
| step-counter | `0` |
| count cans | `54` |

Target setup and pending/live inputs:

| Measurement | Observed value |
| --- | --- |
| seed | `"1"` |
|  | `"5"` |
| live-populationSize | `"100"` |
| live-mutationRate | `"0.01"` |
| live-numberOfGenerations | `"100"` |

Target progressed monitor values:

| Measurement | Observed value |
| --- | --- |
| Generation | `"42"` |
| Best fitness | `"13.00"` |
| Trial score | `"—"` |

The target evaluates every243-gene strategy in20 fresh10×10 can environments,100 actions each; tournament15, one-point crossover and per-gene mutation preserve the source mechanism. Can rewards+10, wall−5, empty pickup−1 and ternary N/E/S/W/here indexing are asserted. Best fitness is a per-generation mean, not a historical maximum. Source and target both evolved populations in the browser; target bounded playback stopped at43 after a live limit43, while the supplementary native run stopped at2 after limit2. Trial steps changed the robot without incrementing generations.

## Executed controls and boundary checks

Original performed actions: setup, go-forever start, go-forever pause, view Robby's Environment, step thru best strategy, view strategies, setup reset. Setup after the run reset tick to0. [Original raw readbacks](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/robby-the-robot-original.json) pin settings, source SHA, actual ticks, reporters and code errors. [Supplementary original parameter/actions](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/original-parameter-actions.json) retain additional native switch/chooser/limit/reset tests; PageRank method switch is in its primary record. K-Means additionally has [single native go](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/k-means-single-command.json). Models without a native single-step button use Command Center go (Robby/Factory/Annealing) or their native split assignment/update actions plus single go (K-Means); no nonexistent native Reset/Step button is claimed. Source Setup is the reset operation.

Target performed actions: Setup, 1 step, Run, Pause, 10 steps × 1, Generation limit43 live, Run to limit →43, View environment, Trial step non-generational, View strategies, Setup resets model. [Target raw readbacks](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/robby-the-robot-target.json) retain Setup, single step, progressed state, live actions and Setup-reset values, all four viewport/theme combinations, actual chunk digests and diagnostics. Completion disables target step/play controls for K-Means and PSO; other models retain their audited terminal rules. Atomic invalid inputs, no-tick actions, observation purity, deterministic target replay and source scientific equations are exercised by the frozen scripts and focused tests, not inferred from screenshots.

Every original and target was run in the real shared T3 Chromium browser. The coordinator inspected actual setup/progress images and readback; target desktop1440×1100 and mobile390×844 CSS pixels were inspected in light/dark. PNG dimensions may be downsampled desktop1280wide or device-scale mobile780wide; viewport metadata is authoritative. Canvas getImageData before capture is the documented raster workaround; theme changes settle across two animation frames. Two partial dark rasters (Dining/Factory) were replaced by explicit seed1 replays and forced1441→1440resize; their recapture JSONs preserve the corrected basis. No source-only browser approval or cross-RNG trajectory identity is claimed.

## Paired screenshot evidence

| State | NetLogo Web original | City Library target |
| --- | --- | --- |
| Setup | ![Original setup](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/robby-the-robot-original-setup.png) | ![Target setup](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/robby-the-robot-target-setup-desktop-light.png) |
| Progress | ![Original progress](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/robby-the-robot-original-progress.png) | ![Target progress](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/robby-the-robot-target-progress-desktop-light.png) |

Target [desktop dark](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/robby-the-robot-target-desktop-dark.png), [mobile light](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/robby-the-robot-target-mobile-light.png), [mobile dark](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/robby-the-robot-target-mobile-dark.png). Those later captures may include explicitly recorded live actions/reset-centroid/trial scenarios, rather than pretending to be the same scientific tick as the paired default-progress frame. Full finite bar/scatter pair labels and model/canonical state readbacks were inspected; charts are not statistical validation.

## Adaptations, diagnostics and remaining approval

Robby retains source pre-mutation allele counts and the273√2 display normalization despite243 genes. The target plots fitness versus allele distance rather than placing individuals in the bounded source world; it hides training-only cans until View environment and uses filled can cells/triangle robot rather than native sprites. Source display formulas can theoretically exceed its hard view bounds; the scatter avoids that potential visualization failure (source-derived, not triggered in the recorded default run). Output is bounded600lines, history2001samples and trails20000segments. Explicit setTrial fixtures intentionally allow trial tests at generation0; native View environment remains disabled there. Run to limit uses the existing repeated-action host and stops when the global generation limit is reached, avoiding an idle native forever-button loop.

Recorded original codeRuntimeErrors/codeCompilerErrors are empty in these default runs. No target application error or failed request was observed; some Chromium captures logged the expected Canvas2D willReadFrequently performance warning after getImageData. The retained target diagnostics include the tab's cumulative console entries and should not be mistaken for per-model unique errors. All target stages reported no horizontal document overflow. Source-derived potential errors and deliberately injected headless failures are distinguished from executed browser failures above.

[Final slice checks](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/final-slice-checks.log): all four TypeScript projects,35focused tests/6679assertions, all five frozen examples and their unchanged SHA-256 checks passed after final fixes. [Full author check](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/author-checks.log) passed336tests/22613assertions,120registered existing scripts,build and packed consumer before the late native-control/UI-only fixes; the final affected checks were repeated. Parent owns global registration and the newer integrated-core regression. No unexecuted new-package/lint check is claimed.

Scientific framing and exactly three verified publications are reused from the existing [research dossier](https://github.com/dweigend/city-library/blob/23693e90e199512faf68a04c9a2198b9eb50463b/docs/research/netlogo-web/robby-the-robot.md), with its original access/metadata limitations. No duplicate literature task or new scientific validation was performed. Required independent Argon/high approval remains pending; author fixes and coordinator boundary decisions are not independent approval.
