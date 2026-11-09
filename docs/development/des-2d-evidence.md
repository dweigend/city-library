# DES 2D scenes and elevator evidence

This task replaces the ten DES primary visualizations with simple state-driven 2D scenes and adds an eleventh, executable elevator experiment. It uses the existing Agent Lab UI, public authoring schema and shared rendering system. It does not redesign the Mesa experiments or change the ten accepted DES mechanisms.

## Baseline and reference direction

Worktree: `/home/david/.t3/worktrees/city-library/t3-4aa89a8c`; owned branch `feat/salabim-concepts`; clean starting commit `44272279e22a82deb162589f892ec058c50994d8`. Local commits are authorized; publication, PRs and main merges are not.

The coordinator opened all eleven selected PNGs with the image viewer before implementation. The selected reference directory is the parent worktree's `output/imagegen/salabim-mockups-2d/`, files `01-civic-office.png` through `11-elevator.png`. Only their flat scene direction is accepted: circles, rectangles, triangles, diamonds, discrete patches and thin links on the existing charcoal visualization surface. Generated menus, duplicate playback controls, textures, shadows and count mistakes are not implementation requirements. Actual observations remain authoritative; in particular the elevator reference draws eight cabin passengers while claiming five.

The existing Svelte/shadcn shell owns playback, inputs, focus, theme and layout. The shared frontend-design, frontend-design-shadcn-svelte and shadcn-svelte skills were read; final QA uses web-design-guidelines with freshly retrieved rules. The existing UI surface already has fixed charcoal canvas tokens in both themes, so a second theme system is unnecessary.

## Ownership and example gates

Shared UI schema, validation, palette and renderers are exclusively owned by this task during implementation; both Mesa coordination threads were notified. Scene bindings are split into disjoint groups. Elevator contracts and model implementation are separate from independent source research. Tests, refactors, substantial reviews and real-browser/image acceptance use independent agents.

The exact refactor skills and their shared workflow/decision examples were read from the original repository at `/home/david/Projekte/city-library/.agents/skills/`. Full coding standards apply to the shared UI and model/UI scripts. Refactor authors must preserve accepted public syntax, domain observations and random schedules.

Five public UI scripts in commit `362dce2` froze the additive primitive/schema contract before shared runtime changes. Five public elevator scripts in commit `e90eccb` froze dispatch, capacity, transfer timing and failure behavior before its implementation. Existing fifteen DES capability/model assertions remain active regressions. The coordinator captured fifty complete original observations (all ten models at times 0, 1, 4, 10 and 20) in `/tmp/des-2d-baseline/observations.json`; additive observations must leave all original fields unchanged.

## Current source and verification status

The shared UI runtime (`f40fc4e`), two groups of five scene bindings (`ce91be4`, `62f6031`) and elevator (`48a4349`) are implemented. Public example registration and legacy alert semantics were integrated in `5e71ae`. The browser-only assertion helpers in frozen UI scripts 04/05 were changed from Node assertions to the existing browser-compatible authoring assertions without changing their checks, values or public calls.

Independent test commit `6bce789` adds 13 tests with 506,861 passing assertions, covering all eleven scene projections and elevator adversarial behavior. Existing ten-model scripts and five elevator scripts pass. The shared geometry refactor (`4ed0c5`) separately reports 25 tests / 127 assertions; model refactor `8628280` preserves 55 complete observation/scene pairs byte-for-byte (SHA256 `299b76703386562d9d84f0ff7b4e41e0da302d68c513b3a16cffb6d35a4b83e9`) and reports 24 tests / 515,568 assertions plus a clean full typecheck. Detailed evidence remains in the independent reports.

The coordinator executed `bun run check` on the integrated pre-boundary-fix source: **737 tests passed, 0 failed, 699,395 assertions**, all registered public examples, TypeScript/Svelte checks, library build and packed Bun/Node ESM/ambient-free TypeScript consumers passed (exit 0). The command log is `/tmp/des-2d-full-check.log`. This full run predates the later precise fixes below and is not relabeled as a full run of those deltas.

