# Grid and parcels — first implementation phase

Date: 2026-11-07. Scope: headless local implementation on
`feat/grid-parcel-foundations`, based on committed experiment revision
`dc7b164abd23c8e7b7f11c902195ab030c5f1c4b`. No push, PR, publication or main merge
is authorized. Concurrent checkouts are outside this phase's ownership.

The complete [API catalogue](API.md) is preserved verbatim from the approved
handover. [INTERIM](INTERIM.md) preserves the earlier discussion as historical
evidence. The catalogue is a target inventory, not a delivery claim.

## Sequence and example-first gate

1. Save the full catalogue and this phase plan.
2. Freeze and locally commit all five complete public scripts before runtime edits.
   `examples/grid-parcels/SHA256SUMS` fixes their contents. Missing-export failures
   are expected at this point; mocks, private imports and disabled assertions are
   prohibited.
3. Implement topology/queries, geometry operations and the additive Grid connection
   through bounded scoped agents; integrate without changing frozen expectations.
4. Run focused tests, all five examples, prior regular regressions, typecheck,
   build, packed consumer and the project check where feasible.
5. Obtain independent Antigravity `gemini-3.8-flash` review, fix findings and obtain
   a fresh review where necessary. Passing author checks is separate evidence.

| Frozen script | Public author task and assertions |
| --- | --- |
| `01-regular-regression-and-tiny-wraps.ts` | Original defaults, centered Space, Moore/faces order, hard endpoints, directional tiny-wrap diffusion multiplicity and invalid cell size. |
| `02-square-and-hex-field-rule.ts` | Same typed synchronous neighbor rule on square/hex, center/corner degree, direct Field state, accurate absence of regular-only capabilities, hex size/orientation and invalid dimensions. |
| `03-irregular-lookup-ties-and-occupancy.ts` | Authored conforming trapezoids, point-only triangle contact, actual shared segment, lowest-key boundary ties, detached immutable topology, canonical Fields, explicit and attached Agent occupancy. |
| `04-merge-and-source-provenance.ts` | Conforming merge through both overloads, caller-order source keys, conserved area, unchanged sources, retained rejected components, duplicate-key error and Polygon/MultiPolygon net area. |
| `05-convex-split-and-rejections.ts` | Successful infinite-line split, area conservation, minimum-area rejection, outside line, unsupported concavity/holes, malformed zero direction, fresh retained geometry and unchanged input. |

The scripts import only `city-library`. Their syntax and expectations are fixed;
runtime fixes must satisfy them. Independent focused tests supplement this finite
public acceptance set.

## Frozen routine decisions

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
- `Grid.add({ layout, state })` returns a distinct accurate LayoutGrid type with
  canonical typed Field identities, lookup, shared-edge neighbors and occupancy.
  It has no `space`, `cellSize`, regular neighborhood options or `diffuse`.
  Field coordinates are embedded representative positions; topology is geometry,
  while Grid/Field owns mutable state. World is optional; attached occupancy and
  explicit detached sources preserve existing Agent lifecycle semantics.
  Representative Field positions use area centroids, which may be outside concave
  authored cells; lookup follows the actual polygon, not these representatives.
- Existing `Grid.add(space, options?)`, `Grid.add()`, Field identity/direct state,
  Space, faces/Moore and diffusion remain compatible. Split/merge transfers no
  Field state or Agent membership implicitly. City policy stays in user scripts.

## Reuse, provenance and review evidence

Read-only source revision: city_game `3e1d34f1`. Compare exact Grid Lab generator,
geometry and urban-geometry candidates, Volume Houses grids as context, and parcel
research geometry/report against a focused bounded implementation and external
options. Record source revisions, adaptation and notices separately from target
verification. No source-checkout runtime import is permitted.

The coordinator records executed commands, baseline failures, implementation
commits, independent findings and responses in this directory. Antigravity
`gemini-3.8-flash` availability was confirmed through orchestrator capabilities;
no other reviewer is an implicit substitute.

## Explicit remaining catalogue

Triangle, trihex, irregular rectangles, Voronoi, organic quadrilaterals,
relaxation/validation APIs, advanced measurements/contact/containment overloads,
intersection/subtraction/clipping, offset/corridor, grouping, recursive subdivision,
OBB procedures, parallel strips, skeleton and all 3D work remain backlog.
The phase adds no empty runtime stubs for those entries. Their original signatures
and target status remain visible in [API](API.md).
