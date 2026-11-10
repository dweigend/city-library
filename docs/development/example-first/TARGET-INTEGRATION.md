# Model probe checkpoint on the finite topology branch

The reviewed client-model checkpoint `04ac06e8ef3a33e0b8993be05c8d24179fc92aaa`
was cherry-picked as `e016814` onto `feat/quad-layouts-grid`, following the existing
E0 integration `cf9baea` → `2df94d1`. The two source probes and their separate
integration manifest are unchanged. The source worktree was not edited.

Two conflicts were resolved by retaining both additions: the root PLAN keeps
the model-probe explanation and the verified E3 section; the public example
registry keeps all five E3 scripts and all four ready city scripts. The existing
example-first PLAN remains the single implementation-plan authority. The
documentation-only checkpoint `13d934a` was inspected but not imported or edited;
its separately owned branch/worktree is preserved.

No library source, root export or UI changed relative to `8359723`. The E3
runtime review at `6726d7e` therefore retains its original scope. The separate
[probe review](INTEGRATION-REVIEW.md) approves the new local client models and
plan, not any new core operation. The six operation families remain questions
for contrasting models, subject to the plan's generalization gate.

## Target verification

- `bun run examples:city`: passed all four ready scripts with assertions.
- `bun run typecheck:city`: passed.
- `bun run examples:city:targets`: exit 1 at the unchanged absent corridor after
  all four ready scripts run.
- `bun run typecheck:city:targets`: exit 1 for the same three missing geometric
  methods and five downstream implicit-any diagnostics.
- Original, integration and E3 script manifests: passed unchanged.
- `bun run check`: exit 0; complete TypeScript/Svelte checking, 619 tests /
  183339 expectations, all 243 registered public scripts, library build and packed
  Bun / Node ESM / ambient-free strict TypeScript consumers.
- `bun run build:ui:svelte`: exit 0 with the existing chunk-size warning.
- Foundation script and source-archive manifests: passed unchanged. All five
  manifest groups now include the separately pinned new model probes.
- Integration Markdown file links and `git diff --check`: passed.

These target checks were run on 8 November 2026 with Bun 1.4.2 / Node 26.8.2.
They supplement the preserved source-checkpoint evidence rather than replacing
it or expanding either review's approval scope. PR #37 remains based on
`feat/grid-parcel-foundations`; its updated remote head and hosted CI are
publication-time checks. No merge is authorized.

The quarter's site/road/land, four-block and parcel expectations remain an open
E1/E2 contract. The 49-row geometry/parcel catalogue is still a staged roadmap.
This integration adds no Resource, Reservation, ClockManager, solver or new E3
API, and supplies no authorization to implement corridor/subtract/subdivide.
