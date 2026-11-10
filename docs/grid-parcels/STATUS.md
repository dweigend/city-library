# Grid and parcel catalogue status

The complete approved target inventory remains unchanged in [API](API.md).
This ledger separates the bounded first-phase implementation from the broader
catalogue. Foundation evidence is recorded in [VERIFICATION](VERIFICATION.md);
the finite quad extension has its own [contract](QUAD-LAYOUTS-CONTRACT.md) and
[verification record](QUAD-LAYOUTS-VERIFICATION.md). The accepted
[example-first plan](../development/example-first/PLAN.md) owns further stages.
The linked quad contract is a frozen historical signature record. Current calls use `rings` → `ringCount`, `iterations` → `iterationCount`, `squareTarget` → `square-target` and `relaxationIterations` → `relaxationIterationCount`; keep the historical bytes unchanged and use the current API table below.

The bounded capabilities below are implemented and included in the [integration pull request](https://github.com/dweigend/city-library/pull/48). The broader catalogue remains planned; package publication is outside this scope. Historical verification records describe their original checkpoints and do not determine current merge authorization.

| Catalogue area | Bounded implementation | Explicit backlog |
| --- | --- | --- |
| Topology generation | `square`, `hex`, `fromPolygons`; finite `quadrilaterals({ ringCount, edgeLength?, random })`; separate `relax({ layout, method: "square-target", iterationCount })` for supported convex quads | `triangle`, `trihex`, `rectangles`, `voronoi`, arbitrary-boundary quadrilaterals, Lloyd relaxation, `validate`, dual mapping and chunks |
| Layout queries | `cells`, `polygon`, `neighbors`, `cellAt`, `sharedBoundary`; local numeric keys, edge adjacency and lowest-key ties | Wrapping layouts, persistent parcel IDs, topology mutation |
| Geometry measurements | `area({shape})` for Polygon and the MultiPolygon variant; existing dataset `bounds` and existing `contains` retain their contracts | `validate`, `perimeter`, shape `bounds` overload, `orientedBounds`, `centroid`, `interiorPoint`, `minimumWidth`, `compactness`, object `contains` overload, `contact`, geometry `sharedBoundary`, `boundaryOverlap` |
| Geometry changes | `merge({shapes})`, `merge({layout,cells})` for conforming connected simple unions; `split` for guarded convex infinite-line cuts | General Boolean merge, `intersection`, `subtract`, `clip`, `offset`, `corridor` |
| High-level procedures | None | `topology.group`, `geometry.subdivide`; OBB recursion, parallel strips, straight skeleton and work-budget/search contracts |
| Agent Loom connection | Existing regular Grid unchanged; additive layout Grid with canonical typed Fields, lookup, shared-edge neighbors and explicit/attached occupancy | Irregular diffusion, implicit state or Agent transfer across split/merge |
| Volumes | None | All 3D layout and parcel operations; separate volume contracts |

The [bounded layout contract](#bounded-layout-contract) specifies input bounds, numerical rules, outcomes,
hex coordinates and example expectations. Unsupported operation results retain
all input geometry. Malformed data throws; an unchanged requested cut does not
prove that every subdivision is infeasible. No deferred method has an empty stub.

Layout lookup accepts planar positions within the declared coordinate bound;
queries beyond it throw rather than extrapolate. A layout Grid may join a World
without Space, or a planar hard-boundary World containing every layout vertex.
Wrapping or three-dimensional Worlds reject it. `World.grids` exposes the honest
regular/layout union; consumers narrow with `"layout" in grid` when they need
variant-specific capabilities. Field positions are polygon area centroids, with
no interior-point guarantee for concave cells. Occupancy uses actual polygons.

Area adds MultiPolygon component areas and subtracts each component's holes;
it does not perform a Boolean union or deduplicate overlapping components. Merge
rejects disconnected or holed unions, partial edges, branching boundaries and
outputs exceeding the supported ring budget, retaining all original shapes.
Split validates both complete children and the relative area residual before
returning success; a numerical failure retains a detached original.

The original catalogue's `Source`, `New` and `Research` labels describe design
lineage. They are not availability flags. Source comparison and notices are in
[PROVENANCE](PROVENANCE.md); source results never substitute for target checks.

## Bounded layout contract


- `layout.cells` contains numeric keys `0..n-1`, ordered row-major for generators
  and in caller order for polygon import. Keys are layout-local, not persistent
  parcel identifiers. No new stateful Cell type exists.
- Square cells start at lower-left `(0,0)` with positive XY axes, default
  `cellSize: 1`. Cell `(column,row)` spans its full square. This geometry origin
  does not change the existing centered regular Grid/Space API.
- Hex defaults to `cellRadius: 1`, `orientation: "pointy"`. Radius is
  center-to-corner. Axial coordinates are `q=column`, `r=row`: pointy centers
  `(sqrt(3)*(q+r/2),1.5*r)*radius`; flat centers
  `(1.5*q,sqrt(3)*(r+q/2))*radius`. The first center is `(0,0)`.
  Finite layouts include complete cells, with no clipping, wrap or normalization.
- Polygon data is the existing closed-ring `PlanarPolygon`; no alternative
  polygon representation or named exported MultiPolygon type is introduced.
  Area accepts Polygon and the MultiPolygon variant of `PlanarGeometry`, subtracts
  hole areas and returns a plain number in squared coordinate units.
- Layout lookup includes boundaries; ties choose the earliest key in
  `layout.cells`. Neighbors share positive full-edge length, with deterministic
  layout-key ordering; corner contacts are excluded. `sharedBoundary` returns
  XY segment pairs oriented as the first cell's ring.
- Imported topology initially supports simple hole-free conforming polygons:
  no overlap, crossing or partial-edge/T junction. Inputs and all produced
  geometry are detached; topology/query results are immutable.
- Bounded supported inputs: up to 1024 cells/shapes, 128 closure-inclusive
  positions per ring and 8192 positions total, finite XY coordinates of absolute
  magnitude at most `1e6`. Authored edge/containment predicates are exact, with no
  epsilon snapping. Generated hex cells reuse exact lattice endpoints.
  Relative `1e-9` tolerance applies only to operation area residuals and split
  degeneracy diagnostics. Tests cover supported bounds, deterministic adjacency
  and conservation. Operations must reject unresolved degeneracy rather than
  discard area.
- `geometry.merge({ shapes })` and `geometry.merge({ layout, cells })` support
  conforming connected simple unions. Success is `{ status: "ok", shape,
  sourceCells }`; caller-specified source keys retain caller order, while the
  shapes overload uses `[]`. Unsupported holes, disconnected components or
  nonconforming edges may be rejected with `{ status: "unsupported",
  remainingShapes, diagnostics }`, retaining every input shape and all area.
  No general polygon Boolean operation is promised.
- `geometry.split({ shape, point, direction, minimumArea? })` uses an infinite
  line and the existing Position/Vector authoring style; `minimumArea` defaults
  to zero. A supported convex hole-free polygon produces fresh `parts` and
  `status: "ok"` only when both parts have positive conserved area and satisfy
  the guard. No crossing or guard rejection yields `status: "unchanged"` with
  a detached original in `parts` and diagnostics. Valid concavity/holes yield
  `unsupported` with the same retained area. Numerical failure uses `failed` and
  preserves input parts. No search failure proves mathematical impossibility.
- Malformed options, invalid geometry, unknown/duplicate keys, non-finite
  coordinates and zero direction throw TypeError/RangeError. Valid but unsupported
  geometry is distinguished from supported but infeasible/no-change operations.
- `Grid.create({ layout, state })` returns a distinct accurate LayoutGrid type with
  canonical typed Field identities, lookup, shared-edge neighbors and occupancy.
  It has no `space`, `cellSize`, regular neighborhood options or `diffuse`.
  Field coordinates are embedded representative positions; topology is geometry,
  while Grid/Field owns mutable state. World is optional; attached occupancy and
  explicit detached sources preserve existing Agent lifecycle semantics.
  Representative Field positions use area centroids, which may be outside concave
  authored cells; lookup follows the actual polygon, not these representatives.
- Existing `Grid.create(space, options?)`, `Grid.create()`, Field identity/direct state,
  Space, faces/Moore and diffusion remain compatible. Split/merge transfers no
  Field state or Agent membership implicitly. City policy stays in user scripts.


The five public scripts in `tests/public-contracts/grid-parcels/` and their `SHA256SUMS` manifest preserve the accepted author tasks. Keep their public syntax and assertions unchanged.
