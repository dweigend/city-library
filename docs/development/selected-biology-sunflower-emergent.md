# Sunflower Emergent: B07 model report

Canonical selected path: `Sample Models/Biology/Sunflower Emergent`. Experiment: `experiments/sunflower-emergent`. Membership is unchanged from selection.json.

Original archive/source session SHA-256: `0e0e3d39384a9b2cde33f248f46c0711cf2f7742f39405dc0907485ab1a67cd8`. Exact served XML version `NetLogo 7.0.4`; running original engine `2.16.1 (90be9317)`. Pinned Galapagos `90be931773fcf499049247a8aaa1aecbe003654c`, with immutable inventory byte match. Full original code/widgets/Info/shapes/notices: [archive](../../experiments/sunflower-emergent/source.nlogox), [notices](../../experiments/sunflower-emergent/NOTICE.md).

Scientific framing and exactly three verified publications remain in the existing [research dossier](../research/netlogo-web/sunflower-emergent.md) and [metadata](../research/netlogo-web/sunflower-emergent.json); their access/verification limits apply. This port does not add or duplicate literature and is not scientific validation.

Public contract: [headless source](../../experiments/sunflower-emergent/model.ts), [thin UI binding](../../experiments/sunflower-emergent/ui.ts). `create(options)`, `advance(count)` and detached `read()` use canonical public state owners. Named source procedures/actions, parameter phases, topology, plots and terminal/tick meaning are specified in [the source audit](selected-biology-source-audit.md). Exact source widgets and procedure list are in [audit JSON](selected-biology-source-audit.json).

## Adaptations and source findings

Setup completes tick1. Temporary candidate headings are random integers rather than equally spaced angles. A detached frame retains the tick-time temporary display; live candidate Agents are deleted, avoiding competing population ownership. The original and target expose division-by-zero at beta0; target throws an explicit RangeError after candidate creation without completing a tick. Existing particle sizes remain unchanged when the live size field changes. CSS diameter approximates NetLogo particle units.

## Actual original browser

Configured defaults: `set energy-approximation "inverse distance" set particle-size 1.8 set ring-dist 0.2 set fixed-temps? false set show-temps? true set alpha 3.0 set beta 0.6`; seed1 before Setup. Setup observation: `{"success": true, "value": [1, 1, 0]}`. After30 go calls: `{"success": true, "value": [31, 31, 186]}`. Reporter tuple expression is retained in browser-observations/sourceProbes and model-specific source contracts; values are actual native observations.

![Original setup](selected-biology-evidence/sunflower-emergent-original-setup.png)
![Original progress](selected-biology-evidence/sunflower-emergent-original-progress.png)

Actual Run/Pause and Setup-as-reset observations: `{"paused": {"success": true, "value": 36}, "stable": {"success": true, "value": 36}, "reset": {"success": true, "value": [1, 1, 0]}, "errors": [], "canvasReadback": {"width": 966, "height": 966, "nonzero": 113}}`. Successful equal paused/stable tick reporters establish bounded stable pause; Reset may randomize again without reseeding. Additional source actions/boundary/error probes are versioned by slug in [raw results](selected-biology-evidence/browser-observations.json).

## Actual target browser

Setup monitors: `[["Tick", "1"], ["Particles", "1"], ["Temporary candidates", "0"]]`. After30 clicked single-step actions: `[["Tick", "31"], ["Particles", "31"], ["Temporary candidates", "186"]]`. Status: `Steps completed.`. Actual loaded build-version `1793969543383`. Loaded model chunk attribution: `[{"url": "http://localhost:3147/chunks/ui-8rmf8qz2.js", "sha256": "163f395904a60e480b039f7f64c68865c477b78352c0097b3dbda599eccc9ed6", "sourceMarker": "selected-biology-b07:sunflower-emergent:0e0e3d39384a9b2cde33f248f46c0711cf2f7742f39405dc0907485ab1a67cd8"}]`. These screenshots belong to this actual final source/UI version; file hashes are recorded separately.

