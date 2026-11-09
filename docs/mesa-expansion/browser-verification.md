# Mesa browser verification

Real browser checks ran on 2026-11-09 against the Svelte Agent Lab at port 3191 in an independently opened T3 server Chrome tab. The browser worker owned only this report. No model, UI, shared CSS, dependencies or source contracts were changed by this worker.

## Tools and capture conditions

The frontend-design, frontend-design-shadcn-svelte, shadcn-svelte and web-design-guidelines instructions were applied. The current Vercel Web Interface Guidelines were fetched successfully from the upstream raw command file before this review. Source rules complement, and do not replace, the following actual browser interactions.

T3 preview automation was available and used directly under the required preview_status → own preview_open sequence. The worker never used the parent's tab or the Salabim tab/server at port 3211. The configured Playwright MCP sandbox failure was reported separately by the Salabim coordinator; it was not reproduced or claimed as this worker's execution. These checks used an actual running shared Chrome browser, not a source-only substitute.

Every main screenshot records an authoritative preview_resize return and page innerWidth/innerHeight/devicePixelRatio in the [final manifest](/tmp/mesa-browser/final-manifest.json). Desktop CSS viewport is 1366×768 at DPR 2; narrow CSS viewport is 390×844 at DPR 2. The preview export downsamples desktop PNGs to 1280×720; narrow PNGs are 780×1688. PNG dimensions therefore differ from the verified CSS viewport. All 40 main screenshots satisfy the requested CSS viewport conditions; four additional scrolled images show the changed chart/inspector.

Screenshots wait 500 ms and two animation frames after theme changes. This matters because shared controls intentionally transition color for 150 ms: earlier draft captures taken after only two frames showed intermediate low-contrast paint. Those files are superseded and excluded from the final manifest. Stable dark captures record foreground oklch(0.985 0 0) and background oklch(0.145 0 0); light captures record oklch(0.145 0 0) on oklch(1 0 0). Main page width equals viewport width. Wide tables scroll within their own overflow container instead of widening the document.

## Executed flows

Each of the ten entries was loaded, given an edited setup input, initialized, advanced with 1 step, started with Run and paused with Pause, and advanced with 10 steps. The setup input edits were: households 12→15, pedestrians 8→9, zoning parcels 12→13, heat width 6→7, occupancy applicants 8→9, battery seed 1→2, basin capacity 3→4, trees 10→11, recycling households 12→13, and membership residents 6→7. Changed setup is explicit: an already initialized model shows Restart with changes, and pressing it resets the model using the prepared input. The energy check verified initial demand 4.50 kW for 15 households and energy 45.00 kWh after ten hours.

| Entry | Browser mechanism result |
| --- | --- |
| Household energy demand | Step increased energy; Run/Pause responded; changing households required explicit restart. Live shifted share 1 caused no setup-pending flag and produced 104.40 kWh after 20 hours. |
| Pedestrian crossing phases | Changed cohort of nine arrived together by minute 5; red phase and waiting/crossing/arrived counts were visible. Latest screenshots use the corrected full green-duration cycle. |
| Zoning scenario comparison | Six completed runs and paired scenario/seed outcome rows; summaries include three replications per scenario. After the independent screenshot finding, the parent shortened chart labels to Run 1…Run 6 and formatted displayed means/deviations to two decimals. Changed desktop/narrow themes and scrolled narrow chart were rechecked and recaptured. |
| Neighborhood heat intervention | Changed grid width was reflected in field rows; 10 steps changed mean heat. Live shade cooling 2 produced mean index 20.00 at tick 10, with no setup-pending flag. |
| Residential occupancy | Resource-backed statuses show granted/waiting/released. Move out first household changed the first grant; subsequent periodic releases admitted waiters. Live slots 4 produced occupied 4 and waiting 1 at day 10. |
| Solar battery microgrid | Changed seed replay initialized successfully; step/run reached reserve crossing count 1 at hour 3.5 in the tested seed-2 trajectory, preserving bounded stored energy and reporting grid imports. |
| Stormwater retention | Capacity edit to 4 produced one capacity crossing, stored 4.00 m³ and overflow 3.70 m³ at hour 11. Live rain 0 resulted in zero stored volume, overflow and crossings after ten hours. |
| Urban tree watering | Changed tree count displayed eleven rows; daily use stayed 20 L in the tested run. Live allowance 0 yielded used-today 0 and total water 0 after ten days. |
| Household recycling behavior | Seeded graph and adoption series progressed. Live influence 0 retained exactly one initial adopter after ten steps. After the screenshot finding, parent changed graph labels to compact H1…H12 and added the accepted inspector view. Clicking H1 in the node selector displayed Household 1/recycling true. Clicking the actual H11 canvas node changed the inspector to Household 11/recycling true while Tick 10 and seven adopters stayed unchanged. All four views and two scrolled narrow inspector states were recaptured. |
| Workplace and household membership | Reassign first resident changed workplace; all seven residents retained household and workplace rows, with 14 membership edges. Graph and table updated through the shared actions. |

A separate playback check let each of the ten models run for 500 ms: every first monitor advanced from zero. After Pause and settled Run-button state, another 500 ms left the displayed step/run counter unchanged. Three checks were repeated with a settled paused baseline because a scheduled frame landed between the first read and the Pause click. The repeated counters were stable; no post-pause advancement was observed. Raw interaction/playback journals are retained under `/tmp/mesa-browser/`.

Additional interaction checks:

