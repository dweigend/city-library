# Independent Review: Townscaper Integration & City Library Implementation Handoff

- **Date:** 2026-11-08
- **Reviewer:** Antigravity (`gemini-4-argon`, independent review sub-agent)
- **Reviewed Worktree:** `/home/david/.codex/worktrees/city-parcel-contract` (uncommitted working-tree delta on `docs/parcel-contract-proposal` over prior reviewed commit `1b12a18b`)
- **Compared Baselines:**
  - Prior reviewed documentation commit: `1b12a18b` (`docs: expand full grid and parcel API reference and inventory`)
  - Original Astra advice: `/tmp/city-townscaper-integration-astra.md`
  - Target City Library foundation: `feat/grid-parcel-foundations` at `2a7f3eb` (`/home/david/.t3/worktrees/city-library/feat-grid-parcel-foundations`), plus latest `AGENTS.md` and `docs/CODING_STANDARDS.md` on `main` (`dfd0584`)
- **Verdict:** **APPROVED** (0 blockers, 2 optional polish notes)

---

## 1. Executive Summary

The uncommitted documentation update in `docs/library-handover/parcel-proposal/` cleanly, accurately, and completely integrates the authorized Astra Townscaper proposal (`/tmp/city-townscaper-integration-astra.md`) and prepares the City Library implementation handoff without scope creep, false runtime claims, or loss of previously reviewed catalogue entries.

