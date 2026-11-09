# Independent measurement and study refactor

This review covers `src/measurement`, `src/storage` and the serial `src/experiments` implementation after its initial handoff. It applies the library refactoring skill, shared workflow and decision examples from the main checkout, the coding standards, and the binding measurement-history/study contracts. The frozen public examples remain unchanged.

## Findings and responses

The study sample preflight counted a possible final observation in addition to every completed boundary, even when no additional boundary existed. This rejected a zero-step study with a one-sample budget and a two-step study sampled at every boundary with a three-sample budget. The correction caps the conservative estimate at `steps + 1`, preserving preflight rejection and conditional-sampling conservatism. Regression coverage includes zero steps, final-only sampling, every-boundary sampling and a filtered study whose declared upper bound still exceeds its budget.

Explicit-plan validation also retained a replication-index Set that was never read. The existing scenario/replication position Set already validates unique positions. Removing the unused Set removes duplicate state without changing accepted identities or ordering.

A new regression verifies that an ordinary synchronous step returning a thenable fails after its own effects, receives no runner tick or completed-step count, does not force a partial-state observation, and still disposes the model exactly once. Existing coverage retains primary and cleanup diagnostics separately and verifies the adapter-stopped seam.

The ownership and dependency boundaries are appropriate for this slice: History owns only its bounded numeric buffer; measurement definitions own no model state; studies call the existing World runner and clone ordinary study data. No browser globals, framework UI dependency, alternate capacity owner, hidden RNG stream or second model execution declaration was introduced. Existing supported-value copying remains reused rather than replaced by a second serializer.

## Executed checks

- `bun test tests/mesa-measurements.test.ts`: 11 tests passed, 48 assertions, zero failures.
- All five `examples/mesa-measurements/*.ts` executed through the public `city-library` import: passed.
- `bunx tsc --noEmit`: passed.
- `bun run typecheck`: executed and failed in the concurrent attachment/DES integration. Diagnostics concern absent root exports `Agenda`, `Resource`, `Store`, `EventTrace`, `TimeWeighted`, missing `World.agendas`, and derived implicit-any uses in DES models. No diagnostic points into this reviewed slice.

## Independent assessment and remaining gates

The concrete findings above are fixed and the reviewed slice's focused checks pass. This assessment is independent of its original author, but is limited to the files and serial contracts reviewed. It does not grant whole-project acceptance, runtime/browser acceptance, scientific validation, full storage continuation, pause/resume, worker execution or calibration. The coordinator must repeat the full checks after cross-track integration and complete public packed-consumer and browser evidence separately.
