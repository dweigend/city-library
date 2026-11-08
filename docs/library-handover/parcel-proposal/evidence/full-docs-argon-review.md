# Independent Review of Expanded Grid and Parcel API Documentation

**Date:** 2026-11-07
**Reviewer:** Antigravity (`gemini-4-argon`)
**Scope:** Fresh independent review of `/home/david/.codex/worktrees/city-parcel-contract/docs/library-handover/parcel-proposal/{api-reference.md,api-table.md,COVERAGE.md,CONTRACT.md,PLAN.md,SYNTAX.md}` against the 49-row source catalogue (`/home/david/Projekte/city_game/docs/library-handover/GRID-PARCELS-API.md`), the style benchmark (`/home/david/Projekte/city-library/docs/agent-loom/{api-reference.md,api-table.md}`), and the actual target baseline (`/home/david/.t3/worktrees/city-library/feat-grid-parcel-foundations` at `2a7f3eb`).
**Mode:** Read-only documentation review. No repository edits, runtime tests, builds, or child delegations were performed.

## Verdict

**APPROVED** (no blockers; two minor non-blocking documentation alignment notes below).

The expanded API documentation (`api-reference.md`, `api-table.md`, `COVERAGE.md`, `CONTRACT.md`, `PLAN.md`, `SYNTAX.md`) is concrete, mathematically and architecturally sound, and matches the elegant, concise specification style of `docs/agent-loom/{api-reference.md,api-table.md}`. The previous small `CONTRACT.md` review was not carried over as blanket approval; every expanded section and signature was audited afresh against `2a7f3eb` source and `GRID-PARCELS-API.md`.

## Verification Summary Across Required Dimensions

1. **Full Catalogue Coverage & Table/Reference Parity:**
   - All 49 operation rows from `GRID-PARCELS-API.md` are mapped in `COVERAGE.md` (`L9-L57`) and expanded into **56 operation/property sections** across `api-table.md` and `api-reference.md` (separating preserved dataset/positional `bounds`/`contains` overloads, default `Grid.add()`, `field.id` vs `field.grid`, and the three `geometry.subdivide` methods).
   - Every local link and fragment anchor across `api-reference.md`, `api-table.md`, `COVERAGE.md`, `CONTRACT.md`, `PLAN.md`, `SYNTAX.md`, and `README.md` resolves cleanly.
   - All 56 operation code fences in `api-table.md` match their corresponding primary signature fences in `api-reference.md` (with `api-reference.md` additionally inlining the `MergeResult` and `SplitResult` type declarations beneath `geometry.merge` and `geometry.split` for reader convenience).

2. **Exact Delivered Signatures, Limits, and Returns vs `2a7f3eb` Baseline:**
   - **Exports (`index.ts`):** All imports shown in `api-reference.md#shared-types` (`L17-L25`)—`geometry`, `topology`, `Grid`, `Random`, `World`, and types `PlanarXY`, `PlanarPolygon`, `PlanarGeometry`, `ParcelShape`, `Position`, `Vector`, `Layout`, `BoundarySegment`, `Bounds`, `PlanarJson`, `PlanarFeature`, `PlanarDataset`, `Space`, `Agent`, `Field`, `LayoutGrid`, `LayoutField`—are verified public exports at `2a7f3eb`. Descriptive-only local types (`SubdivisionControls`, `ShapeChange`, `NumericKey<F>`) and regular `Grid<F>` instance notation are explicitly labeled as non-exported explanatory notation (`api-reference.md#L27`, `#L910`, `#L1191`, `#L1349`, `#L1539`).
   - **Topology (`src/grid/topology/`):** `square`, `hex`, `fromPolygons`, and `Layout` queries (`cells`, `polygon`, `neighbors`, `cellAt`, `sharedBoundary`) match exact runtime validation and limits: `1..1024` cells, `<= 128` closure-inclusive positions per ring, `<= 8192` total positions, coordinate magnitude `<= 1e6`, exact binary64 vertex/edge identity without epsilon snapping, `RangeError` on holes/overlaps/T-junctions/nonmanifold edges, lowest-key tie-break on included boundaries in `cellAt` (`classify >= 0`), and `sharedBoundary` segment direction following `firstCell` ring traversal.
   - **Geometry Measurements & Changes (`src/geometry/planar/`):**
     - `geometry.area({ shape })` (`#geometry-area`, `L601-L617`): matches `readShape` (`ParcelShape`), subtracts holes, sums `MultiPolygon` components without Boolean union, and throws `RangeError` on nonpositive/nonfinite area.
     - `geometry.bounds(input)` (`#geometry-bounds`, `L639-L660`): preserves positional `PlanarDataset | readonly PlanarFeature[]` signature, `[minX, maxX, minY, maxY]` tuple order, `undefined` on empty coordinates, cycle detection on `GeometryCollection`, and unconstrained coordinate magnitude.
     - `geometry.contains(shape, position, options?)` (`#geometry-contains`, `L715-L736`): preserves positional signature, default `boundary: "include"`, `<= 2048` closure-inclusive positions across rings, and `<= 1e9` query coordinate magnitude (`api-reference.md#L185`, `#L735`).
     - `geometry.merge` (`#geometry-merge-shapes`, `#geometry-merge-cells`, `L850-L903`): matches both `{ shapes }` and `{ layout, cells }` overloads, preserves caller order in `sourceCells` (`[]` for raw shapes), enforces `<= 128` merged ring positions and `<= inputArea * 1e-9` area residual, and omits `diagnostics` on `"ok"`.
     - `geometry.split` (`#geometry-split`, `L1002-L1037`): matches convex hole-free restriction, infinite line through `point` (`<= 1e6`) along nonzero XY `direction`, `minimumArea >= 0`, `inputArea * 1e-9` positive-part and residual guard, and retains detached `[shape]` in `parts` on `"unchanged" | "unsupported" | "failed"`.

