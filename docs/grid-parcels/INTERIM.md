# Grid and parcel system — interim discussion snapshot

Date: 2026-11-07. Status: research proposal, not an accepted API or implementation plan.
Saved at the user's request before two independent GPT Astra high consultations.
Their feedback must be presented in chat before joint decisions or incorporation.

## Intent

Build a universal, headless TypeScript library for spatial subdivisions and
parcel mechanisms. Keep defaults simple and allow ordinary TypeScript functions
and variables for customization. Agent Loom is the authoring-language anchor.
Concrete city policies belong in model scripts. HTML, Three.js and other views
consume public model actions and observations; they do not own domain state.
A future host/core coordinates instances, without becoming a prerequisite for
using detached geometry, grids or parcel operations.

This is the saved first draft. Names and boundaries below are deliberately open
to simplification. No package name, new overload or compatibility change is accepted.

## Inspected baseline and sources

- city_game main: `3e1d34f1`.
- City Library implementation: `experiment/netlogo-web-catalog`, `dc7b164`,
  `/home/david/.t3/worktrees/city-library/experiment-netlogo-web-catalog`.
  Do not substitute its older main checkout for this implementation.
- Format reference: city-library `docs/agent-loom/api-table.md`.
- Grid Lab: `prototype/src/lib/experiments/grid-lab/core/`.
- Volumetric grids: `prototype/src/lib/experiments/volume-houses/core/volume-grid.ts`.
- Parcel research: `docs/research/jamessimo/parcels.md` and
  `prototype/scripts/research/jamessimo/parcels/geometry.ts`.
- Existing transfer contracts: `docs/library-handover/workstreams/spatial/`.
- Target: `src/grid/grid.ts`, `src/agent/spatial.ts`, `docs/ARCHITECTURE.md`.
- NetLogo spatial logic, City Flow urban logic and TestFit plans were also
  inspected. TestFit planning is not a delivered parcel solver.

## Proposed inventory

All signatures below are sketches, not available exports or frozen contracts.

| Area | Operation sketch | Intended contract |
| --- | --- | --- |
| Topology | `topology.square({ bounds, cellSize? })` | Finite, measured square cells. |
| Topology | `topology.hex({ bounds, cellSize? })` | Hex cells with explicit size, orientation and boundary policy. |
| Topology | `topology.triangle(options)` / `topology.trihex(options)` | Alternative cell shapes, same basic queries. |
| Topology | `topology.voronoi(sites, { boundary })` | Explicit sites, deterministic degeneracy rules. |
| Topology | `topology.fromPolygons(polygons)` | Validate cells and derive shared boundaries. |
| Topology | `topology.cells` / `topology.neighbors(cell)` | Revision-local identities and defined adjacency/order. |
| Topology | `topology.boundaryBetween(a, b)` | Actual shared boundary geometry. |
| Topology | `topology.components(cells?)` | Connected groups, no domain policy. |
| Topology | `topology.path(from, to, { cost? })` | Cell transitions and explicit costs; reuse graph algorithms. |
| Cell | `cell.id` / `cell.polygon` | Identity is neither coordinate nor persistent cadastral key. |
| Geometry | `geometry.centroid(polygon)` | Area centroid, potentially outside concave polygons. |
| Geometry | `geometry.interiorPoint(polygon)` | Separate guaranteed interior-point operation. |
| Geometry | `geometry.area(polygon)` | Net area in squared declared units. |
| Geometry | `geometry.contains(polygon, point, options?)` | Explicit boundary-point treatment. |
| Geometry | `geometry.contact(a, b)` | Distinguish point, edge and area contact. |
| Geometry | `geometry.validate(polygon)` | Invalid differs from valid but unsupported. |
| Aggregation | `parcels.merge(topology, cells)` | Remove shared internal edges; retain source lineage. |
| Aggregation | `parcels.group(topology, options?)` | Connected grouping with explicit eligibility and scoring. |
| Geometry | `geometry.compactness(polygon)` | Defined measure, not building suitability. |
| Partition | `parcels.split(polygon, line)` | Fresh children, conserved area, unchanged input. |
| Partition | `parcels.subdivide(polygon, options?)` | Named strategy, stop criterion and work budget. |
| Boundary | `parcels.frontage(parcel, boundaries)` | Contact intervals; point contact contributes no length. |
| Provenance | `result.lineage` | Relate output cells/parts to sources and cuts. |
| Offset | `geometry.inset(polygon, distance, options?)` | Best effort, report achieved distance and relaxation. |
| Offset | `geometry.offset(polygon, distance)` | Hard geometric contract or explicit failure. |
| Corridor | `corridors.create(lines, options?)` | Width, caps and joins without traffic semantics. |
| Blocks | `parcels.blocks(domain, corridors)` | Subtract corridor areas; preserve components, holes and boundary labels. |
| Agent Loom | `Grid.add(space, options?)` | Preserve delivered square/cubic API. |
| Agent Loom | `Grid.add(topology, { state? })` | Proposed additional authoring form, requires decision. |
| Agent Loom | `grid.fieldAt(position)` / `grid.agentsAt(field, options?)` | Explicit point lookup; occupancy derived from canonical positions. |
| Agent Loom | `field.temperature = value` | Direct typed state properties. |
| Field process | `fields.update(grid, rule)` | Proposed synchronous old-state/read then publish contract. |

