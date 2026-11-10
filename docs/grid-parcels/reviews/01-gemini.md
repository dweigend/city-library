# Independent Review Report: Grid & Parcel Foundations (Phase 1)

- **Date:** 2026-11-07
- **Reviewer:** Antigravity `gemini-3.8-flash` (Independent Review Sub-agent)
- **Target Branch / Head:** `feat/grid-parcel-foundations` @ `1fda843abd`
- **Baseline:** `dc7b164abd` (`experiment/netlogo-web-catalog`)
- **Diff Inspected:** `dc7b164..1fda843`
- **Worktree:** `/home/david/.t3/worktrees/city-library/feat-grid-parcel-foundations`
- **Scope:** Headless first phase of City Library grid and parcel foundations
- **Decision:** **APPROVED (Scoped to Phase 1)**

---

## 1. Executive Summary & Review Scope

This independent review evaluates the completed first phase of the headless City Library grid and parcel foundations on branch `feat/grid-parcel-foundations` at commit `1fda843abd`. The review covers:
1. Public API exports, TypeScript type integrity, and absence of fabricated capabilities.
2. Exact authored topology validation and square/hex lattice generation.
3. Detached immutable layout query mechanics and canonical `Grid`/`Field` integration.
4. Backward compatibility with existing regular `Grid` mechanics (including Moore/faces neighborhood order and tiny-wrap directional diffusion).
5. World admission criteria and agent occupancy lifecycle (explicit vs. World-indexed).
6. Planar geometry operations: net `area` (with hole and MultiPolygon semantics), conforming `merge` (with source provenance and retained rejects), and guarded convex `split` (with rigorous area conservation and no silent area loss).
7. Robustness against numerical degeneracy, boundary tie handling, T-junctions, non-manifold contacts, and input bounds.
8. Preservation of the five frozen example scripts and provenance boundary against `city_game`.

The review confirms that all five frozen examples are byte-identical to their baseline snapshot in `158b803`, no runtime dependencies have been introduced, no UI code was modified, and all unit, integration, type, and consumer checks pass.

---

## 2. Frozen Examples & Provenance Verification

- **Example Checksums:** Verified against `tests/public-contracts/grid-parcels/SHA256SUMS` using `sha256sum -c`. All 5 examples (`01` through `05`) matched with zero diff from `158b803..1fda843`.
- **Public API Conformance:** All 5 examples run with assertion passes under Bun without flags or shims.
- **Source Provenance Isolation:** Checked for runtime leakage of `city_game` (committed at `3e1d34f1`). `git grep -i "city_game" src/ index.ts package.json` returned zero matches. No dependencies were added to `package.json` or `bun.lockb`. The source remains strictly read-only reference provenance.
- **Scope Discipline:** No UI code (`ui/`) was modified; no secondary `Cell` type or alternative `MultiPolygon` format was exported.

---

## 3. Detailed Audit by Subsystem

### 3.1 Topology Generation & Exact Authored Validation (`src/grid/topology/`)

1. **Square & Hex Generators (`topology.square`, `topology.hex`):**
   - `square` generates row-major cells starting at `(0, 0)` with Cartesian `+X, +Y`.
   - `hex` supports both `"pointy"` and `"flat"` orientations using center-to-corner `cellRadius`.
   - **Integer Lattice Shared Vertices:** Hex generation constructs an integer lattice map `(horizontal + x, vertical + y)` and computes exact floating-point vertices once per lattice node. Incident hex cells share the identical point objects, eliminating floating-point gaps, overlaps, or epsilon snapping between neighbors.
