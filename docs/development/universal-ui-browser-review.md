# Independent universal UI browser verification

The scoped browser gate passes. All 146 catalog entries completed Setup and a bounded step, all 82 migrated bindings completed an actual valid live edit, all 30 new/regression adapter fixtures passed, and the required eleven DES flows and lifecycle probes passed. The 92 final images have a separate independent visual review; this report does not appropriate that approval.

Reviewer: native browser-QA agent, distinct from the implementation, model/UI refactor and screenshot-inspection authors. Starting baseline: `a78bd2359e7a12ac537be131ca8d3023c4b718eb`, branch `feat/salabim-concepts`. Final affected behavior and copy replay used source through `0615e43`. Earlier catalog smoke predates later collection-only wording/alignment corrections and the two overlay flags; those deltas received their own fresh affected checks below rather than being relabelled as another full catalog run.

## Browser, criteria and evidence

The configured Playwright MCP browser was attempted. Chromium aborted at startup with the concrete error:

> The SUID sandbox helper binary was found, but is not configured correctly. You need to make sure that `/usr/local/libexec/codex-playwright/chrome_sandbox` is owned by root and has mode 4755.

Actual verification ran in real T3 Chrome, isolated tab `tab_30_903760d6-5433-46c2-8790-7b134aa6c724`, using the existing Svelte server at `http://localhost:3223/`. Parent port 3211 and the older 3217 session were untouched. No source-only substitute establishes the results below. The test tab was closed at completion; server 3223 remains running.

The frontend-design, frontend-design-shadcn-svelte, standalone shadcn-svelte and web-design-guidelines criteria informed the check. Current [Vercel Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md) were fetched on 2026-11-09. Review covered necessary labels, native actions, visible focus, actual keyboard selection/paging, responsive overflow, theme variants, meaningful colors and plain-text scene equivalents. No new component system, style palette or application controls were introduced by QA.

Unlike the previous task's tooling, `preview_set_appearance` is now available. These images use its actual `prefers-color-scheme` override, confirmed by `matchMedia`, rather than injected dark CSS. CSS desktop viewport was 1366×768 and narrow was 390×844, native DPR 2. The screenshot backend produced 1280×720 desktop PNGs and 780×1688 narrow PNGs. These CSS, device and PNG dimensions are recorded separately, not conflated.

## Complete catalog and migration replay

The repeatable [catalog harness](universal-ui-browser-evidence/catalog-harness.js) uses the actual public catalog search and option pointer events, then clicks Setup and one step. It never invokes a private session or model instance. The [146-entry journal](universal-ui-browser-evidence/catalog-smoke.json) records each slug, actual monitors, view captions, completion-disabled cases, alerts and errors.

- **146/146 catalog entries passed**, including the static/complete cases explicitly recorded by the journal.
- **82/82 migrated entries passed a valid alternative live control edit.** Values were chosen from the actual descriptor/control bounds; disabled controls were skipped. The control was checked after the ordinary observation getter refreshed it. This is a public-control/observation proof, not a spy on a private model method.
- The catalog sweep produced **zero `window.error`, `unhandledrejection`, console warning or console error events** within its instrumented scope. Console instrumentation forwarded calls rather than suppressing them.
- Both named-domain-action entries and existing graph/grid/chart/table/spatial views remained usable. This is a runtime smoke, not independent scientific calibration or a deep mechanism audit of 146 models.

The first QA harness used an incorrect virtual-import URL, leaving a Vite error overlay. That QA import was corrected to the existing catalog module identifier. A fresh navigation removed the stale overlay and the entire 146-entry sweep was repeated; the committed journal is the clean repeat, with the overlay absent before and after. The unaccepted probe screenshot with the stale overlay is not in the image manifest.

The catalog sweep runs the Svelte catalog. Both public adapters separately receive the complete authoring/validation/lifecycle fixtures below; this is not a claim that all 146 entries were also deeply exercised in the legacy catalog.

## Both public adapters

