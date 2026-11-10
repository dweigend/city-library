# Grid and parcel API — implementation starting point

Date: 2026-11-07. Saved from the user-approved chat inventory.
Status: target catalogue, not a runtime availability claim. Work proceeds in
bounded example-first phases; open research methods are not promised as delivered.
This supersedes the interim inventory for authoring style, not historical evidence.

## Language and architecture

New calls use flat, YAML-like TypeScript configuration objects. Use complete,
self-explanatory names such as minimumArea and maximumParcels. Keep defaults
simple, native TypeScript extensibility, and existing Agent Loom calls compatible.
Topology is immutable geometry; Grid/Field adds canonical state. Concrete city
policy belongs in scripts. No renderer, World or UI is required for geometry.
Reuse PlanarPolygon and the MultiPolygon variant of PlanarGeometry, not a second
public polygon format or a second stateful Cell lifecycle.

Status: Existing = target code; Source = limited source mechanism requiring
adaptation; New = new contract; Research = additional algorithm/robustness work.

## Topology generation

| Operation | Call | Contract | Status |
| --- | --- | --- | --- |
| Square | `topology.square({ columnCount, rowCount, cellSize? })` | Equal squares | Source |
| Hexagon | `topology.hex({ columnCount, rowCount, cellRadius?, orientation? })` | Radius is center-to-corner; orientation explicit | Source |
| Triangle | `topology.triangle({ columnCount, rowCount, edgeLength? })` | Regular triangles | Source |
| Trihex | `topology.trihex({ columnCount, rowCount, edgeLength? })` | Mixed triangles and hexagons | Source |
| Rectangles | `topology.rectangles({ columnCount, rowCount, cellSize?, variation?, random? })` | Unequal rectangles with explicit random input | Source |
| Voronoi | `topology.voronoi({ points, boundary })` | Explicit sites and boundary | Source |
| Organic quads | `topology.quadrilaterals({ boundary, pointSpacing, relaxationIterationCount?, random? })` | Named irregular quad procedure | Source / New |
| Polygon import | `topology.fromPolygons({ polygons })` | Initially conforming full edges | Source |
| Relaxation | `topology.relax({ layout, method, iterationCount })` | New layout; named method | Source / New |
| Validation | `topology.validate({ layout })` | Check shapes, overlaps and relationships | New |

Proposed regular defaults: size 1, hard boundary, no display normalization.
Hex orientation and finite-boundary conventions must be frozen with examples.

## Layout queries

| Operation | Call | Contract |
| --- | --- | --- |
| Cells | `layout.cells` | Ordered local keys, not persistent parcel identities |
| Polygon | `layout.polygon({ cell })` | Immutable PlanarPolygon |
| Neighbors | `layout.neighbors({ cell })` | Positive shared edge length; no corner-only contacts |
| Locate | `layout.cellAt({ position })` | One key or undefined, deterministic boundary ties |
| Shared boundary | `layout.sharedBoundary({ firstCell, secondCell })` | Actual shared segments |

## Geometry measurements

| Operation | Call | Contract / status |
| --- | --- | --- |
| Validate | `geometry.validate({ shape })` | Invalid versus unsupported; Source / New |
| Area | `geometry.area({ shape })` | Net area including holes; Source |
| Perimeter | `geometry.perimeter({ shape, includeHoleBoundaries? })` | Explicit ring counting; Source / New |
| Bounds | `geometry.bounds({ shape })` | New polygon overload; existing dataset signature retained |
| Oriented bounds | `geometry.orientedBounds({ shape })` | Minimum-area rectangle, initially convex; Source |
| Centroid | `geometry.centroid({ shape })` | May lie outside a concave polygon; Source |
| Interior point | `geometry.interiorPoint({ shape })` | Interior guarantee for supported input; New |
| Minimum width | `geometry.minimumWidth({ shape })` | Support width, not buildability; Source |
| Compactness | `geometry.compactness({ shape })` | Defined shape measure, not quality; Source |
| Contains | `geometry.contains({ shape, position, boundary? })` | New object overload; existing signature retained |
| Contact | `geometry.contact({ firstShape, secondShape })` | Separate disjoint/point/edge/area contact; Source / New |
| Shared boundary | `geometry.sharedBoundary({ firstShape, secondShape })` | Actual intervals; Source / New |
| Boundary overlap | `geometry.boundaryOverlap({ shape, boundarySegments })` | Contact intervals, not legal/network access; Source / New |