The independent native source reviewer found a stale mixed-selection sentence and a finite-but-unrepresentable canvas buffer boundary. The sentence was corrected in `1f994d5`. Actual browser repro in both adapters confirmed that scene width 1, height 2^32 could wrap DOM canvas height to zero and lose the previous buffer. Fix `1e5849c` rejects candidate dimensions outside positive unsigned 32-bit integers before publishing state or touching DOM dimensions. The independent source recheck approves the correction in `1e6b6a3`; its seven geometry tests / 35 assertions pass. Coordinator post-fix checks: 26 UI tests / 143 assertions and full typecheck (Svelte 0 errors, 0 warnings) passed. Explicit `bun run build:ui:svelte` passed in 958 ms, with the existing bundle-size advisory. Fresh actual browser checks preserve identical previous canvas pixels/dimensions and report the accessible validation error with zero window errors/rejections in both hosts. This is a representability check, not a guarantee of browser-specific canvas allocation limits.

Independent actual-image review found a narrow waste-scene depot annotation overlapping a collection patch. Fix `b3cb3b9` shortens that diagram label to “Depot” and retains actual unloading/availability in the accessible description. No model action, time, capacity or entity changed. Nine affected scene tests / 320,983 assertions and the frozen waste script passed. The independent inspector approved all four fresh waste captures in both viewport sizes and both themes. The final post-label `bun run typecheck` passed with 0 Svelte errors/warnings and explicit Svelte build passed in 614 ms.

The NEW [Gemini high-reasoning design/transfer/source review](des-2d-gemini-review.md) is **APPROVED**, including the corrective commits through `b3cb3b9`. It directly executed 31 focused tests / 515,603 assertions plus 12 public-authoring tests / 55 assertions, all passing, and all ten newly frozen public scripts. The [native source review](des-2d-code-review.md) separately approves the precise numeric correction. Neither source approval substitutes for browser evidence.

The [independent actual-image review](des-2d-image-review.md), commit `cf34483`, is **APPROVED** for all 44 final captures: eleven models × desktop/narrow × light/dark. It actually opened the eleven selected references and 48 browser PNGs (44 initial plus four corrected waste captures), then checked final original/portable bytes against the manifest. No visual finding remains. Desktop CSS was 1366×768; the backend downsamples its PNG to 1280×720. Narrow CSS was 390×844 at DPR2; PNG was 780×1688. These recorded dimensions are not conflated.

The [independent browser report](des-2d-browser-review.md), commit `d8bf335`, completes the interaction gate: all eleven actual catalog entries passed Setup, step, timed Run/Pause, supplied actions, valid numeric controls, keyboard selection, four alternating resizes and model switching. Time advanced 0 → 1 → 3 and remained stable after Pause in each alternate configuration. Ordinary flows produced zero window errors/rejections. Both adapters passed frozen browser scripts 04/05 and adversarial numeric/selection probes. Held resize frames coalesced, consumed the latest projection, cancelled on disposal/catalog switch, and forced late callbacks produced zero old-canvas draws. Four unchanged table/chart/network/grid entries passed regression flows.

Configured Playwright MCP was attempted and could not launch because its Chromium SUID sandbox helper lacked the required root ownership/mode 4755. Actual checks ran in isolated T3 Chrome tabs on port 3217. Light/dark checks used the existing dark media-query declarations temporarily applied by QA and recreated renderers from computed tokens; they do not claim OS theme switching. DPR 2 is native; DPR 1 was a renderer-property override, not a separate physical device. These exact tooling limits remain in the browser report. No universal console-clean or full accessibility certification is claimed.

**This authorized local slice is complete.** All implementation, independent refactor, source/design, browser and actual-image gates are satisfied within their recorded scope. No known blocking finding remains. The server remains at `http://localhost:3217/`; both task-owned browser tabs were closed. The parent’s port 3211 was not touched. No push, PR, publication or main merge was performed. Prior DES approvals apply to the previous implementation, not this redesign or new elevator.

## Planned state-parity and visual checks