[The final fixture journal](universal-ui-browser-evidence/public-fixtures-and-lifecycle.json) records all 30 passing browser exercises on the final affected code:

| Public scripts | Each adapter | Total |
| --- | ---: | ---: |
| Five frozen `ui-live-changes` author tasks | 5 | 10 |
| Five frozen `ui-collections` author tasks | 5 | 10 |
| Existing authoring 01/04, namespaced-selection 03 and spatial validation/picking 04/05 | 5 | 10 |

Each script ran unchanged through both `ui/index.ts` and `ui/svelte/index.ts`, with its actual exported browser assertions. Coverage includes exact one-key decoded writes, local setter overrides, draft initialization, enabled fields, labels/groups, legacy arrays, errors, stable chart colors under filtering/reordering, duplicate-label compatibility, explicit colors, ordered Store/Resource snapshots, retained capacity, anonymous counts, empty data, invalid input classes, selection and disposal.

The table fixture reaches actual rows 201 and 401, clamps after shrinking, resets on Setup and shows an explicit empty state. Robby's actual 243-row strategy table was also tested with **keyboard Space** on Next rows: range `201–243 of 243`, 43 actual rows, original state indices 200 through 242. No row identity or domain value was renumbered.

Legacy fixtures embedded on the Svelte page use the legacy host's ordinary bounded `.world` canvas CSS. An initial unstyled legacy fixture allowed intrinsic-width growth and failed a pixel comparison; it was corrected before assessing rejection atomicity. The real legacy contract was not weakened. The corrected fixture preserves identical valid canvas pixels on invalid publication.

## Eleven DES flows

[The DES journal](universal-ui-browser-evidence/des-flows.json) records each actual catalog entry after a valid numeric alternative, Setup, one step, 700 ms timed Run, Pause and a further 250 ms stability wait. All eleven observed time 0 → 1 → 3, then remained stable after Pause. These are the models' labelled minutes/seconds, not an inferred equivalence between all World ticks and Agenda time.

All supplied actions were clicked where enabled: Add resident; Add priority vehicle; Cancel waiting vehicle; Produce crate; Collect crate; Dispatch bus; Add parcel; Add 3 supply units; Add passenger. The remaining entries have no domain action buttons. Resulting counts are in the journal. Each entry also received Home/ArrowRight/End selection, four alternating 1366×768 / 390×844 viewport changes and actual catalog switching. There were no instrumented window errors/rejections or console warnings/errors in these flows.

| Primary capture | State |
| --- | --- |
| Office, minute 1 | Two waiting, one in service; separate one-seat capacity |
| EV charging, minute 1 | One queued, two charging |
| Goods, minute 3 | Two stored, one blocked producer |
| Bus, minute 6 | Berth occupancy and waiting on the weighted route |
| Parcel, minute 2 | Actual depot/van state and route graph |
| Waste, minute 3 | Eight units in fields, four aboard, depot unloading |
| Emergency, minute 5 | Pending incident, assigned team and completed call |
| Bikes, minute 2 | Conserved stock split between stations and transit |
| Water, minute 1 | Six allocated and six unmet synthetic units |
| Maintenance, minute 10 | Operational, waiting and repairing machine states |
| Elevator, second 10 | Three waiting, two riding, one arrived |

## Deeper interactions and lifetime

[Manual checks](universal-ui-browser-evidence/manual-checks.json) include actual pointer drawing/selection in Traffic 2 Lanes followed by Watch, Follow and Reset perspective. These actions preserved Tick 0; the subsequent explicit step produced Tick 1. Wolf/Sheep's grass rule was disabled in the ordinary mode, enabled after the actual grass-mode Setup, and its shared change accepted 31 without advancing time. The frozen Virus exercise independently proves its local transforming setter overrides the common action.

After fresh loading the two overlay changes, an actual pointer at PSO's True best marker selected underlying model/grid identity, never `highlight`; End selected an actual particle. Vision Evolution's FOV overlay similarly passed selection through to an actual fish and End never selected an `fov-` decoration. The inspector displayed the selected domain fish. The independent public model was used only to calculate deterministic pointer coordinates, not to access or replace the mounted instance. These targeted checks close the later `b1051eb` delta after the earlier catalog sweep.

