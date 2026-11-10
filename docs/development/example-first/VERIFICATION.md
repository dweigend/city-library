# Example-first checkpoint verification

Date: 8 November 2026. Code baseline: City Library feat/grid-parcel-foundations at 2a7f3eb. This checkpoint adds client scripts, assertions, runners and a plan; no library runtime is changed.

## Executed checks

- bun install --frozen-lockfile: passed, no dependency/lockfile changes.
- bun run contracts:city: passed; balance 19000, heat tick 1, center 20, total 188; all appended assertions enabled.
- bun run typecheck:city: passed.
- bun run typecheck: passed, including the newly registered ready scripts; Svelte diagnostics 0 errors/0 warnings. This is a typecheck, not browser interaction acceptance.
- bun run contracts:city:targets: exit 1 at actual missing geometry.corridor; two preceding scripts pass. No expected-error catch or skipped assertion converts this to success.
- bun run typecheck:city:targets: exit 1 for missing corridor/subtract/subdivide plus downstream implicit-any diagnostics from absent public return types. No type assertions or ambient fake exports hide the unmet contract.
- bun run contracts: passed (exit 0), including the existing complete registered example suite and the two ready city scripts. Full console log: [examples-console.txt](examples-console.txt). The unmet quarter target remains in its explicitly separate red gate.

The quarter invariants are independent analytical expectations and have not run past the missing API. No quarter runtime/build/package-consumer/browser acceptance is claimed. No unit or integration runtime suite is claimed from these checks. Fresh independent Gemini 4 Argon review approved the E0 test/plan checkpoint, with one required final log update now applied. See [review](REVIEW.md) and [response](REVIEW-RESPONSE.md).

## Accepted sources

[SCRIPT-SHA256SUMS](SCRIPT-SHA256SUMS) pins the three files including their acceptance assertions. From the repository root run:

```sh
sha256sum -c docs/development/example-first/SCRIPT-SHA256SUMS
```

A source hash guards unauthorized script changes; it cannot establish scientific correctness. Document any accepted contract revision rather than silently regenerating hashes. The approved model workflow remains separate from the assertions appended below it. No mock, skipped test, private import or placeholder implementation was added.
