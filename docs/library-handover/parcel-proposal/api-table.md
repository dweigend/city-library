# Grid and parcel API inventory

> **Proposed target inventory.** This document expands the complete grid/parcel catalogue. Only entries marked delivered exist at the pinned City Library grid revision `2a7f3eb`. Proposed and research signatures are design contracts awaiting example-first freeze and implementation; their presence is not a runtime availability claim.

[Overview](README.md) · [Detailed reference and examples](api-reference.md) · [Catalogue coverage](COVERAGE.md)

Import delivered APIs from `city-library`. No additional package entry, Parcel class or parcel namespace is introduced. Ordinary TypeScript composes geometry operations; `topology` owns immutable relationships and `Grid` owns Field state.

## Contents

[Topology generation](#topology-generation) · [Layout queries](#layout-queries) · [Geometry measurements](#geometry-measurements) · [Geometry changes](#geometry-changes) · [Reusable procedures](#reusable-procedures) · [Grid and Field](#grid-and-field) · [Shared data and procedure results](#shared-data-and-procedure-results)

## Availability

| Label | Meaning |
| --- | --- |
| Delivered | A bounded implementation exists at `2a7f3eb`; supported-input limits still apply. |
| Proposed | Target author contract; not implemented or exported by the pinned package. |
| Research | Proposed method still needs algorithm/backend or robustness decisions before freeze. |

The original catalogue's Source/New/Research provenance labels are not availability flags. No signature here changes the delivered merge/split result shapes or existing Grid behavior.



<a id="topology-generation"></a>

## Topology generation

<a id="topology-square"></a>

### topology.square

**Delivered.**

```ts
topology.square(options: {
  columns: number;
  rows: number;
  cellSize?: number;
}): Layout
```

Equal complete squares from the lower-left origin; row-major local keys, default size 1.

[Details and examples](api-reference.md#topology-square)

<a id="topology-hex"></a>

### topology.hex

**Delivered.**

```ts
topology.hex(options: {
  columns: number;
  rows: number;
  cellRadius?: number;
  orientation?: "pointy" | "flat";
}): Layout
```

Complete axial hexagons; center-to-corner radius, default pointy orientation and exact shared lattice endpoints.

[Details and examples](api-reference.md#topology-hex)

<a id="topology-triangle"></a>

### topology.triangle

**Proposed.**

```ts
topology.triangle(options: {
  columns: number;
  rows: number;
  edgeLength?: number;
}): Layout
```

Finite regular triangle cells with explicit measured edge length; no display normalization.

[Details and examples](api-reference.md#topology-triangle)

<a id="topology-trihex"></a>

### topology.trihex

**Research.**

```ts
topology.trihex(options: {
  columns: number;
  rows: number;
  edgeLength?: number;
}): Layout
```

Finite mixed triangle/hexagon layout with positive shared-edge adjacency.

[Details and examples](api-reference.md#topology-trihex)

<a id="topology-rectangles"></a>

### topology.rectangles

**Proposed.**

```ts
topology.rectangles(options: {
  columns: number;
  rows: number;
  cellSize?: number;
  variation?: number;
  random?: Random;
}): Layout
```

Unequal rectangles from explicit controls and optional Random input; retain rectangular topology.

[Details and examples](api-reference.md#topology-rectangles)

<a id="topology-voronoi"></a>

### topology.voronoi

**Proposed.**

```ts
topology.voronoi(options: {
  points: readonly Position[];
  boundary: PlanarPolygon;
}): Layout
```

Nearest-site regions clipped to an explicit boundary; no implied road frontage or parcel policy.

[Details and examples](api-reference.md#topology-voronoi)

<a id="topology-quadrilaterals"></a>

### topology.quadrilaterals — finite hex patch

**Proposed.**

```ts
topology.quadrilaterals(options: {
  rings: number;
  edgeLength?: number;
  random: Random;
}): Layout
```

Regular triangular hex patch, random pairing, then complete quad refinement. Explicit Random; no built-in relaxation or arbitrary clipping. Full-edge shared construction; exact continuation and finite bounds frozen before runtime.

[Details and examples](api-reference.md#topology-quadrilaterals)

<a id="topology-quadrilaterals-boundary"></a>

### topology.quadrilaterals — arbitrary boundary research

**Research.**

```ts
topology.quadrilaterals(options: {
  boundary: PlanarPolygon;
  pointSpacing: number;
  relaxationIterations?: number;
  random?: Random;
}): Layout
```

Bounded named organic quadrilateral generation; backend, degeneracy and supported boundary rules require freeze.

[Details and examples](api-reference.md#topology-quadrilaterals-boundary)

<a id="topology-from-polygons"></a>

### topology.fromPolygons

**Delivered.**

```ts
topology.fromPolygons(options: {
  polygons: readonly PlanarPolygon[];
}): Layout
```

Detached immutable layout from caller-ordered conforming, nonoverlapping, hole-free polygons.

[Details and examples](api-reference.md#topology-from-polygons)

<a id="topology-relax"></a>

### topology.relax — squareTarget

**Proposed.**

```ts
topology.relax(options: {
  layout: Layout;
  method: "squareTarget";
  iterations: number;
}): Layout
```

Synchronous square-target relaxation of conforming strictly convex quads, fixed finite boundary and new immutable revision. Preserve incidence/local-key correspondence; no RNG or automatic Field-state transfer. Numerical step policy requires freeze fixtures.

[Details and examples](api-reference.md#topology-relax)

<a id="topology-relax-lloyd"></a>

### topology.relax — Lloyd research

**Research.**

```ts
topology.relax(options: {
  layout: Layout;
  method: "lloyd";
  iterations: number;
}): Layout
```

Return a new layout using an explicitly named relaxation method; no in-place topology or Field mutation.

[Details and examples](api-reference.md#topology-relax-lloyd)

<a id="topology-validate"></a>

### topology.validate

**Proposed.**

```ts
topology.validate(options: { layout: Layout }): ValidationResult
```

Report topology shape/relationship validity without changing layout geometry or state.

[Details and examples](api-reference.md#topology-validate)

<a id="layout-queries"></a>

## Layout queries

<a id="layout-cells"></a>

### layout.cells

**Delivered.**

```ts
layout.cells: readonly number[]
```

Read ordered layout-local numeric keys; not persistent parcel or cadastral identities.

[Details and examples](api-reference.md#layout-cells)

<a id="layout-polygon"></a>

### layout.polygon

**Delivered.**

```ts
layout.polygon(options: { cell: number }): PlanarPolygon
```

Read the immutable polygon for a known cell key.

[Details and examples](api-reference.md#layout-polygon)

<a id="layout-neighbors"></a>

### layout.neighbors

**Delivered.**

```ts
layout.neighbors(options: { cell: number }): readonly number[]
```

Read sorted cells sharing positive full-edge length; point contacts are excluded.

[Details and examples](api-reference.md#layout-neighbors)

<a id="layout-cell-at"></a>

### layout.cellAt

**Delivered.**

```ts
layout.cellAt(options: { position: Position }): number | undefined
```

Locate actual polygon membership; included-boundary ties choose the earliest layout key.

[Details and examples](api-reference.md#layout-cell-at)

<a id="layout-shared-boundary"></a>

### layout.sharedBoundary

**Delivered.**

```ts
layout.sharedBoundary(options: {
  firstCell: number;
  secondCell: number;
}): readonly BoundarySegment[]
```

Read actual shared intervals, oriented along the first cell's ring.

[Details and examples](api-reference.md#layout-shared-boundary)

<a id="geometry-measurements"></a>

## Geometry measurements

<a id="geometry-validate"></a>

### geometry.validate

**Proposed.**

```ts
geometry.validate(options: { shape: unknown }): ValidationResult
```

Separate invalid polygonal data from valid shapes outside declared capabilities.

[Details and examples](api-reference.md#geometry-validate)

<a id="geometry-area"></a>

### geometry.area

**Delivered.**

```ts
geometry.area(options: { shape: ParcelShape }): number
```

Read net polygon area including holes; MultiPolygon sums components and is not Boolean union.

[Details and examples](api-reference.md#geometry-area)

<a id="geometry-perimeter"></a>

### geometry.perimeter

**Proposed.**

```ts
geometry.perimeter(options: {
  shape: ParcelShape;
  includeHoleBoundaries?: boolean;
}): number
```

Read boundary length with explicit inclusion of hole boundaries.

[Details and examples](api-reference.md#geometry-perimeter)

<a id="geometry-bounds"></a>

### geometry.bounds — dataset query

**Delivered.**

```ts
geometry.bounds(input: PlanarDataset | readonly PlanarFeature[]): Bounds | undefined
```

Preserved dataset/feature-array query; empty coordinate input returns undefined.

[Details and examples](api-reference.md#geometry-bounds)

<a id="geometry-bounds-shape"></a>

### geometry.bounds — shape overload

**Proposed overload.**

```ts
geometry.bounds(options: { shape: ParcelShape }): Bounds
```

Proposed polygonal overload; preserve the existing dataset signature.

[Details and examples](api-reference.md#geometry-bounds-shape)

<a id="geometry-oriented-bounds"></a>

### geometry.orientedBounds

**Proposed.**

```ts
geometry.orientedBounds(options: { shape: PlanarPolygon }): OrientedBounds
```

Read a minimum-area oriented rectangle for supported geometry with deterministic ties.

[Details and examples](api-reference.md#geometry-oriented-bounds)

<a id="geometry-centroid"></a>

### geometry.centroid

**Proposed.**

```ts
geometry.centroid(options: { shape: ParcelShape }): Position
```

Read area centroid; it may lie outside concave land or inside a hole.

[Details and examples](api-reference.md#geometry-centroid)

<a id="geometry-interior-point"></a>

### geometry.interiorPoint

**Proposed.**

```ts
geometry.interiorPoint(options: { shape: ParcelShape }): Position
```

Read a guaranteed interior representative for supported nonempty geometry.

[Details and examples](api-reference.md#geometry-interior-point)

<a id="geometry-minimum-width"></a>

### geometry.minimumWidth

**Proposed.**

```ts
geometry.minimumWidth(options: { shape: PlanarPolygon }): number
```

Read minimum supporting-line width; not an inscribed buildable rectangle.

[Details and examples](api-reference.md#geometry-minimum-width)

<a id="geometry-compactness"></a>

### geometry.compactness

**Proposed.**

```ts
geometry.compactness(options: { shape: PlanarPolygon }): number
```

Read a defined dimensionless shape measure; not planning quality or buildability.

[Details and examples](api-reference.md#geometry-compactness)

<a id="geometry-contains"></a>

### geometry.contains — positional polygon query

**Delivered.**

```ts
geometry.contains(
  shape: PlanarPolygon,
  position: { x: number; y: number },
  options?: { boundary?: "include" | "exclude" },
): boolean
```

Preserved positional Polygon query with explicit include/exclude boundary policy.

[Details and examples](api-reference.md#geometry-contains)

<a id="geometry-contains-shape"></a>

### geometry.contains — object overload

**Proposed overload.**

```ts
geometry.contains(options: {
  shape: ParcelShape;
  position: Position;
  boundary?: "include" | "exclude";
}): boolean
```

Proposed flat object overload; no change to existing positional containment.

[Details and examples](api-reference.md#geometry-contains-shape)

<a id="geometry-contact"></a>

### geometry.contact

**Proposed.**

```ts
geometry.contact(options: {
  firstShape: ParcelShape;
  secondShape: ParcelShape;
}): ShapeContact
```

Distinguish disjoint, point, positive-length edge and area contact.

[Details and examples](api-reference.md#geometry-contact)

<a id="geometry-shared-boundary"></a>

### geometry.sharedBoundary

**Proposed.**

```ts
geometry.sharedBoundary(options: {
  firstShape: ParcelShape;
  secondShape: ParcelShape;
}): readonly BoundarySegment[]
```

Read geometric shared boundary intervals, independent of road meaning.

[Details and examples](api-reference.md#geometry-shared-boundary)

<a id="geometry-boundary-overlap"></a>

### geometry.boundaryOverlap

**Proposed.**

```ts
geometry.boundaryOverlap(options: {
  shape: PlanarPolygon;
  boundarySegments: readonly LabelledBoundarySegment[];
}): BoundaryOverlap
```

Intersect labelled intervals with boundary; point contact is zero and overlapping labels count once in total length.

[Details and examples](api-reference.md#geometry-boundary-overlap)

<a id="geometry-changes"></a>

## Geometry changes

<a id="geometry-merge-shapes"></a>

### geometry.merge — shapes

**Delivered, bounded.**

```ts
geometry.merge(options: { shapes: readonly PlanarPolygon[] }): MergeResult
```

Merge conforming connected simple polygons; retain every source shape when unsupported or failed.

[Details and examples](api-reference.md#geometry-merge-shapes)

<a id="geometry-merge-cells"></a>

### geometry.merge — layout cells

**Delivered, bounded.**

```ts
geometry.merge(options: { layout: Layout; cells: readonly number[] }): MergeResult
```

Merge selected unique cells and retain source cell keys in caller order.

[Details and examples](api-reference.md#geometry-merge-cells)

<a id="geometry-intersection"></a>

### geometry.intersection

**Proposed; robust Boolean implementation pending.**

```ts
geometry.intersection(options: {
  firstShape: PlanarPolygon;
  secondShape: PlanarPolygon;
}): ShapeChange
```

Return common polygonal area; empty intersection is valid, with no discarded holes or components.

[Details and examples](api-reference.md#geometry-intersection)

<a id="geometry-subtract"></a>

### geometry.subtract

**Proposed; robust Boolean implementation pending.**

```ts
geometry.subtract(options: {
  shape: PlanarPolygon;
  excludedShapes: readonly PlanarPolygon[];
}): ShapeChange
```

Remove the union of exclusions; preserve all surviving components and holes.

[Details and examples](api-reference.md#geometry-subtract)

<a id="geometry-clip"></a>

### geometry.clip

**Proposed.**

```ts
geometry.clip(options: {
  shape: PlanarPolygon;
  boundary: PlanarPolygon;
}): ShapeChange
```

Intersect land with a declared boundary; empty clipping output is valid.

[Details and examples](api-reference.md#geometry-clip)

<a id="geometry-split"></a>

### geometry.split

**Delivered, convex and hole-free.**

```ts
geometry.split(options: {
  shape: PlanarPolygon;
  point: Position;
  direction: Vector;
  minimumArea?: number;
}): SplitResult
```

One infinite-line cut of convex hole-free land; conserve area and retain detached input on no change or failure.

[Details and examples](api-reference.md#geometry-split)

<a id="geometry-offset"></a>

### geometry.offset

**Proposed; offset backend and difficult topology remain research work.**

```ts
geometry.offset(options: {
  shape: PlanarPolygon;
  distance: number;
  cornerStyle?: "bevel";
}): ShapeChange
```

Positive outward and negative inward displacement; no silent reduction of requested distance.

[Details and examples](api-reference.md#geometry-offset)

<a id="geometry-corridor"></a>

### geometry.corridor

**Proposed; straight segments first.**

```ts
geometry.corridor(options: {
  paths: readonly (readonly PlanarXY[])[];
  width: number;
  endCap?: "butt";
  cornerStyle?: "bevel";
}):
  | { readonly status: "ok"; readonly parts: readonly PlanarPolygon[];
      readonly diagnostics: readonly string[] }
  | { readonly status: "unsupported" | "failed";
      readonly remainingPaths: readonly (readonly PlanarXY[])[];
      readonly diagnostics: readonly string[] }
```

Convert explicit paths and full width into geometric road surfaces; caps/joins do not establish access permissions.

[Details and examples](api-reference.md#geometry-corridor)

<a id="reusable-procedures"></a>

## Reusable procedures

<a id="topology-group"></a>

### topology.group

**Proposed; bounded connected grouping.**

```ts
topology.group(options: {
  layout: Layout;
  availableCells?: readonly number[];
  minimumCells?: number;
  maximumCells?: number;
  maximumGroups?: number;
  random?: Random;
}): {
  readonly status: "ok" | "partial" | "unchanged";
  readonly groups: readonly (readonly number[])[];
  readonly remainingCells: readonly number[];
  readonly diagnostics: readonly string[];
}
```

Connected cell grouping within explicit bounds; retain ungrouped cells and separate grouping from merging.

[Details and examples](api-reference.md#topology-group)

<a id="geometry-subdivide"></a>

### geometry.subdivide

**Proposed; three method contracts, with different readiness.**

```ts
geometry.subdivide(options:
  | OrientedBoundingBoxOptions
  | ParallelStripsOptions
  | StraightSkeletonOptions
): SubdivisionResult
```

Bounded procedure producing accepted parts and retained unresolved land with diagnostics and local derivation.

[Details and examples](api-reference.md#geometry-subdivide)

<a id="geometry-subdivide-obb"></a>

### geometry.subdivide — orientedBoundingBox

**Proposed first implementation: deterministic convex, hole-free polygons.**

```ts
type OrientedBoundingBoxOptions = SubdivisionControls & {
  readonly method: "orientedBoundingBox";
  readonly targetArea: number;
};
```

Deterministic midpoint OBB recursion with perpendicular retry, guards and explicit work limits.

[Details and examples](api-reference.md#geometry-subdivide-obb)

<a id="geometry-subdivide-strips"></a>

### geometry.subdivide — parallelStrips

**Proposed later method; full algorithm/defaults need separate freeze fixtures.**

```ts
type ParallelStripsOptions = SubdivisionControls & {
  readonly method: "parallelStrips";
  readonly direction: Vector;
  readonly stripWidth: number;
};
```

Direction- and width-based subdivision as its own strategy; fragment and residual rules remain explicit.

[Details and examples](api-reference.md#geometry-subdivide-strips)

<a id="geometry-subdivide-skeleton"></a>

### geometry.subdivide — straightSkeleton

**Research target; no skeleton or parcel backend is delivered.**

```ts
type StraightSkeletonOptions = SubdivisionControls & {
  readonly method: "straightSkeleton";
  readonly targetArea: number;
};
```

True skeleton-driven strips and slicing; requires event topology and correction, not arbitrary ribs.

[Details and examples](api-reference.md#geometry-subdivide-skeleton)

<a id="grid-and-field"></a>

## Grid and Field

<a id="grid-add-default"></a>

### Grid.add — default regular grid

**Delivered.**

```ts
Grid.add(): Grid<{}>
```

Construct the preserved centered default regular Grid; no layout state implied.

[Details and examples](api-reference.md#grid-add-default)

<a id="grid-add-space"></a>

### Grid.add — regular Space

**Delivered.**

```ts
Grid.add<F extends object>(space: Space, options: {
  state: F; cellSize?: number; boundary?: Space["boundary"];
}): Grid<F>
Grid.add(space?: Space, options?: {
  cellSize?: number; boundary?: Space["boundary"];
}): Grid<{}>
```

Construct a regular Grid in an explicit Space, with preserved cell/boundary defaults and optional typed state overload.

[Details and examples](api-reference.md#grid-add-space)

<a id="grid-add-layout"></a>

### Grid.add — immutable Layout

**Delivered.**

```ts
Grid.add<F extends object>(options: { layout: Layout; state: F }): LayoutGrid<F>
```

Create canonical typed Fields over detached topology; no regular Space/cellSize/diffuse capability.

[Details and examples](api-reference.md#grid-add-layout)

<a id="grid-fields"></a>

### grid.fields

**Delivered.**

```ts
grid.fields: readonly Field<F>[]          // regular Grid
grid.fields: readonly LayoutField<F>[]    // LayoutGrid
```

Read canonical Field identities in receiver order; custom state remains directly typed.

[Details and examples](api-reference.md#grid-fields)

<a id="grid-field-at"></a>

### grid.fieldAt

**Delivered.**

```ts
grid.fieldAt(position: Position): Field<F> | undefined       // regular
layoutGrid.fieldAt(position: Position): LayoutField<F> | undefined
```

Locate a Field from actual regular cells or layout polygons, preserving variant-specific spatial rules.

[Details and examples](api-reference.md#grid-field-at)

<a id="grid-neighbors"></a>

### grid.neighbors

**Delivered.**

```ts
grid.neighbors(field: Field<F>, options?: {
  neighborhood?: "faces" | "moore";
}): readonly Field<F>[]
layoutGrid.neighbors(field: LayoutField<F>): readonly LayoutField<F>[]
```

Regular faces/Moore semantics remain separate from layout positive-edge neighbors.

[Details and examples](api-reference.md#grid-neighbors)

<a id="grid-agents-at-world"></a>

### grid.agentsAt — attached World source

**Delivered.**

```ts
grid.agentsAt(field: Field<F>): readonly Agent[]
layoutGrid.agentsAt(field: LayoutField<F>): readonly Agent[]
```

Read living Agents in this Field from the attached World; detached use requires an explicit source.

[Details and examples](api-reference.md#grid-agents-at-world)

<a id="grid-agents-at-source"></a>

### grid.agentsAt — explicit source

**Delivered.**

```ts
grid.agentsAt<T extends Agent>(field: Field<F>, options: {
  source: Iterable<T>;
}): readonly T[]
layoutGrid.agentsAt<T extends Agent>(field: LayoutField<F>, options: {
  source: Iterable<T>;
}): readonly T[]
```

Read canonical Agents from the caller's iterable without requiring World attachment.

[Details and examples](api-reference.md#grid-agents-at-source)

<a id="field-id"></a>

### field.id

**Delivered.**

```ts
field.id: string // readonly
```

Read the Field's stable receiver-local identity; not a layout-independent parcel key.

[Details and examples](api-reference.md#field-id)

<a id="field-grid"></a>

### field.grid

**Delivered.**

```ts
field.grid: Grid<F>          // readonly, regular Field owner
layoutField.grid: LayoutGrid<F> // readonly, actual LayoutField owner
```

Read the owning regular or layout Grid reference.

[Details and examples](api-reference.md#field-grid)

<a id="field-position"></a>

### field.x, field.y, field.z

**Delivered.**

```ts
field.x: number             // readonly
field.y: number             // readonly
field.z: number | undefined // readonly
```

Read embedded representative coordinates; layout area centroid is not guaranteed inside its cell.

[Details and examples](api-reference.md#field-position)

<a id="field-state"></a>

### Typed Field properties

**Delivered.**

```ts
field.temperature = value // when initial state declares temperature: number
```

Read/write custom typed state directly; no generic state setter or Parcel class.

[Details and examples](api-reference.md#field-state)

<a id="grid-diffuse"></a>

### grid.diffuse — regular grids only

**Delivered.**

```ts
grid.diffuse(property: NumericKey<F>, options?: {
  rate?: number;
  neighborhood?: "faces" | "moore";
}): void
```

Preserved synchronous regular-grid diffusion, including directional multiplicity on tiny wrapping grids.

[Details and examples](api-reference.md#grid-diffuse)

<a id="shared-data-and-procedure-results"></a>

## Shared data and procedure results

These entries describe structural types and proposed result members. They do not create objects, mutable containers or additional runtime namespaces. Types marked proposed are not current package exports.

| Entry | Signature / shape | Compact contract | Status | Details |
| --- | --- | --- | --- | --- |
| Planar coordinate | `PlanarXY = readonly [number, number]` | XY length units; no implicit CRS conversion. | Delivered | [Types](api-reference.md#shared-types) |
| Polygon | `PlanarPolygon = { readonly type: "Polygon"; readonly coordinates: readonly (readonly PlanarXY[])[] }` | Closed outer ring, followed by closed hole rings. | Delivered | [Types](api-reference.md#shared-types) |
| Polygon union type | `Extract<PlanarGeometry, { type: "Polygon" \| "MultiPolygon" }>` | Structural polygonal input, not a new geometry representation. | Delivered variants | [Types](api-reference.md#shared-types) |
| Boundary segment | `BoundarySegment = readonly [PlanarXY, PlanarXY]` | Coordinate interval, independent of ring indices. | Delivered | [Types](api-reference.md#shared-types) |
| Position | `Position = { readonly x: number; readonly y: number; readonly z?: number }` | Existing point object; planar operations omit z. | Delivered | [Types](api-reference.md#planar-types) |
| Vector | `Vector = { readonly x?: number; readonly y?: number; readonly z?: number }` | Existing displacement object; a split direction must be nonzero. | Delivered | [Types](api-reference.md#planar-types) |
| Feature and dataset | `PlanarFeature`, `PlanarDataset`, `PlanarJson` | Existing nullable feature geometry, JSON properties and coordinate metadata. | Delivered | [Data types](api-reference.md#planar-data-types) |
| Simulation types | `Space`, `Agent<S>`, `Field<F>`, `LayoutGrid<F>`, `LayoutField<F>` | Existing simulation identities and normalized spatial context; not polygon wrappers. | Delivered | [Simulation types](api-reference.md#simulation-types) |
| Layout | `Layout` | Canonical immutable topology with local numeric cell keys and five query members; squareTarget preserves revision-local key correspondence. | Delivered | [Full interface](api-reference.md#layout-type) |
| Axis-aligned bounds | `Bounds = readonly [number, number, number, number]` | Tuple order is minimumX, maximumX, minimumY, maximumY. | Delivered | [Measurements](api-reference.md#measurement-types) |
| Validation report | `ValidationResult = { readonly valid: boolean \| null; readonly supported: boolean; readonly diagnostics: readonly string[] }` | Invalid, valid supported, or unestablished validity for unsupported input remain distinct. | Proposed | [Measurements](api-reference.md#measurement-types) |
| Oriented bounds | `OrientedBounds = { readonly shape: PlanarPolygon; readonly center: Position; readonly width: number; readonly height: number; readonly angle: number }` | Angle radians counterclockwise from +X; width follows that axis. | Proposed | [Measurements](api-reference.md#measurement-types) |
| Shape contact | `ShapeContact = "disjoint" \| "point" \| "edge" \| "area"` | Distinguish dimension of intersection. | Proposed | [Measurements](api-reference.md#measurement-types) |
| Boundary overlap | `BoundaryOverlap = { readonly length: number; readonly segments: readonly LabelledBoundarySegment[] }` | Unique union length and retained labelled intervals. | Proposed | [Measurements](api-reference.md#measurement-types) |
| Road-labelled interval | `LabelledBoundarySegment = { readonly id: string; readonly segment: BoundarySegment }` | Caller-declared geometric label; does not establish legal or network access. | Proposed | [Overlap](api-reference.md#geometry-boundary-overlap) |
| Subdivision part | `SubdivisionPart = { readonly key: string; readonly parentKey: string \| null; readonly shape: PlanarPolygon; readonly boundarySegments: readonly LabelledBoundarySegment[] }` | Detached polygon with call-local derivation and inherited frontage. | Proposed | [Subdivision](api-reference.md#geometry-subdivide) |
| Result status | `result.status: "ok" \| "partial" \| "unchanged" \| "unsupported" \| "failed"` | Complete, bounded progress, no committed cut, valid unsupported input, or numerical rollback. | Proposed subdivision | [Subdivision](api-reference.md#geometry-subdivide) |
| Accepted parcels | `result.parts: readonly SubdivisionPart[]` | Terminal leaves meeting target and minimum guards. | Proposed | [Subdivision](api-reference.md#geometry-subdivide) |
| Remaining land | `result.remainingParts: readonly SubdivisionPart[]` | Retained unresolved leaves; never silently discarded. | Proposed | [Subdivision](api-reference.md#geometry-subdivide) |
| Diagnostics | `result.diagnostics: readonly SubdivisionDiagnostic[]` | Codes identify leaf key and candidate attempt; noncandidate guard decisions use null. | Proposed | [Subdivision](api-reference.md#geometry-subdivide) |
| Attempt count | `result.attempts: number` | Number of candidate cut evaluations; no hidden retries. | Proposed | [Budgets](api-reference.md#geometry-subdivide-obb) |
| Area residual | `result.areaResidual: number` | Input area minus accepted and remaining areas; alone does not prove containment or nonoverlap. | Proposed | [Subdivision](api-reference.md#geometry-subdivide) |
| Local key | `part.key: string; part.parentKey: string \| null` | Binary derivation keys repeat across calls; not persistent parcel IDs. | Proposed | [Subdivision](api-reference.md#geometry-subdivide) |
| Area completion | `targetArea: number` | Positive finite upper completion bound, not exact area or statistical mean. | Proposed | [OBB](api-reference.md#geometry-subdivide-obb) |
| Minimum guards | `minimumArea?: number; minimumWidth?: number; minimumFrontage?: number` | Nonnegative thresholds; width is support width and frontage is total unique labelled boundary length. | Proposed | [OBB](api-reference.md#geometry-subdivide-obb) |
| Work limits | `maximumParcels?: number; maximumDepth?: number; maximumAttempts?: number` | Bound live leaves, root-relative depth and evaluated candidate cuts; preserve pending land. | Proposed | [OBB](api-reference.md#geometry-subdivide-obb) |
| Malformed input | `TypeError` / `RangeError` | Throws before geometric search; not an ordinary unsupported or unsplittable outcome. | Delivered pattern / proposed extension | [Shared contracts](api-reference.md#shared-contracts) |

Field values remain direct typed properties. Geometry results never transfer Field state or Agent membership. Existing merge/split use their own delivered result shapes; the proposed subdivision result does not replace them.


### Shared subdivision controls

The following is a local reference type used by the three method option types above; it is not a new runtime container or required public export.

```ts
type SubdivisionControls = {
  readonly shape: PlanarPolygon;
  readonly minimumArea?: number;
  readonly minimumWidth?: number;
  readonly minimumFrontage?: number;
  readonly boundarySegments?: readonly LabelledBoundarySegment[];
  readonly maximumParcels?: number;
  readonly maximumAttempts?: number;
  readonly maximumDepth?: number;
};
```

[Complete result types and status rules](api-reference.md#subdivision-types)
