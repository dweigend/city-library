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

Pending: focused behavior/type checks, complete registered examples, build,
packed Bun/Node/TypeScript consumers, full project check and fresh independent
runtime review. No browser-facing flow is added by this headless slice.
