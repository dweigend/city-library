# Model and browser baseline review

Date: 6 November 2026. Scoped independent Codex subagent review, separate from the model implementer and browser operator C. Source scope: `44efd4c..9a4203c`. Browser baseline: `/tmp/city-library-authoring-browser-baseline.json`, captured at `b7a972c` before the new authoring runtime. All 16 theme/viewport PNGs listed below were actually opened and visually inspected with the image tool. No runtime files changed.

## Model source outcome

No blocking regression found in the four model changes. This is scoped source acceptance, not approval of the entire pre-main slice, scientific equivalence or future UI runtime.

- Taxi/Grid/Goal move ordinary `go`/`step` declarations upfront. Their closures are not executed at declaration. Setup/initial recording still follows initialization of captured state, and public return objects/aliases remain intact. Tijuana similarly moves `advance` without adding an early call or second state owner.
- Independent TypeScript AST extraction found Taxi/Grid/Goal `go`/`step` and Tijuana `advance` bodies byte-identical between commits. Tijuana `validatedRules` changes indentation only: scanner-token comparison is identical. Its module-scope relocation captures module-level `inputs` and `record`, not per-instance settings. Plain-record, key/accessor and undefined validation remains unchanged.
- Taxi/Grid/Goal retain count validation, `run(world, go)` and post-success recording. Tijuana retains its different pre-procedure Tick advance, readiness guards, boundary handling, successful-call history and partial-failure semantics. These protocols were not silently normalized.
- Taxi `model.ts:703–704` derives `occupiedCabs` with the existing `!cab.vacancy` predicate and `totalIncome` from current cab income. These are pure projections, not stored counters. Existing UI/history use the same definitions; no random draw or clock change is introduced.

Executed independently: four `examples/model-authoring/*.ts` task scripts, their SHA manifest, `bun examples/lab/01-headless-network-entry.ts`, and the AST/token comparisons. Final checks passed. No broad suite, packed consumer or full typecheck was rerun here. The implementer's 34-test/322-assertion and bounded seeded comparison remain separately attributed in [model evidence](../model-function-encapsulation.md).

## Reader-command check

`package.json`, `vite.config.ts`, the real model and the headless example agree with the documented commands/imports. Explicit `CITY_LIBRARY_UI_RUNTIME=svelte bun run dev:ui:svelte` selects Svelte at default port 3101; omitting the variable selects legacy. `bun run dev:ui` starts the older Bun host at default port 3100. Explicit Svelte builds also need the runtime variable. The headless introductory example was run successfully.

This reviewer authored portions of the earlier reader docs. These mechanical source/command checks therefore do not count as independent editorial approval of those same documents. No new server was started solely to verify the documented start commands.

## Screenshot review

The installed web-design-guidelines skill was read and current upstream Vercel rules fetched from `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`. Static images do not prove keyboard/focus behavior, semantic names, validation or disposal.

| Model | Actual light/dark desktop/narrow observations |
| --- | --- |
| Traffic Grid | Readable controls/monitors and rendered road/signal/car colors. Narrow layout stacks controls, grid and chart without horizontal clipping in the captured region. |
| Traffic Grid Goal | Same readable responsive arrangement; progressed distribution/count differs visibly. No blank renderer or overlapping header controls. |
| Taxi Cabs | Legacy fallback is visibly different. Narrow setup/playback/reporters precede the map; visible text and map remain readable. This is fallback-baseline evidence, not completed Svelte migration. |
| Tijuana | Progressed cityscape/traces/colored symbols render in both themes; dense reporters wrap without cut-off text in the captured region. Explicit scientific white map background in dark mode is preserved rather than misclassified as a chrome defect. |

No new visible regression attributable to the model-only change was identified. There is no independently captured pre-change image pair here; this is a baseline review, not proof of visual equivalence or complete visual-system acceptance.

### Open findings and limits

- **P1 capture gate:** CSS desktop viewport was 1366×768; actual saved desktop PNGs are 1280×720. Narrow CSS viewport was 390×844 at DPR 2; PNGs are 780×1688. Do not claim native 1366×768 PNG evidence. Obtain correctly sized final captures for affected new-runtime states.
- **P2 resize diagnostic:** both narrow Tijuana records contain `ResizeObserver loop completed with undelivered notifications.` No blank renderer is visible, but responsive lifecycle investigation/retest remains open; do not claim error-free browser acceptance.
- **P1 Taxi migration:** remove its private author DOM/mount patch, model-specific fallback exception and duplicated reporter usage through the accepted shared contract, then retest. Baseline appearance does not close that task.
- This reviewer did not independently operate the browser. C's manifest records actual Setup/step/live-edit/Run/Pause and a successful final pointer/typing model-switch retest; these are operator evidence. Keyboard/focus, validation, below-fold chart coverage and drawing/intersection/watch actions remain outside this screenshot conclusion.
- New typed setup/live normalization, observation-union safety, accessible mount harness, grouping/formatting/categories/axes, bar overlap/negative domains and stale disposal still require their own implementation and both-host checks. These baseline images exercise none of the new syntax.
- Requested Gemini/Astra provider reviews, the private-function architecture decision, documentation availability ledger and per-model scientific acceptance remain separate under [PLAN](../../../PLAN.md). This review supplies no substitute provider or scientific approval.

## Inspected artifacts

Every PNG below was actually opened. Artifacts are session-local; retain them through the evidence workflow before relying on durable availability. Other screenshots later added to C's manifest are not claimed as inspected here.

