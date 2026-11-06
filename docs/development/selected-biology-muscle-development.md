# Muscle Development: B07 model report

Canonical selected path: `Sample Models/Biology/Muscle Development`. Experiment: `experiments/muscle-development`. Membership is unchanged from selection.json.

Original archive/source session SHA-256: `29c39af0fbaff47c0ecab4d901260f05a5195f807046dd895ddd66eef1163e26`. Exact served XML version `NetLogo 7.0.4`; running original engine `2.16.1 (90be9317)`. Pinned Galapagos `90be931773fcf499049247a8aaa1aecbe003654c`, with immutable inventory byte match. Full original code/widgets/Info/shapes/notices: [archive](../../experiments/muscle-development/source.nlogox), [notices](../../experiments/muscle-development/NOTICE.md).

Scientific framing and exactly three verified publications remain in the existing [research dossier](../research/netlogo-web/muscle-development.md) and [metadata](../research/netlogo-web/muscle-development.json); their access/verification limits apply. This port does not add or duplicate literature and is not scientific validation.

Public contract: [headless source](../../experiments/muscle-development/model.ts), [thin UI binding](../../experiments/muscle-development/ui.ts). `create(options)`, `advance(count)` and detached `read()` use canonical public state owners. Named source procedures/actions, parameter phases, topology, plots and terminal/tick meaning are specified in [the source audit](selected-biology-source-audit.md). Exact source widgets and procedure list are in [audit JSON](selected-biology-source-audit.json).

## Adaptations and source findings

Each canonical Grid Field holds both hormone concentrations; one World Agent represents its muscle fiber. The source daily activity, workout at preincrement tick modulus, sleep, diffusion/bounds and logarithmic growth order are retained. Hormone background uses direct RGB rather than approximate-rgb palette quantization; fiber red is a simplified shade. Muscle mass history is raw mass and the UI plots mass/100 exactly as the original. Population RNG differs, so numeric masses acrossseed1 are not trajectory-equivalence evidence.

## Actual original browser

Configured defaults: `set days-between-workouts 5.0 set hours-of-sleep 8.0 set intensity 95.0 set lift? true set %-slow-twitch-fibers 50.0`; seed1 before Setup. Setup observation: `{"success": true, "value": [0, 289, 1630.2352379109811, 50, 52]}`. After20 go calls: `{"success": true, "value": [20, 289, 1719.6438578016543, 84.21524074396656, 53.98108906598185]}`. Reporter tuple expression is retained in browser-observations/sourceProbes and model-specific source contracts; values are actual native observations.

![Original setup](selected-biology-evidence/muscle-development-original-setup.png)
![Original progress](selected-biology-evidence/muscle-development-original-progress.png)

Actual Run/Pause and Setup-as-reset observations: `{"paused": {"success": true, "value": 23}, "stable": {"success": true, "value": 23}, "reset": {"success": true, "value": [0, 289, 1620.606204318675, 50, 52]}, "errors": [], "canvasReadback": {"width": 782, "height": 782, "nonzero": 611524}}`. Successful equal paused/stable tick reporters establish bounded stable pause; Reset may randomize again without reseeding. Additional source actions/boundary/error probes are versioned by slug in [raw results](selected-biology-evidence/browser-observations.json).

## Actual target browser

Setup monitors: `[["Tick", "0"], ["Muscle mass", "1623.25"]]`. After20 clicked single-step actions: `[["Tick", "20"], ["Muscle mass", "1711.72"]]`. Status: `Steps completed.`. Actual loaded build-version `1793968579671`. Loaded model chunk attribution: `[{"url": "http://localhost:3147/chunks/ui-gsaawsq3.js", "sha256": "80741fb34a300c087e028408b116b34b222acbd80f3d6482afa9b3e66fcd40c9", "sourceMarker": "selected-biology-b07:muscle-development:29c39af0fbaff47c0ecab4d901260f05a5195f807046dd895ddd66eef1163e26"}]`. These screenshots belong to this actual final source/UI version; file hashes are recorded separately.

![Target setup](selected-biology-evidence/muscle-development-target-setup.png)
![Target progress](selected-biology-evidence/muscle-development-target-progress.png)

Run/Pause, stable pause and Setup-as-reset: `{"paused": ["22", "1722.53"], "stable": ["22", "1722.53"], "reset": ["0", "1623.25"], "status": "Model initialized.", "buttons": [{"label": "Setup", "disabled": false}, {"label": "Run", "disabled": false}, {"label": "1 step", "disabled": false}, {"label": "10 steps", "disabled": false}, {"label": "100 steps", "disabled": false}], "liveNames": ["live-daysBetweenWorkouts", "live-hoursOfSleep", "live-intensity", "live-lift"]}`. Source-specific target actions/live controls/terminal probes are recorded under `targetProbes` in [raw observations](selected-biology-evidence/browser-observations.json).

![Desktop dark](selected-biology-evidence/muscle-development-target-desktop-dark.png)
![Mobile light](selected-biology-evidence/muscle-development-target-mobile-light.png)
![Mobile dark](selected-biology-evidence/muscle-development-target-mobile-dark.png)

Mobile dark measured geometry: `{"viewport": [390, 844], "scroll": [0, 252], "scrollWidth": 390, "theme": "dark", "canvas": {"x": 16, "y": 242.984375, "width": 358, "height": 358}}`. Light/mobile and dark/desktop geometry are separately retained in raw results. All ordinary captures were visually inspected. Apparent blank bundled transport in Sunflower/Tumor/Membrane was reopened individually with view_image: files contain the actual particle/stems/membrane; no model renderer fix was warranted.

Console/runtime diagnostics: baseline source errors `[]`; target captured console entries `[[], []]`; paired target status states were success. Expected beta-zero/zero-radius probes are explicit errors, not passing runtime claims. Initial automation attempts used an unsupported manual redraw invocation and ran Go before Setup on three fresh originals; corrected captures/control checks replaced them. These harness errors are distinct from model failures.

Comparison conclusion: default topology/membership and observed source-specific mechanisms/reporters, plus bounded interactions, are supported by executed evidence. Different spatial patterns/masses are expected under the declared RNG/scheduling differences; no stochastic-distribution equivalence is established. UI palettes/shapes/scales and seam strokes are adapted as documented above. Full arbitrary-parameter/long-horizon equivalence is not claimed.

## Verification and approval

Executed shell commands and exit codes are in [focused checks](selected-biology-evidence/focused-checks.json). Frozen01/02/04/05 and hashes pass; frozen03 and the Blood focused test fail on the missing dependency. Four TypeScript projects were invoked individually: core and UI examples pass; dev/UI and standalone model/frozen-script TypeScript reject only the two missing public distribution overloads. Build and actual packed Bun/Node ESM/ambient-free TypeScript consumer pass. Exact logs are versioned in the evidence directory. No parent full-integration checkpoint is relabeled as a B07 run.

Independent Argon/high review: **pending**, existing quota-blocked task8194e842, no retry/substitute. Native author findings and coordinator responses are not independent approval. No global model count, registration, selection, ledger or research status was changed here.
