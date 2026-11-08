# Independent Design Review: Parcel Library Proposal

- **Date:** 2026-11-07
- **Reviewer:** Antigravity (`gemini-4-argon`)
- **Scope:** Read-only design and contract review of `/home/david/.codex/worktrees/city-parcel-contract/docs/library-handover/parcel-proposal/{README.md,CONTRACT.md,PAPERS.md,EXTENDED-PAPERS.md,SYNTAX.md}` against target `/home/david/.t3/worktrees/city-library/feat-grid-parcel-foundations` (`2a7f3eb`) and current rules in `/home/david/Projekte/city-library/AGENTS.md` + `docs/CODING_STANDARDS.md`.
- **Verification Basis:** Static analysis of proposal documents, mathematical verification of example assertions, and inspection of target worktree source (`index.ts`, `src/geometry/planar/*`, `src/grid/topology/layout.ts`, `docs/grid-parcels/{API.md,STATUS.md,PHASE-PLAN.md}`). No repositories were modified, no runtime tests or builds were executed, and no paper reproduction or visual implementation approval is implied.

---

## 1. Executive Summary & Verdict

**Verdict:** **Conditionally Approved (Contract Design Ready after 2 Small Precision Fixes in `CONTRACT.md` / `PAPERS.md`).**

The proposal package (`README.md`, `CONTRACT.md`, `PAPERS.md`, `EXTENDED-PAPERS.md`, `SYNTAX.md`) is exceptionally well-engineered. It respects Minimum Sufficient Architecture, preserves the actual delivered `city-library` root exports and closed-ring GeoJSON `PlanarPolygon` syntax, avoids class/manager/DSL bloat, cleanly separates actual delivered capabilities (`2a7f3eb`) from planned catalogue methods, and provides conservative, primary-source-verified paper attributions and bibliography corrections. All five proposed example scripts in `CONTRACT.md` are mathematically sound on their concrete numeric inputs.

Before freezing the contract for the first implementation slice, **two concrete specification gaps** (classified below as actual contract defects/blockers for edge-case determinism) and one minor path reference inconsistency in `PAPERS.md` should be corrected with minimal local edits.

---

## 2. Concrete Blockers / Contract Defects (Smallest Corrections Required)