Proposed polygon shape: `{ outer: readonly Position[]; holes?: readonly
(readonly Position[])[] }`. Hole support must be declared per algorithm.

## Findings and boundaries

Grid Lab implements seven planar families: square, hex, triangle, trihex,
irregular rectangles, Voronoi and Townscaper-inspired quads. It normalizes output
to 20 display units; size, rounding and IDs cannot become target contracts silently.
Volume Houses has five volumetric families and uses Z-up; other experiments use
Y-up. Planar and volumetric operations need distinct supported capabilities.

Target Grid currently supports equal square/cubic cells, field values, occupancy
and synchronous diffusion. Its faces/Moore semantics must remain compatible.
Topological neighbors generalize; 90-degree turns, continuous distance movement
and physical diffusion require additional geometry or process assumptions.
Mass and concentration are different contracts on unequal-sized cells.

Cell aggregation is implemented in Grid Lab. Its merge supports conforming edges
and a single simple ring, not arbitrary polygon Boolean operations. Its inset may
halve the requested distance or return the original shape; no minimum setback
guarantee follows.

Continuous subdivision exists as a bounded research fixture: one OBB-inspired
split of strictly convex polygons, with a perpendicular retry and area, support
width and labelled-frontage guards. No recursion, concavity, holes, persistent
parcel IDs or straight skeleton implementation is delivered.

Continuous road-width-aware land-block extraction remains a major gap. Crossing
planarization, corridor unions, holes and road-facing boundary labels are needed.
Geometric frontage is not legal access or reachability through a transport graph.
Rejected or unsplittable area must remain visible; failure of a bounded search
does not prove that no subdivision exists.

Grid cell, parcel and Field state are separate meanings. Start with immutable
topology revisions; split/merge state transfer is a separate future contract.
Minimum lot sizes, usage, density, growth and building heights are script policies.

## Proposed first evidence, not yet approved

Use square, hex and a hand-authored irregular polygon network with five public
examples: shared neighbor rule; agent-to-cell lookup; cell merge; area-preserving
convex split; rejected split preserving the original and explaining failure.
Then investigate grouping, recursive subdivision, block extraction and organic
generators. No implementation or fresh test/browser verification is claimed.

## Questions for independent consultation

Simplify both the conceptual structure and author-facing language. Challenge the
number of namespaces, duplicate concepts and premature operations. Research
primary sources and alternatives; distinguish source evidence from recommendations.
Test compatibility with Agent Loom's terminology, direct properties, defaults and
native TypeScript composition. Propose a smaller coherent inventory with examples,
explicit tradeoffs, open decisions and a bounded first slice. Do not implement,
rewrite this snapshot, adopt a design or communicate with the other consultant.
