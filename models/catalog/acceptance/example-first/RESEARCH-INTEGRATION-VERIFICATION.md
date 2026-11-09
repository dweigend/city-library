# Research integration verification

Date: 8 November 2026. Baseline: `cf9baeaf628b7d09a7c71e0067305e16f1f87984`, isolated branch `docs/model-research-integration`.

This documentation-only change adds a research integration guide and links it from the existing plan and example index. It preserves all three frozen scripts, hashes, commands, phase order and library runtime. Earlier acceptance evidence in [VERIFICATION.md](VERIFICATION.md) remains a separate historical record.

## Executed checks

- `sha256sum -c docs/development/example-first/SCRIPT-SHA256SUMS`: all three accepted scripts match.
- `bun run examples:city`: exit 0; balance 19000; heat tick 1, center 20, total 188.
- `bun run examples:city:targets`: exit 1 at missing `geometry.corridor`, after the first two examples pass. The target remains unfulfilled; no error is converted into success. This run does not reach subtraction or subdivision.
- `git diff --check`: passed for the tracked documentation changes.

No TypeScript, runtime, dependency, runner or UI files changed. Full typecheck/build/consumer and browser checks were not rerun for this documentation-only integration. The checks above do not validate new scarcity, repair or circularity models; those remain proposed briefs.

## Independent review

A read-only consolidation audit recommended the existing-plan integration, semantic checklist, preserved script limits and correction of stale paused-thread descriptions. These findings were incorporated.

The first Antigravity review could not access the target worktree from its workspace and gave no target verdict. A new `gemini-4-argon` review inspected the complete supplied document snapshot and diff and returned APPROVED with no defects. The coordinator then confirmed that all five reviewed document hashes matched the actual worktree. See the [review report, scope and hashes](RESEARCH-INTEGRATION-REVIEW.md).

The reviewer did not independently run worktree commands or tests. This update records the completed review; the guide, accepted scripts and phase plan were not revised after approval. Runtime and main-merge acceptance remain separate.