The [lifecycle harness](universal-ui-browser-evidence/lifecycle-harness.js) mounts a complete public model through each adapter. It intercepts only the canvas-origin deferred animation frame, leaving Bits UI's observer callbacks native. Two real ResizeObserver-triggering width changes coalesced into one held handle 9000001. Two public steps published `Generation 2` while it was held. Dispose cancelled the frame, detached the canvas and emptied the held queue. Deliberately forcing the saved callback afterward caused **zero old-canvas draws and no buffer dimension change**. Actual catalog switching from Elevator to Life passed the same cancellation/forced-late check.

Tiny rectangle selection passed in both adapters at native renderer DPR 2 and a temporary `devicePixelRatio` property override of 1. A painted-center click selected the item, Setup cleared it and a two-CSS-pixel miss did not invoke legacy nearest fallback. Model step count remained zero. The property was restored to native 2. This is a renderer-ratio probe, not a separate physical DPR-1 device. An earlier fractional MouseEvent-offset probe was unsuitable because browser client coordinates quantize those offsets; it is not treated as a product defect or subpixel physical-device proof.

## Images, findings and fixes

The [manifest](universal-ui-browser-evidence/manifest.json) contains **92 final unique originals and byte-identical portable PNG copies**, with SHA256, viewport/theme, PNG dimensions and observed state. There are 44 primary DES images and 48 supplemental images: retained Office claims, maximum Office density, EV priority, Robby's last page, conditional chart colors, dense Taxi groups, Heat Diffusion's fixed scientific portrayal, Traffic Follow, PSO/Vision overlays, recycling network and empty table. Each case has desktop/narrow × light/dark coverage. No sampled final document had horizontal overflow. These are captured states, not every possible parameter combination.

Findings and responses are distinct:

1. **Table reactive feedback, fixed `f91b27e`.** The initial Svelte 401-row fixture hung during first Setup, before a paging click. The first surfaced stack pointed to Bits UI's slider layout callback, but the cause was the table effect reading the same reactive `rows` it had just assigned. The root correction computes/clamps from a local projected array. Fresh isolated Setup and then all 30 fixtures passed without error. No dependency patch, callback suppression or speculative state workaround was used.
2. **Collection headings clipped at the left edge, fixed `434978b`.** The helper initially positioned headings as if text were left-anchored; the existing renderer centers labels. Root changed only the common collection heading position to x=0, preserving all old spatial label semantics. Fresh affected captures showed full headings. The independent image reviewer separately rechecked them.
3. **Singular count wording, fixed `0615e43`.** The independent image reviewer found `1 items`. Root changed the common summary only. Twelve primary collection captures and four retained-capacity captures were replaced after a fresh reload. The manifest records superseded originals and correction provenance.
4. **Rejected Taxi QA draft, not a product defect.** The first dense-control supplemental preparation incorrectly supplied probability 31 to a fractional [0,1] input. Native validation correctly rejected it and displayed its max-1 message. These four unaccepted captures were replaced with actual valid **0.31** through the control; final metadata records value/min/max/checkValidity. The separate catalog smoke had validly edited `waitTimeMean` 50 → 51 and was unaffected. No popup was hidden by CSS or suppression.

Some Traffic screenshots display the existing Reload updates notice. Their running Traffic module was unchanged; the pending source updates were unrelated collection wording/alignment or erased type-interface changes. This freshness limit is recorded rather than claiming every earlier image was captured from the later documentation head. The affected collection captures were freshly reloaded after their corrections.

Independent actual-image findings, fixes and approval belong in [universal-ui-image-review.md](universal-ui-image-review.md). This browser report does not claim full screen-reader/accessibility certification, physical-device DPR-1 coverage, scientific equivalence/calibration or universal console cleanliness outside its instrumented flows. No unresolved observed browser failure remains within the completed scoped checks.
