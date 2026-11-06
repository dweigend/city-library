# Fur: B07 model report

Canonical selected path: `Sample Models/Biology/Fur`. Experiment: `experiments/fur`. Membership is unchanged from selection.json.

Original archive/source session SHA-256: `8f7b57b7df931ec45906251a9421017d438286b5607c20c409f722e6db311bc5`. Exact served XML version `NetLogo 7.0.4`; running original engine `2.16.1 (90be9317)`. Pinned Galapagos `90be931773fcf499049247a8aaa1aecbe003654c`, with immutable inventory byte match. Full original code/widgets/Info/shapes/notices: [archive](../../experiments/fur/source.nlogox), [notices](../../experiments/fur/NOTICE.md).

Scientific framing and exactly three verified publications remain in the existing [research dossier](../research/netlogo-web/fur.md) and [metadata](../research/netlogo-web/fur.json); their access/verification limits apply. This port does not add or duplicate literature and is not scientific validation.

Public contract: [headless source](../../experiments/fur/model.ts), [thin UI binding](../../experiments/fur/ui.ts). `create(options)`, `advance(count)` and detached `read()` use canonical public state owners. Named source procedures/actions, parameter phases, topology, plots and terminal/tick meaning are specified in [the source audit](selected-biology-source-audit.md). Exact source widgets and procedure list are in [audit JSON](selected-biology-source-audit.json).

## Adaptations and source findings

Grid Fields own white and persistent next-color values; cached ellipses retain Field identities. A zero difference retains next-color, initially black, exactly as executed in the original despite its comment. Zero-radius division and empty outer rings produce explicit target validation errors rather than a NetLogo dialog. Setup neighborhoods remain fixed until Setup, while Restart uses current density and preserves stored next-color.

## Actual original browser

Configured defaults: `set initial-density 50.0 set inner-radius-x 3.0 set inner-radius-y 3.0 set outer-radius-x 6.0 set outer-radius-y 6.0 set ratio 0.35`; seed1 before Setup. Setup observation: `{"success": true, "value": [0, 1855]}`. After20 go calls: `{"success": true, "value": [20, 1768]}`. Reporter tuple expression is retained in browser-observations/sourceProbes and model-specific source contracts; values are actual native observations.

![Original setup](selected-biology-evidence/fur-original-setup.png)
![Original progress](selected-biology-evidence/fur-original-progress.png)

Actual Run/Pause and Setup-as-reset observations: `{"paused": {"success": true, "value": 26}, "stable": {"success": true, "value": 26}, "reset": {"success": true, "value": [0, 1863]}, "errors": [], "canvasReadback": {"width": 610, "height": 610, "nonzero": 372100}}`. Successful equal paused/stable tick reporters establish bounded stable pause; Reset may randomize again without reseeding. Additional source actions/boundary/error probes are versioned by slug in [raw results](selected-biology-evidence/browser-observations.json).

## Actual target browser

Setup monitors: `[["Tick", "0"], ["White cells", "1855"]]`. After20 clicked single-step actions: `[["Tick", "20"], ["White cells", "1812"]]`. Status: `Steps completed.`. Actual loaded build-version `1793968579671`. Loaded model chunk attribution: `[{"url": "http://localhost:3147/chunks/ui-h3kw0qsk.js", "sha256": "b5ad3b8e9077635583da8a90657e35417d6607555728b3a2473f144b9ebe02e0", "sourceMarker": "selected-biology-b07:fur:8f7b57b7df931ec45906251a9421017d438286b5607c20c409f722e6db311bc5"}]`. These screenshots belong to this actual final source/UI version; file hashes are recorded separately.

![Target setup](selected-biology-evidence/fur-target-setup.png)
![Target progress](selected-biology-evidence/fur-target-progress.png)

Run/Pause, stable pause and Setup-as-reset: `{"paused": ["22", "1812"], "stable": ["22", "1812"], "reset": ["0", "1855"], "status": "Model initialized.", "buttons": [{"label": "Setup", "disabled": false}, {"label": "Run", "disabled": false}, {"label": "1 step", "disabled": false}, {"label": "10 steps", "disabled": false}, {"label": "100 steps", "disabled": false}, {"label": "Restart", "disabled": false}], "liveNames": ["live-initialDensity", "live-ratio"]}`. Source-specific target actions/live controls/terminal probes are recorded under `targetProbes` in [raw observations](selected-biology-evidence/browser-observations.json).

![Desktop dark](selected-biology-evidence/fur-target-desktop-dark.png)
![Mobile light](selected-biology-evidence/fur-target-mobile-light.png)
![Mobile dark](selected-biology-evidence/fur-target-mobile-dark.png)

Mobile dark measured geometry: `{"viewport": [390, 844], "scroll": [0, 402], "scrollWidth": 390, "theme": "dark", "canvas": {"x": 16, "y": 242.96875, "width": 358, "height": 358}}`. Light/mobile and dark/desktop geometry are separately retained in raw results. All ordinary captures were visually inspected. Apparent blank bundled transport in Sunflower/Tumor/Membrane was reopened individually with view_image: files contain the actual particle/stems/membrane; no model renderer fix was warranted.

Console/runtime diagnostics: baseline source errors `[]`; target captured console entries `[[], []]`; paired target status states were success. Expected beta-zero/zero-radius probes are explicit errors, not passing runtime claims. Initial automation attempts used an unsupported manual redraw invocation and ran Go before Setup on three fresh originals; corrected captures/control checks replaced them. These harness errors are distinct from model failures.

Comparison conclusion: default topology/membership and observed source-specific mechanisms/reporters, plus bounded interactions, are supported by executed evidence. Different spatial patterns/masses are expected under the declared RNG/scheduling differences; no stochastic-distribution equivalence is established. UI palettes/shapes/scales and seam strokes are adapted as documented above. Full arbitrary-parameter/long-horizon equivalence is not claimed.

## Verification and approval

Executed shell commands and exit codes are in [focused checks](selected-biology-evidence/focused-checks.json). Frozen01/02/04/05 and hashes pass; frozen03 and the Blood focused test fail on the missing dependency. Four TypeScript projects were invoked individually: core and UI examples pass; dev/UI and standalone model/frozen-script TypeScript reject only the two missing public distribution overloads. Build and actual packed Bun/Node ESM/ambient-free TypeScript consumer pass. Exact logs are versioned in the evidence directory. No parent full-integration checkpoint is relabeled as a B07 run.

Independent Argon/high review: **pending**, existing quota-blocked task8194e842, no retry/substitute. Native author findings and coordinator responses are not independent approval. No global model count, registration, selection, ledger or research status was changed here.