- On narrow view, Parameters expands the canonical controls; they remain usable.
- Keyboard catalog selection via search, ArrowDown and Enter switched the membership model to Solar Battery Microgrid, changed the URL, cleared the old results/canvas and showed Setup to begin. Focus returned to the Experiment combobox. Setup followed by Tab moved focus to Run with its visible 3 px focus ring.
- Occupied capacity shrink 3→2 was rejected with Capacity cannot shrink below granted units, aria-invalid=true, and occupied remained 3. Correcting slots to 4 cleared the error and admitted the next applicant.
- No unexpected model alert remained in the successful checked flows. The explicitly induced capacity error is expected validation behavior. Snapshot console arrays are not a universal console-error guarantee; the later explicit resize-error reproduction below qualifies that evidence.

The first Residential navigation showed a stale catalog-metadata error for the previously absent Resource export. The parent restarted only the port-3191 Vite server after runtime integration; Residential then loaded and passed the checks above. This was recorded as an integration cache issue, not accepted as a source-only workaround.

## Final screenshots

Earlier draft screenshots and manifests are superseded. These are the settled final images supplied for independent image inspection.

| Entry | Desktop light | Desktop dark | Narrow light | Narrow dark |
| --- | --- | --- | --- | --- |
| `household-energy-demand` | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91o5tq-a3a5b4d7.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91o6c8-b647551a.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91o6t2-a3ed1132.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91o79f-bda402f6.png) |
| `pedestrian-crossing-phases` | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91o893-dcb31655.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91o90s-3388dd96.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91oa2w-e96bb3ae.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91oaqu-da0634e7.png) |
| `zoning-scenario-comparison` | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91rko6-646b3eb2.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91rl7q-b4660377.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91rlou-7a9e19aa.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91rm5k-dd971ba6.png) |
| `neighborhood-heat-intervention` | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91oed3-0d32f0a0.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91oexh-18d05e1b.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91off3-ff24d52f.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91ofwu-72df4df7.png) |
| `residential-occupancy` | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91ogws-fd61a6e2.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91ohgi-6f45133b.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91ohyv-5831fdd3.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91oifd-cdcb1a67.png) |
| `solar-battery-microgrid` | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91ojcc-fd15c81c.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91okee-22942eee.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91ol08-db501e73.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91olgl-64e71a60.png) |
| `stormwater-retention` | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91omdw-e2092d26.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91omww-30e8d4f2.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91one2-90daf2e0.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91onuo-e0d5ce3a.png) |
| `urban-tree-watering` | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91oosc-18166622.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91opbg-70867ac9.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91opsd-fe42d062.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91oq8x-c5667b21.png) |
| `household-recycling-behavior` | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91t8qq-4ad71e80.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91t9ao-50ab48b2.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91t9t4-cdc56bed.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91taa6-39395db7.png) |
| `workplace-household-membership` | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91otxd-160629e1.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91ouhl-9407a7fd.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91ouzr-6f26beb4.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91ovgv-efd5c556.png) |

Additional scrolled images:

- `zoning-scenario-comparison` narrow-chart light: [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91rmn3-6eba50c9.png)
- `zoning-scenario-comparison` narrow-chart dark: [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91rn4g-d004ca8c.png)
- `household-recycling-behavior` narrow-inspector light: [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91tas9-4b6aa882.png)
- `household-recycling-behavior` narrow-inspector dark: [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw91tb9f-f7e47c9d.png)

## Acceptance limits

This record establishes executed browser interactions and captured evidence. Independent screenshot findings, parent fixes and independent reapproval belong to the separate screenshot-review record. This worker does not claim complete accessibility conformance, touch-device coverage, scientific validation, or full NetLogo compatibility. Browser checks do not replace the shell/type/package checks recorded by other workers.

## Portable evidence copies

The coordinator copied all forty-four final approved PNGs byte-for-byte into [browser-evidence](browser-evidence/manifest.json). The manifest records original paths, verified CSS viewport/DPR, portable filenames and SHA-256 values. Every copy hash equals its independently inspected original. This does not replace or expand the review; it preserves those same images without requiring temporary browser directories.

## Late resize-error investigation

After the successful interaction and image checks, Salabim reported Vite client window errors during resizing. The coordinator independently installed a `window.error` listener before Setup on port 3191. Four alternating narrow390×844/desktop1366×768 resizes, each settled for500ms, produced no errors in Household Recycling Behavior (network and chart). The same sequence in the integrated DES Machine Maintenance spatial view produced five `ResizeObserver loop completed with undelivered notifications.` events, including initialization. The model remained usable; no model-state loss was observed in this short sequence. An empty preview snapshot console array and the silent local Vite session did not detect this event channel.

The shared spatial canvas observer is under coordinated investigation by Salabim. No source change or universal console-clean claim is made by this report. Existing successful flows and independent image approval remain their stated evidence; they do not clear this runtime warning. Any accepted fix and targeted reproduction result will be recorded separately.

## Post-fix resolution

The later normally merged canvas fix `11d78f7` is covered by a separate [source review](resize-source-review.md), [real-browser recheck](resize-browser-recheck.md) and [four-image reapproval](resize-image-review.md). All ten original Mesa flows were repeated with explicit error/rejection/console instrumentation; none captured an error in the checked ordinary-host sequences. The spatial Maintenance reproduction changed from five captured window errors to zero. A deterministic pending-frame/cancel/dispose probe also passed. These scoped results resolve the reproduced ordinary-host warning; deliberate caller updates from the caller's own ResizeObserver callback remain outside that guarantee. The earlier core Gemini approval does not retrospectively cover this source delta.