| Model | Theme | CSS viewport | PNG pixels | Artifact |
| --- | --- | --- | --- | --- |
| traffic-grid | light | 1366×768 | 1280×720 | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw5ieplw-886382a1.png) |
| traffic-grid | dark | 1366×768 | 1280×720 | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw5iepvw-0b5d34da.png) |
| traffic-grid | light | 390×844 | 780×1688 | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw5ieq2u-6062f493.png) |
| traffic-grid | dark | 390×844 | 780×1688 | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw5ieq9e-79a3e137.png) |
| traffic-grid-goal | light | 1366×768 | 1280×720 | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw5if0b9-bb056b6b.png) |
| traffic-grid-goal | dark | 1366×768 | 1280×720 | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw5if0l1-3094f633.png) |
| traffic-grid-goal | light | 390×844 | 780×1688 | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw5if0ry-4a633cb0.png) |
| traffic-grid-goal | dark | 390×844 | 780×1688 | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw5if0xu-20e1454c.png) |
| taxi-cabs | light | 1366×768 | 1280×720 | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw5ifqnc-1e6c3021.png) |
| taxi-cabs | dark | 1366×768 | 1280×720 | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw5ifqxe-8c0b67c8.png) |
| taxi-cabs | light | 390×844 | 780×1688 | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw5ifr52-6f89a8ca.png) |
| taxi-cabs | dark | 390×844 | 780×1688 | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw5ifrbm-5b2757b2.png) |
| urban-suite-tijuana-bordertowns | light | 1366×768 | 1280×720 | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw5igoht-76eb34d2.png) |
| urban-suite-tijuana-bordertowns | dark | 1366×768 | 1280×720 | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw5igovj-10b76310.png) |
| urban-suite-tijuana-bordertowns | light | 390×844 | 780×1688 | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw5igp6n-0c9ecb58.png) |
| urban-suite-tijuana-bordertowns | dark | 390×844 | 780×1688 | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw5igpfe-7875f7a1.png) |


## Independent review of correctly sized baseline supplement

The browser operator subsequently supplied a separate real Playwright-Chromium run in `localPlaywrightSupplement` of the same manifest. This reviewer opened all 16 additional original PNGs with the image tool: eight at actual 1366×768 and eight at actual 390×844, in both themes. No resize/postprocessing was used. This resolves the earlier file-size limitation for these baseline artifacts; it does not retroactively change the historical T3 capture sizes above.

Traffic Grid/Goal and Taxi controls, reporters and visible renderers remain readable without horizontal clipping in these captures. Narrow Tijuana includes its complete map and wrapped monitors. The two Tijuana desktop captures are scrolled lower-control states: header/top-map content is outside the captured region. They are valid lower-control evidence, not complete desktop overview evidence; two top-of-page captures have been requested from the operator. The supplement's error arrays are empty, so the earlier T3 ResizeObserver diagnostic was not reproduced in that independent browser run; this alone does not identify its cause.

This supplement remains pre-runtime baseline evidence captured by C. It is not independent approval of the chart changes later implemented by this reviewer or acceptance of the new authoring syntax. That runtime requires a different independent reviewer after actual browser checks.

| Model | Theme | Actual baseline PNG | Artifact |
| --- | --- | --- | --- |
| traffic-grid | light | 1366×768 | [PNG](/tmp/city-library-baseline-traffic-grid-1366-light.png) |
| traffic-grid | dark | 1366×768 | [PNG](/tmp/city-library-baseline-traffic-grid-1366-dark.png) |
| traffic-grid | light | 390×844 | [PNG](/tmp/city-library-baseline-traffic-grid-390-light.png) |
| traffic-grid | dark | 390×844 | [PNG](/tmp/city-library-baseline-traffic-grid-390-dark.png) |
| traffic-grid-goal | light | 1366×768 | [PNG](/tmp/city-library-baseline-traffic-grid-goal-1366-light.png) |
| traffic-grid-goal | dark | 1366×768 | [PNG](/tmp/city-library-baseline-traffic-grid-goal-1366-dark.png) |
| traffic-grid-goal | light | 390×844 | [PNG](/tmp/city-library-baseline-traffic-grid-goal-390-light.png) |
| traffic-grid-goal | dark | 390×844 | [PNG](/tmp/city-library-baseline-traffic-grid-goal-390-dark.png) |
| taxi-cabs | light | 1366×768 | [PNG](/tmp/city-library-baseline-taxi-cabs-1366-light.png) |
| taxi-cabs | dark | 1366×768 | [PNG](/tmp/city-library-baseline-taxi-cabs-1366-dark.png) |
| taxi-cabs | light | 390×844 | [PNG](/tmp/city-library-baseline-taxi-cabs-390-light.png) |
| taxi-cabs | dark | 390×844 | [PNG](/tmp/city-library-baseline-taxi-cabs-390-dark.png) |
| urban-suite-tijuana-bordertowns | light | 1366×768 | [PNG](/tmp/city-library-baseline-urban-suite-tijuana-bordertowns-1366-light.png) |
| urban-suite-tijuana-bordertowns | dark | 1366×768 | [PNG](/tmp/city-library-baseline-urban-suite-tijuana-bordertowns-1366-dark.png) |
| urban-suite-tijuana-bordertowns | light | 390×844 | [PNG](/tmp/city-library-baseline-urban-suite-tijuana-bordertowns-390-light.png) |
| urban-suite-tijuana-bordertowns | dark | 390×844 | [PNG](/tmp/city-library-baseline-urban-suite-tijuana-bordertowns-390-dark.png) |
