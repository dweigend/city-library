# Artificial Neural Net - Multilayer — executed B18 author acceptance

Selected identity: `Sample Models/Computer Science/Artificial Neural Net - Multilayer`. Mechanism: **Sigmoid backpropagation**. Source audit, implementation, headless verification and original/target browser comparison are evidenced here; independent approval remains **pending** (known quota-blocked Argon/high task8194e842, no retry/substitution). This is not final scientific or independent acceptance.

## Identity, versions and public composition

Exact [served source](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Computer%20Science/Artificial%20Neural%20Net%20-%20Multilayer.nlogox), archived as [source.nlogox](../../../experiments/artificial-neural-net-multilayer/source.nlogox), [attribution/license](../../../experiments/artificial-neural-net-multilayer/NOTICE.md): CC BY-NC-SA 3.0. Source SHA-256 `dec9e3394cde9d0fae15d15a0e75763f854dd908e00804924667e92e8211d4e9`; 53006bytes. Galapagos `90be931773fcf499049247a8aaa1aecbe003654c` matches served bytes; Desktop membership is not used as identity. All Procedures/Widgets/Info/notices were audited; [complete procedure/widget inventory](artificial-neural-net-multilayer-source.md) and [source contract](../selected-computing-contract.md) retain equations/defaults/topology/order/actions/reporters and source faults.

Target public headless entry: `experiments/artificial-neural-net-multilayer/model.ts`, `create(options?)`, `advance(count?)`, `read()` plus documented model actions. It composes real public City Library objects/functions; UI imports domain actions and detached snapshots. No transpiled NetLogo, substitute engine, new private generic library or shared core API was introduced.

- Model source SHA-256: `94d11f87a1ee83bbf8bff5fdd1cf04bd0a177cf11705f41712f36cb1ad6cc787`.
- Thin UI SHA-256: `f7c2509c25a87e71720e84bc104b386320e1c24bd2b5593b3415c617b60b0bdf`.
- Actual browser-loaded model chunk: `http://localhost:3188/chunks/ui-rr63tyt3.js`, SHA-256 `18c15e71cf339b9c913155c0a8af0c8a42c087f7a3e87463ed72ec0252444035`, 9565bytes, compiled source marker `experiments/artificial-neural-net-multilayer/model.ts` checked.

Reference XML declares NetLogo7.0.4; hosted Web engine2.16.1(90be9317) was read from native netlogo-version/modelConfig.version in the final K-Means session. Browser Chromium156.0.0.0; target Bun1.4.2/TypeScript7.0.2/Node26.8.2. [Environment](evidence/environment.json) records the observation basis and exact two-file parent5bc6b16 renderer hashes. Reference RNG is not equated to target Mulberry32 seed1. Content-addressed model-chunk URLs were read back and SHA-256 checked; app.js is a mutable dev-server entry and its refetched hash is supplemental, not a source identity assertion.

## Native setup and measured progress

Native controls at Setup (complete widget code/ranges/defaults in audit):

| Measurement | Observed value |
| --- | --- |
| input-1 | `1` |
| input-2 | `0` |
| learning-rate | `0.5` |
| examples-per-epoch | `500` |
| target-function | `"xor"` |
| show-weights? | `false` |

Original setup tick0 and progressed tick147:

| Measurement | Observed value |
| --- | --- |
| epoch-error | `0.0001629487885660472` |
| [activation] of output-node-1 | `0.9877465008955809` |
| [weight] of links | `[10.378950913155156,-4.985852451829808,-6.669648823980025,-4.978712133213548,-10.507189915600112,-6.6587691084028835,2.757974886455174,-4.944296978527217,7.420125118730288]` |

Target setup and pending/live inputs:

| Measurement | Observed value |
| --- | --- |
| seed | `"1"` |
|  | `"5"` |
| live-learningRate | `"0.5"` |
| live-examplesPerEpoch | `"500"` |
| live-targetFunction | `"xor"` |
| live-input1 | `"1"` |
| live-input2 | `"0"` |
| live-showWeights | `false` |

Target progressed monitor values:

| Measurement | Observed value |
| --- | --- |
| Epoch | `"103"` |
| Epoch error | `"0.00026"` |
| Output activation | `"0.019"` |
| Test | `"—"` |

Six canonical Graph nodes and nine mutable weighted edges implement the2–2–1network with bias. Hidden propagation precedes output; output delta a(1−a)(target−a), then ALL hidden deltas use OLD outgoing weights before any edge update. The frozen zero-weight case asserts .25error, output-bias±.0625 and hidden-output±.03125 with unchanged hidden incoming weights. The original XOR run reached mean error0.0001629488at147; target0.00026at103; Test(1,0)reported1correct in both without a training tick.

