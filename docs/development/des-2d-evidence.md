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

Full integration, final code/design review and eleven-entry real-browser/image acceptance are underway. No final approval is claimed yet. Prior DES approvals apply to the previous implementation, not this redesign or new elevator.

## Planned state-parity and visual checks

Scene inspection uses meaningful states rather than copying the mockups' invented numbers. Primary proposed captures are office/EV at minute 1, goods at minute 3 (blocked producer), bus at minute 6 (berth/queue) plus a travelling state, parcels at minute 2 (occupied outbound van), waste at minute 3 (loaded truck), emergency at minute 5 (active priority call), bikes at minute 2 (stock in transit), water at minute 1 (delivered/unmet), maintenance at minute 10 (working/repair/waiting), and elevator near second 10 (waiting and cabin passengers). These capture choices do not alter model fixtures or require a particular generated count.

Every scene must match actual queue order, Resource/Store occupancy, visible entity count and graph/grid topology. Diagram layouts are presentation coordinates and may not imply new physical routing or calibrated motion. Maximum supported setup values must fit or use an explicit inspectable bounded presentation; silently hiding entities or inventing capacity is not acceptable.

Both public UI adapters need real tests for the new schema, invalid-input handling, rectangle picking, keyboard identity and disposal. All eleven Svelte entries need actual Setup/step/timed Run/Pause/actions/control/model-switch checks, window-error/rejection listeners, repeated resize, desktop/narrow light/dark screenshots and independent actual-image comparison. Representative unchanged Mesa and older graph/grid/chart/table flows provide shared-system regression coverage. The task's preview uses its own free port 3217; the parent's existing 3211 tab is not touched.
