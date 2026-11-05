# Agent Lab refactor evidence

Status: implementation in progress. This file separates executed checks from intended acceptance.

## Git checkpoints

- `40c4ce6`: preserves the pre-refactor library and existing application, including previously uncommitted work.
- `085f71b`: refactor assignment and binding DESIGN update.
- `8c53722`: 15 new asserted author scripts, headless entry contract, source archives and provenance. Scripts precede their runtime.

## Executed baseline

Before runtime implementation, `bun run check` passed: existing typechecks, behavior tests, 15 earlier public scripts, browser-target core build and packed Bun/Node/ambient-free TypeScript consumer. This is baseline evidence only, not verification of the refactor.

New example initial failures, exact contracts and hashes are recorded in [agent-lab-examples.md](agent-lab-examples.md). Reference sources, licensing and comparisons are recorded in [netlogo-reference-sources.md](netlogo-reference-sources.md).

## Review decisions

Argon found six architecture blockers; Astra identified step/observation ordering, domain prerequisites and typing issues. Responses and accepted corrections are recorded in [the assignment](agent-lab-refactor.md#review-responses-and-decisions). These are pre-implementation reviews, not approval of runtime behavior. The suggestion to record inside a rule callback was rejected for new models in favor of post-success recording.

## Outstanding acceptance

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
