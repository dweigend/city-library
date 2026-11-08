# Weighted distance precision

Shortest-path calculations must keep the same ordering when floating-point addition loses small differences. This contract uses exact sums of captured binary64 edge costs internally and rounds only the published distances. These rules apply to weighted routing without adding a public numeric API.

## Numerical rules

Captured finite binary64 edge costs are exact dyadic values. Weighted shortest-path ordering, relaxation and negative-cycle detection use their exact sums. Round each published distance once to nearest binary64, ties to even. Published equal Numbers may represent distinct internal path lengths. Preserve original canonical keys, once-per-edge top-level callback capture, guards, callback exception identity and option/error semantics. Unit-cost BFS remains the fast path.

Preserve the existing overflow boundary: every examined relaxation candidate, including a non-improving candidate, must round to a finite Number or throw RangeError. This is not a stricter exact-magnitude cap: MAX_VALUE + 1 rounds to MAX_VALUE and is allowed; MAX_VALUE + 2^970 rounds to infinity and throws. Decode original captured Numbers before arithmetic; decoding rounded partial sums cannot repair cancellation.

Summary aggregation sums the published rounded distances exactly, checks each cumulative sum's correctly rounded finite representation, and rounds the permitted total once before ordinary Number division by reachablePairs. Overflow of the total throws before division even when a mathematical mean would be finite. Eccentricity, radius and diameter use published distances. Closeness uses the same aggregation rule.

No new public operation or generic numeric module is introduced. An internal graph dyadic-cost helper may decode finite Number bits to integer units of 2^-1074 and perform correctly rounded conversion, including subnormals and ties. Do not convert an enormous coefficient to Number before scaling. Preserve all five original routing examples unchanged.