3. **Grid vs LayoutGrid Ownership and Capabilities (`src/grid/`):**
   - Accurately distinguishes `Grid<F>` (`space`, `cellSize`, `neighbors(field, { neighborhood?: "faces" | "moore" })` defaulting to `"moore"`, `diffuse(property, { rate?, neighborhood? })` defaulting to `rate: 0.25, neighborhood: "faces"` with directional slot multiplicity on tiny wrapped grids) from `LayoutGrid<F>` (`layout`, `fields: readonly LayoutField<F>[]`, `neighbors(field)` with 1-argument check and positive-edge adjacency, no `space`/`cellSize`/`diffuse`, `z: undefined`, and cell area centroid positions).
   - Explicitly documents that `field.grid` is typed as `Grid<F>` on regular fields and `LayoutField<F>["grid"] = LayoutGrid<F>` on layout fields (`#field-grid`, `L1479-L1490`).

4. **Honest Labeling of Proposed & Research Contracts:**
   - Every unimplemented operation, overload (`bounds({ shape })`, `contains({ shape, position, boundary? })`), type (`ValidationResult`, `OrientedBounds`, `ShapeContact`, `BoundaryOverlap`, `LabelledBoundarySegment`, `SubdivisionPart`, `SubdivisionDiagnostic`, `SubdivisionResult`, `ShapeChange`), and default is explicitly marked **Proposed** or **Research**.
   - Expanded topology generators (`triangle`, `trihex`, `rectangles`, `voronoi`, `quadrilaterals`, `relax`, `validate`, `group`) clearly state pre-freeze open decisions (slot/motif definitions, cut distributions and RNG draw order, Voronoi site/domain restrictions, Lloyd relaxation provenance gap on general `Layout`s) rather than faking maturity.
   - `geometry.validate` (`#geometry-validate`, `L536-L553`) cleanly separates `valid: true | false | null` and `supported: boolean` so budget limits (`valid: null, supported: false`) are never conflated with proven geometric invalidity, while scalar measurements throw `RangeError`/`TypeError` instead of wrapping scalar returns in status objects.

5. **Subdivision Contracts (OBB, Parallel Strips, Straight Skeleton):**
   - **OBB (`#geometry-subdivide-obb`, `L1215-L1245`, `CONTRACT.md#L306-L319`):** Fully specifies deterministic edge-aligned minimum-area OBB, angle normalization in `[0, pi)`, area and equal-side tie-breaking by smaller normalized angle then canonical edge coordinates, full canonical CCW ring lexicographical comparison (`X` then `Y`, excluding closing vertex) for child ordering, perpendicular midpoint retry, attempt charging (`1` per candidate line), pre-cut `maximumParcels` live-leaf check (`attempt: null`, retaining pending land), root/leaf terminal classification when already `<= targetArea` but failing minimum guards (`unchanged` with `0` attempts), and full rollback to the detached root on `"failed"`.
   - **Parallel Strips & Straight Skeleton (`#geometry-subdivide-strips`, `#geometry-subdivide-skeleton`, `L1246-L1299`):** Honestly scoped as later/research contracts under the discriminated union without claiming that `targetArea` or naive ribs implement Vanegas et al. (2012) or Aichholzer et al. (1995).

## Non-Blocking Notes (Smallest Fixes)

1. **`COVERAGE.md` Supplementary Row Count After Shared-Type Addition (`COVERAGE.md#L67`):**
   - *Observation:* `COVERAGE.md#L67` states that the inventory expands the 49 catalogue rows into *"56 operation/property sections and **25** supplementary type/result rows"*, whereas adding the `Feature and dataset` (`api-table.md#L983`) and `Simulation types` (`api-table.md#L984`) rows brought the table in `api-table.md#shared-data-and-procedure-results` (`L977-L1003`) to **27** rows.
   - *Smallest fix:* Update `25 supplementary type/result rows` to `27 supplementary type/result rows` at `COVERAGE.md#L67`.

2. **Triangle Example Comment Arithmetic (`api-reference.md#topology-triangle`, `L267-L269`):**
   - *Observation:* In `#topology-triangle` (`L264`), the formula is stated as `sqrt(3)*edgeLength**2/4`. The example at `L267` passes `edgeLength: 2`, which yields `sqrt(3) * 4 / 4 = sqrt(3)` (matching the comment at `L269`: `// Every area is analytically sqrt(3)`), so this is mathematically exact. However, in `#geometry-oriented-bounds` (`L638`) and `#geometry-minimum-width` (`L696`), the prose says *"raise the proposed query `RangeError`"*; keeping that phrasing explicitly tied to the pre-freeze convention in `#shared-contracts` (`L177`) is clear and needs no structural change.