## Geometry changes

| Operation | Call | Contract / status |
| --- | --- | --- |
| Merge shapes | `geometry.merge({ shapes })` | Preserve holes/components or reject unsupported; limited Source |
| Merge cells | `geometry.merge({ layout, cells })` | Retain input cell provenance; New on Source |
| Intersection | `geometry.intersection({ firstShape, secondShape })` | Empty is valid; New / Research |
| Subtract | `geometry.subtract({ shape, excludedShapes })` | Preserve components/holes; New / Research |
| Clip | `geometry.clip({ shape, boundary })` | Bounded intersection; convex Source |
| Split | `geometry.split({ shape, point, direction })` | Infinite line, fresh parts, conserved area; convex Source |
| Offset | `geometry.offset({ shape, distance, cornerStyle? })` | Proposed positive outward/negative inward, no silent relaxation; Research |
| Corridor | `geometry.corridor({ paths, width, endCap?, cornerStyle? })` | Pure geometric width/caps/joins; limited Source |

## High-level reusable procedures

| Operation | Call | Status |
| --- | --- | --- |
| Group cells | `topology.group({ layout, availableCells?, minimumCells?, maximumCells?, maximumGroups?, random? })` | Source / New |
| Subdivide | `geometry.subdivide({ shape, method, ... })` | Single-step Source; repeated procedure New |

Subdivision settings: targetArea, minimumArea, minimumWidth, maximumParcels,
maximumDepth, maximumAttempts, direction, stripWidth, random. Settings are
method-specific. Require a stopping goal; define a safe explicit work budget.
Methods: orientedBoundingBox (bounded single-cut research exists; recursion new),
parallelStrips (new), straightSkeleton (research). Voronoi is only under topology.
City usage/density/regulatory rules are outside these mathematical mechanisms.

## Agent Loom connection

| Operation | Call | Status / contract |
| --- | --- | --- |
| Regular grid | `Grid.create(space, options?)` / `Grid.create()` | Existing; preserve defaults |
| Layout grid | `Grid.create({ layout, state })` | New; honest layout-specific capabilities/type required |
| Fields | `grid.fields` | Existing canonical identities |
| Locate field | `grid.fieldAt(position)` | Existing; adapt for layouts |
| Neighbors | `grid.neighbors(field, options?)` | Preserve regular Moore/faces ordering and defaults |
| World occupancy | `grid.agentsAt(field)` | Existing; requires attached grid |
| Explicit occupancy | `grid.agentsAt(field, { source })` | Existing; detached allowed |
| Identity | `field.id`, `field.grid` | Existing |
| Position | `field.x`, `field.y`, `field.z` | Embedded position, not universal address |
| State | `field.temperature = value` | Existing typed direct properties |
| Regular diffusion | `grid.diffuse(property, options?)` | Existing; preserve directional multiplicity on tiny wraps |

Irregular diffusion requires separate quantity/concentration, weights and boundary
contracts. A layout grid must not pretend to have a uniform cellSize or rectangular
Space. Split/merge never implicitly transfers Field state or Agent membership.

## Results and scope

Proposed results distinguish ok, partial, unchanged, unsupported and failed.
Malformed arguments are separate. Return operation-specific parts, remaining
shapes, source keys and diagnostics; measurements remain plain values. Never lose
area silently. A bounded search failure is not proof of geometric impossibility.

Use corridor plus subtract for land blocks, existing Graph algorithms for routes,
ordinary TypeScript for model policy and synchronous field loops. No new host,
renderer or general process framework. 3D has a later independent volume contract.

First implementation phase: square, hex, polygon import, layout queries, area,
bounded merge, convex split and Field connection. Freeze five asserted public
examples first, preserve example-first commits, run meaningful type/behavior/build/
packed-consumer checks and independent review. Record deferred catalogue entries
honestly, without stubs or availability claims.

## Source evidence

See [source comparison and adaptation](PROVENANCE.md) for provenance. Primary sources:
Grid Lab core, Volume Houses grids, parcel research geometry and report. Target
implementation inspected at dc7b164; source at 3e1d34f1. Current target checkouts
contain concurrent documentation work; preserve it and use an isolated branch.
