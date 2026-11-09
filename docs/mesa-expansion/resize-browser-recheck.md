# Post-fix resize browser recheck

An independent browser worker checked the integrated canvas scheduling fix on 2026-11-09 using actual T3 server Chrome on port 3191. The source baseline at the start was `ab5289beeeb82535525cfdc18f24f1cc3ffb2273`, which normally merged canvas-only fix `11d78f70ed8af57724698a145d0eb830581160e3`. This check is separate from the earlier Gemini core review and from the initial forty-four-image review. At completion HEAD was `93f70988c6238b7b08d8f9657881e591eaa42f09`; the inspected canvas source remained SHA-256 `0093bcee333722343e3984411819cdc01478461db83270d196a7bd7a6ddf9f73` throughout this pass.

## Method and ownership

The worker followed `preview_status`, then opened its own tab `tab_2i_903760d6-5433-46c2-8790-7b134aa6c724` with `reuseExistingTab=false`. It did not use the parent's or Salabim's tabs or port 3211. A page `window.error` listener, `unhandledrejection` listener, and wrappers retaining native `console.warn/error` behavior were installed before Setup. They remained active across public catalog model switches. Empty snapshot console arrays were not the sole error evidence.

Each resize settled for 500 ms and two animation frames. Actual CSS viewports alternated four times between 390×844 and 1366×768. The check uses ordinary public controls and catalog switching; no private model imports, substitute models, production edits, or hidden model state writes were used.

## Ten Mesa flows

All ten entries were initialized, advanced with 1 step, resized four times, run for 500 ms, paused, and observed for another 500 ms after a settled pause baseline. The first monitor advanced during playback and remained stable after Pause. Catalog switches cleared the preceding monitors/results and returned to Setup to begin. No document-width overflow appeared in the checked desktop states.

| Entry | Settled paused counter | Counter 500 ms later | Window errors / warning-error console / rejections |
| --- | ---: | ---: | --- |
| Household Energy Demand | 2 | 2 | 0 / 0 / 0 |
| Pedestrian Crossing Phases | 2 | 2 | 0 / 0 / 0 |
| Zoning Scenario Comparison | 2 | 2 | 0 / 0 / 0 |
| Neighborhood Heat Intervention | 2 | 2 | 0 / 0 / 0 |
| Residential Occupancy | 2 | 2 | 0 / 0 / 0 |
| Solar Battery Microgrid | 2 | 2 | 0 / 0 / 0 |
| Stormwater Retention | 2 | 2 | 0 / 0 / 0 |
| Urban Tree Watering | 3 | 3 | 0 / 0 / 0 |
| Household Recycling Behavior | 2 | 2 | 0 / 0 / 0 |
| Workplace and Household Membership | 2 | 2 | 0 / 0 / 0 |

Raw results: [flows.json](/tmp/mesa-resize-recheck/flows.json). These entries use tables, charts and networks rather than the changed spatial canvas; their repeated flows establish the requested integration regression check.

## Spatial reproduction and new images

The earlier coordinator reproduction observed five ResizeObserver undelivered-notification window errors in DES Machine Maintenance during Setup and alternating resizes. After the real fix, the worker initialized that spatial entry with the explicit listeners already installed, advanced ten steps, enabled Labels, and performed four alternating narrow/desktop resizes. The complete observed arrays remained empty. Stable canvas buffers were 732×293 pixels at narrow CSS 390×844 and 2044×818 at desktop CSS 1366×768, both DPR 2. The renderer remained visible and usable.

Four fresh, unique settled images were captured after the fix and supplied to the separate independent actual-image reviewer. [Image manifest](/tmp/mesa-resize-recheck/images.json):

| View | Light | Dark |
| --- | --- | --- |
| Desktop | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw92aiv9-dee99c8c.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw92ajf5-d1c8ed22.png) |
| Narrow | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw92ajwf-d80c3f13.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw92akdi-04656503.png) |

Raw spatial listener result: [maintenance.json](/tmp/mesa-resize-recheck/maintenance.json). The earlier forty-four final Mesa images were preserved unchanged.

## Coalescing and disposal probe

A separate deterministic instrumentation probe wrapped browser requestAnimationFrame/cancelAnimationFrame only for frames originating from the canvas module. It held the canvas's next real scheduled callback, without executing it or changing model rules. Setup queued handle 9000001. Two further viewport changes while that callback was held left exactly the same single pending handle, confirming coalescing.

The worker then used the public catalog to switch DES Machine Maintenance to Household Energy Demand. Disposal called cancelAnimationFrame for handle 9000001; the held queue became empty, the old canvas was detached, and the new entry showed Setup to begin with no old monitors. The probe deliberately invoked the captured cancelled callback once afterward to simulate a late-delivery race. It produced zero observed clearRect calls on the detached canvas and left its buffer dimensions unchanged at 2044×818. The runtime error arrays remained empty. All instrumented functions were restored afterward.

Raw probe result: [disposal.json](/tmp/mesa-resize-recheck/disposal.json). This is an explicitly instrumented lifecycle test, not a claim that the browser naturally delivered a cancelled frame. It tests the pending-frame cancellation and disposed guard through ordinary model teardown, without importing private implementation functions.

## Limits and handoff

No source files, dependencies or model state APIs were edited by this worker. The own browser tab was closed after checks; the server and other tabs were left untouched. Independent source review and actual-image review are separate evidence.

The observed normal host flows no longer reproduced the reported ResizeObserver window error. This is not a universal console-clean or ResizeObserver-immunity claim. In particular, a caller deliberately invoking its own public action/update inside its own ResizeObserver callback remains outside these ordinary-host checks and can still cause synchronous layout feedback. Scientific validity, complete accessibility, all browser engines and full NetLogo compatibility are not established by this pass.


## Portable raw evidence

The coordinator preserved byte-identical copies of the raw [ten-flow journal](resize-browser-evidence/flows.json), [spatial listener result](resize-browser-evidence/maintenance.json), [disposal probe](resize-browser-evidence/disposal.json), and [four-image manifest](resize-browser-evidence/manifest.json). Image SHA-256 values match the independently inspected originals. Temporary paths above retain provenance; these relative copies preserve the same evidence within the repository.