![Target setup](selected-biology-evidence/sunflower-emergent-target-setup.png)
![Target progress](selected-biology-evidence/sunflower-emergent-target-progress.png)

Run/Pause, stable pause and Setup-as-reset: `{"paused": ["33", "33", "198"], "stable": ["33", "33", "198"], "reset": ["1", "1", "0"], "status": "Model initialized.", "buttons": [{"label": "Setup", "disabled": false}, {"label": "Run", "disabled": false}, {"label": "1 step", "disabled": false}, {"label": "10 steps", "disabled": false}, {"label": "100 steps", "disabled": false}], "liveNames": ["live-ringDist", "live-particleSize", "live-fixedTemps", "live-showTemps", "live-energyApproximation", "live-alpha", "live-beta"]}`. Source-specific target actions/live controls/terminal probes are recorded under `targetProbes` in [raw observations](selected-biology-evidence/browser-observations.json).

![Desktop dark](selected-biology-evidence/sunflower-emergent-target-desktop-dark.png)
![Mobile light](selected-biology-evidence/sunflower-emergent-target-mobile-light.png)
![Mobile dark](selected-biology-evidence/sunflower-emergent-target-mobile-dark.png)

Mobile dark measured geometry: `{"viewport": [390, 844], "scroll": [0, 228.5], "scrollWidth": 390, "theme": "dark", "canvas": {"x": 16, "y": 243.1875, "width": 358, "height": 358}}`. Light/mobile and dark/desktop geometry are separately retained in raw results. All ordinary captures were visually inspected. Apparent blank bundled transport in Sunflower/Tumor/Membrane was reopened individually with view_image: files contain the actual particle/stems/membrane; no model renderer fix was warranted.

Console/runtime diagnostics: baseline source errors `[]`; target captured console entries `[[], []]`; paired target status states were success. Expected beta-zero/zero-radius probes are explicit errors, not passing runtime claims. Initial automation attempts used an unsupported manual redraw invocation and ran Go before Setup on three fresh originals; corrected captures/control checks replaced them. These harness errors are distinct from model failures.

Comparison conclusion: default topology/membership and observed source-specific mechanisms/reporters, plus bounded interactions, are supported by executed evidence. Different spatial patterns/masses are expected under the declared RNG/scheduling differences; no stochastic-distribution equivalence is established. UI palettes/shapes/scales and seam strokes are adapted as documented above. Full arbitrary-parameter/long-horizon equivalence is not claimed.

## Verification and approval

Final executed shell commands and exit codes are in [final checks](selected-biology-evidence/final-checks.json). All four TypeScript projects and standalone ambient-free ten-model/frozen-five-script TypeScript pass. Focused biology+shared-distribution checks:26tests/286assertions pass; additional inherited uniform/normal regression:31tests/73assertions pass. Frozen01/02/04/05 and all five original freeze hashes pass. Unchanged frozen03 now fails only its source-contradicted411 expectation (actual412); the proposed412/724 correction awaits explicit user approval. Build and actual packed Bun/Node ESM/ambient-free TypeScript consumer pass locally after parent sync. Historical pre-sync failures remain separately versioned; no parent full-integration checkpoint is relabeled as a B07 run.

Independent Argon/high review: **pending**, existing quota-blocked task8194e842, no retry/substitute. Native author findings and coordinator responses are not independent approval. No global model count, registration, selection, ledger or research status was changed here. Parent-owned dependency sync commits19f98ba(source428750f) and6dfc324(sourceb3db9b4) are excluded from the owned handoff list.

Final shared-shell supplement: these captures retain their actual distribution-sync build. After parent status fix e1c4ae8, this model module was freshly imported in Chromium and its final source marker/chunk SHA recorded in [status-fix.json](selected-biology-evidence/status-fix.json). Affected completion/error flows and post-fix checks are documented in [the batch supplement](selected-biology-browser.md#final-shared-status-supplement).
