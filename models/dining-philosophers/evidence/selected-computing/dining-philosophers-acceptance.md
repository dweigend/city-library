# Dining Philosophers — executed B18 author acceptance

Selected identity: `Sample Models/Computer Science/Dining Philosophers`. Mechanism: **Asynchronous marked resource protocol**. Source audit, implementation, headless verification and original/target browser comparison are evidenced here; independent approval remains **pending** (known quota-blocked Argon/high task8194e842, no retry/substitution). This is not final scientific or independent acceptance.

## Identity, versions and public composition

Exact [served source](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Computer%20Science/Dining%20Philosophers.nlogox), archived as [source.nlogox](../../../experiments/dining-philosophers/source.nlogox), [attribution/license](../../../experiments/dining-philosophers/NOTICE.md): CC BY-NC-SA 3.0. Source SHA-256 `94a061a1c0c2d8e69a8e6f3dfd4a154222d44d6676693cdc3430fb7e76d47e51`; 52999bytes. Galapagos `90be931773fcf499049247a8aaa1aecbe003654c` matches served bytes; Desktop membership is not used as identity. All Procedures/Widgets/Info/notices were audited; [complete procedure/widget inventory](dining-philosophers-source.md) and [source contract](../../../docs/development/selected-computing-contract.md) retain equations/defaults/topology/order/actions/reporters and source faults.

Target public headless entry: `experiments/dining-philosophers/model.ts`, `create(options?)`, `advance(count?)`, `read()` plus documented model actions. It composes real public City Library objects/functions; UI imports domain actions and detached snapshots. No transpiled NetLogo, substitute engine, new private generic library or shared core API was introduced.

- Model source SHA-256: `6aec9e113eed5510c810fee120c3251f6440b8183a94d604c56aea76d32ccc1d`.
- Thin UI SHA-256: `93d1c3b8d451d62ad39453edb678c8f9522d1eb723a11cdfb8a8039f753ccd17`.
- Actual browser-loaded model chunk: `http://localhost:3188/chunks/ui-d67w32a7.js`, SHA-256 `055760be80f623b2f8f929fd07b1a2f9a1be271eec5ef9b8fae7cb16776c186f`, 9537bytes, compiled source marker `experiments/dining-philosophers/model.ts` checked.

Reference XML declares NetLogo7.0.4; hosted Web engine2.16.1(90be9317) was read from native netlogo-version/modelConfig.version in the final K-Means session. Browser Chromium156.0.0.0; target Bun1.4.2/TypeScript7.0.2/Node26.8.2. [Environment](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/environment.json) records the observation basis and exact two-file parent5bc6b16 renderer hashes. Reference RNG is not equated to target Mulberry32 seed1. Content-addressed model-chunk URLs were read back and SHA-256 checked; app.js is a mutable dev-server entry and its refetched hash is supplemental, not a source identity assertion.

## Native setup and measured progress

Native controls at Setup (complete widget code/ranges/defaults in audit):

| Measurement | Observed value |
| --- | --- |
| num-philosophers | `20` |
| hungry-chance | `0.5` |
| full-chance | `0.5` |
| cooperation? | `false` |

Original setup tick0 and progressed tick546:

| Measurement | Observed value |
| --- | --- |
| count philosophers | `20` |
| count forks | `20` |
| count philosophers with [state = "EATING"] | `2` |
| sum [total-eaten] of philosophers | `80` |

Target setup and pending/live inputs:

| Measurement | Observed value |
| --- | --- |
| numPhilosophers | `"20"` |
| seed | `"1"` |
|  | `"5"` |
| live-hungryChance | `"0.5"` |
| live-fullChance | `"0.5"` |
| live-cooperation | `false` |

Target progressed monitor values:

| Measurement | Observed value |
| --- | --- |
| Tick | `"102"` |
| Thinking | `"2"` |
| Hungry | `"15"` |
| Eating | `"3"` |

One random philosopher updates per tick. Acquiring both forks does not consume food until a later activation. Naive holding/deadlock and marked-fork cooperation, left-before-right acquisition and mark transfer on release are asserted. Browser Setup created20thinking actors and20forks; progressed counts remain a partition of20. The original reached546ticks with80eaten; target at102 had2thinking,15hungry,3eating. Cooperation was toggled live without advancing time in both systems.

## Executed controls and boundary checks

