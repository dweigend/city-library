# Grid and parcel catalogue coverage

This trace covers all **49 operation rows** in the original GRID-PARCELS-API.md catalogue. It records documentation coverage, not runtime acceptance. Extra inventory entries separate overloads, method variants and shared result types.

Baseline: City Library grid branch `2a7f3eb`. **Delivered** means the bounded target implementation exists there; its restrictions still apply. **Proposed** means a new target contract. **Research** adds an unresolved algorithm/backend decision; it does not promise a runtime implementation.

| # | Catalogue area | Original row | Inventory | Detailed reference | Availability / readiness |
| --- | --- | --- | --- | --- | --- |
| 1 | Topology generation | Square | [Entry](api-table.md#topology-square) | [Details](api-reference.md#topology-square) | Delivered (bounded) |
| 2 | Topology generation | Hexagon | [Entry](api-table.md#topology-hex) | [Details](api-reference.md#topology-hex) | Delivered (bounded) |
| 3 | Topology generation | Triangle | [Entry](api-table.md#topology-triangle) | [Details](api-reference.md#topology-triangle) | Proposed |
| 4 | Topology generation | Trihex | [Entry](api-table.md#topology-trihex) | [Details](api-reference.md#topology-trihex) | Research / proposed |
| 5 | Topology generation | Rectangles | [Entry](api-table.md#topology-rectangles) | [Details](api-reference.md#topology-rectangles) | Proposed |
| 6 | Topology generation | Voronoi | [Entry](api-table.md#topology-voronoi) | [Details](api-reference.md#topology-voronoi) | Research / proposed |
| 7 | Topology generation | Organic quads | [Entry](api-table.md#topology-quadrilaterals) | [Details](api-reference.md#topology-quadrilaterals) | Proposed finite overload; arbitrary boundary remains research |
| 8 | Topology generation | Polygon import | [Entry](api-table.md#topology-from-polygons) | [Details](api-reference.md#topology-from-polygons) | Delivered (bounded) |
| 9 | Topology generation | Relaxation | [Entry](api-table.md#topology-relax) | [Details](api-reference.md#topology-relax) | Proposed squareTarget; Lloyd remains research |
| 10 | Topology generation | Validation | [Entry](api-table.md#topology-validate) | [Details](api-reference.md#topology-validate) | Proposed |
| 11 | Layout queries | Cells | [Entry](api-table.md#layout-cells) | [Details](api-reference.md#layout-cells) | Delivered (bounded) |
| 12 | Layout queries | Polygon | [Entry](api-table.md#layout-polygon) | [Details](api-reference.md#layout-polygon) | Delivered (bounded) |
| 13 | Layout queries | Neighbors | [Entry](api-table.md#layout-neighbors) | [Details](api-reference.md#layout-neighbors) | Delivered (bounded) |
| 14 | Layout queries | Locate | [Entry](api-table.md#layout-cell-at) | [Details](api-reference.md#layout-cell-at) | Delivered (bounded) |
| 15 | Layout queries | Shared boundary | [Entry](api-table.md#layout-shared-boundary) | [Details](api-reference.md#layout-shared-boundary) | Delivered (bounded) |
| 16 | Geometry measurements | Validate | [Entry](api-table.md#geometry-validate) | [Details](api-reference.md#geometry-validate) | Proposed |
| 17 | Geometry measurements | Area | [Entry](api-table.md#geometry-area) | [Details](api-reference.md#geometry-area) | Delivered (bounded) |
| 18 | Geometry measurements | Perimeter | [Entry](api-table.md#geometry-perimeter) | [Details](api-reference.md#geometry-perimeter) | Proposed |
| 19 | Geometry measurements | Bounds | [Entry](api-table.md#geometry-bounds-shape) | [Details](api-reference.md#geometry-bounds-shape) | Proposed |
| 20 | Geometry measurements | Oriented bounds | [Entry](api-table.md#geometry-oriented-bounds) | [Details](api-reference.md#geometry-oriented-bounds) | Research / proposed |
| 21 | Geometry measurements | Centroid | [Entry](api-table.md#geometry-centroid) | [Details](api-reference.md#geometry-centroid) | Proposed |
| 22 | Geometry measurements | Interior point | [Entry](api-table.md#geometry-interior-point) | [Details](api-reference.md#geometry-interior-point) | Proposed |
| 23 | Geometry measurements | Minimum width | [Entry](api-table.md#geometry-minimum-width) | [Details](api-reference.md#geometry-minimum-width) | Proposed |
| 24 | Geometry measurements | Compactness | [Entry](api-table.md#geometry-compactness) | [Details](api-reference.md#geometry-compactness) | Proposed |
| 25 | Geometry measurements | Contains | [Entry](api-table.md#geometry-contains-shape) | [Details](api-reference.md#geometry-contains-shape) | Proposed |
| 26 | Geometry measurements | Contact | [Entry](api-table.md#geometry-contact) | [Details](api-reference.md#geometry-contact) | Proposed |
| 27 | Geometry measurements | Shared boundary | [Entry](api-table.md#geometry-shared-boundary) | [Details](api-reference.md#geometry-shared-boundary) | Proposed |
| 28 | Geometry measurements | Boundary overlap | [Entry](api-table.md#geometry-boundary-overlap) | [Details](api-reference.md#geometry-boundary-overlap) | Proposed |
| 29 | Geometry changes | Merge shapes | [Entry](api-table.md#geometry-merge-shapes) | [Details](api-reference.md#geometry-merge-shapes) | Delivered (bounded) |
| 30 | Geometry changes | Merge cells | [Entry](api-table.md#geometry-merge-cells) | [Details](api-reference.md#geometry-merge-cells) | Delivered (bounded) |
| 31 | Geometry changes | Intersection | [Entry](api-table.md#geometry-intersection) | [Details](api-reference.md#geometry-intersection) | Research / proposed |
| 32 | Geometry changes | Subtract | [Entry](api-table.md#geometry-subtract) | [Details](api-reference.md#geometry-subtract) | Research / proposed |
| 33 | Geometry changes | Clip | [Entry](api-table.md#geometry-clip) | [Details](api-reference.md#geometry-clip) | Proposed |
| 34 | Geometry changes | Split | [Entry](api-table.md#geometry-split) | [Details](api-reference.md#geometry-split) | Delivered (bounded) |
| 35 | Geometry changes | Offset | [Entry](api-table.md#geometry-offset) | [Details](api-reference.md#geometry-offset) | Research / proposed |
| 36 | Geometry changes | Corridor | [Entry](api-table.md#geometry-corridor) | [Details](api-reference.md#geometry-corridor) | Research / proposed |
| 37 | High-level reusable procedures | Group cells | [Entry](api-table.md#topology-group) | [Details](api-reference.md#topology-group) | Proposed |
| 38 | High-level reusable procedures | Subdivide | [Entry](api-table.md#geometry-subdivide) | [Details](api-reference.md#geometry-subdivide) | Research / proposed |
| 39 | Agent Loom connection | Regular grid | [Entry](api-table.md#grid-add-space) | [Details](api-reference.md#grid-add-space) | Delivered (bounded) |
| 40 | Agent Loom connection | Layout grid | [Entry](api-table.md#grid-add-layout) | [Details](api-reference.md#grid-add-layout) | Delivered (bounded) |
| 41 | Agent Loom connection | Fields | [Entry](api-table.md#grid-fields) | [Details](api-reference.md#grid-fields) | Delivered (bounded) |
| 42 | Agent Loom connection | Locate field | [Entry](api-table.md#grid-field-at) | [Details](api-reference.md#grid-field-at) | Delivered (bounded) |
| 43 | Agent Loom connection | Neighbors | [Entry](api-table.md#grid-neighbors) | [Details](api-reference.md#grid-neighbors) | Delivered (bounded) |
| 44 | Agent Loom connection | World occupancy | [Entry](api-table.md#grid-agents-at-world) | [Details](api-reference.md#grid-agents-at-world) | Delivered (bounded) |
| 45 | Agent Loom connection | Explicit occupancy | [Entry](api-table.md#grid-agents-at-source) | [Details](api-reference.md#grid-agents-at-source) | Delivered (bounded) |
| 46 | Agent Loom connection | Identity | [Entry](api-table.md#field-id) | [Details](api-reference.md#field-id) | Delivered (bounded) |
| 47 | Agent Loom connection | Position | [Entry](api-table.md#field-position) | [Details](api-reference.md#field-position) | Delivered (bounded) |
| 48 | Agent Loom connection | State | [Entry](api-table.md#field-state) | [Details](api-reference.md#field-state) | Delivered (bounded) |
| 49 | Agent Loom connection | Regular diffusion | [Entry](api-table.md#grid-diffuse) | [Details](api-reference.md#grid-diffuse) | Delivered (bounded) |

## Additional explicit entries

- Existing dataset `geometry.bounds` and positional `geometry.contains` remain separately documented; shape-object overloads are proposed additions.
- Default regular Grid construction, typed regular construction and layout construction retain separate signatures.
- `field.id` and `field.grid` are separately documented even though the original catalogue combines identity.
- OBB, parallel strips and straight skeleton have separate method entries under `geometry.subdivide`; Voronoi belongs to topology.
- Shared polygon/layout/label/result types and status meanings are documented alongside operations.

The inventory expands the 49 catalogue rows into **58 operation/property sections** and **27 supplementary type/result rows**, plus the shared subdivision-control definition. Extra operation sections separate preserved bounds/contains overloads, default Grid construction, Field ownership and the three subdivision methods. The integration author checked all 58 signature fences against the detailed reference and resolved every catalogue/detail anchor. Re-run those checks after integration edits. Proposed script examples and signature declarations are documentation, not executed implementation tests.

The Townscaper integration adds two explicit sections while retaining both earlier research signatures: [arbitrary-boundary quads](api-reference.md#topology-quadrilaterals-boundary) and [Lloyd](api-reference.md#topology-relax-lloyd). The 49 original catalogue rows are unchanged. Previous review evidence applies to its recorded revision; the integrated revision needs its own review.
