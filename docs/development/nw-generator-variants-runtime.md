# Explicit NW Web topology edition 1: author implementation evidence

The accepted [edition-1 contract](nw-generator-variants-contract.md) is implemented through the existing `Graph.generate` method and exported `GeneratorOptions` union. The exact opt-in is **`profile: "nw-web-topology/1"`**. All five unchanged scripts frozen at `08544d1` pass. The existing eleven unprofiled kinds retain their closed schemas, defaults, domains, ordering and draw schedules. This is a headless topology expansion, not native engine/MT/birth/layout/model compatibility or independent approval.

## Source finding, coordinator correction, then runtime

Before any implementation change, the agent found that the initial root contract's WS Remaining-Tail swap contradicted the actual retained primary source and frozen Front-Cursor traces. With the same public unit inputs, the rejected tail algorithm produced seed1 `[[0,1],[1,3],[2,3],[3,0]]` with 13 units, while frozen seed1 requires `[[0,2],[1,3],[2,1],[3,2]]` with 9. Seed7 consumes 11 units in either description but produces different endpoints, so equal counts alone would not establish equivalence.

The agent reported the exact discrepancy and made no source/test/example changes. The coordinator corrected the authoritative text at **`0f26695` before runtime**, acknowledged the editorial error and preserved every frozen example byte/expectation. Implementation and verification below follow the corrected Front-Cursor contract. The [accepted contract's correction record](nw-generator-variants-contract.md#pre-implementation-editorial-correction) owns that decision; the author finding and successful runtime checks are separate evidence, not independent approval.

## Implementation and reuse

The working modules remain under [src/graph/generators](../../src/graph/generators/):

- `nw-options.ts` defines only the five opt-in branches and validates their exact applicable fields, required discriminator, integer shapes/domains, real Random and deterministic output bounds.
- `nw-planning.ts` constructs wheel, lattice, Kleinberg, link-end PA and Front-Cursor WS endpoint plans.
- `validation.ts` holds the existing dense-array/scalar/flag checks unchanged for reuse. `options.ts` dispatches explicit profiles; `planning.ts` routes their validated configurations.

The actual Graph owner was **not changed**. All profiles use its existing read protection, canonical selected-node snapshot, induced-edgeless check, independent state clones, final default liveness checks, fresh Edge materialization, automatic keys and atomic publication. There is no public add loop, extra generator API, model-private engine, World inference or hidden stream. Return values are the existing frozen arrays of real current Edge identities, with no invented path geometry.

Kleinberg emits the profile lattice before one categorical attempt per source, considering every other row-major target, including neighbors. It deliberately uses ordered `Math.pow`/Number cumulative sums, the inclusive boundary and existing-pair suppression without redraw. Every finite exponent≥0 is supported; no UI10 cap, epsilon or exact-rational replacement was introduced. The test using a real issued Random whose third unit is exactly zero verifies that an underflowed zero-weight initial CDF plateau can intentionally select source2→target0. This operational behavior is distinct from an ideal arbitrary-precision tail-probability promise.

PA keeps the stored link pool fixed through each new node's distinct-target batch and consumes a separate unit for link index and endpoint on every accepted/rejected attempt. Both directed link ends supply incidence. WS preloads symmetric occupancy for all original forward slots, removes the old edge before searching, resets only its front cursor, and preserves one candidate-buffer permutation across slots. Every trial, including a final singleton, consumes a unit. No arbitrary retry cap or shortcut replaces either protocol. Wheel uses a last hub and selective in/out spokes; lattice suppresses two-cell seams. Unprofiled behavior stays separate.

### Existing TypeScript authoring compatibility

Adding a second profiled wheel branch exposed a TypeScript7 union-assignability regression for an already supported caller variable whose kind is `path|cycle|star|wheel|complete|tree`. The existing no-branching default-tree case is therefore also represented in the common native-family type group with `branching?: never`; the original configurable tree branch remains. This is a redundant spelling of an already valid default-tree option, not a new runtime kind/domain. No old test cast or expectation was changed.

Focused source and packed declaration witnesses compile that original kind variable, an explicit tree `branching:3`, and `if (options.kind === "tree") options.branching` as `number|undefined`. Runtime checks separately retain rejection of own inapplicable `branching:undefined`, `spokes:undefined`, generic directed PA/WS fields, and own undefined/unknown profiles. No `exactOptionalPropertyTypes` policy change was made.

## Executed checks

[checks.json](nw-generator-variants-runtime-evidence/checks.json) records source hashes, scope and commands. Raw logs and fresh package results are retained alongside it.

| Check | Actual outcome |
| --- | --- |
| Ten new profile tests plus previous copy/generator/analysis/precision/distance/connectivity/A5a tests | **65 passed, 0 failed, 21122 assertions**, eight files |
| All five new and 25 previous frozen Graph scripts | **30 passed unchanged** |
| All corresponding frozen input hashes | **30 matched** |
| `bun run typecheck` | All four projects passed |
| Separate strict source check including exactly the five new scripts | Passed with tsc via stdin configuration extending existing development settings |
| `bun run build` | Browser ESM bundle/declarations passed |
| `bun run consumer` | Existing packed Bun, Node ESM and ambient-free declaration checks passed |
| Fresh [profile package consumer](nw-generator-variants-runtime-evidence/verify-packed-profile.ts) | All five actual branches and portable ledgers passed under Bun and Node ESM; strict fresh declarations passed new options and the legacy type witnesses |
| `git diff --check` | Passed |

The tests use independent tiny integer distance-mass/CDF tables, endpoint-occurrence bags and a front-prefix/untried-list WS trace rather than invoking production planners as oracles. They cover saturated K3 old-target reselection, singleton trials, k0, p0, extreme exponents, directed reverse arcs, undirected stored endpoints, closed fields/accessors, finite/range errors, legacy defaults, canonical Agent lifecycle and World/RNG separation. A controlled Date intrinsic fault injects a genuinely late default-clone failure after 14 PA units: no edges/automatic keys publish, scheduled draws remain consumed, guards release, and a later successful batch starts at key0.

Initial author-check failures were confined to one new-test non-null annotation and a composite foreign-node/shape-invalid assertion; both were corrected in the new test file. The old frozen scripts and earlier tests were never weakened. The final logged checks above pass. The earlier TS7 kind-union compatibility issue was fixed in the delivered option type as described above.

## Practical workloads and limits

[performance.json](nw-generator-variants-runtime-evidence/performance.json) records single local **generate-only** observations using actual public owner publication:

| Profile kind | Nodes / new edges | Observed ms |
| --- | ---: | ---: |
| PA, links2, directed | 10000 / 19997 | 109.50 |
| WS, per-side2, p1, directed | 10000 / 20000 | 105.86 |
| Kleinberg, wrapped20×20, r2 | 400 / 1063 | 22.69 |
| Directed wrapped100×100 lattice | 10000 / 20000 | 51.38 |
| Directed inward wheel | 5000 / 9998 | 17.78 |

These are executed examples, not universal timing bounds or native-performance comparisons. Lattice/wheel preparation is linear in output. PA/WS retry work remains variable as contracted. Kleinberg currently computes all other targets per source, so it is quadratic in selected nodes; no hidden candidate-work cap was added. Atomic materialization needs memory for the complete endpoint/state/Edge batch. Existing per-call100000-node and1000000-new-edge limits remain, with known PA/WS output oversize rejected before any unit draw. No positive million-edge benchmark is claimed.

## Functional boundary

Edition1 pins accepted topology semantics based on the existing [26-probe source audit](nw-generator-source-gaps.md). It does not auto-track the live server and does not promise native bounded-int/boolean bits, seed17 trajectories, birth/color/heading interleaving, final shuffled/no-op turtle blocks, layout, plots, clear/append actions or host I/O. The five scripts' separated action-stream composition is a library scenario; a selected NW model still needs its own functional/native comparison and explicit action differences.

The shared checkout contained concurrent coordinator model/counter work. These scoped Graph/core/package checks do not constitute its final combined repository/model check, and no B07/B11 pending counter phase was run or marked passed here. No browser comparison, model-stage increase, scientific/distribution-equivalence assertion or independent Argon approval follows. Global registration, consumer integration and final combined checks remain coordinator-owned.
