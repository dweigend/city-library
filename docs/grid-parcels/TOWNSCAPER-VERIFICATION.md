# Finite quad topology verification

This record separates target checks, independent reviews and the remaining
catalogue. The first delivery implements only finite quadrilaterals and
square-target relaxation. The [source receipt](TOWNSCAPER-RECEIPT.md) retains the
full 49-row roadmap and the historical 58-section reference.

## Preparation and accepted city contracts

The bound branch started clean at `2a7f3eb`. The current primary-checkout
AGENTS.md and CODING_STANDARDS.md were read without changing that checkout.
Antigravity `gemini-4-argon` availability was confirmed. No source runtime code
or external geometry dependency was imported.

The initial `bun run check` could not find installed Bun types. After
`bun install --frozen-lockfile` (no lockfile changes), the baseline typecheck and
605 tests / 152156 expectations passed. That full check was deliberately stopped
during examples when the user paused contract preparation. It does not establish
a complete example/build/consumer pass.

The user later accepted E0 and authorized continuation. Commit `cf9baea` was
cherry-picked as `2df94d1`, preserving all concurrent untracked preparation.
Executed after integration:

- `sha256sum -c docs/development/example-first/SCRIPT-SHA256SUMS`: all three match.
- `bun run examples:city`: passed, balance 19000 and heat total 188.
- `bun run typecheck:city`: passed.
- `bun run examples:city:targets`: exit 1 at absent `geometry.corridor`.
- `bun run typecheck:city:targets`: exit 1 for absent corridor/subtract/subdivide
  and five dependent implicit-any diagnostics.
- Source package SHA-256 verification: all 28 transferred files match.

The quarter is an unmet E1/E2 target, not a passing test or an E3 regression.
Its source and all accepted hashes remain unchanged. No placeholder API,
expected-failure success or skipped assertion hides that target.

## Example-first E3 checkpoint

Fresh Gemini 4 Argon design/archive/example review approved the freeze without
P0–P2 blockers. Its two P3 implementation notes concern explicit undefined/extra
arguments and canonical fresh zero/stationary revisions; author responses are
recorded separately. The five public scripts and their SHA-256 manifest were
committed in `9fca840` before runtime implementation. Earlier drafts were
unagreed and were never used to claim approval. The dedicated E3 runner and
typecheck reported actual missing-export failures at this checkpoint.

## Runtime and delivery

Runtime commit: `6726d7e627de11d2c01d727eb5e704035aee1f44`. Fresh independent
[Gemini 4 Argon runtime review](TOWNSCAPER-RUNTIME-REVIEW.md): APPROVED, zero
findings. The review verifies the two earlier design notes and the radius-seven
rounding boundary. Findings, author responses and approval remain separate files.

Coordinator checks on 8 November 2026, Bun 1.4.2 and Node 26.8.2:

| Executed command | Result |
| --- | --- |
| `bun run typecheck:townscaper` | Passed, including mixed named-variable option and regular-only Grid negative type cases. |
| `bun run examples:townscaper` | All five frozen public scripts passed unchanged. |
| `bun test tests/townscaper-grid.test.ts tests/grid-parcels-topology.test.ts tests/grid-parcels-grid.test.ts` | 27 tests passed, 31815 expectations. |
| `bun run check` | Exit 0: complete TypeScript/Svelte checking, 619 tests / 183339 expectations across 73 files, all 241 registered public scripts, library bundle/declarations and packed consumers. |
| Packed consumer within `bun run check` | Bun, Node ESM and ambient-free strict TypeScript passed, exercising both new APIs, RNG purity, area, revision/incidence identity, explicit Field copy and mixed options. |
| `bun run build:ui:svelte` | Exit 0; existing chunk-size warning remains. No UI source changed. |
| Four `sha256sum -c` manifests | All E3 (5), foundation (5), E0 (3) scripts and 28 archived source files unchanged. |
| `git diff --check` | Passed. |
| `bun run examples:city:targets` | Exit 1 at absent corridor; ready budget/heat scripts still pass. |
| `bun run typecheck:city:targets` | Exit 1: three missing E1/E2 methods and five dependent implicit-any diagnostics, unchanged from the accepted red checkpoint. |

The separate reviewer ran 35 focused tests / 32548 expectations, the five
foundation scripts, E3 scripts/types, ready city scripts/types and red target
commands. That independent record does not claim the coordinator's full check.
No maintained baseline check failed after dependency setup; the quarter remains
an explicitly unmet target rather than an accepted failure or delivered feature.

No dependency or lockfile changed. The focused runtime uses the existing exact
predicates, Layout constructor and Random. The source prototype supplied context,
not copied runtime code. The research archive retains its own attribution and
rights limits. No browser-facing flow is added by this headless slice; no browser
or original-Townscaper fidelity acceptance is claimed. Hosted CI, PR linkage and
remote-head verification remain publication-time checks, separate from these
local results. Merge is not authorized.

## Subsequent client-model checkpoint

The reviewed `04ac06e` model/plan checkpoint was integrated as `e016814` without
changing E3 runtime, root exports or UI. The [target integration record](../development/example-first/TARGET-INTEGRATION.md)
records the additional two ready city scripts and the new complete check:
619 tests / 183339 expectations, 243 registered scripts, build and packed
consumers passed. The earlier 241-script result above remains its original
checkpoint evidence. All original/E3/foundation/archive hashes remain unchanged;
the quarter is still a red E1/E2 target.
