# Agent Lab refactor evidence

Status: modular replacement implemented; final checks and evidence are recorded below. This is bounded delivery, not full A3/A4/A7 or NetLogo parity.

## Git checkpoints

- `40c4ce6`: preserves the pre-refactor library and existing application, including previously uncommitted work.
- `085f71b`: refactor assignment and binding DESIGN update.
- `8c53722`: 15 new asserted author scripts, headless entry contract, source archives and provenance. Scripts precede their runtime.

## Executed baseline

Before runtime implementation, `bun run check` passed: existing typechecks, behavior tests, 15 earlier public scripts, browser-target core build and packed Bun/Node/ambient-free TypeScript consumer. This is baseline evidence only, not verification of the refactor.

New example initial failures, exact contracts and hashes are recorded in [agent-lab-examples.md](agent-lab-examples.md). Reference sources, licensing and comparisons are recorded in [netlogo-reference-sources.md](netlogo-reference-sources.md).

## Review decisions

Argon found six architecture blockers; Astra identified step/observation ordering, domain prerequisites and typing issues. Responses and accepted corrections are recorded in [the assignment](agent-lab-refactor.md#review-responses-and-decisions). These are pre-implementation reviews, not approval of runtime behavior. The suggestion to record inside a rule callback was rejected for new models in favor of post-success recording.

## Acceptance checklist

- Shared controls/renderers and automatic catalog with no scenario-specific shell branches.
- Four headless reference ports and source-specific behavioral fixtures, including both Wolf Sheep modes.
- Core spatial/grid/stats closure and earlier API compatibility.
- New/old scripts, strict types, tests, build and packed public consumer.
- Actual target browser flows, desktop/mobile and supported themes.
- Setup/progress screenshots compared with separately versioned NetLogo Web references.
- UI guideline review, independent implementation review and fixes.
- Legacy runtime removed; active commands/configs migrated; final Git checkpoints and main-thread handoff.

## Gaps to track

Before this work, spatial movement, Grid/Field, occupancy, field diffusion and generic statistics have no delivered public runtime. New slices must report only their actual closure, not full A3/A4/A7 completion. NetLogo MT RNG compatibility, general advanced activation, full storage/continuation and experiment-runner delivery remain separate capabilities. A renderer or partial snapshot does not provide those contracts.

## Delivered closure and review remediation

- Headless Space/Agent movement, orientation, distance/perception, canonical Grid/Field lookup/neighbors/occupancy/diffusion and World Grid membership; public gini/histogram. Frozen author examples and targeted regressions exercise these bounded operations.
- Shared typed UI components and neutral network/grid/spatial/chart/inspector adapters; automatic paired-entry catalog, independent view state, model actions and cleanup. Legacy Agend_Lab runtime and source-specific projection/layout tests were retired. Their relevant snapshot, layout, selection and lifecycle regressions are covered by new public examples, catalog tests and real-browser checks; the original playback regression is retained against the shared module.
- Four reference entries and both Wolf modes. Model rules remain headless; generic core contains no reference-model imports. Adapted source notices stay with reference ports and archives, excluded from core package files.
- Astra's model audit reproduced two bugs: Voting double-read validation and grass-history availability across live mode changes. Fixed with materialize-once validation and per-sample grassAvailable metadata plus projection filtering; targeted regressions pass. This is author remediation, not independent re-approval.
- Argon's core audit reproduced clipping roundoff/invalid-origin movement, wrapped-endpoint admission, coordinate accessor handling, arity/undefined inconsistencies and statistics option/source validation bugs. Corrected with focused regressions. String sources now reject. Internal nominal Grid membership is retained to preserve sound typed payload admission without any; the suggested any-based replacement was not adopted. The reference does not prohibit private framework identity bookkeeping.
- Plain coordinate records currently use strict own-data x/y/z validation, consistent with creation options; canonical Agent/Field position sources are accepted. Structural Position values carrying extra ordinary metadata require explicit coordinate projection in this bounded runtime. This is an interoperability limitation requiring an explicit broader contract decision, not a claim of complete structural parity.

## Executed target/browser evidence

[Browser comparison and corrective retests](agent-lab-browser-evidence.md) includes all four default setups/progressed runs, both Wolf modes, Run/Pause, live/draft inputs, validation, catalog rebuild switching, layout/keyboard selection, responsive sizing and selective actual light/dark emulation. No complete accessibility or cross-browser certification is claimed.

Root also smoke-tested the replacement server on port 3100 with Preferential Attachment Setup and 10 steps (12 nodes/11 edges), dark/light theme switching and no console errors. Network labels now use the shared muted token and update on preference changes; screenshots are in agent-lab-screenshots/preferential-attachment-theme-{dark,light}.png. All owned browser tabs are closed after checks.

Final executed `bun run check` passed after review fixes: all three TypeScript configurations, 103 tests across 13 files, 35 public example scripts, browser-target build/declarations and packed Bun/Node/ambient-free TypeScript consumer. The packed consumer additionally executes spatial wrapping, typed Grid admission, canonical occupancy, conservative diffusion and histogram/Gini through the installed package. No UI or reference sources enter that archive.

Remaining library work: paths/canMove/gradients, general geometry namespace, advanced activation/MT compatibility, Graph/Input/Agenda World participation, generic Input/stats.describe/alignment/History, study execution/storage/continuation and further graph algorithms. The model-owned bounded histories are not delivery of generic storage.History. Current neutral glyphs, independent layout and RNG differ intentionally from NetLogo; see provenance/deviation records.
