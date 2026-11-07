# Grid and parcel catalogue status

The complete approved target inventory remains unchanged in [API](API.md).
This ledger separates the bounded first-phase implementation from the broader
catalogue. Runtime and review evidence is recorded in [VERIFICATION](VERIFICATION.md).
Nothing in this phase is published or merged into main.

| Catalogue area | First-phase implementation | Explicit backlog |
| --- | --- | --- |
| Topology generation | `square`, `hex`, `fromPolygons` with finite, immutable, conforming hole-free cells | `triangle`, `trihex`, `rectangles`, `voronoi`, `quadrilaterals`, `relax`, `validate` |
| Layout queries | `cells`, `polygon`, `neighbors`, `cellAt`, `sharedBoundary`; local numeric keys, edge adjacency and lowest-key ties | Wrapping layouts, persistent parcel IDs, topology mutation |
| Geometry measurements | `area({shape})` for Polygon and the MultiPolygon variant; existing dataset `bounds` and existing `contains` retain their contracts | `validate`, `perimeter`, shape `bounds` overload, `orientedBounds`, `centroid`, `interiorPoint`, `minimumWidth`, `compactness`, object `contains` overload, `contact`, geometry `sharedBoundary`, `boundaryOverlap` |
| Geometry changes | `merge({shapes})`, `merge({layout,cells})` for conforming connected simple unions; `split` for guarded convex infinite-line cuts | General Boolean merge, `intersection`, `subtract`, `clip`, `offset`, `corridor` |
| High-level procedures | None | `topology.group`, `geometry.subdivide`; OBB recursion, parallel strips, straight skeleton and work-budget/search contracts |
| Agent Loom connection | Existing regular Grid unchanged; additive layout Grid with canonical typed Fields, lookup, shared-edge neighbors and explicit/attached occupancy | Irregular diffusion, implicit state or Agent transfer across split/merge |
| Volumes | None | All 3D layout and parcel operations; separate volume contracts |

The [phase plan](PHASE-PLAN.md) specifies input bounds, numerical rules, outcomes,
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