All core architectural, mathematical, and workflow requirements are satisfied:
1. **Minimal API surface:** Two distinct, composable operations (`topology.quadrilaterals({ rings, edgeLength?, random })` and `topology.relax({ layout, method: "squareTarget", iterations })`) reuse the delivered `Layout`, `PlanarPolygon`, `Random`, and `Grid.add` root exports without introducing a public mesh/halfedge class, solver framework, or implicit state transfer.
2. **Preserved research & full catalogue:** The arbitrary-boundary `topology.quadrilaterals` overload and `topology.relax` (`method: "lloyd"`) are preserved explicitly as deferred research (`#topology-quadrilaterals-boundary` and `#topology-relax-lloyd`), keeping all **49** source catalogue rows, **58** operation/property sections (up from 56), and **27** supplementary type/result rows intact.
3. **Mathematical & algorithmic precision:** The square-target formula (`c = (p0+p1+p2+p3)/4`, quarter-turn rotations `-i*pi/2` averaged into `u`, target corners `c + R(i*pi/2)*u` on CCW corners), synchronous force accumulation from previous-iteration vertices only, pinned finite hex boundary, strict quad convexity and global overlap/crossing checks, bounded global step-halving, and `RangeError` rollback without partial publication or input mutation are all rigorously specified.
4. **Handoff & branch topology:** `IMPLEMENTATION-HANDOFF.md` accurately pins the target baseline to `feat/grid-parcel-foundations` (`2a7f3eb`, PR #36 open against `experiment/netlogo-web-catalog`), prohibits blind branching/cherry-picking from `main`, mandates freezing numerical/RNG choices in 4–5 public asserted example scripts with independent review (`gemini-4-argon`) before runtime code, and keeps prior review approvals scoped strictly to their historical commits.

---

## 2. File-by-File Audit of Uncommitted Documentation

| File | Status | Review Assessment |
| --- | --- | --- |
| `evidence/townscaper-astra-proposal.md` | New (`??`) | Byte-for-byte identical (`diff -u` clean) to `/tmp/city-townscaper-integration-astra.md`. |
| `TOWNSCAPER.md` | New (`??`) | Faithfully distills primary developer evidence (Stålberg IndieCade Europe 2019 & SGC21 timestamps, Imgur post, Game Developer interview), distinguishes the local Sylves-based Laplace prototype (`generator.ts`) from the true square-target solver, and clearly separates the module-side quad `Layout` from the deferred player-side dual graph, chunk interpolation, and WFC/Marching-Cubes building solver. |
| `IMPLEMENTATION-HANDOFF.md` | New (`??`) | Defines the exact first-PR scope (`quadrilaterals` finite overload + `relax` `squareTarget`), branch stacking on `feat/grid-parcel-foundations` (`2a7f3eb`, PR #36 -> `experiment/netlogo-web-catalog`), the 5 example-first fixture tasks, pre-freeze numerical/RNG decisions, target verification (`bun run typecheck`, tests, frozen examples, build, packed consumer, `gemini-4-argon` review), and the remaining 49-row roadmap. |
| `api-reference.md` | Modified (`M`) | Adds `#topology-quadrilaterals` (finite hex patch) and `#topology-relax` (`squareTarget`), retains `#topology-quadrilaterals-boundary` and `#topology-relax-lloyd` as deferred research, updates `#layout-type` and `#ownership-ordering-and-randomness` for revision-local correspondence and preserved cell ordering across `squareTarget`, and clarifies boundaries in `#topology-from-polygons`, `#topology-group`, `#geometry-subdivide`, `#grid-and-field-connection`, and `#future-generation-boundary`. |
| `api-table.md` | Modified (`M`) | Mirrors all 4 quadrilateral/relax headings, anchors, availability badges (`Proposed` vs `Research`), and TypeScript signature fences verbatim from `api-reference.md`. |
| `COVERAGE.md` | Modified (`M`) | Updates rows 7 and 9 to reflect the split between the proposed finite slice and deferred research, updates section count from 56 to 58 (with 49 catalogue rows and 27 supplementary rows unchanged), and links both retained research anchors. |
| `CONTRACT.md` | Modified (`M`) | Adds the 8 November 2026 integrated finite topology section, linking `evidence/townscaper-astra-proposal.md`, `api-reference.md`, `TOWNSCAPER.md`, and `IMPLEMENTATION-HANDOFF.md`, while scoping earlier approvals to the original parcel-only revision. |
| `README.md` | Modified (`M`) | Updates status to 8 November 2026, adds links to `TOWNSCAPER.md` and `IMPLEMENTATION-HANDOFF.md`, introduces the finite topology track alongside the parcel delivery order, and explicitly requires fresh review of the integrated revision. |
| `PLAN.md` | Modified (`M`) | Records the 8 November 2026 integration scope, the 56 -> 58 operation section expansion, and the requirement for fresh independent review before committing and launching the City Library thread. |
| `SYNTAX.md` | Modified (`M`) | Adds the 8 November 2026 note confirming the delivered syntax baseline is unchanged and the two new `topology` calls reuse existing root imports without new classes or DSLs. |
| `PAPERS.md` & `EXTENDED-PAPERS.md` | Modified (`M`) | Cross-reference `TOWNSCAPER.md` and `evidence/townscaper-astra-proposal.md`, distinguishing timestamped developer talks and architectural module solvers from the geometric parcel kernel. |

---

## 3. Detailed Verification Against Review Criteria

### 3.1 Core Simplicity & API Surface
- **Finite generator (`topology.quadrilaterals`):** Takes `{ rings: number; edgeLength?: number; random: Random }` and returns an unrelaxed `Layout`. Centered at `(0,0)` with `edgeLength` defaulting to `1` in caller XY units (no 20-unit display normalization), `6 * rings^2` initial triangles, deterministic pairing of adjacent unused triangles, and complete refinement (paired quads -> 4 quads, leftover triangles -> 3 quads) yielding `4*P + 3*T` cells and analytic area `3*sqrt(3)/2 * (rings * edgeLength)^2`. Shared vertices are constructed once by identity rather than coordinate rounding.
- **Separate relaxation (`topology.relax`):** Takes `{ layout: Layout; method: "squareTarget"; iterations: number }` and returns a new immutable `Layout`. Keeping relaxation separate from generation avoids duplicate iteration controls and allows inspecting the unrelaxed layout.
- **No mesh framework:** Internal vertex/edge/face cyclic incidence remains private concrete arrays/maps reconstructed from canonical polygons. Public `Layout`, query methods, `Grid`, `Field`, and `Random` remain unchanged.
- **Deferred research preserved:** Arbitrary-boundary `quadrilaterals` and `lloyd` relaxation remain documented under explicit `#topology-quadrilaterals-boundary` and `#topology-relax-lloyd` anchors. Mixed option keys across overloads throw before RNG consumption.

### 3.2 Mathematical, Algorithmic & Revision Contracts
- **Square-target formula & winding immunity:** For canonical CCW corners `p0..p3` with centroid `c = (p0+p1+p2+p3)/4`, corner vectors `pi - c` are rotated by `-i * pi/2`, averaged into `u`, and rotated back to `c + R(i * pi/2) * u`. Because internal polygons are canonicalized to CCW with deterministic starting corners (or cyclic indexing is normalized), the step is invariant to caller input winding or cyclic start vertex, and any exact square (including rotated squares) is a fixed point.
- **Synchronous summed forces:** Forces (`target - current`) from all incident quads are accumulated at each shared interior vertex from previous-iteration positions only and applied synchronously with a bounded valence-aware scale frozen in fixtures.
- **Pinned boundary, global validity & rollback:** All finite outer boundary vertices are pinned. Every step must preserve strictly convex positive-area quads, full-edge sharing, disjoint interiors, and complete domain coverage (checking signed area alone is explicitly noted as insufficient). Invalid candidate steps use bounded deterministic global step-halving; if exhausted, `RangeError` is thrown with no partial `Layout` published and no input mutation.
- **Bounds, RNG & post-draw failure:** Shape/size/resource bounds (candidate `rings` 1..7 -> at most `18 * rings^2 = 882` quads, within the 1,024-cell `Layout` budget) and option validity are checked before drawing from `Random`. Pairing is the only RNG consumer; refinement and relaxation consume no RNG. If a post-draw validity check fails, no partial `Layout` is returned and consumed RNG draws are not implicitly rolled back (exact continuation behavior to be frozen in fixtures).
- **Immutable revisions & preserved ordering:** `squareTarget` returns a new deeply frozen `Layout` (even at `iterations: 0`), preserving source cell order, `0..cells.length - 1` correspondence, and adjacency rather than re-sorting cells by moved coordinates. Old `Layout` query snapshots remain immutable, and `Grid.add` requires explicit loop-based state transfer.

### 3.3 Inventory Counts, Parity & Source Attribution
- **Exact counts verified by script:**
  - **49** catalogue rows in `COVERAGE.md`
  - **58** operation/property `###` sections with `<a id="..."></a>` anchors in both `api-table.md` and `api-reference.md`
  - **27** supplementary type/result rows in `api-table.md` (`## Shared data and procedure results`)
- **Exact parity & links:** Every anchored signature block in `api-table.md` matches its counterpart in `api-reference.md`, and all markdown links/anchors across the 12 modified/new files resolve cleanly (`git diff --check` is also clean with zero whitespace issues).
- **Source attribution & research boundaries:** Primary timestamps from Stålberg's talks are accurately cited; developer quotes are separated from interviewer commentary; player-grid vs. dual module-grid and 3-patch cluster interpolation are accurately framed as deferred research rather than false runtime capabilities.

### 3.4 Target Baseline & City Library Standards
- **Branch & PR stacking:** `IMPLEMENTATION-HANDOFF.md` accurately identifies `feat/grid-parcel-foundations` (`2a7f3eb`) as the foundation branch with open PR #36 targeting `experiment/netlogo-web-catalog` (since `main` at `dfd0584` does not yet contain `experiment/netlogo-web-catalog` or `feat/grid-parcel-foundations`). It rightly instructs stacking the new branch on `feat/grid-parcel-foundations` and checking git ancestry before any retargeting.
- **Standards alignment:** Aligns with `AGENTS.md` and `docs/CODING_STANDARDS.md` (Minimum Sufficient Architecture, example-first gate with 4–5 asserted public scripts before runtime, headless core, explicit error boundaries, and independent review by `gemini-4-argon`).

---

## 4. Blockers & Smallest Fixes

### Concrete Blockers
- **None.**

### Optional Non-Blocking Polish Notes (Smallest Fixes)
1. **Shared data table `Layout` / `Local key` summary note in `api-table.md` (optional alignment with Astra advice):**
   - *Context:* Astra's edit list suggested a brief note in the `api-table.md` Shared data table (`Layout` / `Local key` rows) mentioning revision-local correspondence across `squareTarget`. `api-reference.md#layout-type` and `api-table.md#topology-relax` already state this clearly, so there is no ambiguity.
   - *Smallest fix (optional):* In `api-table.md` line 871 (`| Layout | \`Layout\` | Canonical immutable topology with local numeric cell keys and five query members. |`), optionally append `squareTarget preserves revision-local key correspondence.` if desired.
2. **Target `AGENTS.md` / `CODING_STANDARDS.md` ancestry note in `IMPLEMENTATION-HANDOFF.md` (optional informational note):**
   - *Context:* On `feat/grid-parcel-foundations` (`2a7f3eb`), `AGENTS.md` is an older revision that still mentions `gemini-3.8-flash` and lacks `docs/CODING_STANDARDS.md` (which was committed on `main` at `dfd0584`). `IMPLEMENTATION-HANDOFF.md` already explicitly states that the required review model is `gemini-4-argon` and instructs reading the latest target rules.
   - *Smallest fix (optional):* In `IMPLEMENTATION-HANDOFF.md` under `## Source and target`, optionally note that `docs/CODING_STANDARDS.md` and the `gemini-4-argon` review rule live on `main` (`dfd0584`) so the implementation thread reads them from `main` even while branching off `feat/grid-parcel-foundations` (`2a7f3eb`).