Original performed actions: setup, go once, go, go pause, setup reset. Setup after the run reset tick to0. [Original raw readbacks](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/dining-philosophers-original.json) pin settings, source SHA, actual ticks, reporters and code errors. [Supplementary original parameter/actions](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/original-parameter-actions.json) retain additional native switch/chooser/limit/reset tests; PageRank method switch is in its primary record. K-Means additionally has [single native go](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/k-means-single-command.json). Models without a native single-step button use Command Center go (Robby/Factory/Annealing) or their native split assignment/update actions plus single go (K-Means); no nonexistent native Reset/Step button is claimed. Source Setup is the reset operation.

Target performed actions: Setup, 1 step, Run, Pause, 100 steps × 1, Cooperation on live, Setup resets model. [Target raw readbacks](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/dining-philosophers-target.json) retain Setup, single step, progressed state, live actions and Setup-reset values, all four viewport/theme combinations, actual chunk digests and diagnostics. Completion disables target step/play controls for K-Means and PSO; other models retain their audited terminal rules. Atomic invalid inputs, no-tick actions, observation purity, deterministic target replay and source scientific equations are exercised by the frozen scripts and focused tests, not inferred from screenshots.

Every original and target was run in the real shared T3 Chromium browser. The coordinator inspected actual setup/progress images and readback; target desktop1440×1100 and mobile390×844 CSS pixels were inspected in light/dark. PNG dimensions may be downsampled desktop1280wide or device-scale mobile780wide; viewport metadata is authoritative. Canvas getImageData before capture is the documented raster workaround; theme changes settle across two animation frames. Two partial dark rasters (Dining/Factory) were replaced by explicit seed1 replays and forced1441→1440resize; their recapture JSONs preserve the corrected basis. No source-only browser approval or cross-RNG trajectory identity is claimed.

## Paired screenshot evidence

| State | NetLogo Web original | City Library target |
| --- | --- | --- |
| Setup | ![Original setup](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/dining-philosophers-original-setup.png) | ![Target setup](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/dining-philosophers-target-setup-desktop-light.png) |
| Progress | ![Original progress](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/dining-philosophers-original-progress.png) | ![Target progress](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/dining-philosophers-target-progress-desktop-light.png) |

Target [desktop dark](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/dining-philosophers-target-desktop-dark.png), [mobile light](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/dining-philosophers-target-mobile-light.png), [mobile dark](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/dining-philosophers-target-mobile-dark.png). Those later captures may include explicitly recorded live actions/reset-centroid/trial scenarios, rather than pretending to be the same scientific tick as the paired default-progress frame. Full finite bar/scatter pair labels and model/canonical state readbacks were inspected; charts are not statistical validation.

## Adaptations, diagnostics and remaining approval

Target uses circles for philosophers/forks instead of person/fork sprites, with detached fork ownership table and source state colors. Exactly one marked fork is visible when cooperation is enabled. The first dark desktop raster was partial; the retained PNG was recaptured from fresh seed1 replay at102 with cooperation enabled, using resize/readback workaround. Recapture metadata is separate and replaces the invalid raster basis. History is bounded1001samples; deadlock does not invent an automatic terminal stop.

Recorded original codeRuntimeErrors/codeCompilerErrors are empty in these default runs. No target application error or failed request was observed; some Chromium captures logged the expected Canvas2D willReadFrequently performance warning after getImageData. The retained target diagnostics include the tab's cumulative console entries and should not be mistaken for per-model unique errors. All target stages reported no horizontal document overflow. Source-derived potential errors and deliberately injected headless failures are distinguished from executed browser failures above.

[Final slice checks](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/final-slice-checks.log): all four TypeScript projects,35focused tests/6679assertions, all five frozen examples and their unchanged SHA-256 checks passed after final fixes. [Full author check](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-computing/evidence/author-checks.log) passed336tests/22613assertions,120registered existing scripts,build and packed consumer before the late native-control/UI-only fixes; the final affected checks were repeated. Parent owns global registration and the newer integrated-core regression. No unexecuted new-package/lint check is claimed.

Scientific framing and exactly three verified publications are reused from the existing [research dossier](../../../docs/research/netlogo-web/dining-philosophers.md), with its original access/metadata limitations. No duplicate literature task or new scientific validation was performed. Required independent Argon/high approval remains pending; author fixes and coordinator boundary decisions are not independent approval.