2. **Authored Conforming Validation (`topology.fromPolygons`):**
   - Inputs are bounded: 1..1024 cells, <=128 positions per ring, <=8192 positions total, and coordinate magnitude <= 1e6.
   - Validates that polygons are simple, hole-free, non-empty, and closed.
   - Employs exact binary64 `BigInt` predicates (`src/geometry/planar/predicates.ts`) to evaluate determinant orientations, edge contacts, and ray classifications without rounding or division error.
   - **T-Junction & Overlap Rejection:** Pairwise edge validation detects:
     - Edge interior contacts (`interiorSegment`), cleanly rejecting T-junctions with `RangeError("Unsupported nonconforming polygon edge contact.")`.
     - Non-conforming edge crossings without shared endpoints (`RangeError("Polygon interiors overlap at crossing edges.")`).
     - Strict interior containment (`RangeError("Polygon interiors overlap.")`).
     - Duplicate interior overlaps (`RangeError("Duplicate polygon interiors overlap.")`).
     - Interior overlap along shared edges via signed orientation and direction matching (`RangeError("Polygon interiors overlap beside a shared edge.")`).
     - Non-manifold edges where an edge has >2 incident polygons (`RangeError("Unsupported nonmanifold polygon edge.")`).
3. **Layout Queries:**
   - `layout.cells`: Returns frozen numeric array `0..n-1`.
   - `layout.polygon({ cell })`: Returns detached frozen `PlanarPolygon`. Caller mutations do not affect layout state.
   - `layout.neighbors({ cell })`: Includes only cells sharing positive edge length, sorted in ascending key order. Corner-only contacts (e.g. vertices touching at `(1, 1)`) are correctly excluded.
   - `layout.cellAt({ position })`: Evaluates point containment via bounding boxes and exact ray-casting. Boundary ties deterministically resolve to the lowest numeric cell key.
   - `layout.sharedBoundary({ firstCell, secondCell })`: Returns shared segments oriented in the direction of `firstCell`'s ring.

### 3.2 Canonical State & Grid/World Connection (`src/grid/`, `src/world/`)

1. **Separation of Geometry and State:**
   - `Layout` is strictly immutable pure geometry.
   - `LayoutGrid` wraps a `Layout` and instantiates canonical `Field` objects owning mutable user state.
2. **Honest Capabilities on `LayoutGrid`:**
   - `LayoutGrid` explicitly omits regular properties: `"space"`, `"cellSize"`, and `"diffuse"` are absent and blocked at compile time via type constraints (`grid-parcel-types.ts`).
   - `field.grid` points to the `LayoutGrid` instance; `field.z` is `undefined`.
   - Representative field position `(field.x, field.y)` uses the polygon area centroid, clearly distinct from a regular grid address.
3. **World Admission Rules:**
   - A `LayoutGrid` may join a World that has no `Space`, or a 2D World with hard boundaries (`boundary.x === "hard" && boundary.y === "hard"`) whose spatial extents fully enclose all vertices of all cells in the layout.
   - Adding a `LayoutGrid` to a 3D World or a wrapping World throws a `TypeError`.
   - `World.grids` returns `readonly (Grid | LayoutGrid)[]`.
4. **Agent Occupancy:**
   - Both regular and layout grids share the `createOccupancyIndex` infrastructure.
   - Occupancy reacts to agent movement (`agent.move`), lifecycle changes (`agent.delete`), and world detach/reattach.
   - Explicit `agentsAt(field, { source })` correctly filters detached candidates without requiring World membership.

### 3.3 Planar Geometry Operations (`src/geometry/planar/`)

1. **Net Area (`geometry.area`):**
   - Computes Shoelace area translated relative to `ring[0]`, mitigating floating-point catastrophic cancellation for coordinates near `1e6`.
   - Supports both `PlanarPolygon` and the `MultiPolygon` variant of `PlanarGeometry`.
   - Shell area is added; hole areas are subtracted. Rejects non-positive or non-finite results.