Scene inspection uses meaningful states rather than copying the mockups' invented numbers. Primary proposed captures are office/EV at minute 1, goods at minute 3 (blocked producer), bus at minute 6 (berth/queue) plus a travelling state, parcels at minute 2 (occupied outbound van), waste at minute 3 (loaded truck), emergency at minute 5 (active priority call), bikes at minute 2 (stock in transit), water at minute 1 (delivered/unmet), maintenance at minute 10 (working/repair/waiting), and elevator near second 10 (waiting and cabin passengers). These capture choices do not alter model fixtures or require a particular generated count.

Every scene must match actual queue order, Resource/Store occupancy, visible entity count and graph/grid topology. Diagram layouts are presentation coordinates and may not imply new physical routing or calibrated motion. Maximum supported setup values must fit or use an explicit inspectable bounded presentation; silently hiding entities or inventing capacity is not acceptable.

Both public UI adapters need real tests for the new schema, invalid-input handling, rectangle picking, keyboard identity and disposal. All eleven Svelte entries need actual Setup/step/timed Run/Pause/actions/control/model-switch checks, window-error/rejection listeners, repeated resize, desktop/narrow light/dark screenshots and independent actual-image comparison. Representative unchanged Mesa and older graph/grid/chart/table flows provide shared-system regression coverage. The task's preview uses its own free port 3217; the parent's existing 3211 tab is not touched.

## Delivered scene inventory

Each experiment has a headless `model.ts` and thin declarative `ui.ts`; pure projection helpers remain local where useful. The main view uses the existing spatial renderer.

| Experiment | Main scene and authoritative mechanism |
| --- | --- |
| [Civic office](../../experiments/des-civic-office/ui.ts) | Ordered resident dots, occupied/free clerk rectangles |
| [EV charging](../../experiments/des-ev-charging/ui.ts) | Priority-marked vehicle queue and Resource-owned charger slots |
| [Goods buffer](../../experiments/des-goods-buffer/ui.ts) | Bounded Store slots, actual crates and blocked producers outside |
| [Bus interchange](../../experiments/des-bus-interchange/ui.ts) | Actual weighted graph, moving buses, berth and waiting queue |
| [Parcel logistics](../../experiments/des-parcel-logistics/ui.ts) | Depot buffer, destination graph and occupied outbound/returning van |
| [Waste collection](../../experiments/des-waste-collection/ui.ts) | Six actual quantity patches, truck capacity and depot disposal |
| [Emergency dispatch](../../experiments/des-emergency-dispatch/ui.ts) | Actual graph, priority incident diamonds and team triangles |
| [Bike redistribution](../../experiments/des-bike-redistribution/ui.ts) | Three station slot rectangles, conserved stock and transit vehicle |
| [Water allocation](../../experiments/des-water-allocation/ui.ts) | Four actual district demand patches, allocated/unmet units; no hydraulic claim |
| [Infrastructure maintenance](../../experiments/des-machine-maintenance/ui.ts) | Actual machine status squares and maintenance crew triangles |
| [Elevator](../../experiments/des-elevator/ui.ts) | Floor lines, waiting dots, bounded cabins, actual riders and direction markers |

The shared additive schema supports rectangle/diamond shapes, diagram-unit rectangle extents, filled/outlined slots, stroke controls, nonselectable labels and accessible descriptions. It exports one semantic scientific palette from both adapters. No custom draw callback, duplicate scene engine, domain clock, capacity owner or per-experiment literal palette was introduced. Pure circle/triangle views retain legacy selection semantics; mixed diagrams use actual painted bounds.

The elevator defaults to six floors, two cars and capacity four. It exposes bounded arrivals, public passenger actions, deterministic oldest-call dispatch, per-direction FIFO queues, alighting before boarding, explicit wakeups and per-step event bounds. Its waits/rides are finite-run descriptive measurements. Pinned MIT upstream provenance and intentional deviations from upstream bugs are documented in [the independent source record](../research/des-elevator-sources.md). It is a synthetic teaching model, not optimized dispatch, empirical calibration or physical elevator certification.