## Executed controls and boundary checks

Original performed actions: setup, train once, train start, train pause, test, setup reset. Setup after the run reset tick to0. [Original raw readbacks](evidence/artificial-neural-net-multilayer-original.json) pin settings, source SHA, actual ticks, reporters and code errors. [Supplementary original parameter/actions](evidence/original-parameter-actions.json) retain additional native switch/chooser/limit/reset tests; PageRank method switch is in its primary record. K-Means additionally has [single native go](evidence/k-means-single-command.json). Models without a native single-step button use Command Center go (Robby/Factory/Annealing) or their native split assignment/update actions plus single go (K-Means); no nonexistent native Reset/Step button is claimed. Source Setup is the reset operation.

Target performed actions: Setup, 1 step, Run, Pause, 100 steps × 1, Show weights on, Test, Setup resets model. [Target raw readbacks](evidence/artificial-neural-net-multilayer-target.json) retain Setup, single step, progressed state, live actions and Setup-reset values, all four viewport/theme combinations, actual chunk digests and diagnostics. Completion disables target step/play controls for K-Means and PSO; other models retain their audited terminal rules. Atomic invalid inputs, no-tick actions, observation purity, deterministic target replay and source scientific equations are exercised by the frozen scripts and focused tests, not inferred from screenshots.

Every original and target was run in the real shared T3 Chromium browser. The coordinator inspected actual setup/progress images and readback; target desktop1440×1100 and mobile390×844 CSS pixels were inspected in light/dark. PNG dimensions may be downsampled desktop1280wide or device-scale mobile780wide; viewport metadata is authoritative. Canvas getImageData before capture is the documented raster workaround; theme changes settle across two animation frames. Two partial dark rasters (Dining/Factory) were replaced by explicit seed1 replays and forced1441→1440resize; their recapture JSONs preserve the corrected basis. No source-only browser approval or cross-RNG trajectory identity is claimed.

## Paired screenshot evidence

| State | NetLogo Web original | City Library target |
| --- | --- | --- |
| Setup | ![Original setup](evidence/artificial-neural-net-multilayer-original-setup.png) | ![Target setup](evidence/artificial-neural-net-multilayer-target-setup-desktop-light.png) |
| Progress | ![Original progress](evidence/artificial-neural-net-multilayer-original-progress.png) | ![Target progress](evidence/artificial-neural-net-multilayer-target-progress-desktop-light.png) |

Target [desktop dark](evidence/artificial-neural-net-multilayer-target-desktop-dark.png), [mobile light](evidence/artificial-neural-net-multilayer-target-mobile-light.png), [mobile dark](evidence/artificial-neural-net-multilayer-target-mobile-dark.png). Those later captures may include explicitly recorded live actions/reset-centroid/trial scenarios, rather than pretending to be the same scientific tick as the paired default-progress frame. Full finite bar/scatter pair labels and model/canonical state readbacks were inspected; charts are not statistical validation.

## Adaptations, diagnostics and remaining approval

Logical Graph IDs label bias/input/hidden/output instead of native who numbers. Show weights uses a table rather than edge labels; node sizes/colors remain activation signs. A final propagation is intentionally not added after the last learning update, matching source activation timing. Histories are bounded1001samples. Different RNGs and rendering draw policies preclude trajectory/epoch identity claims.

Recorded original codeRuntimeErrors/codeCompilerErrors are empty in these default runs. No target application error or failed request was observed; some Chromium captures logged the expected Canvas2D willReadFrequently performance warning after getImageData. The retained target diagnostics include the tab's cumulative console entries and should not be mistaken for per-model unique errors. All target stages reported no horizontal document overflow. Source-derived potential errors and deliberately injected headless failures are distinguished from executed browser failures above.

[Final slice checks](evidence/final-slice-checks.log): all four TypeScript projects,35focused tests/6679assertions, all five frozen examples and their unchanged SHA-256 checks passed after final fixes. [Full author check](evidence/author-checks.log) passed336tests/22613assertions,120registered existing scripts,build and packed consumer before the late native-control/UI-only fixes; the final affected checks were repeated. Parent owns global registration and the newer integrated-core regression. No unexecuted new-package/lint check is claimed.

Scientific framing and exactly three verified publications are reused from the existing [research dossier](../../research/netlogo-web/artificial-neural-net-multilayer.md), with its original access/metadata limitations. No duplicate literature task or new scientific validation was performed. Required independent Argon/high approval remains pending; author fixes and coordinator boundary decisions are not independent approval.