2. **Conforming Merge (`geometry.merge`):**
   - Supports `{ shapes }` and `{ layout, cells }`.
   - Validates source inputs through `createLayout(shapes, true)` to ensure non-overlapping, conforming input.
   - Uses directed edge cancellation on normalized CCW rings to extract merged contours.
   - Detects branching boundaries at pinch points (`"Merged boundary branches at a point contact."`), non-closing loops, disconnected components, and holes.
   - Verifies area conservation within relative `1e-9` tolerance.
   - Rejections (`"unsupported"` or `"failed"`) retain all original shapes in `remainingShapes` and preserve `sourceCells`, preventing silent area loss.
3. **Guarded Convex Split (`geometry.split`):**
   - Takes `{ shape, point, direction, minimumArea? }`.
   - Direction vector is scaled by its infinity-norm (`Math.max(abs(dx), abs(dy))`), preventing division overflow or underflow across extreme floating-point magnitudes (e.g. `1e-300` to `1e308`).
   - Zero or non-finite directions throw `RangeError`.
   - Rejects non-convex or holed polygons as `"unsupported"` while preserving the input shape.
   - Cuts that do not cross the interior (tangents, outside lines) or cuts resulting in a part below `minimumArea` or positive area tolerance return status `"unchanged"` with diagnostic messages and detached original shape in `parts`.
   - Verifies child validity via `readPolygon` and confirms area conservation `|area1 + area2 - originalArea| <= originalArea * 1e-9`. Numerical discrepancies return `"failed"` with the retained shape.

### 3.4 Preservation of Regular Grid Contracts

- Regular `Grid.create(space, options)` behavior remains intact:
  - Centered origin preserved.
  - Moore (8) and faces (4) neighborhood order preserved.
  - Directional diffusion multiplicity on tiny wrapping spaces (e.g., 1x1, 1x2, 2x2) is strictly maintained.
  - Existing spatial tests (`tests/spatial-grid.test.ts`, `tests/indexed-occupancy.test.ts`, `tests/grid-occupancy-performance.test.ts`) continue to pass without modification.

---

## 4. Verification & Testing Evidence

All checks executed independently during this review:

| Check | Target / Command | Result |
| --- | --- | --- |
| Checksums | `bun run check:migration` | All 5 frozen examples matched |
| Frozen Examples | `bun tests/public-contracts/grid-parcels/01..05-*.ts` | All 5 passed (exit code 0) |
| Grid/Parcel Tests | `bun test tests/grid-parcels-*.test.ts` | 21 passed, 0 failed (1365 expect calls) |
| Spatial Regressions | `bun test tests/spatial-grid.test.ts tests/indexed-occupancy.test.ts` | 19 passed, 0 failed |
| TypeScript Check | `bun run typecheck && bunx tsc -p tsconfig.dev.json` | 0 errors, 0 warnings (including Svelte check) |
| Independent Edge Tests | Node/Bun harness testing boundary ties, T-junctions, diagonal/tangent cuts, MultiPolygon hole subtraction | All edge cases passed |
| Packed Consumer | Real `.tgz` pack and ambient-free TS consumption in Bun + Node ESM | Passed |

---

## 5. Observations & Follow-Up Recommendations (Non-Blocking)

1. **Centroid vs. Interior Point for Concave Cells:**
   As specified in `STATUS.md` and `API.md`, `LayoutField.x` and `LayoutField.y` represent polygon area centroids, which can theoretically fall outside the boundary of severely concave authored polygons. Field lookup (`fieldAt`) correctly uses the polygon boundaries rather than the centroid coordinates. This is honest and documented; future phases offering `geometry.interiorPoint` may provide optional interior anchor points if required.
2. **Merge Overlap Diagnostics:**
   When non-conforming shapes are passed to `geometry.merge({ shapes })`, the pre-validation via `createLayout(shapes, true)` throws a `RangeError`, which is caught and returned as `status: "unsupported"`. The error message is clear (`"Merge requires nonoverlapping conforming full-edge polygons."`). This is safe and conservative.

---

## 6. Formal Acceptance Decision

The implementation of the first phase of the City Library grid and parcel foundations meets all architectural, algorithmic, safety, and delivery requirements.

**Decision: APPROVED**
