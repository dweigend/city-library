# Grid and parcel phase verification

Date: 2026-11-07. Branch: `feat/grid-parcel-foundations`.
Worktree: `/home/david/.t3/worktrees/city-library/feat-grid-parcel-foundations`.
Verified clean starting head: `dc7b164abd23c8e7b7f11c902195ab030c5f1c4b`, identical
to committed `experiment/netlogo-web-catalog`. No concurrent checkout contents
were imported or staged. No push, PR, publication or main merge was performed.

## Preserved sequence

| Commit | Evidence |
| --- | --- |
| `158b803` | Full unchanged catalogue/interim snapshot, scoped plan and five complete asserted public scripts, with real missing-API failures recorded in [EXAMPLE-FIRST](EXAMPLE-FIRST.md). No runtime edits preceded this commit. |
| `aa824df` | Immutable square/hex/authored topology and provenance comparison. |
| `49ff219` | Canonical Field factory, accurate layout Grid types and World/occupancy integration. |
| `c92289a` | Net area, bounded conforming merge and guarded convex split. |

The integration commit adds root exports, registered examples, development
typechecking, packed-consumer coverage, cross-variant conservation tests and
current documentation. The five frozen script checksums still match.

## Baseline and actual checks

The first `bun run check` failed at TS2688 because this prepared worktree lacked
installed Bun type definitions. `bun install --frozen-lockfile` succeeded without
lockfile changes. The subsequent baseline typechecks and 584 tests / 150791
expectations passed. Its examples phase overlapped live integration and stopped
on a temporarily missing new topology module after the root export was added;
that interrupted run is not claimed as a clean full baseline or an existing
product regression. Final integrated checks replace that partial run.

Executed author checks so far:

- `bun run typecheck`: passed, including Svelte with zero errors/warnings.
- `bun test tests/grid-parcels-geometry.test.ts tests/grid-parcels-topology.test.ts tests/grid-parcels-grid.test.ts tests/spatial-grid.test.ts tests/indexed-occupancy.test.ts tests/grid-occupancy-performance.test.ts`: 38 tests / 1340 expectations passed.
- `bun test tests/grid-parcels-conservation.test.ts`: two additional integration
  tests / 648 expectations passed across varying convex vertex counts, scales,
  windings, cut directions, and square/hex unions.
- Each of the five frozen public scripts: passed with assertions enabled.
- `sha256sum -c examples/grid-parcels/SHA256SUMS`: all five unchanged.
- `cmp docs/grid-parcels/API.md /home/david/Projekte/city_game/docs/library-handover/GRID-PARCELS-API.md`: identical complete saved catalogue.
- `bunx tsc -p tsconfig.dev.json`: passed after the added integration tests.
- `git diff --check`: passed.
- `bun run build:ui:svelte`: passed with the existing large-chunk warning.
- Complete `bun run check`: in progress at this checkpoint; its test stage
  passed 603 tests / 151508 expectations. The two subsequent integration tests
  above were added after test discovery and checked separately.

The packed consumer now exercises both Bun and Node ESM from a real tarball,
with ambient-free TypeScript assertions for honest layout capabilities, root
types, square/hex/import queries, merge/split and live occupancy. Its result is
recorded once the complete check finishes. No UI behavior changed; no browser
check is required or claimed for this headless phase. Existing UI build checks
are complementary shell evidence.

## Independent review

Availability confirmed through orchestrator capabilities: Antigravity provider,
`gemini-3.8-flash`, with high thinking supported. Independent substantial review
is pending; passing author checks are not independent approval. Review findings,
author responses and fresh re-review decisions will be recorded separately.

## Limits

See [STATUS](STATUS.md) for every deferred catalogue family and [PHASE-PLAN](PHASE-PLAN.md)
for bounded inputs and numerical semantics. Source research results establish
provenance, not target behavior. No arbitrary polygon Boolean solver, recursive
subdivision, offset/corridor, irregular diffusion, state transfer or volume API
is delivered. The original catalogue is retained without empty stubs.
