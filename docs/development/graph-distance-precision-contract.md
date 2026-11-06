# Weighted distance precision repair

The [executed preflight](network-analysis-proposal-evidence/weighted-distance-preflight.json) demonstrates a reachable negative cycle hidden by Number addition. This violates the existing routing contract. The [deep advisory](network-numeric-advisory.json) is design consultation, not independent approval. Argon/high approval remains quota-blocked; no model acceptance stage changes here.

## Numerical closure before runtime

Captured finite binary64 edge costs are exact dyadic values. Weighted shortest-path ordering, relaxation and negative-cycle detection use their exact sums. Round each published distance once to nearest binary64, ties to even. Published equal Numbers may represent distinct internal path lengths. Preserve original canonical keys, once-per-edge top-level callback capture, guards, callback exception identity and option/error semantics. Unit-cost BFS remains the fast path.

Preserve the existing overflow boundary: every examined relaxation candidate, including a non-improving candidate, must round to a finite Number or throw RangeError. This is not a stricter exact-magnitude cap: MAX_VALUE + 1 rounds to MAX_VALUE and is allowed; MAX_VALUE + 2^970 rounds to infinity and throws. Decode original captured Numbers before arithmetic; decoding rounded partial sums cannot repair cancellation.

Summary aggregation sums the published rounded distances exactly, checks each cumulative sum's correctly rounded finite representation, and rounds the permitted total once before ordinary Number division by reachablePairs. Overflow of the total throws before division even when a mathematical mean would be finite. Eccentricity, radius and diameter use published distances. Future closeness must use the same aggregation rule; this phase does not implement graph.analyze.

No new public operation or generic numeric module is introduced. An internal graph dyadic-cost helper may decode finite Number bits to integer units of 2^-1074 and perform correctly rounded conversion, including subnormals and ties. Do not convert an enormous coefficient to Number before scaling. Preserve all five original routing examples unchanged.

## Frozen public scripts and actual preflight

Five supplementary public scripts in examples/graph-distance-precision cover large prefixes/ties, hidden negative cycles, exact cancellation/subnormal/overflow boundaries, aggregation/callback/identity consistency, and an independently implemented integer Floyd oracle with insertion-order variants. SHA256SUMS freezes their contents before runtime delegation.

Executed before runtime: direct strict TypeScript check of all five scripts passed using tsc --ignoreConfig. An initial command without --ignoreConfig was rejected with TS5112 and was corrected. Script 01 fails at its asserted 2^53+2 distance: actual 2^53. This is an expected recorded regression, not a passing verification. The original five examples remain frozen. Global registration waits for the repair.

## Implementation ownership

The scoped implementer owns only src/graph/algorithms/distances.ts, a working internal src/graph/algorithms/dyadic-costs.ts if needed, and tests/graph-distance-precision.test.ts. Preserve existing tests and examples. Use exact weighted heap Dijkstra and Bellman–Ford; do not enumerate paths or impose a new graph/path cap. Include independent fractional/subnormal and signed-cycle regressions and run focused old/new tests, both sets of frozen scripts and four type projects. The coordinator owns contracts, configuration, registration, consumer checks, integration, commits and GitHub. No UI or browser claim follows from headless checks.