### Blocker 1: `maximumParcels` guard interaction with leaf splitting is underspecified at `liveLeaves === maximumParcels`
- **Evidence:** [CONTRACT.md](file:///home/david/.codex/worktrees/city-parcel-contract/docs/library-handover/parcel-proposal/CONTRACT.md#L233-L237), [CONTRACT.md](file:///home/david/.codex/worktrees/city-parcel-contract/docs/library-handover/parcel-proposal/CONTRACT.md#L308-L316).
  - Line 236 defines diagnostic code `"maximum-parcels"`.
  - Line 314 states: *"Every committed cut replaces one live leaf by two. The parcel cap counts accepted AND pending leaves, so it bounds memory and unfinished fragments."*
  - Line 316 states: *"`ok`: no remaining parts. `partial`: at least one cut committed and unresolved leaves remain. `unchanged`: no cut committed and root unresolved."*
- **Problem:** Because each cut increases total live leaves (`parts.length + remainingParts.length`) by `+1` (from $1$ at the root), what happens when `maximumParcels: 1` is passed and the root has `area > targetArea`? Or more generally, when `liveLeaves === maximumParcels` and a pending leaf with `area > targetArea` is popped from the traversal queue?
  - If `maximumParcels: 1` and `root.area > targetArea`, no cut can be committed without reaching 2 live leaves (`> maximumParcels`). Does it record `"maximum-parcels"` with `attempt: null` (or `0`), perform 0 attempts, and return `status: "unchanged"` with `[root]` in `remainingParts`?
  - When `liveLeaves === maximumParcels` after $k \ge 1$ committed cuts and another pending leaf still has `area > targetArea`, does traversal stop immediately before attempting a candidate cut on that leaf (recording `{ code: "maximum-parcels", key, attempt: null }` without incrementing `attempts`), or after evaluating candidate cuts?
- **Smallest Correction:** In `CONTRACT.md` §"OBB search, completion and failure" (item 5, line 314), add one sentence:
  > *"Before testing candidate cuts on an unresolved leaf (`area > targetArea`), if `liveLeaves === maximumParcels`, stop work immediately without incrementing `attempts`, retain that leaf and all queued unresolved leaves in `remainingParts`, and emit `{ code: "maximum-parcels", key, attempt: null }` (yielding `unchanged` if at the root with no committed cuts, or `partial` otherwise)."*

### Blocker 2: OBB tie-breaking and child-ordering (`0/0` vs `0/1`) have an orientation ambiguity on symmetric/axis-aligned boxes
- **Evidence:** [CONTRACT.md](file:///home/david/.codex/worktrees/city-parcel-contract/docs/library-handover/parcel-proposal/CONTRACT.md#L79-L108) (Script 2), [CONTRACT.md](file:///home/david/.codex/worktrees/city-parcel-contract/docs/library-handover/parcel-proposal/CONTRACT.md#L290), [CONTRACT.md](file:///home/david/.codex/worktrees/city-parcel-contract/docs/library-handover/parcel-proposal/CONTRACT.md#L312).
  - Line 290 defines canonical polygon ordering: *"canonical CCW outer/CW holes, lexicographically smallest first vertex, component order by canonical ring coordinates."* (Assuming standard `[x, y]` lexicographical comparison: `a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]`).
  - Line 312 states: *"Fit the minimum-area edge-aligned OBB. Cut at its long-axis midpoint perpendicular to that axis. Resolve equal box areas by normalized angle then canonical edge coordinates; on equal side lengths select the axis nearest positive X. Use deterministic depth-first traversal, lower canonical child first."*
- **Problem:**
  1. **"Normalized angle" range and "nearest positive X"**: An undirected box axis has angle $\theta \in [0, \pi)$ (or $[-\pi/2, \pi/2)$). For a square rotated by $45^\circ$ ($\pi/4$ and $3\pi/4$), both axes have equal angle distance ($\pi/4$) to the positive X axis (`0`), or for an axis-aligned square (`0` and $\pi/2$), `0` is along $+X$. Without specifying the half-open angle interval (e.g., $\theta \in [0, \pi)$ measured CCW from $+X$, smallest $\theta$ wins), a $45^\circ$ rotated square is ambiguous between $\pi/4$ and $3\pi/4$.
  2. **Explicit coordinate tuple order for child `0/0` vs `0/1`**: In Script 2 (`[0,0]..[12,8]`, cut at $x=6$), the left child starts at `[0, 0]` and the right child starts at `[6, 0]`, so `[0, 0] < [6, 0]` under both `(x, y)` and `(y, x)` lexicographical order. However, when two polygons share their lexicographically smallest first vertex (Wait: two interior-disjoint convex children of a straight line cut can share at most the two cut endpoints! And since the cut crosses the interior, the cut endpoints cannot be the lexicographically smallest vertex of *both* children—one child's minimum vertex must strictly precede the other's unless they share the global minimum vertex, i.e., the cut line passes directly through the polygon's lexicographically smallest vertex `[minX, minY]`). If a cut line passes directly through the polygon's minimum vertex `[minX, minY]`, **both children have the exact same lexicographically smallest first vertex `[minX, minY]`**!
- **Smallest Correction:** In `CONTRACT.md` lines 290 and 312, specify:
  1. Lexicographical vertex comparison is `(x, y)` (`a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]`), and canonical ring comparison compares vertex-by-vertex along the canonical CCW ring (so if two children share the minimum vertex `[minX, minY]`, their next CCW vertex breaks the tie deterministically).
  2. Normalize OBB long-axis angle to $\theta \in [0, \pi)$ radians CCW from $+X$, and break equal-area / equal-side-length ties by smallest $\theta \in [0, \pi)$.

---

## 3. Minor Documentation / Cross-File Defect (Non-Mathematical)

### Minor Issue 1: Asset path mismatch between `PAPERS.md` and `README.md`
- **Evidence:** [PAPERS.md](file:///home/david/.codex/worktrees/city-parcel-contract/docs/library-handover/parcel-proposal/PAPERS.md#L76-L83) vs [README.md](file:///home/david/.codex/worktrees/city-parcel-contract/docs/library-handover/parcel-proposal/README.md#L48-L62).
- **Problem:** `PAPERS.md` line 76 lists the screenshot table column header as `Path (under /tmp/city-parcel-proposal-assets/)`, whereas the actual proposal package stores and links them under `./assets/` (`docs/library-handover/parcel-proposal/assets/*.png`), as correctly used in `README.md`.
- **Smallest Correction:** Change the table header in `PAPERS.md` line 76 from `Path (under /tmp/city-parcel-proposal-assets/)` to `Path (under assets/)`.

---

## 4. Point-by-Point Audit Against Review Criteria

### 4.1 Mathematical Correctness of the 5 Author Scripts (`CONTRACT.md` §§1–5)
All five scripts were verified analytically against the proposed rules:
1. **Script 1 (Corridor, Subtract, Boundary Overlap — lines 38–75):**
   - Domain $[0, 12] \times [0, 8]$ has area $12 \times 8 = 96$.
   - Corridor on path `[[6, 0], [6, 8]]` with `width: 2, endCap: "butt"` spans $[5, 7] \times [0, 8]$, area $= 2 \times 8 = 16$.
   - Subtracting $[5, 7] \times [0, 8]$ from $[0, 12] \times [0, 8]$ yields two disjoint blocks: $[0, 5] \times [0, 8]$ (area $40$) and $[7, 12] \times [0, 8]$ (area $40$).
   - Each block shares one vertical edge of length $8$ with the corridor (`x = 5` and `x = 7`, respectively). `frontage.length === 8` and segment ID `"main-road"` are exact. Input `domain` immutability check (`[12, 0]`) holds.
2. **Script 2 (Frontage-Preserving Subdivision to `Layout` and `Grid` — lines 77–110):**
   - Input $[0, 12] \times [0, 8]$ (area $96 > targetArea\ 48$). South boundary `[[0, 0], [12, 0]]` has length $12$.
   - OBB long axis is horizontal (length $12 > 8$). Perpendicular midpoint cut is at $x = 6$, yielding $[0, 6] \times [0, 8]$ (`key: "0/0"`, `parentKey: "0"`) and $[6, 12] \times [0, 8]$ (`key: "0/1"`, `parentKey: "0"`).
   - Each child has area $48 \le 48$ (`targetArea`), `minimumArea: 40` ($48 \ge 40$), `minimumWidth: 4` ($\min(6, 8) = 6 \ge 4$), and clipped south frontage of length $6 \ge 6$ (`minimumFrontage: 6`).
   - Both children are terminal on cut 1 (`attempts: 1 <= maximumAttempts: 2`, live leaves $= 2 \le maximumParcels: 2$).
   - The two rectangles share the full vertical edge `[[6, 0], [6, 8]]` without T-junctions, so `topology.fromPolygons` accepts them and `grid.neighbors(grid.fields[0]!).length === 1`.
3. **Script 3 (Frontage Failure Retry & Unsplittable Retention — lines 112–149):**
   - Input $[0, 12] \times [0, 8]$, `targetArea: 48`, `minimumFrontage: 4`, west label `[[0, 0], [0, 8]]` (length $8$).
   - Attempt 1 cuts perpendicular to the long axis at $x = 6$. Left child $[0, 6] \times [0, 8]$ gets all $8$ units of west frontage, but right child $[6, 12] \times [0, 8]$ gets $0 < 4$. Cut 1 fails guard and records diagnostic `code: "minimum-frontage"`.
   - Attempt 2 tries the perpendicular midpoint cut at $y = 4$. Both children ($[0, 12] \times [0, 4]$ and $[0, 12] \times [4, 8]$) have area $48 \le 48$ and inherit $4$ units of the west edge ($4 \ge 4$). Cut 2 succeeds (`status: "ok"`, `attempts: 2`).
   - Second call has `targetArea: 48, minimumArea: 49`. Any midpoint bisection of area $96$ yields two parts of area $48 < 49$. Both candidate orientations fail `minimum-area`, returning `status: "unchanged"`, `parts: []`, detached original in `remainingParts`, and `code: "minimum-area"`.
   - Third call with `targetArea: 0` throws `RangeError`.
4. **Script 4 (Hole Preservation, `unsupported` OBB on Holed Polygon, and `partial` Budget Stop — lines 151–186):**
   - Subtracting $[4, 8] \times [2, 6]$ (area $16$) from $[0, 12] \times [0, 8]$ (area $96$) produces 1 `PlanarPolygon` with 2 rings (`coordinates.length === 2`, outer ring + 1 hole ring) and net area $96 - 16 = 80$.
   - Passing that holed polygon to `subdivide` with `method: "orientedBoundingBox"` returns `status: "unsupported"`, `parts: []`, and retains the 80-unit holed polygon in `remainingParts`.
   - Calling `subdivide` on the hole-free $12 \times 8$ shape with `targetArea: 24, maximumAttempts: 1` performs 1 cut at $x = 6$, producing two children of area $48 > 24$. Since `attempts === 1 === maximumAttempts`, recursion halts with `status: "partial"`, `parts: []`, `remainingParts` of areas `[48, 48]`, diagnostic `"maximum-attempts"`, conserved sum $96$, and `areaResidual: 0`.
5. **Script 5 (Explicit `Random` Stream & Zero Incidental Draws — lines 188–215):**
   - `Random.add({ seed })` and `random.number({ min: 12, max: 20 })` match the actual delivered `Random` API in `feat/grid-parcel-foundations`.
   - `structuredClone(random.state)` before and after `geometry.subdivide` proves that deterministic OBB consumes zero RNG draws.

### 4.2 API Compatibility & Minimum Sufficient Architecture
- **Closed GeoJSON `PlanarPolygon`:** Preserved everywhere (`type: "Polygon"`, closed coordinate rings `[[x, y], ...]`, holes as additional rings in `coordinates`). No `{ outer, holes }` object or competing `Parcel` class is introduced.
- **Root exports & namespace discipline:** Everything imports from `"city-library"`. Operations stay on `geometry` (`corridor`, `subtract`, `boundaryOverlap`, `subdivide`) and `topology` (`fromPolygons`, and later `voronoi`). Only three small type families (`LabelledBoundarySegment`, `SubdivisionPart`, `SubdivisionDiagnostic` / `SubdivisionResult` / `OrientedBoundingBoxOptions`) are proposed as exports.
- **Flat configuration & discriminated options:** `geometry.subdivide` uses a flat configuration object discriminated by `method: "orientedBoundingBox"`, preventing skeleton-only or strip-only parameters from polluting OBB calls.
- **Existing signatures untouched:** Existing `geometry.split`, `geometry.merge`, `geometry.area`, `geometry.bounds`, and `geometry.contains` keep their exact delivered signatures and return types.

### 4.3 Residual, `partial`, `unchanged`, `unsupported`, and `failed` Semantics
- **Disjoint Partition Invariant:** `parts` (accepted terminal leaves with `area <= targetArea` meeting all guards) and `remainingParts` (valid unresolved leaves) have disjoint interiors whose union equals the input net region, with `areaResidual = inputArea - sum(parts) - sum(remainingParts)` checked within `inputArea * 1e-9`.
- **Status Discrimination:**
  - `ok`: `remainingParts.length === 0`.
  - `partial`: $\ge 1$ cut committed and `remainingParts.length > 0` (including when `parts.length === 0` and all committed children are still pending above `targetArea`, as tested in Script 4).
  - `unchanged`: $0$ cuts committed and root unresolved (or root already $\le targetArea$ fails a minimum guard? Note: see Recommendation 1 below to confirm whether a root that already has `area <= targetArea` but fails `minimumFrontage` / `minimumArea` / `minimumWidth` returns `unchanged` with 0 attempts).
  - `unsupported`: Valid geometry outside method capability (concavity or holes for first-slice OBB), checked *before* terminal `area <= targetArea` acceptance.
  - `failed`: Numerical failure rolls back the entire `subdivide` call to a detached copy of the input `shape` in `remainingParts` (`parts: []`), avoiding partially corrupted output.

### 4.4 Boundary Labels & Interval Union (`boundaryOverlap`)
- Representing road frontage as `LabelledBoundarySegment[]` (`{ id, segment: [[x1, y1], [x2, y2]] }`) is clean, detached from ring vertex indices, and survives edge splitting and collinear vertex removal.
- Merging overlapping segments of the same `id` while computing `.length` as the **geometric 1D interval union across all IDs** prevents double-counting when two road labels overlap on the same boundary edge.
- Point contacts correctly contribute `0` length.
- Explicitly distinguishing geometric boundary overlap from transport-network reachability (`Graph`) and legal/vehicular access (e.g., dead-end caps or grade-separated bridges) is rigorous and honest.

### 4.5 `targetArea`, Guards, Budgets, Units, and Precision
- Defining `targetArea` as a strict completion upper bound (`area <= targetArea`) rather than an approximate statistical mean is necessary for deterministic status classification (`ok` vs `partial` vs `unchanged`).
- Support bounds (`<= 1024` cells/components, `<= 128` positions/ring, `<= 8192` positions total, coordinate magnitude `<= 1e6`, relative `1e-9` area residual tolerance) match `src/geometry/planar/parcel-input.ts` and `src/grid/topology/layout.ts` in `2a7f3eb`.
- Units remain caller-declared local planar coordinates (areas in squared units) with no hidden metre assumptions or silent epsilon snapping.

### 4.6 Topology T-Junction Limitations
- `CONTRACT.md` (line 110, line 376, line 389) and `SYNTAX.md` (line 91) accurately reflect `src/grid/topology/layout.ts` (`validatePair` line 15: `throw new RangeError("Unsupported nonconforming polygon edge contact.")`).
- Because recursive binary subdivision of adjacent blocks (or depth $\ge 2$ asymmetric OBB splits within a single block) naturally creates T-junctions (partial shared edges), `topology.fromPolygons` in `2a7f3eb` will reject general recursive subdivision outputs. The proposal rightly flags this as an explicit boundary and prevents making false general subdivision-to-`Grid` claims before a conforming-edge normalization or partial-edge topology extension is accepted.

### 4.7 Actual vs. Proposed Separation & Conservative Paper Claims
- Across all five files, delivered functionality at `2a7f3eb` is clearly separated from the approved target inventory (`docs/grid-parcels/API.md`) and from new proposal refinements (`minimumFrontage`, `boundarySegments`, structured `SubdivisionDiagnostic`).
- Paper claims in `CONTRACT.md`, `PAPERS.md`, and `EXTENDED-PAPERS.md` are conservative and accurate:
  - **Vanegas et al. (2012):** Clearly separates OBB recursion from straight-skeleton strip generation; notes that Appendix A was not inspected and no faithful port is claimed.
  - **Aichholzer et al. (1995):** Accurately cited as the wavefront straight-skeleton definition (distinct from medial axis and naive bisectors), noting event handling complexity and CGAL's GPL-3.0+/commercial license constraints.
  - **Parish & Müller (2001):** Notes that their pipeline discards small/inaccessible lots, whereas `city-library` must conserve area via `remainingParts`.
  - **Chen, Song & Ortner (2024):** Correctly classified as coupled hierarchical street-and-parcel co-generation (cross-field streamlines + I/L access street extensions + global mesh optimization), not an OBB flag.
  - **Wickramasuriya et al. (2011) & Koc et al. (2020/2022):** Honestly records that publisher full texts were paywalled/403 and forbids deriving algorithms from abstract-only evidence.
  - **Bibliography Corrections Verified:**
    - Wickramasuriya et al.: *Environmental Modelling & Software* 26(12), 1675–1684 (2011), DOI `10.1016/j.envsoft.2011.06.003`.
    - Koc et al.: *Proceedings of the Institution of Civil Engineers - Municipal Engineer* 175(1), 16–28 (2022 issue; online 2020), DOI `10.1680/jmuen.18.00066`.
    - He & Aliaga (GlobalMapper): ICCV 2023, pp. 454–464.
    - Nishida, Garcia-Dorado & Aliaga: *Computer Graphics Forum* 35(6), 5–17 (2016).
    - Mei, Yandong: *Bulletin of Hosei University Graduate School, Computer and Information Sciences* 13, 1–6 (2017), DOI `10.15002/00021513`.

---

## 5. Non-Blocking Design Recommendations

1. **Clarify root acceptance when `root.area <= targetArea` but a minimum guard fails:**
   - `CONTRACT.md` line 311 states: *"A leaf is accepted only when its area is at most targetArea and it meets all minimum guards... An already acceptable root returns `ok`, key `0`, parentKey null, zero attempts."*
   - What if `root.area <= targetArea`, `minimumFrontage: 10`, and the root only has `frontage = 4` (or `root.area < minimumArea`)? Since a cut can only decrease area and frontage, splitting cannot fix it. Clarify in item 2 (line 311) that if the root has `area <= targetArea` (or `maximumDepth === 0`) and fails a minimum guard, it returns `status: "unchanged"`, `parts: []`, `remainingParts: [root]`, `attempts: 0`, and the corresponding guard diagnostic (`attempt: null`).
2. **Keep `SubdivisionDiagnostic` vs `string` diagnostics consistent with `CODING_STANDARDS.md`:**
   - Existing `split` and `merge` use `readonly diagnostics: readonly string[]`, and `CONTRACT.md` keeps `readonly string[]` on `corridor` and `subtract` while introducing structured `SubdivisionDiagnostic[]` on `subdivide`. This is a sound design choice (explained in `CONTRACT.md` line 371) because recursive search benefits from `{ code, key, attempt }`, whereas single-step operations do not. No change needed, just confirm this distinction when freezing the examples.
3. **Single-block vs. multi-block T-junction note in `CONTRACT.md` line 110:**
   - Worth noting that even *within* a single block, if `subdivide` reaches depth 2 on one half of a cut (`0/0/0`, `0/0/1`) while the other half (`0/1`) terminates at depth 1, the internal cut between `0/0/0` and `0/0/1` forms a T-junction on the shared boundary with `0/1`. Thus, `topology.fromPolygons` requires conforming-edge splitting even for single-block asymmetric recursion whenever depth $> 1$.
