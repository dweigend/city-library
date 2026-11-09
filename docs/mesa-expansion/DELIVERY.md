# City mechanisms delivery

Ten requested mechanisms are implemented through public headless APIs and the normal Mesa/Salabim integration. Ten original illustrative model/UI pairs supplement the fixed upstream selection of 200; they are not accepted NetLogo ports. README, its diagram and the selection ledger are unchanged. The models use synthetic assumptions, not calibrated city predictions.

Worktree: `/home/david/.t3/worktrees/city-library/t3-4fc992c0`. Owned branch: `feat/mesa-mechanisms`. No push, PR, publication or main merge was performed. Final Git identity/status is reported in the handoff rather than embedding a self-referential commit hash here.

## Delivered mechanisms

| Requested capability | Public composition and evidence |
| --- | --- |
| Pure reusable measurements | `measurements.define(project).read(model)`; detached finite numeric projections reused by observations, studies and UI. |
| Bounded explicit history and export | `storage.history`, explicit `add`, detached `samples`, `delete`; ordinary JSON export of selected samples, no complete continuation. |
| Parameter scenarios and replications | `experiments.design`, `replicate`, serial `run`, `summarize`; independent runs and explicit seeds. |
| Activation and lifecycle | `world.activate/report/select`; fixed, shuffled and stable priority order, scoped contexts and coordinated death. |
| Two-phase updates | `twoPhase` computes all proposals before commits; explicit partial-failure semantics, no hidden clock or rollback. |
| Events | `Agenda.add/delete/advance/next`; caller-composed one-off, repeated and cancelled events, stable ties, explicit event budgets. |
| Stopping and budgets | Existing study stop/sample policies and preflight budgets, explicit horizon/stop/error/adapter reasons; incomplete event intervals do not silently count a tick. |
| Continuous thresholds | `continuous.linear/crossing`; declared units, strict start/inclusive end, rounded IEEE-754 interpolation and explicit causal rescheduling. |
| Groups | Existing Graph membership, canonical objects and readonly native snapshots; no parallel group registry. |
| Capacity and reservations | Salabim-owned Resource is the only allocation owner; queued/granted outcomes, release/cancel, capacity changes and deletion veto. |

The [central reference](../agent-loom/api-reference.md), [cross-track contract](../../CROSS-TRACK-CONTRACTS.md), [measurement decisions](measurements.md) and [dynamics decisions](dynamics.md) separate delivered subsets from broader target APIs. Full NetLogo MT compatibility, generic snapshots/continuation, pause/resume, workers and calibration remain open targets.

## Ten original entries

Each directory contains its inert headless model and flat shared UI. The [model inventory](models.md) records mechanisms, units, provenance and limitations.

| Entry | Model | UI |
| --- | --- | --- |
| Household energy demand | [model.ts](../../experiments/household-energy-demand/model.ts) | [ui.ts](../../experiments/household-energy-demand/ui.ts) |
| Pedestrian crossing phases | [model.ts](../../experiments/pedestrian-crossing-phases/model.ts) | [ui.ts](../../experiments/pedestrian-crossing-phases/ui.ts) |
| Zoning scenario comparison | [model.ts](../../experiments/zoning-scenario-comparison/model.ts) | [ui.ts](../../experiments/zoning-scenario-comparison/ui.ts) |
| Neighborhood heat intervention | [model.ts](../../experiments/neighborhood-heat-intervention/model.ts) | [ui.ts](../../experiments/neighborhood-heat-intervention/ui.ts) |
| Residential occupancy | [model.ts](../../experiments/residential-occupancy/model.ts) | [ui.ts](../../experiments/residential-occupancy/ui.ts) |
| Solar battery microgrid | [model.ts](../../experiments/solar-battery-microgrid/model.ts) | [ui.ts](../../experiments/solar-battery-microgrid/ui.ts) |
| Stormwater retention | [model.ts](../../experiments/stormwater-retention/model.ts) | [ui.ts](../../experiments/stormwater-retention/ui.ts) |
| Urban tree watering | [model.ts](../../experiments/urban-tree-watering/model.ts) | [ui.ts](../../experiments/urban-tree-watering/ui.ts) |
| Household recycling behavior | [model.ts](../../experiments/household-recycling-behavior/model.ts) | [ui.ts](../../experiments/household-recycling-behavior/ui.ts) |
| Workplace/household membership | [model.ts](../../experiments/workplace-household-membership/model.ts) | [ui.ts](../../experiments/workplace-household-membership/ui.ts) |

