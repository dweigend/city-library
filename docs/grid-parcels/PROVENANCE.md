# Grid and parcels: source comparison and adaptation

Date: 2026-11-07. This is a source and design ledger, not evidence that target
runtime checks or independent acceptance have passed. The frozen phase examples
and [bounded layout contract](STATUS.md#bounded-layout-contract) define the delivered contract.

## Exact local candidates

Source repository: `city_game`, committed revision
`3e1d34f1b40ea05b81c4a52206e9c7bf58a12a98`. Inspection used `git show` and
`git ls-tree` against this revision; the source working tree was not changed.
Target baseline: City Library `dc7b164abd23c8e7b7f11c902195ab030c5f1c4b`.
Other target checkouts' concurrent documentation is not extraction input.

The following paths are relative to the source repository. Git blob IDs identify
the inspected contents independently of subsequent source working-tree edits.

| Candidate | Blob | Findings and adaptation |
| --- | --- | --- |
| `prototype/src/lib/studies/grid-lab/core/generator.ts` | `2a4391d5310a23ddf4076965a5959acb33ea1f8a` | Square lattice and pointy hex formulas are useful mechanisms. The source clamps size to 4..10, builds an axial hexagonal footprint, then centers/scales every family into a 20-unit display span. Replace these presentation choices with explicit rows/columns, physical size and documented finite bounds. Other families remain backlog. |
| `prototype/src/lib/studies/grid-lab/core/geometry.ts` | `f0fb2efc9be8d782610252146def02dc06037a9c` | Shoelace area, centroid and shared-edge indexing. `gridFromPolygons` reverses caller polygons in place, uses seven-decimal endpoint strings and does not validate overlap or third ownership of an edge. Preserve mathematical mechanisms, replace mutation and unchecked topology with validated detached data and deterministic queries. Do not copy its random stream; this phase needs none. |
| `prototype/src/lib/studies/grid-lab/core/urban-geometry.ts` | `e55eecb95234efa95960f84fa612299e41470f51` | `mergeParcels` cancels reverse directed conforming edges and traces one simple contour; disconnected loops, holes and pinches fail. This is a useful bounded merge, not a general Boolean union. Explicitly report unsupported cases, conserve area and preserve selected source keys. Its inset halves distance up to twelve times or returns the original: it cannot implement a hard offset promise and is not transferred. |
| `prototype/src/lib/studies/volume-houses/core/volume-grid.ts` | `6cfa738ab29f40cd18be8dff6579d4706651193e` | Context only: five volume families, complete-face adjacency and convex polyhedron support-plane intersections. Coordinates are horizontal XY and vertical Z; its seven-decimal face keys are not a planar or universal tolerance contract. No volume API is transferred. |
| `prototype/scripts/research/jamessimo/parcels/geometry.ts` | `b194e7820fdb02a32edd263a62bb010c98004705` | Research fixture: strictly convex CCW rings, 3..32 vertices, coordinates within +/-1000, explicit roads, bounded OBB midpoint cut and perpendicular retry. Complementary exact-sign half-plane clipping and area checks support a focused explicit-line split. Do not transfer road policy, research defaults, OBB search, recursion claims or the incompatible `Point`/`Block` public format. |
| `docs/research/jamessimo/parcels.md` | `d450ae9fca570ddeeb123e962443e5487c5f7f03` | Research assumptions, rejection counterexamples, source-paper ledger and historical verification limits. Its successful fixture checks are source evidence only. It explicitly defers application transfer, holes, concavity, skeleton, continuous block extraction and robust arbitrary-scale geometry. |

Existing City Library candidates are `src/geometry/planar/types.ts`,
`validation.ts`, `predicates.ts`, `contains.ts` and `src/grid/grid.ts` at the target
baseline. Keep their public `PlanarPolygon` and `PlanarGeometry` MultiPolygon
variant, closed rings and existing containment/data overloads. The existing
predicates decode original binary64 coordinates into BigInts: orientation and
contact are exact for those inputs, rather than ordinary floating determinants.
Reuse that validation and those predicates for authored topology. Existing regular Grid owns
Field state, occupancy and directional diffusion; topology must not create a
second stateful Cell identity or duplicate agent state.

## External alternatives checked

Primary maintainer READMEs and package manifests were inspected on 2026-11-07.
Versions below identify the inspected manifests, not installed dependencies or
a claim of latest registry releases. No external package was installed or copied.

| Candidate | Fit and decision |
| --- | --- |
| [polygon-clipping](https://github.com/mfogel/polygon-clipping), manifest 0.15.7, MIT | General Boolean union/intersection/difference/XOR for polygons and multipolygons; wider accepted input than this phase. Its normalization policy would need an explicit adapter and independent validation contract. Defer dependency selection until arbitrary Boolean operations are requested. [Manifest](https://raw.githubusercontent.com/mfogel/polygon-clipping/main/package.json). |
| [martinez-polygon-clipping](https://github.com/w8r/martinez), manifest 0.9.0, MIT | General Boolean operations and holes; useful future candidate, but broader algorithm and dependency closure than conforming-edge cancellation. Does not provide Field ownership or provenance contracts. [Manifest](https://raw.githubusercontent.com/w8r/martinez/master/package.json). |
| [robust-predicates](https://github.com/mourner/robust-predicates), manifest 3.0.3, Unlicense | Robust orientation/incircle primitives, not complete polygon topology or clipping. A future use needs a sign-convention adapter and tests. Bounded IEEE-754 arithmetic must not be described as adaptive exact predicates. [Manifest](https://raw.githubusercontent.com/mourner/robust-predicates/main/package.json). |

Decision: a focused implementation of the bounded supported slice, informed by
the exact local mechanisms, with existing target polygon contracts. General
Boolean libraries remain candidates for later independently scoped work. No
runtime import may reference the source checkout, UI modules, research runners
or downloaded implementations.

## Numerical and input adaptation requirements

The source has several unrelated tolerances: Grid Lab seven-decimal keys,
urban geometry `EPSILON = 1e-8`, and the research fixture distance `1e-8` versus
area `1e-7`. These are evidence, not automatically compatible target settings.
The phase plan must declare its actual coordinate/vertex/cell bounds, distance
comparison and area-residual policy; length and area tolerances have different
units. Coordinates represent local abstract units unless the caller establishes
a physical scale.

Recommended invariants for implementation and review:

- Validate finite coordinates, ring structure and topology before unsupported
  algorithm checks; malformed data differs from a valid unsupported shape.
- Polygon import starts with conforming full edges. Reject overlapping
  interiors, partial-edge contacts and nonmanifold ownership rather than
  silently constructing incomplete adjacency.
- Detach and freeze layouts and returned geometry. Winding normalization must
  never reverse an input array. Specify stable cell/neighbor order and boundary
  tie ownership independently of hash-map accidents.
- Merge either returns the complete supported union with source provenance or
  preserves all inputs in its rejection result. Multiple components and holes
  must be preserved or explicitly unsupported; never keep only one traced loop.
- Split requires a supported convex ring and a finite nonzero direction. Use
  complementary half-planes; expanding both by epsilon overlaps child area.
  A tangent/outside cut or a failed minimum-area guard is an infeasible requested
  cut, not malformed input and not proof that every cut is infeasible.
- Verify positive child area, output validity and total area residual before
  publishing fresh parts. Keep the original visible on rejection. No hidden
  random stream, timer or iterative relaxation belongs in this slice.
- Keep regular Grid's tiny-wrap directional multiplicity and public semantics.
  Layout Grid exposes only its actual capabilities; uniform `cellSize`, regular
  Space and regular diffusion cannot be inferred from arbitrary polygons.

These recommendations guide the frozen phase contract; they do not silently
change frozen examples or establish target-runtime verification.

## Attribution and notices

The committed source tree was searched for paths containing `LICENSE`,
`COPYING`, `NOTICE` or `third-party`; no matching files were found. Its root and
prototype package manifests have no license field. The inspected local modules
contain no third-party license header. Record this absence honestly: it is not
evidence of a permissive redistribution license. This phase records the
user-authorized local adaptation and exact lineage; it does not declare the
source or target published or relicense either repository.

The research report attributes Vanegas et al. (2012) for OBB-style parcel
subdivision, Aichholzer et al. (1995) for straight-skeleton definitions, and
Parish/Müller (2001) for an earlier subdivision baseline. This pass inspected
the committed report and fixture, not those papers again. Its `jamessimo` path
is a workstream name, not author attribution; no video-derived algorithm claim
follows. No paper, PDF or third-party implementation is redistributed here.

External package license labels above are comparison evidence only; their code
and notices are not incorporated. If later adopted, pin the exact dependency
revision, retain required notices and verify packaging separately.
