# A2a source research

User-requested read-only advisory research on 5 November 2026 inspected city_game revision `08b3efb66d0f93d023f0b1deb762578552f7b819`. Source tests were read, not executed. No source code transfer or old-runtime dependency is selected.

Research: <t3-thread://v2/cb5e98d1-f255-44ff-8175-d9cf75ded5d7/d5b597da-7daf-4f76-993e-cd71270dae20>.

| Source path under that revision | Finding and response |
| --- | --- |
| netlogo-ts/src/lib/core/random.ts | Preserve the already verified Mulberry recurrence. Old constructor accepts more seeds than target. Fisher–Yates is useful schedule evidence only; normal full sample consumes n draws, explicit legacy shuffle consumes n−1 (zero for empty/singleton). |
| netlogo-ts/src/lib/core/distributions.ts | weightedChoice validates before drawing and falls back to the final positive position. Its max-scaling accepts an overflowing total and can erase tiny positive weights, so do not copy its normalization; the target requires finite total. |
| netlogo-ts/src/lib/core/agent-set.ts | nOf deduplicates, rejects oversized counts and shuffles on zero count; these differ from the new positional sampling contract. Do not transfer. |
| netlogo-ts/tests/core/utilities.test.ts | Useful reproducibility, integer-range and input-preserving shuffle scenarios; supplement with exact numeric fixtures. |
| netlogo-ts/tests/core/distributions-contracts.test.ts | Useful cumulative boundaries, zero/no-draw and invalid-weight preflight scenarios. |
| netlogo-ts/tests/core/distributions-sampling.test.ts | Huge-weight acceptance must become target rejection for nonfinite totals. Keep positive MIN_VALUE beside zero eligible. |
| netlogo-ts/tests/oracle/semantics.nlogox | Historical local-randomness scenario, not an implemented standard Random API. New local/reseed/copy and closed state require focused implementation. |

Nested local needs both an immutable outermost main checkpoint and each scope's immediate predecessor. Restore full seed/word/Gaussian continuation in finally; external model effects remain. State reads/writes are allowed locally, and storage capture restrictions belong to the future storage contract rather than prohibiting state reads. Invalid iterator/weight preflight must not draw from the library stream; purity of caller weight callbacks remains a precondition rather than a promise to undo arbitrary external side effects.

Finite floating bounds can have an overflowing difference or round to the exclusive upper endpoint. Support the former with stable affine arithmetic and preserve the latter without additional draws; do not restrict the finite-bound contract silently. Integer bounds and their difference must be safe integers.

The previously unresolved source license is not inferred from repository visibility. This slice selects new focused implementations and retains source findings as evidence, not a transferred implementation or target acceptance.