## Executed verification

- Example-first commits `9b3b0f6`, `95d94c5` and `4371a38` precede runtime; Salabim freezes and runtime arrived through normal merges.
- Independent full `bun run check`, started at `79c9ffc`: **707 tests, 183,808 assertions, all registered examples, library build and packed Bun/Node/ambient-free TypeScript consumers passed in one chained run**. Earlier failed attempts and corrections remain in [the independent report](independent-testing.md).
- Subsequent presentation-only changes received complete typechecks (Svelte 0 errors/0 warnings), explicit `CITY_LIBRARY_UI_RUNTIME=svelte bun run build:ui:svelte`, affected model scripts and targeted browser/image checks. The build retains the existing chunk-size advisory.
- All ten original entries passed actual setup/input/step/timed Run/Pause/live-action/model-switch checks, including capacity error recovery and keyboard focus. [Browser evidence](browser-verification.md) distinguishes these flows from event-channel coverage.
- All 44 final original images were independently opened and approved after two label findings were fixed and recaptured. [Image review](screenshot-review.md) and [portable PNG manifest](browser-evidence/manifest.json) preserve exact paths, viewport/DPR and SHA-256 equality to inspected originals.
- A later explicit window-error listener reproduced ResizeObserver warnings in the shared spatial canvas. The canvas-only fix `11d78f7` is normally integrated at `ab5289b`; post-fix targeted browser/disposal/source/image gates are recorded separately as they complete. Image approval alone does not establish absence of runtime errors.

## Independent review boundaries

Antigravity `gemini-3.8-flash` with `thinking_level=high` performed the [contract review](gemini-contract-review.md). Findings and author responses are [separate](review-responses.md). The [fresh final review](gemini-final-review.md) explicitly approved the requested scope on `98015d0` (acknowledging non-interfering evidence through `2446724`). Its exact selected option was `thinking_level=high`. Later central-reference documentation, maintenance labels and canvas scheduling are explicit post-review deltas rather than claims that Gemini observed them.

Codex `gpt-6-astra` with `reasoningEffort=high` performed deep logical analysis of time, activation, thresholds and ownership. It withheld unconditional runtime approval and identified the edge cases subsequently documented/fixed and adversarially tested. Independent library refactors and three model-batch passes preserve accepted examples and seeded trajectories; their reports are [measurements](measurement-refactor.md), [dynamics](dynamics-refactor.md) and [models](model-refactor.md).

No report claims full scientific validation, complete accessibility, mathematical exactness of floating-point interpolation, full upstream compatibility or general model continuation. The separate DES evidence also retains the synthetic queue utilization confidence-interval miss instead of implying empirical equivalence.

## Post-review canvas delta

The independently reproduced spatial ResizeObserver warning led to the normally merged UI-only fix `11d78f7` at `ab5289b`. Salabim exclusively changed `ui/views/canvas.ts`: read dimensions during observer delivery, coalesce buffer writes/draw into one animation frame, and cancel that frame on dispose. No model, clock, Random, chart, network or CSS code changed. The [separate focused source review](resize-source-review.md) approved this bounded source/lifecycle delta and independently executed nineteen UI tests (108 assertions). It is not attributed to the earlier Gemini approval.

On the integrated post-fix checkout, the coordinator executed `bun run typecheck` (Svelte 0 errors/0 warnings), nineteen UI authoring/chart tests (108 assertions), and the explicit Svelte production build (1.63 seconds), all passed. The unchanged frozen maintenance model script and eight public Mesa integration tests (41 assertions) also passed. Post-fix real-browser resize/error/dispose and affected-image rechecks remain separately recorded before final acceptance.
