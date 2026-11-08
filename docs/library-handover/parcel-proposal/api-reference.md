# Grid and parcel API reference

> **Proposed target reference.** This document expands the complete grid/parcel catalogue. Entries marked **Delivered** describe City Library `feat/grid-parcel-foundations` at `2a7f3eb`. **Proposed** entries are target contracts, not available exports or accepted executable examples. **Research** entries additionally need the method and numerical decisions named in their entries. Existing accepted calls remain unchanged.

[Overview](README.md) · [API inventory](api-table.md) · [Source evidence](PAPERS.md) · [Design decisions](CONTRACT.md)

Use ordinary TypeScript functions to compose geometry, topology and simulation state. Import delivered functions from `city-library`; future signatures use the same root entry as a proposal. No World, renderer, framework, GPU or registry is required to calculate a shape.

## Contents

[Shared types](#shared-types) · [Shared contracts](#shared-contracts) · [Topology generation](#topology-generation) · [Layout queries](#layout-queries) · [Geometry measurements](#geometry-measurements) · [Geometry changes](#geometry-changes) · [Grouping](#topology-group) · [Subdivision](#geometry-subdivide) · [Grid and Field connection](#grid-bridge)

<a id="shared-types"></a>

## Exports and shared types

```ts
import { geometry, topology, Grid, Random } from "city-library";
import type {
  PlanarXY, PlanarPolygon, PlanarGeometry, ParcelShape,
  Position, Vector, Layout, BoundarySegment, Bounds,
  PlanarJson, PlanarFeature, PlanarDataset, Space,
  Agent, Field, LayoutGrid, LayoutField,
} from "city-library";
```

These imports exist at the inspected baseline. Individual future members of `geometry` and `topology` do not exist merely because their namespace exists. New helper type names in this reference are proposed type declarations; names used only to explain a signature need not become separate public exports.

<a id="planar-types"></a>

### Planar coordinates and polygons

```ts
type PlanarXY = readonly [number, number];
type PlanarPolygon = {
  readonly type: "Polygon";
  readonly coordinates: readonly (readonly PlanarXY[])[];
};
type ParcelShape = PlanarPolygon |
  Extract<PlanarGeometry, { type: "MultiPolygon" }>;
type BoundarySegment = readonly [PlanarXY, PlanarXY];
type Position = { readonly x: number; readonly y: number; readonly z?: number };
type Vector = { readonly x?: number; readonly y?: number; readonly z?: number };
```

**Delivered.** Polygon coordinates contain an outer ring followed by zero or more holes. Every ring is closed: the final position equals the first. A triangle therefore has four coordinate positions. Input rings may use either winding. Polygon coordinate tuples contain exactly XY, while point/direction arguments use the existing object types. For the planar APIs here, omit z. An operation accepting `Position` validates it in its two-dimensional context.

`PlanarGeometry` also includes Point, MultiPoint, LineString, MultiLineString and GeometryCollection for existing data operations. A polygon operation accepts only the type stated in its signature; accepting `ParcelShape` does not imply accepting every GeoJSON geometry. MultiPolygon means a coordinate list of Polygon components, without introducing a second `{ outer, holes }` format.

```ts
const block: PlanarPolygon = {
  type: "Polygon",
  coordinates: [[[0, 0], [12, 0], [12, 8], [0, 8], [0, 0]]],
};
const courtyard: PlanarPolygon = {
  type: "Polygon",
  coordinates: [
    [[0, 0], [12, 0], [12, 8], [0, 8], [0, 0]],
    [[4, 2], [8, 2], [8, 6], [4, 6], [4, 2]],
  ],
};
```

A ring must be simple, finite and have representable positive area. Holes must be valid interior rings without crossings or invalid nesting. Self-intersections, repeated degenerate edges and holes touching or crossing an exterior boundary are invalid. The underlying geometric validators remain authoritative for exact admission. Constructors do not repair invalid polygons by rounding or filling holes.

<a id="planar-data-types"></a>

### Existing feature and dataset types

**Delivered.** These existing structures support the dataset overload of `geometry.bounds`. Metadata describes coordinates; reading a dataset does not transform them.

```ts
type PlanarJson = null | boolean | number | string |
  readonly PlanarJson[] | { readonly [key: string]: PlanarJson };
interface PlanarFeature {
  readonly type: "Feature";
  readonly id?: string | number;
  readonly geometry: PlanarGeometry | null;
  readonly properties: Readonly<Record<string, PlanarJson>> | null;
}
interface PlanarDataset {
  readonly features: readonly PlanarFeature[];
  readonly coordinateSystem: { readonly crs: string; readonly units: string };
}
```

<a id="simulation-types"></a>

### Existing simulation types and Space

**Delivered.** `Agent<S>` holds typed agent data. `Field<F>` is a regular-grid Field; `LayoutField<F>` is a layout-grid Field. `LayoutGrid<F>` is the returned layout-grid interface. Their identity, state and spatial capabilities are described in the [Grid and Field connection](#grid-bridge); they do not add new polygon ownership or wrappers.

```ts
interface Space {
  readonly x: number;
  readonly y: number;
  readonly z?: number;
  readonly dimensions?: 2 | 3;
  readonly boundary?: "hard" | "wrap" | {
    readonly x?: "hard" | "wrap";
    readonly y?: "hard" | "wrap";
    readonly z?: "hard" | "wrap";
  };
}
```

Space extents are positive finite full lengths centered at the origin. Omitting z selects two dimensions; including z selects three, and supplied dimensions must agree. Missing boundary rules default to hard. Constructors return an immutable normalized context with dimensions and effective boundary rules present; its internal normalized type is not a new required public import. A layout Grid has no rectangular Space. This is the existing simulation convention, not the arbitrary world-coordinate bounding box returned by `geometry.bounds`.

<a id="layout-type"></a>

### Layout

```ts
interface Layout {
  readonly cells: readonly number[];
  polygon(options: { cell: number }): PlanarPolygon;
  neighbors(options: { cell: number }): readonly number[];
  cellAt(options: { position: Position }): number | undefined;
  sharedBoundary(options: {
    firstCell: number;
    secondCell: number;
  }): readonly BoundarySegment[];
}
```

**Delivered.** A Layout is a canonical immutable subdivision produced by `topology`. Cells have local integer keys `0..cells.length - 1`. The keys are not agents, live Field identities, coordinates or persistent cadastral IDs. A key is meaningful only with its Layout. Identical numbers in unrelated layouts have no shared identity. The proposed squareTarget operation explicitly preserves cell order and local-key correspondence across its new revision; this is correspondence, not shared mutable identity or state migration.

Cell interiors do not overlap; disconnected cell groups and gaps are allowed. The delivered importer accepts only hole-free polygons with conforming full-edge contacts. Each cell pair can share several complete edges. Partial-edge/T-junction contacts are outside its capability, even when their interiors are otherwise disjoint. The library rejects a caller-built object that merely imitates the Layout interface when a canonical Layout is required.

<a id="measurement-types"></a>

### Measurement result types

The existing bounds tuple is preserved:

```ts
type Bounds = readonly [number, number, number, number];
// [minimumX, maximumX, minimumY, maximumY]
```

The following names describe **proposed** measurement results:

```ts
type ValidationResult = {
  readonly valid: boolean | null;
  readonly supported: boolean;
  readonly diagnostics: readonly string[];
};
type OrientedBounds = {
  readonly shape: PlanarPolygon;
  readonly center: Position;
  readonly width: number;
  readonly height: number;
  readonly angle: number;
};
type ShapeContact = "disjoint" | "point" | "edge" | "area";
type BoundaryOverlap = {
  readonly length: number;
  readonly segments: readonly LabelledBoundarySegment[];
};
```

`width` is the extent along `angle`, `height` the perpendicular extent. Angles are radians counterclockwise from +X. `LabelledBoundarySegment` is defined with the [subdivision types](#subdivision-types). Boundary labels belong to geometric intervals, not mutable ring vertex indices. They identify caller-supplied roads or other boundaries; a label is not a transport-network edge or proof of legal access.

<a id="shared-contracts"></a>

## Shared contracts

### Availability and failure

| Label | Meaning |
| --- | --- |
| Delivered | Available at inspected target revision `2a7f3eb`, subject to its bounded implementation. |
| Proposed | Complete target syntax/behavior proposed here; runtime and example freeze still required. |
| Research | Proposed operation family with explicitly outstanding method, backend or topology decisions. |

Measurements return plain numbers, booleans, points, intervals or their stated records. Constructors return a Layout or throw. Existing constructor/query exceptions are preserved; the `unsupported` status used by shape changes does not retrofit a result wrapper onto all queries. For new bounded measurements, this reference proposes `RangeError` for valid geometry outside a stated measurement capability, and `RangeError` for nonrepresentable numerical results. This measurement convention needs acceptance before freeze. Validation queries are the exception: they report invalid/unsupported inspected data rather than throwing for that data.

Shape-changing procedures distinguish `ok`, `unchanged`, `unsupported`, `failed` and, for bounded multi-step work, `partial`, through their operation-specific results. There is no universal Result class. Malformed options still throw `TypeError` or `RangeError`. A failed bounded search does not prove no valid subdivision exists.

### Units, precision and budgets

Lengths use caller-declared XY units and areas use their square. No CRS reprojection, display normalization or metre conversion is hidden in a call. Scaling a model requires scaling length constraints and squared-area constraints consistently. Angles are radians unless an existing operation explicitly says otherwise.

Delivered Layout and parcel operations bound coordinate magnitude to `1e6`, rings to 128 positions including closure, total input positions to 8192, and cells/components to 1024. Some existing general planar queries use different admission: the positional `contains` query admits coordinates up to `1e9`, while dataset `bounds` is not subject to the new parcel budget. Those existing limits are not narrowed by this document. New operations propose using the bounded parcel limits until their own measured limits are accepted. Generated geometry must also satisfy its output budget; overflow must not silently truncate cells or rings.

Delivered topology identifies shared vertices/edges using exact binary64-coordinate comparisons and robust predicates, without epsilon snapping. Relative `1e-9` area residual checks belong to split/proposed subdivision validation, not to every distance comparison. Exact predicates do not make newly constructed floating-point intersections exact. A future Boolean backend needs a declared precision policy before freeze; no user tolerance knob or integer quantization is silently introduced.

### Ownership, ordering and randomness

Inputs remain caller-owned and unchanged. Delivered Layouts contain detached deeply frozen snapshots. Query arrays are immutable and may reuse cached references; do not infer a new allocation on every query. New calculated shapes and procedure results are proposed as detached deeply immutable data. Creating a new layout never migrates Grid values or agent membership.

New generated Boolean/procedure output is canonical CCW exterior/CW holes, lexicographically smallest starting vertex, then component order by complete canonical ring sequence, comparing X then Y. Omit the repeated closing position when comparing sequences; a shorter exact prefix comes first. This proposed order does not reorder retained originals or change existing split/merge outputs. Method-specific ties are stated separately. Square-target relaxation preserves source cell ordering rather than re-sorting cells by moved coordinates; see [squareTarget](#topology-relax).

Deterministic operations consume no random numbers. Methods that use randomness accept an explicit `Random` stream and must state draw order before executable examples are frozen. Merely supplying the same seed does not define saved continuation, stable parcel identity or cross-version parity. No callback registry, World or process DSL is needed to customize an ordinary script.

<a id="topology-generation"></a>

## Topology generation

All generation signatures below create detached finite XY layouts. They do not instantiate Fields. Regular generation defaults to unit size, with no wrapping or 20-unit display normalization. A future generator must reject unsupported input before making random draws where its contract promises atomic validation.

<a id="topology-square"></a>

### topology.square

```ts
topology.square(options: {
  columns: number;
  rows: number;
  cellSize?: number;
}): Layout
```

**Delivered.** Generate `columns * rows` equal squares. `cellSize` defaults to 1 and is a positive finite side length. Counts are positive safe integers with product at most 1024. Cells are keyed row-major: `row * columns + column`. Cell `(column,row)` spans `[column*cellSize,(column+1)*cellSize]` and the corresponding Y interval; the layout starts at `(0,0)`.

```ts
const layout = topology.square({ columns: 3, rows: 2, cellSize: 4 });
const area = geometry.area({ shape: layout.polygon({ cell: 0 }) }); // 16
const adjacent = layout.neighbors({ cell: 0 }); // [1, 3]
```

**Behavior and errors.** All cells are hole-free and share exact full edges. Boundary cells simply have fewer neighbors; no periodic edge is added. Invalid option records or unexpected keys throw; invalid dimensions/size or generated coordinates outside supported bounds throw. No RNG is used. The original options remain unchanged.

<a id="topology-hex"></a>

### topology.hex

```ts
topology.hex(options: {
  columns: number;
  rows: number;
  cellRadius?: number;
  orientation?: "pointy" | "flat";
}): Layout
```

**Delivered.** Generate `columns * rows` regular hexagons. Radius is center-to-corner distance, defaults to 1; orientation defaults to `"pointy"`. Counts follow square generation bounds. Keys remain row-major in both orientations; this is an axial parallelogram patch, not a clipped rectangular domain.

For pointy hexagons, center `(column,row)` is `((2*column+row)*sqrt(3)*radius/2, 3*row*radius/2)`. Its first center is `(0,0)`, so vertices may be negative. Flat orientation exchanges the axial directions: center `(column,row)` is `(3*column*radius/2, (2*row+column)*sqrt(3)*radius/2)`. Shared lattice vertices are evaluated identically rather than joined by rounded endpoint keys.

```ts
const pointy = topology.hex({ columns: 2, rows: 2, cellRadius: 3 });
const flat = topology.hex({ columns: 2, rows: 2, cellRadius: 3, orientation: "flat" });
const cells = pointy.cells; // [0, 1, 2, 3]
const area = geometry.area({ shape: flat.polygon({ cell: 0 }) });
// Analytical area: 3 * Math.sqrt(3) * 3 ** 2 / 2.
```

**Behavior and errors.** No wrap, clipping, display normalization or random draws. Radius must be positive finite; unsupported orientation throws `TypeError`. Standard generated-coordinate/ring/total budgets apply. Orientation affects geometry, not the meaning of local cell keys.

<a id="topology-triangle"></a>

### topology.triangle

```ts
topology.triangle(options: {
  columns: number;
  rows: number;
  edgeLength?: number;
}): Layout
```

**Proposed.** Generate an equilateral triangular tiling. `edgeLength` defaults to 1, with the same positive finite/count validation as regular generation. Each triangle has area `sqrt(3)*edgeLength**2/4`. Triangle neighbors share a full edge; corner contact does not establish adjacency.

```ts
const layout = topology.triangle({ columns: 4, rows: 3, edgeLength: 2 });
const areas = layout.cells.map(cell => geometry.area({ shape: layout.polygon({ cell }) }));
// Every area is analytically sqrt(3), within the future numerical check.
```

**Pre-freeze decision.** The catalogue does not yet define whether a counted slot means one triangle or one rhombus containing two triangles, nor its up/down boundary convention. This proposal requires one triangle per slot and therefore `columns * rows` cells, but the exact embedding, first-cell orientation and row offsets must be frozen with a small coordinate fixture before implementation. Do not infer square coordinates or claim a particular neighbor array from this example. No random input is part of this signature.

<a id="topology-trihex"></a>

### topology.trihex

```ts
topology.trihex(options: {
  columns: number;
  rows: number;
  edgeLength?: number;
}): Layout
```

**Research.** Generate a finite patch of the regular triangle/hexagon tiling with common positive finite edge length, default 1. Polygons must meet at conforming full edges; no overlaps or duplicated shared cells may be introduced at repeated motif boundaries.

```ts
const layout = topology.trihex({ columns: 3, rows: 2, edgeLength: 2 });
const sideCounts = layout.cells.map(cell => layout.polygon({ cell }).coordinates[0]!.length - 1);
// The intended output contains triangles and hexagons, not a square-cell mask.
```

**Pre-freeze decision.** Motif meaning, emitted cell count, boundary trimming, orientation, coordinate/key order and partial motifs are not yet specified by the source catalogue. The default edge length is a proposed dimensional default, not evidence that these choices are settled. Freeze exact polygons for one motif and two adjacent motifs before this generator is exported. Total emitted cells, rather than only `columns * rows`, must satisfy the 1024-cell budget. No RNG is required for this regular tiling.

<a id="topology-rectangles"></a>

### topology.rectangles

```ts
topology.rectangles(options: {
  columns: number;
  rows: number;
  cellSize?: number;
  variation?: number;
  random?: Random;
}): Layout
```

**Proposed.** Generate unequal axis-aligned rectangles on shared row/column cuts, preserving full-edge conformity. Counts are positive safe integers with product at most 1024. `cellSize` defaults to 1. This proposal sets `variation` to 0 by default; at zero, geometry and ordering equal `topology.square` and consume no draws. Variation is proposed as a finite value in `[0,1)` controlling cut displacement relative to the nominal spacing.

```ts
const random = Random.add({ seed: 19 });
const layout = topology.rectangles({
  columns: 4, rows: 3, cellSize: 10, variation: 0.2, random,
});
const widths = layout.cells.map(cell => geometry.area({ shape: layout.polygon({ cell }) }));
// Unequal areas are allowed; the cells must not overlap or leave accidental gaps.
```

**Behavior and open decisions.** Shared cuts prevent independently jittered cell corners from creating gaps. Proposed policy: keep the domain `[0,columns*cellSize] × [0,rows*cellSize]` fixed and move only interior cuts. Nonzero variation requires explicit `random`; no hidden global generator is selected. Cut distribution, minimum spacing, draw count and column-before-row ordering must be frozen before replay expectations are executable. Invalid options are validated before draws. Output is row-major with detached geometry. A seed alone does not promise parity with Grid Lab's display-normalized generator.

<a id="topology-voronoi"></a>

### topology.voronoi

```ts
topology.voronoi(options: {
  points: readonly Position[];
  boundary: PlanarPolygon;
}): Layout
```

**Proposed.** Partition a domain by nearest explicit sites using Euclidean XY distance. No random sites are generated. Proposed first scope: a convex hole-free boundary and finite distinct sites strictly inside it; one clipped convex cell per site. The caller's site order determines cell keys. The cells cover the domain within the accepted numerical policy and have disjoint interiors.

```ts
const boundary: PlanarPolygon = {
  type: "Polygon", coordinates: [[[0, 0], [12, 0], [12, 8], [0, 8], [0, 0]]],
};
const layout = topology.voronoi({
  points: [{ x: 3, y: 4 }, { x: 9, y: 4 }], boundary,
});
// Intended boundary between the two cells: x=6, y=0..8.
```

**Behavior and errors.** Empty, duplicate, nonfinite or out-of-domain sites are proposed `RangeError`/`TypeError` cases. No site is silently deduplicated or relocated. A site on the domain boundary is excluded by this first proposed contract. More than 1024 sites or an output beyond position budgets is rejected without partial Layout output. Cocircular ties, computed-vertex sharing and exact generated adjacency require a common-construction policy before freeze; nearest-site floating-point calculations alone do not guarantee conformity. Concave domains/holes may produce disconnected cells and need a separate Layout capability decision. Voronoi belongs only to `topology`, not an alias on `geometry.subdivide`. It guarantees neither road frontage nor buildability.

<a id="topology-quadrilaterals"></a>

### topology.quadrilaterals — finite hex patch

```ts
topology.quadrilaterals(options: {
  rings: number;
  edgeLength?: number;
  random: Random;
}): Layout
```

**Proposed first finite quad generator; not delivered.** Return an unrelaxed immutable Layout from a regular hexagonal patch. `rings` counts triangular-lattice steps from the center to a hex corner, not cells or distance. `edgeLength` is the initial triangle edge length in caller XY units, default 1. The patch is centered at `(0,0)` with fixed orientation, has hex side length `rings * edgeLength`, and starts with `6 * rings²` equal triangles. No display normalization or metre assumption is applied.

```ts
const raw = topology.quadrilaterals({
  rings: 3, edgeLength: 4, random: Random.add({ seed: 7 }),
});
const layout = topology.relax({ layout: raw, method: "squareTarget", iterations: 32 });
const grid = Grid.add({ layout, state: { population: 0 } });
```

Enumerate the lattice deterministically, randomly pair only unused edge-adjacent triangles, then subdivide each paired quad into four quads and each leftover triangle into three. Complete pairing is unnecessary. Every original edge has one shared midpoint; each mixed face has one center. Use construction identities and calculate each shared coordinate once, rather than welding rounded coordinates. The result covers the entire hex domain with conforming hole-free quads. With P pairs and T leftover triangles, the output has `4*P + 3*T` cells. Its analytic area is `3*sqrt(3)/2*(rings*edgeLength)²`.

**Inputs, limits and RNG.** Require a canonical explicit Random, positive safe-integer rings and positive finite edgeLength. A conservative candidate bound is rings 1..7: before pairing there can be at most `18*rings²` output quads, hence at most 882. This bound, orientation, enumeration and exact stream consumption must be recorded before example freeze; it is not a recovered Townscaper constant. All geometry must also fit existing Layout position/coordinate budgets. Validate admission before consuming the stream. Freeze the shuffle, candidate order and partner-choice draws, including the no-candidate case. Pairing is the only random step; refinement and square-target relaxation consume no RNG. An advanced supplied stream intentionally changes generation. No automatic seed hashing or cross-version replay guarantee is added.

**Boundary and errors.** This overload has no arbitrary boundary or built-in relaxation options. Mixed overload keys, invalid limits/stream or unrepresentable construction throw before publishing a Layout. Do not silently clip the hex: clipping quads can produce other polygon kinds or destroy coverage. A later validity failure publishes no partial Layout; RNG already consumed by attempted pairing is not implicitly rolled back. Exact failures after drawing and their continuation expectations must be included in the freeze fixtures. The [arbitrary-boundary overload](#topology-quadrilaterals-boundary) remains separate research.

The generated all-quad network is the module-side geometric substrate. Townscaper's player network is its dual and can contain non-quads; `Grid.add` attaches ordinary model state to this Layout and does not silently dualize it. See [Townscaper research](TOWNSCAPER.md) and the [square-target contract](#topology-relax).

<a id="topology-quadrilaterals-boundary"></a>

### topology.quadrilaterals — arbitrary boundary research

```ts
topology.quadrilaterals(options: {
  boundary: PlanarPolygon;
  pointSpacing: number;
  relaxationIterations?: number;
  random?: Random;
}): Layout
```

**Deferred research.** Generate irregular quadrilaterals within a declared boundary. This older sketch is not the finite Townscaper-style overload and is not silently reinterpreted by it. Compatibility preserves this research signature; no placeholder export is required. `pointSpacing` is a positive finite target sampling distance, not a promised exact edge length or guaranteed cell count. Proposed `relaxationIterations` default is 0 and accepts nonnegative safe integers. The procedure must preserve shared vertices and produce simple nonoverlapping conforming quads, or reject the unsupported request without a misleading Layout.

```ts
const layout = topology.quadrilaterals({
  boundary, pointSpacing: 8, relaxationIterations: 4,
  random: Random.add({ seed: 7 }),
});
// Cell state is still added separately with Grid.add({ layout, state }).
```

**Pre-freeze decisions.** Sampling, triangle pairing, treatment of unmatched boundary triangles, boundary clipping, stopping/work limits and supported boundary shapes are unresolved. A clipped quad may cease to be a quad; the final contract must either retain only supported quads with explicit domain coverage semantics or broaden the operation name/capability through a recorded decision. No universal all-quad coverage is claimed. Randomized sampling requires an explicit stream and draw-order contract; deterministic special cases must make no incidental draws. Do not silently reuse a fixed 20-unit source normalization or its local editor bounds.

<a id="topology-from-polygons"></a>

### topology.fromPolygons

```ts
topology.fromPolygons(options: {
  polygons: readonly PlanarPolygon[];
}): Layout
```

**Delivered.** Import 1..1024 authored polygons in caller order, assigning consecutive numeric keys. Inputs are fully validated, detached and frozen. Each cell is simple and hole-free. Cells may be concave, separated, share a point or share complete edges, but their interiors must not overlap. Either winding is accepted. No global connectedness or complete domain coverage is implied.

```ts
const layout = topology.fromPolygons({ polygons: [block] });
const snapshot = layout.polygon({ cell: 0 });
const sameArea = geometry.area({ shape: snapshot }); // 96
```

**Behavior and errors.** Rejects holes, duplicate interiors, crossed edges, partial-edge contacts, T-junctions, same-side shared interiors and nonmanifold edges. These valid-but-unsupported topology cases throw `RangeError`; they are not shape-change status records. The caller must normalize partial shared edges explicitly before importing future asymmetric recursive subdivision results. No implicit snapping, merge, split, random draws or state migration occurs. The finite quad generator constructs shared vertices once; squareTarget does not expand this importer to accept T-junctions or nonconforming parcel subdivisions. Budgets cover all rings and all input polygons before pairwise validation.

<a id="topology-relax"></a>

### topology.relax — squareTarget

```ts
topology.relax(options: {
  layout: Layout;
  method: "squareTarget";
  iterations: number;
}): Layout
```

**Proposed finite method; not delivered.** Return a new deeply immutable Layout after a specified number of synchronous square-target steps. Support canonical conforming Layouts whose cells are strictly convex quads with four distinct corners. This includes suitable authored grids, not just the new generator. Require a nonnegative safe-integer iteration count. A practical iteration cap, fixed internal step scale, bounded step-halving count and numerical admission rules must be fixed in the public examples before runtime. The demonstrated original 256 steps are evidence of a run, not an accepted library default. There is no random, jitter or separate relaxationIterations option.

```ts
const revised = topology.relax({ layout: raw, method: "squareTarget", iterations: 32 });
const after = Grid.add({ layout: revised, state: { population: 0 } });
// Existing Grid/Field state remains on its original Layout until explicitly copied.
```

For CCW corners p₀..p₃, use the proposed center `c = (p₀+p₁+p₂+p₃)/4`. Rotate the four vectors `pᵢ-c` by `-i*pi/2`, average them into u, and construct target corner `c + R(i*pi/2)*u`. Accumulate incident-quad target-minus-current forces at each shared vertex, using positions from the previous iteration only, then publish the next positions together. Choose one documented internal scale bounded by incident valence during fixture freeze. This is square-target relaxation, not Laplacian neighbor averaging or Lloyd's Voronoi-site movement. Exact squares, including rotated squares, are a fixed point under the proposed rule.

**Validity and boundary.** Pin every finite domain boundary vertex. Every accepted step must retain strictly convex positive-area quads, shared endpoints/full edges, disjoint interiors, no crossings and complete domain coverage. Checking signed area alone is insufficient; validate overlaps too. Propose bounded deterministic global step-halving for an invalid candidate step. If no admissible step is found, throw RangeError and publish no result, rather than returning a partially completed run as success. Invalid options throw TypeError/RangeError; non-quad, concave or unsupported Layout geometry throws RangeError under the constructor/query convention. Validate capability even for zero iterations. No input or RNG is modified.

**Revisions and state.** Preserve cell ordering, local keys and incidence as an explicit source-to-output correspondence. Return a new immutable Layout even for zero iterations; old query results remain unchanged. Geometry and `cellAt` outcomes can change; neighbor ordering and lowest-key boundary ties retain their existing rules. Do not sort cells again by their moved coordinates: preserved ordering is a method-specific exception to generated-output canonical sorting. Corresponding numeric keys are still revision-local, not persistent geographic IDs. Constructing a new Grid creates new Fields and transfers nothing automatically.

```ts
const before = Grid.add({ layout: raw, state: { population: 0 } });
before.fields[0]!.population = 12;
const revised = topology.relax({ layout: raw, method: "squareTarget", iterations: 0 });
const after = Grid.add({ layout: revised, state: { population: 0 } });
for (const cell of raw.cells) after.fields[cell]!.population = before.fields[cell]!.population;
// This is explicit population-copy policy; density or Agents need their own policy.
```

The operation exposes neither a new mesh/halfedge framework nor public dual topology. Cyclic vertex/edge/face incidence can remain concrete internal data until a caller needs a dual mapping. Fixed boundaries do not implement seamless chunks. The [Lloyd research method](#topology-relax-lloyd) keeps its own provenance requirements and is not renamed or implemented by squareTarget.

<a id="topology-relax-lloyd"></a>

### topology.relax — Lloyd research

```ts
topology.relax(options: {
  layout: Layout;
  method: "lloyd";
  iterations: number;
}): Layout
```

**Research.** Return a new relaxed layout without changing the source. This separately deferred named method is Lloyd relaxation; this exact method discriminator extends the source catalogue's unspecified `method` and requires acceptance. Iterations is a nonnegative safe integer with no implied convergence guarantee. Zero iterations proposes an equivalent detached immutable Layout with the same local order, not a mutable alias.

```ts
const relaxed = topology.relax({ layout, method: "lloyd", iterations: 3 });
// Keep any Grid state on the original layout until an explicit transfer is chosen.
```

**Pre-freeze decisions.** Lloyd relaxation needs a domain and generating-site interpretation that the current Layout does not expose. The final slice must either restrict this call to canonical Voronoi layouts retaining that provenance, or explicitly revise the signature to provide the domain/sites. Arbitrary imported/square layouts must not be treated as hidden Voronoi data. Boundary treatment, empty-cell handling, site relocation, identity mapping and iteration caps remain open. Output keys cannot promise persistent geographic meaning after relaxation. This signature is therefore a research target, not an implementable promise for every Layout.

<a id="topology-validate"></a>

### topology.validate

```ts
topology.validate(options: { layout: Layout }): ValidationResult
```

**Proposed.** Check canonical Layout geometry, relationships and budgets without mutation or rebuilding state. `valid` means the inspected cell shapes and relationships satisfy topology invariants. `supported` means they fit the declared finite conforming Layout capability; it is false when `valid` is false or null. A null validity means a resource limit prevented establishing validity, not that the geometry was proven invalid. Validity does not imply connectedness or coverage of an unstated external domain.

```ts
const report = topology.validate({ layout: topology.square({ columns: 2, rows: 2 }) });
// Proposed: { valid: true, supported: true, diagnostics: [] }.
```

**Behavior and errors.** Invalid option records throw. Noncanonical records pretending to be Layouts are rejected with `TypeError`, rather than invoking untrusted methods. For canonical immutable layouts the normal result is valid/supported; this method primarily supplies explicit verification/reporting and must not pretend it accepts arbitrary serialized topology. Diagnostic code vocabulary and exact work-budget behavior are pre-freeze choices. It consumes no RNG and preserves keys and references.

<a id="layout-queries"></a>

## Layout queries

The following queries are delivered and do not modify any data. Unknown/noninteger keys throw `RangeError`; malformed option objects throw. Results refer only to the receiver Layout.

<a id="layout-cells"></a>

### layout.cells

```ts
layout.cells: readonly number[]
```

Read ascending local keys, from zero through one less than the cell count. The immutable array may be reused between reads. It contains no Field objects.

```ts
const layout = topology.square({ columns: 2, rows: 2 });
const keys = layout.cells; // [0, 1, 2, 3]
```

<a id="layout-polygon"></a>

### layout.polygon

```ts
layout.polygon(options: { cell: number }): PlanarPolygon
```

Read the cell's immutable polygon snapshot, preserving imported ring coordinates and winding. The method does not compute an envelope, inset or centroid. Repeated calls may return the same reference.

```ts
const shape = layout.polygon({ cell: 0 });
const area = geometry.area({ shape });
```

<a id="layout-neighbors"></a>

### layout.neighbors

```ts
layout.neighbors(options: { cell: number }): readonly number[]
```

Read ascending unique neighbor keys sharing positive-length complete edges. The cell itself is omitted. Point-only contact is not adjacency; neither Euclidean proximity nor graph access adds neighbors. Boundary cells have fewer neighbors, with no wrap.

```ts
const layout = topology.square({ columns: 2, rows: 2 });
const neighbors = layout.neighbors({ cell: 0 }); // [1, 2], not diagonal cell 3
```

<a id="layout-cell-at"></a>

### layout.cellAt

```ts
layout.cellAt(options: { position: Position }): number | undefined
```

Locate a planar point using actual cell polygons. Boundary points count as contained; if several cells contain a boundary point, the lowest numeric key wins. A point outside all polygons returns undefined. No nearest-cell extrapolation occurs.

```ts
const layout = topology.square({ columns: 2, rows: 1 });
layout.cellAt({ position: { x: 1, y: 0.5 } }); // 0: shared-edge tie
layout.cellAt({ position: { x: 3, y: 0.5 } }); // undefined
```

**Errors.** Nonfinite/malformed or unsupported-dimensional positions throw. Coordinate magnitude beyond `1e6` throws, even when the point would simply be outside the layout. This bound differs from the existing positional geometry.contains query.

<a id="layout-shared-boundary"></a>

### layout.sharedBoundary

```ts
layout.sharedBoundary(options: {
  firstCell: number;
  secondCell: number;
}): readonly BoundarySegment[]
```

Read the actual shared complete segments, ordered and directed by traversal of the first cell's ring. Swapping the cells can change segment direction/order. Self-pairs, disjoint pairs and point-only contacts return an empty immutable array; unknown keys still throw. Multiple full edges are retained rather than collapsed to a fictitious straight segment.

```ts
const layout = topology.square({ columns: 2, rows: 1 });
const segments = layout.sharedBoundary({ firstCell: 0, secondCell: 1 });
// [[[1, 0], [1, 1]]]
```

<a id="geometry-measurements"></a>

## Geometry measurements

Examples below use this fixture unless they define another shape:

```ts
const rectangle: PlanarPolygon = {
  type: "Polygon",
  coordinates: [[[0, 0], [12, 0], [12, 8], [0, 8], [0, 0]]],
};
```

A plain measurement does not transfer ownership, alter the polygon or establish planning/buildability quality. No RNG is used.

<a id="geometry-validate"></a>

### geometry.validate

```ts
geometry.validate(options: { shape: unknown }): ValidationResult
```

**Proposed.** Inspect unknown input as a bounded Polygon/MultiPolygon. An invalid shape yields `valid: false, supported: false` with diagnostics. Valid geometry beyond this validator's bounded capability yields `valid: true, supported: false` only if its validity has actually been established; a budget stop cannot claim validity it did not check. The proposed resource-limit result is therefore `valid: null, supported: false`, with a diagnostic explaining which check was not completed. Null is an explicit unverified state, distinct from false for proven invalid input.

```ts
const closed = geometry.validate({ shape: rectangle });
const open = geometry.validate({
  shape: { type: "Polygon", coordinates: [[[0, 0], [1, 0], [0, 1]]] },
});
// Proposed: closed.valid is true; open.valid is false (ring is not closed).
```

**Behavior and errors.** Input geometry errors are reported, not thrown, because validation is the task. Malformed options still throw. Diagnostics must distinguish invalid geometry, unsupported type/capability and validation resource limits. It does not repair data or test every future method's eligibility; a valid holed polygon may still be unsupported by convex subdivision. Diagnostic codes and the proposed three-state validity result need acceptance before freeze.

<a id="geometry-area"></a>

### geometry.area

```ts
geometry.area(options: { shape: ParcelShape }): number
```

**Delivered.** Return net area independent of winding. Subtract each Polygon's holes from its exterior; add MultiPolygon component areas. Components are not Boolean-unioned or deduplicated, so overlapping components are counted separately. For the intended disjoint parcel-set invariant, overlap must be checked separately.

```ts
geometry.area({ shape: rectangle }); // 96
geometry.area({ shape: courtyard }); // 80
```

**Behavior and errors.** Supports valid concave Polygon rings and holes within parcel bounds. Rejects empty MultiPolygon input, nonpositive/nonfinite representable polygon area, invalid rings, wrong geometry types and exceeded budgets. Returns squared XY units; no centroid or terrain/surface area is implied. This is planar area, not a roof area or an Earth-surface calculation.

<a id="geometry-perimeter"></a>

### geometry.perimeter

```ts
geometry.perimeter(options: {
  shape: ParcelShape;
  includeHoleBoundaries?: boolean;
}): number
```

**Proposed.** Return the sum of Euclidean boundary-edge lengths, including each closing edge once. `includeHoleBoundaries` defaults to true. MultiPolygon components add; internal boundaries between touching components are not automatically removed.

```ts
geometry.perimeter({ shape: rectangle }); // 40
geometry.perimeter({ shape: courtyard }); // 56: exterior 40 + hole 16
geometry.perimeter({ shape: courtyard, includeHoleBoundaries: false }); // 40
```

**Behavior and errors.** Supports valid simple polygons, holes and components under parcel bounds. No simplification or union precedes measurement. Invalid geometry/options or length overflow throws; the proposed default and complete supported scope need executable examples before export. Perimeter is a geometric length, not automatically road frontage.

<a id="geometry-bounds"></a>

### geometry.bounds — dataset query

```ts
geometry.bounds(input: PlanarDataset | readonly PlanarFeature[]): Bounds | undefined
```

**Delivered.** Read axis-aligned extent across supported feature geometries. Return `[minX,maxX,minY,maxY]`, or undefined when no position occurs. This positional dataset signature remains available when the future shape overload is added. It does not require parcel coordinate budgets or a declared CRS conversion.

```ts
import type { PlanarFeature } from "city-library";

const features: readonly PlanarFeature[] = [{
  type: "Feature", geometry: rectangle, properties: null,
}];
geometry.bounds(features); // [0, 12, 0, 8]
geometry.bounds([]); // undefined
```

**Behavior and errors.** Null feature geometry is skipped. Point, MultiPoint, LineString, MultiLineString, Polygon, MultiPolygon and acyclic GeometryCollection contribute their coordinates. Polygon boundaries are validated; holes contribute positions but remain inside valid exteriors. Cyclic GeometryCollections and malformed geometries throw. Dataset metadata is not transformed. The returned tuple is frozen; it is not `[minX,minY,maxX,maxY]`.

<a id="geometry-bounds-shape"></a>

### geometry.bounds — shape overload

```ts
geometry.bounds(options: { shape: ParcelShape }): Bounds
```

**Proposed overload.** Return a nonempty bounded Polygon/MultiPolygon's axis-aligned extent using the existing tuple order. Exterior and hole vertices are considered without interpreting them as a union.

```ts
geometry.bounds({ shape: rectangle }); // [0, 12, 0, 8]
```

**Behavior and errors.** Valid bounded shape input is required, so unlike an empty dataset this overload never returns undefined. Invalid/empty geometry or exceeded parcel budgets throws. Dispatch is by the explicit `shape` options form; existing feature-array/dataset calls and their accepted validation remain unchanged. No implicit cast of a polygon to a dataset is required.

<a id="geometry-oriented-bounds"></a>

### geometry.orientedBounds

```ts
geometry.orientedBounds(options: { shape: PlanarPolygon }): OrientedBounds
```

**Proposed.** Find a minimum-area edge-aligned oriented rectangle. First capability: convex, hole-free simple polygons. Return canonical rectangle `shape`, center object, width/height and undirected angle in `[0,pi)`. Width is along the selected axis; height is perpendicular. Proposed selection compares candidate area, then normalized angle, then canonical edge coordinates. For equal side lengths use the smaller normalized axis angle.

```ts
const box = geometry.orientedBounds({ shape: rectangle });
// Intended: center { x: 6, y: 4 }, width 12, height 8, angle 0.
// geometry.area({ shape: box.shape }) is 96.
```

**Behavior and errors.** Input winding does not select a different box. Returned rectangle is a detached polygon, not a reference to the input even if identical in extent. Concavity/holes are valid-but-unsupported first-scope inputs and raise the proposed query `RangeError`; they must not silently use their convex hull under this initial scope. Candidate tie/float comparison details require a rotated-square fixture before freeze. This finds an enclosing box, not an inscribed building footprint.

<a id="geometry-centroid"></a>

### geometry.centroid

```ts
geometry.centroid(options: { shape: ParcelShape }): Position
```

**Proposed.** Return the area-weighted planar centroid. Hole area contributes negatively; MultiPolygon components contribute by net area. The returned object has x/y and no z. It is a detached immutable observation.

```ts
geometry.centroid({ shape: rectangle }); // { x: 6, y: 4 }
geometry.centroid({ shape: courtyard }); // { x: 6, y: 4 }, inside the hole
```

**Behavior and errors.** A centroid can lie outside a concave polygon, inside a hole, or between disconnected components. This is not an interior point or an agent-placement guarantee. Valid positive finite net area and representable moments are required; invalid shapes, exceeded budgets or nonfinite calculations throw. Component overlap is not implicitly unioned. No random draws or shape mutation occur.

<a id="geometry-interior-point"></a>

### geometry.interiorPoint

```ts
geometry.interiorPoint(options: { shape: ParcelShape }): Position
```

**Proposed.** Return one point strictly inside the net region, excluding every boundary and hole. Unlike centroid, it is intended for valid placement inside some component. Proposed deterministic rule: choose the largest net-area component, tie by canonical geometry, and use a validated interior-triangle centroid from deterministic triangulation; if that candidate is not strictly inside due to numerical construction, report a numerical `RangeError` rather than returning an unchecked boundary point.

```ts
const point = geometry.interiorPoint({ shape: courtyard });
const inside = geometry.contains(courtyard, point, { boundary: "exclude" }); // true
```

**Pre-freeze decisions.** The exact triangulation/selection order and backend are not accepted. The first implementation must freeze them, including holes, thin regions and reversed winding. A deterministic but different point after backend changes is an observable contract change if exact coordinates were frozen. There is no largest-inscribed-circle, maximum-clearance, entrance or accessible-network guarantee. Invalid/unsupported/failed measurement cases follow the proposed plain-query error convention.

<a id="geometry-minimum-width"></a>

### geometry.minimumWidth

```ts
geometry.minimumWidth(options: { shape: PlanarPolygon }): number
```

**Proposed.** Return the minimum separation of parallel supporting lines enclosing the shape. First scope: convex hole-free simple polygons. Evaluate supporting edge directions; return a nonnegative finite length. It is not minimum local neck width, depth everywhere, or the width of a buildable rectangle.

```ts
geometry.minimumWidth({ shape: rectangle }); // 8
```

**Behavior and errors.** Winding and translation do not change the mathematical result. Concavity/holes are outside the initial capability and raise proposed query `RangeError`; any later convex-hull interpretation must be explicit. Input is never inset or repaired. A sharp triangle can pass this guard while retaining a tip unsuitable for a requested building. Invalid geometry, exceeded budgets and nonrepresentable results throw.

<a id="geometry-compactness"></a>

### geometry.compactness

```ts
geometry.compactness(options: { shape: PlanarPolygon }): number
```

**Proposed.** Return the dimensionless isoperimetric quotient `4*pi*netArea/perimeter**2`, using all hole boundaries in the perimeter. Scope is one valid bounded Polygon, including concavity and holes. The mathematical value lies in `(0,1]`; a circle is the limiting ideal and finite polygons have lower values. Do not clamp a materially invalid value to hide numerical failure.

```ts
const compactness = geometry.compactness({ shape: rectangle });
// Analytical value: 4 * Math.PI * 96 / 40 ** 2, about 0.754.
```

**Behavior and errors.** Translation/rotation/uniform scale do not change the mathematical measure. Irregular boundary or holes reduce this quotient, but it is not a general quality, building suitability or planning compliance score. Multicomponent aggregation is excluded from this first signature rather than mixing disconnectedness into an unexplained number. Invalid geometry or nonfinite calculations throw. Formula and hole-boundary convention are proposed decisions needing acceptance.

<a id="geometry-contains"></a>

### geometry.contains — positional polygon query

```ts
geometry.contains(
  shape: PlanarPolygon,
  position: { x: number; y: number },
  options?: { boundary?: "include" | "exclude" },
): boolean
```

**Delivered.** Test membership in the net Polygon. `boundary` defaults to `"include"`. Hole interiors are excluded; a point on either exterior or hole boundary follows the selected boundary policy.

```ts
geometry.contains(rectangle, { x: 0, y: 4 }); // true
geometry.contains(rectangle, { x: 0, y: 4 }, { boundary: "exclude" }); // false
geometry.contains(courtyard, { x: 6, y: 4 }); // false
```

**Behavior and errors.** The complete polygon is validated on each call; no stale index is retained across caller mutation. Query magnitude greater than `1e9` throws. The existing polygon/query budgets are distinct from bounded parcel generation. Invalid shape/query/options or unsupported boundary strings throw. This is exact planar membership under the existing predicate semantics, not nearest-cell lookup, geographic geodesic membership or legal accessibility.

<a id="geometry-contains-shape"></a>

### geometry.contains — object overload

```ts
geometry.contains(options: {
  shape: ParcelShape;
  position: Position;
  boundary?: "include" | "exclude";
}): boolean
```

**Proposed overload.** Add explicit flat options and MultiPolygon support without replacing the positional Polygon form. Boundary defaults to include; any containing component yields true, using each component's holes. For touching components the predicate follows membership in the stated component set, not a hidden repaired Boolean union.

```ts
geometry.contains({ shape: courtyard, position: { x: 4, y: 4 }, boundary: "exclude" });
// false: a point on the hole boundary.
```

**Behavior and errors.** Proposed object-form input follows bounded parcel coordinates and budgets; the positional call keeps its current broader admission. Validate all input components rather than returning early before discovering malformed later components. Invalid shapes/options/query positions throw. Do not infer this overload exists from the delivered positional function.

<a id="geometry-contact"></a>

### geometry.contact

```ts
geometry.contact(options: {
  firstShape: ParcelShape;
  secondShape: ParcelShape;
}): ShapeContact
```

**Proposed.** Classify net-region contact with precedence `area` over `edge` over `point` over `disjoint`. Positive-area intersection is `area`; otherwise positive-length shared boundary is `edge`; otherwise one or more shared points are `point`. Holes are excluded net regions. The classification is symmetric and says nothing about network connectivity.

```ts
const left: PlanarPolygon = {
  type: "Polygon", coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]],
};
const right: PlanarPolygon = {
  type: "Polygon", coordinates: [[[1, 0], [2, 0], [2, 1], [1, 1], [1, 0]]],
};
geometry.contact({ firstShape: left, secondShape: right }); // "edge"
```

**Behavior and errors.** Proposed full scope includes nonconforming boundary intervals and valid concavity/holes, unlike Layout import. It needs verified intersection predicates; a bounding-box overlap test is insufficient. Invalid data throws, and numerical/capability failure must not be returned as disjoint. Dependency and precision policy must be accepted before export. This returns a category, not intersection geometry, area, contact length or entrance.

<a id="geometry-shared-boundary"></a>

### geometry.sharedBoundary

```ts
geometry.sharedBoundary(options: {
  firstShape: ParcelShape;
  secondShape: ParcelShape;
}): readonly BoundarySegment[]
```

**Proposed.** Return positive-length intervals lying on both shapes' boundaries. Point contacts are omitted. Collinear overlaps are split/merged into unique maximal intervals, directed and ordered by canonical boundary traversal of the first shape. Swapping shapes may reverse direction/order while preserving the measured boundary set.

```ts
const segments = geometry.sharedBoundary({ firstShape: left, secondShape: right });
// Intended interval: [[1, 0], [1, 1]].
```

**Behavior and errors.** Supports partial-edge overlap without requiring equal input edge endpoints. Hole boundaries participate because they are boundaries of the net regions. Coincident boundary intervals may exist even if other parts overlap in area; use `contact` to classify the full relation separately. Output is detached and immutable. Empty contact returns `[]`; invalid data or a numerical inability to classify throws. No topology mutation, tolerance snapping, legal-access inference or field-state transfer occurs.

<a id="geometry-boundary-overlap"></a>

### geometry.boundaryOverlap

```ts
geometry.boundaryOverlap(options: {
  shape: PlanarPolygon;
  boundarySegments: readonly LabelledBoundarySegment[];
}): BoundaryOverlap
```

**Proposed.** Intersect labelled segments with the polygon's actual boundaries. Return clipped labelled intervals and the length of their geometric union across all IDs. Point contact contributes zero. Same-ID duplicates/overlaps are merged. Different IDs may both label the same interval; their record lengths must not be blindly summed because `.length` counts that interval only once.

```ts
const contact = geometry.boundaryOverlap({
  shape: rectangle,
  boundarySegments: [
    { id: "south", segment: [[0, 0], [12, 0]] },
    { id: "also-south", segment: [[6, 0], [12, 0]] },
  ],
});
// Intended contact.length: 12, not 18.
```

**Behavior and errors.** Irrelevant segments contribute nothing. Labels need not cover a complete polygon edge; clip partial intervals and split where labels change. Proposed ID admission is a nonempty string; endpoints are finite, distinct XY tuples under parcel bounds. Invalid/nonfinite/zero-length segments throw. Returned records follow polygon boundary traversal, then label ID; the exact canonical traversal for newly calculated measurements must be frozen consistently with the shared ordering rule. Hole boundaries participate only when the caller supplies overlapping labels; they are never automatically roads.

A positive result proves geometric frontage only. It does not require one contiguous entrance, establish road connectivity, distinguish bridges in 2D, certify legal access or permit vehicle entry. Subdivision inherits clipped source labels and never labels a new internal cut automatically. See the subdivision contract for `minimumFrontage` and remaining-area accounting.


<a id="geometry-changes"></a>

## Geometry changes

`merge` and `split` below describe their delivered bounded implementations at `2a7f3eb`. The other changes are proposed target contracts. Every operation works without World, Agent, Grid or rendering. A changed polygon never moves Field values or Agent membership. Plain input data remains caller-owned; returned geometry is detached and deeply immutable.

Examples in this section reuse this local-unit fixture unless they define another:

```ts
import { geometry, topology, Grid, type PlanarPolygon } from "city-library";

const shape: PlanarPolygon = {
  type: "Polygon",
  coordinates: [[[0, 0], [12, 0], [12, 8], [0, 8], [0, 0]]],
};
```

<a id="geometry-merge-shapes"></a>

### geometry.merge — shapes

**Delivered, bounded.**

```ts
geometry.merge(options: { shapes: readonly PlanarPolygon[] }): MergeResult

type MergeResult =
  | { readonly status: "ok"; readonly shape: PlanarPolygon;
      readonly sourceCells: readonly number[] }
  | { readonly status: "unsupported" | "failed";
      readonly remainingShapes: readonly PlanarPolygon[];
      readonly sourceCells: readonly number[];
      readonly diagnostics: readonly string[] };
```

Remove full shared edges from nonoverlapping, conforming, hole-free polygons to produce one connected simple ring. This is not an arbitrary polygon-union solver. `shapes` is required and nonempty; no default geometry is generated.

```ts
const layout = topology.square({ columns: 2, rows: 1 });
const merged = geometry.merge({
  shapes: layout.cells.map(cell => layout.polygon({ cell })),
});
if (merged.status === "ok") {
  console.log(geometry.area({ shape: merged.shape })); // 2
  console.log(merged.sourceCells); // []: raw polygons have no layout-cell provenance
}
```

**Behavior and errors**

Input order determines edge traversal and output start; do not apply the new subdivision canonical ordering retroactively. Either source winding is accepted. Success has no `diagnostics` member. Failure retains every detached source polygon and diagnostics. Disconnected unions, holes, area overlaps, partial-edge contacts and branched point-contact boundaries return `unsupported`; representational/numerical failures return `failed`. Invalid polygons, an empty array, mixed overload keys or exceeded input budgets throw before work. At most 1,024 shapes and 8,192 total positions are accepted, and each ring has at most 128 closure-inclusive positions with coordinate magnitude at most 1e6. A merged ring exceeding 128 positions is unsupported. Relative area residual must not exceed input area × 1e-9. No input is modified and no random draw occurs.

<a id="geometry-merge-cells"></a>

### geometry.merge — layout cells

**Delivered, bounded.**

```ts
geometry.merge(options: { layout: Layout; cells: readonly number[] }): MergeResult
```

Merge selected cells under the same geometry restrictions. `cells` is required, nonempty, contains unique valid local layout keys, and retains caller order in `sourceCells` on both success and failure.

```ts
const layout = topology.square({ columns: 3, rows: 1 });
const result = geometry.merge({ layout, cells: [1, 0] });
console.log(result.sourceCells); // [1, 0]
```

The Layout is unchanged. Its cell keys describe one immutable revision, not persistent parcel identities. Unknown keys, duplicates or mixed `shapes`/`layout` options throw. Input and output limits match the shapes overload. The result does not contain a new Layout or transfer Field state.

<a id="proposed-shape-change-result"></a>

### Proposed polygon-change results

`intersection`, `subtract`, `clip` and `offset` use the following proposed local reference type. It describes shared output structure; it does not add a universal Result wrapper to existing operations or rename existing `SplitResult`/`MergeResult`.

```ts
type ShapeChange =
  | { readonly status: "ok" | "unchanged";
      readonly parts: readonly PlanarPolygon[];
      readonly diagnostics: readonly string[] }
  | { readonly status: "unsupported" | "failed";
      readonly remainingShapes: readonly PlanarPolygon[];
      readonly diagnostics: readonly string[] };
```

On successful empty output, `status` is `ok` and `parts` is `[]`. `unchanged` means the requested operation made no geometric change; it returns a detached original in `parts`. An unsupported or numerical-failure result returns all relevant unchanged input geometry in `remainingShapes`, never a partially trusted computation. Boolean results may contain disconnected components and holes. Generated components use the canonical order in the shared contracts; retained originals preserve their original coordinate order.

Malformed geometry/options throw TypeError or RangeError. Valid shapes outside a selected implementation's advertised capability return `unsupported`. Exact backend, robustness fixtures and output-complexity limits must be frozen before these planned exports are delivered. Unless explicitly revised through that gate, keep the current coordinate/position bounds. Inputs exceeding the input bounds throw; a representable valid result exceeding output support returns `unsupported` with originals retained. These operations have no Random option.

<a id="geometry-intersection"></a>

### geometry.intersection

**Proposed; robust Boolean implementation pending.**

```ts
geometry.intersection(options: {
  firstShape: PlanarPolygon;
  secondShape: PlanarPolygon;
}): ShapeChange
```

Return the positive-area overlap of two polygons. Both arguments are required. Boundary-only point or line contacts produce no polygon parts. Components and holes must be preserved; do not return a bounding box or fill a hole.

```ts
const secondShape: PlanarPolygon = {
  type: "Polygon",
  coordinates: [[[6, 0], [14, 0], [14, 8], [6, 8], [6, 0]]],
};
const overlap = geometry.intersection({ firstShape: shape, secondShape });
if (overlap.status === "ok" || overlap.status === "unchanged") {
  console.log(overlap.parts.reduce((sum, part) => sum + geometry.area({ shape: part }), 0)); // 48
}
```

`unchanged` applies when the overlap equals `firstShape`. Unsupported/failed results retain both input polygons in argument order. Area conservation here means correct set intersection, not preservation of the sum of operand areas. Output must be contained in both inputs; area alone does not prove that. No state or source-label propagation is inferred.

<a id="geometry-subtract"></a>

### geometry.subtract

**Proposed; robust Boolean implementation pending.**

```ts
geometry.subtract(options: {
  shape: PlanarPolygon;
  excludedShapes: readonly PlanarPolygon[];
}): ShapeChange
```

Subtract the union of all exclusions from one shape. `excludedShapes` is required; an empty list returns `unchanged` with the detached original. Overlapping exclusions are subtracted once. Exclusion outside the domain has no effect. Full exclusion returns `ok` with no parts. Failure retains the original land shape, not a land-minus-some-exclusions partial result; exclusions remain caller-owned inputs.

```ts
const road: PlanarPolygon = {
  type: "Polygon",
  coordinates: [[[5, 0], [7, 0], [7, 8], [5, 8], [5, 0]]],
};
const land = geometry.subtract({ shape, excludedShapes: [road] });
if (land.status === "ok" || land.status === "unchanged") {
  console.log(land.parts.map(part => geometry.area({ shape: part }))); // [40, 40]
}
```

A fully internal exclusion creates a hole; an exclusion cutting across the domain can create disconnected land components. Both are necessary before describing this as general block extraction. The first OBB method may still reject those blocks as unsupported. The operation does not establish which surviving edges face an eligible street; use labelled intervals and `boundaryOverlap`. Bridges, legal access and travel reachability are outside this 2D set operation. A cap of 1,024 exclusion polygons and the shared total-position bound are proposed input limits.

<a id="geometry-clip"></a>

### geometry.clip

**Proposed.**

```ts
geometry.clip(options: {
  shape: PlanarPolygon;
  boundary: PlanarPolygon;
}): ShapeChange
```

Restrict a shape to a polygonal domain. Both arguments are required; no implicit world bounds are used. Geometrically this is intersection with an explicitly named domain. Empty output is valid. Unchanged output retains a detached shape; unsupported/failed output retains `shape`, while `boundary` remains caller data.

```ts
const clipped = geometry.clip({ shape, boundary: shape });
// Proposed expectation: unchanged, with one detached copy of shape.
```

Initial implementation may advertise only convex, hole-free inputs if the public example set freezes that restriction. A future general implementation must retain holes/components. Do not imply general clipping from the existing convex `split`. Backend support and precision decisions remain the same pre-freeze requirements as intersection.

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

interface SplitResult {
  readonly status: "ok" | "unchanged" | "unsupported" | "failed";
  readonly parts: readonly PlanarPolygon[];
  readonly diagnostics: readonly string[];
}
```

Cut with the infinite line through `point` in `direction`. Direction magnitude is irrelevant; XY components must define a finite nonzero vector. A finite line segment is not implied. `minimumArea` defaults to 0 and must be finite and nonnegative.

```ts
const cut = geometry.split({
  shape, point: { x: 6, y: 0 }, direction: { x: 0, y: 1 },
  minimumArea: 40,
});
console.log(cut.status); // ok
console.log(cut.parts.map(part => geometry.area({ shape: part }))); // [48, 48]
```

A line missing the interior or a candidate failing positive-area/minimum-area guards returns `unchanged` with the detached original. Valid concavity or holes return `unsupported` with the original. Numerical construction, support-bound or conservation failures return `failed` with the original. Unlike proposed subdivision, the retained original is in `parts`, not `remainingParts`. Success orders the nonnegative signed-cross-product side first, then the nonpositive side, using the supplied direction; reversing direction can reverse part order. Input winding is retained by the construction. Do not retrofit canonical subdivision ordering.

The same shape/ring bounds apply. Split point magnitude is at most 1e6. Direction accepts XY only and omitted supported vector components mean zero. Strict child-area guards apply without added minimum-area slack; each child must exceed inputArea × 1e-9, and summed area residual must not exceed that threshold. Unknown option keys, malformed geometry, a zero direction or negative minimumArea throw. Nothing is mutated.

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

Positive distance expands the filled region; negative distance erodes it. The proposed initial join is `bevel`, the only advertised initial literal. Distance must be finite; zero returns `unchanged` with a detached original. Expanding land shrinks its holes, while erosion can enlarge holes, disconnect components or remove the region entirely. Such changes must be preserved; complete erosion is successful empty output.

```ts
const inset = geometry.offset({ shape, distance: -1, cornerStyle: "bevel" });
// Consume inset.parts only after narrowing its status.
```

No best-effort relaxation is permitted. Do not silently halve the distance or return the original as a successful inset when the requested distance cannot be constructed. Numerical failure returns `failed`, unsupported capability returns `unsupported`, each with the original. General self-intersection resolution, offset metric and bevel behavior at concave/reflex vertices need backend fixtures before freeze; this signature does not claim exact Euclidean clearance at a bevel corner. Miter/round options require separate documented parameters, approximation/error semantics and acceptance; they are not implicitly supported strings.

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

Create the union of full-width strips centered on each path. `width` is the full positive finite width, not half-width. Proposed defaults are butt caps and bevel joins. No graph, road class, traffic rule or automatic boundary label is created. Canonical output parts may have holes/components.

```ts
const corridor = geometry.corridor({
  paths: [[[6, 0], [6, 8]]], width: 2,
});
if (corridor.status === "ok") {
  console.log(corridor.parts.reduce((sum, part) => sum + geometry.area({ shape: part }), 0)); // 16
}
```

An empty path list is proposed to return `ok` with no parts. Each supplied path needs at least two distinct successive points; duplicate successive points, nonfinite coordinates and nonpositive widths throw. The initial capability accepts two-point straight paths; longer/bent paths are valid but `unsupported` until join fixtures are accepted. On failure retain all detached input paths in input order. Crossing strips are unioned once, not left as overlapping area. A butt cap stops at the endpoint and can geometrically touch a block; whether vehicles may enter there is caller policy. Candidate input bounds are at most 1,024 paths and 8,192 total points, with coordinate magnitude at most 1e6. Width/output-coordinate growth and the exact maximum output complexity must be resolved before freeze. This operation consumes no randomness.

<a id="topology-group"></a>

## topology.group

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

Partition eligible local cell keys into disjoint edge-connected groups without modifying the Layout. Internal random triangle pairing in the finite quad generator is a separate construction algorithm, not this grouping procedure. Grouping is not polygon merging: a group can later prove unsupported by the bounded `geometry.merge`. Every eligible key appears exactly once in `groups` or `remainingCells`. Noneligible cells never appear.

Proposed deterministic defaults: all `layout.cells` eligible, minimumCells 1, maximumCells 4, maximumGroups 1,024. Limits are positive integers; minimumCells must not exceed maximumCells; all limits are at most the 1,024-cell Layout bound. An explicitly empty eligible list returns `ok` with empty outputs. Duplicate/foreign cell keys, malformed options or an invalid Random throw before work.

```ts
const layout = topology.square({ columns: 4, rows: 1 });
const grouped = topology.group({
  layout, minimumCells: 2, maximumCells: 2, maximumGroups: 2,
});
// Proposed deterministic groups: [[0, 1], [2, 3]], remainingCells: [].
```

The proposed baseline scans eligible keys in layout order. From each earliest unassigned key it grows a breadth-first group, visiting eligible neighbors in Layout order until maximumCells. Commit groups meeting minimumCells; otherwise retain the attempted cells as unresolved and continue from the next unvisited seed. A fixed visited set bounds the pass; no hidden backtracking or claim of optimal packing. When maximumGroups is reached, retain all unassigned keys. `ok` means no leftovers, `partial` means at least one accepted group and leftovers, `unchanged` means no accepted group and nonempty leftovers.

The `random` option is reserved by the catalogue. A proposed randomized variant would shuffle eligible seed order with the supplied stream, then use the same neighbor order; shuffle algorithm, exact draw count and continuation fixtures are **not frozen**. Until those are accepted, do not implement an accepted-but-ignored random option or promise replay portability. Initial implementation may expose only the deterministic subset. No new seed, callback registry, scoring framework, Agent or World is introduced. Proposed defaults and growth order need explicit freeze acceptance.

<a id="geometry-subdivide"></a>

## geometry.subdivide

**Proposed; three method contracts, with different readiness.**

```ts
geometry.subdivide(options:
  | OrientedBoundingBoxOptions
  | ParallelStripsOptions
  | StraightSkeletonOptions
): SubdivisionResult
```

Partition one polygon under explicit work and size constraints. Triangle-to-three/quad-to-four mesh refinement belongs inside the finite topology generator; it is not another parcel subdivision method. A method name is not a promise that its backend exists. Deliver only the accepted implementation subset; do not export placeholder variants. OBB is the first proposed slice. Parallel strips and straight skeleton remain later targets.

<a id="subdivision-types"></a>

### Subdivision types

```ts
type LabelledBoundarySegment = {
  readonly id: string;
  readonly segment: BoundarySegment;
};
type SubdivisionPart = {
  readonly key: string;
  readonly parentKey: string | null;
  readonly shape: PlanarPolygon;
  readonly boundarySegments: readonly LabelledBoundarySegment[];
};
type SubdivisionDiagnostic = {
  readonly code:
    | "minimum-area" | "minimum-width" | "minimum-frontage"
    | "maximum-attempts" | "maximum-parcels" | "maximum-depth"
    | "unsupported-concavity" | "unsupported-holes" | "numerical-failure";
  readonly key: string;
  readonly attempt: number | null;
};
type SubdivisionResult = {
  readonly status: "ok" | "partial" | "unchanged" | "unsupported" | "failed";
  readonly parts: readonly SubdivisionPart[];
  readonly remainingParts: readonly SubdivisionPart[];
  readonly diagnostics: readonly SubdivisionDiagnostic[];
  readonly attempts: number;
  readonly areaResidual: number;
};
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

`SubdivisionControls` is an explanatory local type, not a compulsory extra runtime export. Method-specific types below form a discriminated union; options do not silently apply to unrelated methods.

`parts` contains accepted terminal pieces. `remainingParts` contains every unresolved region. Together they must cover the input net region, with nonoverlapping interiors and no region outside it. `areaResidual` is input net area minus the sum of both sets; require absolute residual ≤ inputArea × 1e-9. Area accounting alone does not prove containment or nonoverlap. All data is detached and deeply immutable.

| Status | Exact proposed meaning |
| --- | --- |
| `ok` | Every leaf is accepted; no remainingParts. A root already meeting completion/minimum guards is one accepted part with zero attempts. |
| `partial` | At least one cut was committed, and unresolved pieces remain, even if parts is empty. |
| `unchanged` | No cut was committed and the unresolved detached root remains. |
| `unsupported` | Valid input lies outside that method's declared shape capabilities. Return the detached original as remainingParts, no accepted parts. |
| `failed` | Numerical construction or invariant checking failed. Roll back the whole call to the detached original; publish no partially trusted geometry. |

Invalid options/geometry throw TypeError/RangeError before search. Minimum thresholds are finite nonnegative values, defaulting to 0. Empty labels are the default. Positive minimumFrontage without useful labels prevents acceptance; it never labels the domain automatically. Proposed budgets: maximumParcels 256 (cap 1,024), maximumAttempts 1,024 (cap 65,536), maximumDepth 16 (nonnegative safe integer). Parcel/attempt caps must be positive safe integers. A limit records a diagnostic with attempt null when it stops work before candidate evaluation. Every actual candidate line costs one attempt; rejected candidates are counted. No hidden wall-clock deadline is used.

Before testing a cut, if the live-leaf count equals maximumParcels, retain that leaf and all queued unresolved leaves without incrementing attempts. Classify queued terminal leaves before returning. The cap counts accepted and pending leaves together. Depth is root=0. A leaf at maximumDepth can still be accepted if it meets completion; otherwise retain it without testing a candidate and report maximum-depth. A root already below the completion threshold but failing a minimum guard stays unchanged with zero attempts; do not cut merely to repair a failing minimum.

<a id="subdivision-boundaries"></a>

### Boundary inheritance and lineage

Labels are intervals, not mutable polygon-edge indices. Intersect inherited intervals with each child boundary; internal cut edges receive no road label. Point-only contact has zero frontage. Compute frontage as geometric union length across labels, avoiding double counting. Disjoint frontage intervals may contribute to the same total; this first proposal does not require one contiguous entrance. These labels assert geometry, not road-network connectivity, legal access or driveway feasibility.

For OBB binary derivation, keys are `0`, `0/0`, `0/1`, and so on; parentKey is the immediate ancestor or null at the root. Associate them with a block identity in user code. They repeat across calls and are not persistent cadastral/edit identities. State transfer after a split/merge is a separate operation or explicit script decision. Future nonbinary methods need their own key derivation/order decisions before freeze; do not apply binary ancestry mechanically to strips or skeleton faces.

<a id="geometry-subdivide-obb"></a>

### geometry.subdivide — orientedBoundingBox

**Proposed first implementation: deterministic convex, hole-free polygons.**

```ts
type OrientedBoundingBoxOptions = SubdivisionControls & {
  readonly method: "orientedBoundingBox";
  readonly targetArea: number;
};
```

`targetArea` is required, positive and finite. The proposal treats it as an upper completion bound: accepted leaves have area ≤ targetArea and meet every minimum guard. It is not a promised exact size or mean. This meaning and proposed budget defaults require explicit acceptance before freezing public examples.

```ts
const result = geometry.subdivide({
  shape, method: "orientedBoundingBox", targetArea: 48,
  minimumArea: 40, minimumWidth: 4, minimumFrontage: 6,
  boundarySegments: [{ id: "south", segment: [[0, 0], [12, 0]] }],
  maximumParcels: 2, maximumAttempts: 2,
});
// Proposed expectation: ok; two parts of area 48 and frontage 6 each.
```

Fit the minimum-area edge-aligned bounding rectangle and cut perpendicular to its long axis at the midpoint. Normalize undirected axis angles to [0, π), counterclockwise from +X. Equal box-area ties use smallest normalized angle then canonical edge coordinates; equal side-length ties choose the smaller axis angle. Traverse depth-first, lower canonical child first. Compare complete canonical CCW ring sequences lexicographically by X then Y, not only their first vertex. Canonical output does not rewrite retained originals or existing split ordering.

Commit a cut only when both children meet minimum guards. If the first candidate fails, try its perpendicular midpoint orientation; if that also fails, retain the parent with diagnostics. Each candidate costs one attempt. Support width means distance between parallel supporting lines, not an inscribed rectangle or minimum usable depth everywhere. The first version consumes no random draws and has no random option; randomized displacement requires a distinct accepted distribution/draw-order contract.

Valid concavity or holes return unsupported before testing whether the root is already small enough. A maximumAttempts of 1 on the 96-area fixture with targetArea 24 commits one cut and returns partial, no accepted parts and two remaining parts of area 48. A maximumParcels of 1 returns unchanged with zero attempts if the root needs a split. Failing two candidate directions or exhausting a budget is not proof that a valid partition is impossible.

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

The proposed direction is the direction of parallel cut lines; normalize finite nonzero XY components. `stripWidth` is the positive finite perpendicular distance between those lines in local units. There is no implicit targetArea for this method. A strip intersecting the input produces one or more polygon components, each separately checked against minimum guards. The shared work budget bounds evaluated cut lines and output pieces. Exact attempt accounting for disconnected intersections must be frozen with this method, rather than inherited accidentally from binary OBB.

```ts
const strips = geometry.subdivide({
  shape, method: "parallelStrips", direction: { x: 0, y: 1 },
  stripWidth: 3, maximumParcels: 8, maximumAttempts: 16,
});
// Proposed rectangle fixture: four 3-by-8 strips, subject to the guards.
```

Proposed phase anchoring starts at the minimum projection of the input onto the cut-line normal; cuts occur at successive stripWidth offsets. A final narrower band is retained if it fails minimum guards. The method must not silently stretch widths to remove a remainder. Parallel cuts differ from recursive OBB: they use a fixed direction/spacing. Concavity/holes can produce multiple components per band. Initial implementation may be convex and hole-free only; advertise the exact supported subset and preserve originals for other shapes.

Before freeze, resolve orientation-sign/phase canonicalization, strip key/parentKey derivation, output ordering, disconnected-band handling and preflight budget counting. These are method-specific decisions, not implementation freedom after examples are accepted. No random option is proposed for fixed strips. A backend and its numeric boundary behavior remain unselected.

<a id="geometry-subdivide-skeleton"></a>

### geometry.subdivide — straightSkeleton

**Research target; no skeleton or parcel backend is delivered.**

```ts
type StraightSkeletonOptions = SubdivisionControls & {
  readonly method: "straightSkeleton";
  readonly targetArea: number;
};
```

This is the smallest proposed call envelope, not a claim that targetArea alone reproduces Vanegas et al. Skeleton-based parcellation requires inward wavefront event handling, face/street attribution, offset strips, corner corrections, guided slicing and small-lot postprocessing. A skeleton graph alone is not a parcel generator.

```ts
const proposed = geometry.subdivide({
  shape, method: "straightSkeleton", targetArea: 48,
  boundarySegments: [{ id: "south", segment: [[0, 0], [12, 0]] }],
  minimumFrontage: 4, maximumParcels: 16, maximumAttempts: 128,
});
// Research example only: no exact partition or success assertion is frozen.
```

The target result must retain every unresolved interior region, including an inaccessible courtyard left by a finite offset. It must distinguish a valid geometric skeleton from accepted street-facing lots. Hole support, logical-street grouping, strip depth/width controls, event degeneracies, merge policy, iteration/attempt accounting, key derivation and precision/backend/license policy remain pre-freeze design decisions. The call is not implementation-ready until those decisions and numerical fixtures are settled. Do not label naive inward ribs or unrelated Voronoi output as straightSkeleton. A future backend may return unsupported for a declared valid subset, but should not be exported as an always-unsupported stub.

<a id="grid-bridge"></a>

## Grid and Field connection

Townscaper-inspired quad Layouts describe the module-side substrate. Attaching Fields does not produce the distinct player-side dual grid, layered occupancy, colors or an architectural solver. Those are separate model/generation tasks; see [Townscaper boundaries](TOWNSCAPER.md).

The following is delivered at `2a7f3eb`. Regular Grid and LayoutGrid share canonical Field state and occupancy queries, but have different spatial capabilities. Import runtime values/types from the package root. `Grid<F>` below is descriptive notation for the regular-grid instance interface; the root value `Grid` provides `.add`, and current root exports explicitly include Field, LayoutGrid and LayoutField.

<a id="grid-add-default"></a>

### Grid.add — default regular grid

```ts
Grid.add(): Grid<{}>
```

Create a detached 2D regular grid of full extents x=40, y=40, cellSize=1 and hard boundaries, centered on the origin. It contains 1,600 Fields with empty independent state. The Grid object is frozen, but custom Field properties remain mutable. No World is required.

```ts
const grid = Grid.add();
console.log(grid.fields.length); // 1600
```

An explicit undefined placeholder is rejected; use the zero-argument call rather than Grid.add(undefined). Regular construction does not generate a polygon Layout.

<a id="grid-add-space"></a>

### Grid.add — regular Space

```ts
Grid.add<F extends object>(space: Space, options: {
  state: F; cellSize?: number; boundary?: Space["boundary"];
}): Grid<F>
Grid.add(space?: Space, options?: {
  cellSize?: number; boundary?: Space["boundary"];
}): Grid<{}>
```

Supply positive finite full extents centered at the origin. XY selects 2D; adding Z selects 3D. `cellSize` defaults to 1, must be positive finite, and divide each extent into a positive safe-integer cell count. Boundary defaults derive from the Space; a constructor override replaces the boundary selection for this new instance only. Total fields must not exceed 1,000,000.

```ts
const grid = Grid.add({ x: 4, y: 2 }, {
  cellSize: 1, state: { temperature: 10 }, boundary: "hard",
});
console.log(grid.fields.length); // 8
```

Initial supported state is cloned independently per Field. Reserved keys id/grid/x/y/z are invalid state keys. Invalid state, dimensions, boundary, options, counts or explicit undefined placeholders throw before any Fields are published. Fields are ordered x-fastest, then y, then z. Geometry/Space snapshots are immutable; the caller's state object is not the live Field state.

<a id="grid-add-layout"></a>

### Grid.add — immutable Layout

```ts
Grid.add<F extends object>(options: { layout: Layout; state: F }): LayoutGrid<F>
```

Create one canonical LayoutField per cell, in layout.cells order. Both options are required. LayoutGrid retains the original immutable Layout identity; state is cloned independently per Field. It has no uniform `cellSize`, rectangular `space`, regular-neighborhood option or `diffuse` method.

```ts
const layout = topology.square({ columns: 2, rows: 1 });
const grid = Grid.add({ layout, state: { population: 0 } });
grid.fields[0]!.population = 12;
console.log(grid.fields[1]!.population); // 0
```

Field XY positions are cell area centroids. A centroid need not be inside a concave polygon and is not a cell key. All centroids and state are validated before publishing identities. Construction accepts exactly one options record; a second argument, extra keys or explicit undefined values throw. A new LayoutGrid creates new Field identities. Splitting polygons does not update this existing Grid or distribute its values.

<a id="grid-fields"></a>

### grid.fields

```ts
grid.fields: readonly Field<F>[]          // regular Grid
grid.fields: readonly LayoutField<F>[]    // LayoutGrid
```

Return a fresh frozen array snapshot containing canonical Field references. Reading does not copy or reset Fields. Custom state mutations through those references affect the grid; changing the array is not supported.

```ts
const fields = grid.fields;
fields[0]!.population += 1; // for the population LayoutGrid above
```

Regular ordering is x-fastest/y/z; layout ordering follows layout.cells. Deleting or reassigning framework Field keys is not an author operation.

<a id="grid-field-at"></a>

### grid.fieldAt

```ts
grid.fieldAt(position: Position): Field<F> | undefined       // regular
layoutGrid.fieldAt(position: Position): LayoutField<F> | undefined
```

Locate one canonical Field from a finite position of matching dimensions. Regular hard boundaries return undefined outside; the positive outer boundary belongs to the last cell. Internal regular boundaries choose the higher-index cell. Wrapped axes normalize into their extent. LayoutGrid delegates to layout.cellAt, including its deterministic local-key tie behavior, and has no wrap option.

```ts
const field = grid.fieldAt({ x: 0.5, y: 0.5 });
if (field) field.population += 1;
```

A missing, nonfinite or wrong-dimensional position throws. Geometry lookup does not move agents. Polygon containment, rather than distance to centroid, determines layout occupancy.

<a id="grid-neighbors"></a>

### grid.neighbors

```ts
grid.neighbors(field: Field<F>, options?: {
  neighborhood?: "faces" | "moore";
}): readonly Field<F>[]
layoutGrid.neighbors(field: LayoutField<F>): readonly LayoutField<F>[]
```

Regular default is Moore: up to 8 neighbors in 2D or 26 in 3D. Faces selects axis-adjacent cells, up to 4/6. Visit offset slots in z/y/x order with x fastest, omit the zero slot, deduplicate references and exclude the source itself. Hard boundaries omit missing neighbors; wrap can map several directions to one reference. LayoutGrid returns positive-shared-edge neighbors in Layout order, with no corner-only adjacency.

```ts
const local = grid.neighbors(grid.fields[0]!); // LayoutGrid: no options
```

The result is a frozen snapshot of canonical Fields. Passing a Field from another Grid, unsupported neighborhood literal or options to LayoutGrid throws. Neighborhood queries do not read/write state or consume randomness.

<a id="grid-agents-at-world"></a>

### grid.agentsAt — attached World source

```ts
grid.agentsAt(field: Field<F>): readonly Agent[]
layoutGrid.agentsAt(field: LayoutField<F>): readonly Agent[]
```

Query living agents at their current positions from the Grid's attached World. A detached Grid throws; no hidden global agent collection is searched. Returned references are canonical agents, with duplicate-free World source order. A foreign Field throws. Queries are read-only and do not assign occupancy ownership to cells.

```ts
import { World } from "city-library";
const world = World.add();
world.add(grid);
const occupants = grid.agentsAt(grid.fields[0]!);
```

The model must still supply compatible positioned agents. Snapshotting this query does not freeze agents' future positions. Repeated lookups reflect current canonical state.

<a id="grid-agents-at-source"></a>

### grid.agentsAt — explicit source

```ts
grid.agentsAt<T extends Agent>(field: Field<F>, options: {
  source: Iterable<T>;
}): readonly T[]
layoutGrid.agentsAt<T extends Agent>(field: LayoutField<F>, options: {
  source: Iterable<T>;
}): readonly T[]
```

Query a supplied iterable without requiring World attachment. Deduplicate by original Agent identity in first-occurrence order, validate source agents and matching dimensions, then select living agents mapped to the target Field. It preserves typed custom agent properties and canonical references.

```ts
const occupants = grid.agentsAt(grid.fields[0]!, { source: [] });
console.log(occupants.length); // 0, including on a detached Grid
```

Noniterable input, invalid agents, wrong dimensions, a foreign Field or unsupported option keys throw. Source iteration failure propagates without changing domain state. The query does not attach agents, copy them or move them.

<a id="field-id"></a>

### field.id

```ts
field.id: string // readonly
```

Read an opaque canonical Field identity. It is stable for that Field lifetime, not derived from coordinates and not a persistent parcel ID. Separate Grids have separate Fields even for identical geometry. Do not parse an ID or use layout-local cell numbers as an interchangeable identity.

```ts
console.log(grid.fields[0]!.id);
```

<a id="field-grid"></a>

### field.grid

```ts
field.grid: Grid<F>          // readonly, regular Field owner
layoutField.grid: LayoutGrid<F> // readonly, actual LayoutField owner
```

Read the exact owning Grid reference. A Field cannot be reassigned to another Grid. LayoutField preserves its actual owner type rather than claiming regular-grid capabilities.

```ts
console.log(grid.fields[0]!.grid === grid); // true
```

<a id="field-position"></a>

### field.x, field.y, field.z

```ts
field.x: number             // readonly
field.y: number             // readonly
field.z: number | undefined // readonly
```

Read the embedded center position. Regular Fields use cell centers; layout Fields use polygon area centroids. Layout Fields are planar and z is undefined. Coordinates are neither a universal address nor a guarantee that a concave cell contains its centroid. They share the caller's declared spatial units; no metre conversion occurs.

```ts
const position = { x: grid.fields[0]!.x, y: grid.fields[0]!.y };
```

<a id="field-state"></a>

### Typed Field properties

```ts
field.temperature = value // when initial state declares temperature: number
```

Custom properties remain ordinary typed values, independently initialized. Framework keys remain readonly. Use named rules and normal arrays/loops for synchronous updates on a LayoutGrid.

```ts
const layout = topology.square({ columns: 2, rows: 1 });
const grid = Grid.add({ layout, state: { temperature: 1 } });
const next = grid.fields.map(field =>
  grid.neighbors(field).reduce((sum, other) => sum + other.temperature, 0));
grid.fields.forEach((field, index) => { field.temperature = next[index]!; });
```

All next values above are computed before any publish. This is user-controlled update ordering, not a new process framework. Later direct reference assignment has normal JavaScript aliasing; constructor copying does not imply automatic copying on every assignment. The meaning of temperature, mass, density and time belongs to the model.

<a id="grid-diffuse"></a>

### grid.diffuse — regular grids only

```ts
grid.diffuse(property: NumericKey<F>, options?: {
  rate?: number;
  neighborhood?: "faces" | "moore";
}): void
```

`NumericKey<F>` means the string keys whose declared state type is numeric; it is explanatory notation here, not a new root export. Default rate is 0.25; default neighborhood is faces. Rate must be finite in [0,1]. Each Field must have the named own writable finite numeric data property. Read and validate the full old buffer and computed next values before publishing any Field; a failure before commit leaves all state unchanged.

```ts
const regular = Grid.add({ x: 2, y: 2 }, { state: { heat: 1 } });
regular.diffuse("heat", { rate: 0.25, neighborhood: "faces" });
```

Each source retains 1-rate and distributes rate evenly across directional slots. A missing hard-boundary slot returns its share to that source. Tiny wrapped grids preserve repeated/self directional contributions; neighbor-query deduplication must not change diffusion. Regular equal-size fields preserve the total within arithmetic error; this says nothing about physical units or mass on unequal cells. Rate zero still validates all source fields, then performs no writes. Unsupported property/options throw.

LayoutGrid intentionally has no diffuse method. Unequal-cell quantity versus concentration, edge weights, flux, boundary conditions and timestep require a separate accepted contract. Use explicit synchronous model rules until that work is selected.

<a id="parcel-workflow"></a>

## Compose road geometry and subdivision

This proposed workflow uses ordinary calls. Its new geometry functions are not delivered exports today. It demonstrates one straight road, not a general road-network backend.

```ts
import { geometry, type PlanarPolygon, type LabelledBoundarySegment } from "city-library";

const domain: PlanarPolygon = {
  type: "Polygon", coordinates: [[[0, 0], [12, 0], [12, 8], [0, 8], [0, 0]]],
};
const road = geometry.corridor({ paths: [[[6, 0], [6, 8]]], width: 2 });
if (road.status !== "ok") throw new Error("Expected a supported road corridor.");
const boundaries: LabelledBoundarySegment[] = road.parts.flatMap(part =>
  part.coordinates.flatMap(ring => ring.slice(0, -1).map((point, index) => ({
    id: "main-road", segment: [point, ring[index + 1]!] as const,
  }))));
const land = geometry.subtract({ shape: domain, excludedShapes: road.parts });
if (land.status !== "ok" && land.status !== "unchanged") {
  throw new Error("Expected supported block extraction.");
}
const results = land.parts.map(block => geometry.subdivide({
  shape: block, method: "orientedBoundingBox", targetArea: 20,
  minimumFrontage: 4, boundarySegments: boundaries,
}));
const accountedArea = results.flatMap(result => [...result.parts, ...result.remainingParts])
  .reduce((sum, part) => sum + geometry.area({ shape: part.shape }), 0);
console.log(accountedArea); // expected analytically: 80, including every residual
```

The road labeling above deliberately permits geometric contact with any corridor boundary, including a cap. Supply only eligible intervals when policy forbids entry there. Nested/overlapping roads need union and attribution fixtures; never sum corridor area independently without accounting for overlaps.

Subdivision outputs do not automatically form a supported Layout. Uneven recursive cuts can introduce partial-edge/T-junction contacts even inside one original block. Current fromPolygons requires conforming full-edge contacts and rejects those outputs. A later measured edge-normalization/topology extension must define how to preserve labels and local provenance; do not hide normalization or Field-state migration inside Grid.add.

<a id="future-generation-boundary"></a>

## Future generation boundary

Hierarchical street/parcel co-generation can add roads to make unreachable parcels reachable and then optimize the joint geometry. It is a separate future procedure, not another OBB switch. No public name or option bag is frozen here. Learned building-layout generators, example-driven streets and reinforcement-learning land-use policies similarly consume or produce descriptions around this core. They do not change polygon validity, frontage meaning, area accounting or the requirement for explicit state ownership. Their research inputs, dependencies and remaining evidence are recorded in PAPERS.md and EXTENDED-PAPERS.md.


Townscaper dual mapping, seamless chunk extension and compatible architecture modules are also separate future contracts. They require source/output correspondence, finite-boundary rules, seam interpolation or solver diagnostics; none are implied by the finite generator or by Grid state. [Research and deferred work](TOWNSCAPER.md).
