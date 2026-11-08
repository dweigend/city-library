# A small parcel contract for City Library

Design proposal, 7 November 2026. Nothing here changes the accepted catalogue or claims runtime delivery. The five scripts below are proposed freeze candidates, not executed examples. Resolve the listed decisions before freezing them.

## Recommendation

Keep `geometry` for shapes and bounded procedures, `topology` for cell relationships, and `Grid` for state. A parcel is a polygon with lineage and optional labelled boundary intervals, not a new class or Agent. Use four ordinary steps: make road corridors, subtract their union from land, measure surviving road boundary contact, and subdivide each resulting block. No `parcels` namespace, manager, registry, host, plugin interface or compulsory World is needed.

Implement deterministic convex OBB subdivision first. Develop corridor/subtraction as a separate robust-geometry slice before presenting arbitrary road-derived blocks as supported parcel inputs. A production block can be concave or have holes even when all roads are straight. Returning those blocks honestly while the first subdivision method rejects them is preferable to filling holes or inventing accessibility.

Preserve these author calls:

```ts
geometry.corridor({ paths, width, endCap, cornerStyle });
geometry.subtract({ shape, excludedShapes });
geometry.boundaryOverlap({ shape, boundarySegments });
geometry.subdivide({ shape, method: "orientedBoundingBox", targetArea });
topology.fromPolygons({ polygons });
Grid.add({ layout, state: { temperature: 0 } });
```

Only the final two calls are delivered today. The complete approved method vocabulary remains `orientedBoundingBox`, `parallelStrips`, `straightSkeleton`. Voronoi remains `topology.voronoi({ points, boundary })`. Do not export empty implementations for future methods.

## Inspected baseline and authority

- Source checkout: `/home/david/Projekte/city_game`, HEAD `3e1d34f1b40ea05b81c4a52206e9c7bf58a12a98`. Its two handover documents are untracked existing work and were only read.
- Target: `/home/david/.t3/worktrees/city-library/feat-grid-parcel-foundations`, branch `feat/grid-parcel-foundations`, clean at `2a7f3ebb7b1d84a4accb17525946072db1c70cc3`. Remote is `https://github.com/dweigend/city-library.git`. This is the delivery baseline, not main.
- Read root/source PLAN, handover API and interim inventory, parcel research dossier; target AGENTS, PLAN, README, DESIGN, ARCHITECTURE, grid-parcels STATUS/PHASE-PLAN, public index, geometry validation/split/types, Random and public grid examples. Target DESIGN owns UI, ARCHITECTURE owns headless architecture. The newer main-checkout `docs/CODING_STANDARDS.md` was read separately as coding guidance, not silently substituted for the target revision.
- Incorporated `/tmp/city-parcel-syntax-audit.md`, `/tmp/city-parcel-paper-analysis.md`, `/tmp/city-parcel-extended-papers.md`. Their independent findings remain separate evidence. No children launched.
- Inspected listening sockets; no server was started or used. No browser origin is claimed. This is a headless contract proposal, not a visual implementation review.

Delivered: square/hex/authored conforming layouts; immutable queries; net area; bounded connected merge; convex split; typed layout Fields. General Boolean operations, corridors, recursive subdivision and skeleton are deferred. Current `geometry` contains direction/normalize/distance/map/contains/bounds/area/merge/split. Existing contains/bounds signatures and all five frozen foundation scripts remain intact.

## Five complete author scripts

Each script imports only the public package and Node assertions. Proposed result members and new exported types are specified below. Fixtures deliberately use local units, not presumed metres. These five scripts span the proposed end state; each implementation slice still needs its own four or five frozen scripts before runtime changes. Do not claim these candidates passed against the current package.

### 1. A finite-width road makes two labelled blocks

The corridor occupies x=5..7. Its union removes 16 square units from a 96-unit domain. Each 40-unit block touches eight units of the same road. This fixture also establishes that the domain boundary itself is not a street.

```ts
import assert from "node:assert/strict";
import { geometry, type PlanarPolygon, type LabelledBoundarySegment } from "city-library";

const domain: PlanarPolygon = {
  type: "Polygon",
  coordinates: [[[0, 0], [12, 0], [12, 8], [0, 8], [0, 0]]],
};
const road = geometry.corridor({
  paths: [[[6, 0], [6, 8]]], width: 2,
  endCap: "butt", cornerStyle: "bevel",
});
assert.equal(road.status, "ok");
if (road.status !== "ok") throw new Error("Expected a road corridor.");
const labels: LabelledBoundarySegment[] = road.parts.flatMap(shape =>
  shape.coordinates.flatMap(ring => ring.slice(0, -1).map((point, index) => ({
    id: "main-road", segment: [point, ring[index + 1]!] as const,
  }))),
);
const land = geometry.subtract({ shape: domain, excludedShapes: road.parts });
assert.equal(land.status, "ok");
if (land.status !== "ok") throw new Error("Expected land extraction.");
assert.deepEqual(land.parts.map(shape => geometry.area({ shape })), [40, 40]);
assert.equal(geometry.area({ shape: domain }), 96);
assert.equal(road.parts.reduce((sum, shape) => sum + geometry.area({ shape }), 0), 16);
for (const block of land.parts) {
  const frontage = geometry.boundaryOverlap({ shape: block, boundarySegments: labels });
  assert.equal(frontage.length, 8);
  assert.deepEqual([...new Set(frontage.segments.map(edge => edge.id))], ["main-road"]);
}
assert.deepEqual(domain.coordinates[0]![1], [12, 0]);
```

This labels all exposed corridor boundary as road frontage, a deliberate geometric convention. At dead ends, a cap can therefore count. A model that forbids entry there must supply only eligible intervals; later corridor provenance can make that selection easier. Do not silently equate a junction patch or motorway boundary with an entrance.

### 2. Two frontage-preserving parcels become stateful Fields

```ts
import assert from "node:assert/strict";
import { geometry, topology, Grid, type PlanarPolygon } from "city-library";

const shape: PlanarPolygon = {
  type: "Polygon",
  coordinates: [[[0, 0], [12, 0], [12, 8], [0, 8], [0, 0]]],
};
const result = geometry.subdivide({
  shape, method: "orientedBoundingBox", targetArea: 48,
  minimumArea: 40, minimumWidth: 4, minimumFrontage: 6,
  boundarySegments: [{ id: "south", segment: [[0, 0], [12, 0]] }],
  maximumParcels: 2, maximumAttempts: 2,
});
assert.equal(result.status, "ok");
assert.deepEqual(result.parts.map(part => geometry.area({ shape: part.shape })), [48, 48]);
assert.equal(result.remainingParts.length, 0);
assert.deepEqual(result.parts.map(part => part.key), ["0/0", "0/1"]);
assert.ok(result.parts.every(part => part.parentKey === "0"));
for (const part of result.parts) {
  const frontage = geometry.boundaryOverlap({ shape: part.shape, boundarySegments: part.boundarySegments });
  assert.equal(frontage.length, 6);
}
const layout = topology.fromPolygons({ polygons: result.parts.map(part => part.shape) });
const grid = Grid.add({ layout, state: { population: 0 } });
grid.fields[0]!.population = 12;
assert.equal(grid.fields[1]!.population, 0);
assert.equal(grid.neighbors(grid.fields[0]!).length, 1);
assert.equal(geometry.area({ shape }), 96);
```

This particular pair has conforming edges. Uneven recursive subdivision can create partial-edge/T-junction contacts; today's `fromPolygons` must reject those. General subdivision-to-Grid integration needs a separately accepted conforming-edge normalization or topology extension. Do not imply this example proves that arbitrary recursive results can become a Layout.

### 3. Retry a frontage failure; retain an unsplittable block

```ts
import assert from "node:assert/strict";
import { geometry, type PlanarPolygon } from "city-library";

const shape: PlanarPolygon = {
  type: "Polygon",
  coordinates: [[[0, 0], [12, 0], [12, 8], [0, 8], [0, 0]]],
};
const result = geometry.subdivide({
  shape, method: "orientedBoundingBox", targetArea: 48,
  minimumFrontage: 4,
  boundarySegments: [{ id: "west", segment: [[0, 0], [0, 8]] }],
  maximumAttempts: 2,
});
assert.equal(result.status, "ok");
assert.equal(result.attempts, 2);
assert.ok(result.diagnostics.some(item => item.code === "minimum-frontage"));
for (const part of result.parts) {
  assert.equal(geometry.area({ shape: part.shape }), 48);
  assert.equal(geometry.boundaryOverlap({ shape: part.shape, boundarySegments: part.boundarySegments }).length, 4);
}
const rejected = geometry.subdivide({
  shape, method: "orientedBoundingBox", targetArea: 48,
  minimumArea: 49, maximumAttempts: 2,
});
assert.equal(rejected.status, "unchanged");
assert.equal(rejected.parts.length, 0);
assert.deepEqual(rejected.remainingParts.map(part => part.shape), [shape]);
assert.notEqual(rejected.remainingParts[0]!.shape, shape);
assert.ok(rejected.diagnostics.some(item => item.code === "minimum-area"));
assert.throws(() => geometry.subdivide({
  shape, method: "orientedBoundingBox", targetArea: 0,
}), RangeError);
```

The first rejected cut remains diagnosable even though the retry succeeds. Rejection says these candidates failed; it does not prove that another offset/orientation or road intervention cannot work.

### 4. Preserve holes and distinguish budget-limited progress

```ts
import assert from "node:assert/strict";
import { geometry, type PlanarPolygon } from "city-library";

const shape: PlanarPolygon = {
  type: "Polygon",
  coordinates: [[[0, 0], [12, 0], [12, 8], [0, 8], [0, 0]]],
};
const hole: PlanarPolygon = {
  type: "Polygon", coordinates: [[[4, 2], [8, 2], [8, 6], [4, 6], [4, 2]]],
};
const land = geometry.subtract({ shape, excludedShapes: [hole] });
assert.equal(land.status, "ok");
if (land.status !== "ok") throw new Error("Expected subtraction with a hole.");
assert.equal(land.parts.length, 1);
assert.equal(land.parts[0]!.coordinates.length, 2);
assert.equal(geometry.area({ shape: land.parts[0]! }), 80);
const unsupported = geometry.subdivide({
  shape: land.parts[0]!, method: "orientedBoundingBox", targetArea: 20,
});
assert.equal(unsupported.status, "unsupported");
assert.equal(unsupported.parts.length, 0);
assert.equal(geometry.area({ shape: unsupported.remainingParts[0]!.shape }), 80);
const partial = geometry.subdivide({
  shape, method: "orientedBoundingBox", targetArea: 24, maximumAttempts: 1,
});
assert.equal(partial.status, "partial");
assert.equal(partial.parts.length, 0);
assert.deepEqual(partial.remainingParts.map(part => geometry.area({ shape: part.shape })), [48, 48]);
assert.ok(partial.diagnostics.some(item => item.code === "maximum-attempts"));
const all = [...partial.parts, ...partial.remainingParts];
assert.equal(all.reduce((sum, part) => sum + geometry.area({ shape: part.shape }), 0), 96);
assert.equal(partial.areaResidual, 0);
```

### 5. Explicit random input, replay and no incidental draws

Randomness belongs in input generation until a randomized subdivision variant has an accepted displacement rule. This example uses the delivered Random API and deterministic subdivision; it deliberately does not invent `seed` or `variation` options on OBB.

```ts
import assert from "node:assert/strict";
import { geometry, Random, type PlanarPolygon } from "city-library";

function makeParcels(seed: number) {
  const random = Random.add({ seed });
  const width = random.number({ min: 12, max: 20 });
  const shape: PlanarPolygon = {
    type: "Polygon", coordinates: [[[0, 0], [width, 0], [width, 8], [0, 8], [0, 0]]],
  };
  const before = structuredClone(random.state);
  const result = geometry.subdivide({
    shape, method: "orientedBoundingBox", targetArea: width * 4,
    maximumParcels: 2, maximumAttempts: 2,
  });
  assert.equal(result.status, "ok");
  assert.equal(result.parts.length, 2);
  assert.deepEqual(random.state, before);
  assert.ok(Math.abs(result.areaResidual) <= geometry.area({ shape }) * 1e-9);
  return { result, state: random.state };
}
assert.deepEqual(makeParcels(19), makeParcels(19));
assert.notDeepEqual(makeParcels(19).result, makeParcels(20).result);
```

## Minimal types and exact meanings

Existing `PlanarXY`, `PlanarPolygon`, `ParcelShape`, `Position`, `Vector`, `BoundarySegment` and `Random` remain authoritative. The following are proposed additions, not a second polygon format. Result types are operation-specific; do not retrofit a universal Result container onto existing split/merge.

```ts
// Existing BoundarySegment is a readonly pair of PlanarXY positions.
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
type OrientedBoundingBoxOptions = {
  readonly shape: PlanarPolygon;
  readonly method: "orientedBoundingBox";
  readonly targetArea: number;
  readonly minimumArea?: number;
  readonly minimumWidth?: number;
  readonly minimumFrontage?: number;
  readonly boundarySegments?: readonly LabelledBoundarySegment[];
  readonly maximumParcels?: number;
  readonly maximumAttempts?: number;
  readonly maximumDepth?: number;
};
```

`geometry.subdivide(options: OrientedBoundingBoxOptions): SubdivisionResult` is the first proposed signature. Later method-specific options form a discriminated union under the same function. Do not accept skeleton-only controls on OBB, or expose all catalogue settings as optional fields without meaning.

Other proposed signatures, sufficient for the examples:

```ts
// Local aliases below describe signatures; they need not all be public exports.
type ShapeChange =
  | { readonly status: "ok" | "unchanged"; readonly parts: readonly PlanarPolygon[];
      readonly diagnostics: readonly string[] }
  | { readonly status: "unsupported" | "failed"; readonly remainingShapes: readonly PlanarPolygon[];
      readonly diagnostics: readonly string[] };

// geometry.corridor({ paths: readonly (readonly PlanarXY[])[], width: number,
//   endCap?: "butt", cornerStyle?: "bevel" }):
//   { status: "ok"; parts: readonly PlanarPolygon[]; diagnostics: readonly string[] }
//   | { status: "unsupported" | "failed";
//       remainingPaths: readonly (readonly PlanarXY[])[]; diagnostics: readonly string[] }
// geometry.subtract({ shape: PlanarPolygon, excludedShapes: readonly PlanarPolygon[] }): ShapeChange
// geometry.boundaryOverlap({ shape: PlanarPolygon,
//   boundarySegments: readonly LabelledBoundarySegment[] }):
//   { readonly length: number; readonly segments: readonly LabelledBoundarySegment[] }
```

The comments specify future calls without pretending those declarations already augment the frozen geometry object. Corridor defaults: full width, butt caps, bevel joins. Initial supported input may be restricted to straight paths, with bent paths returning unsupported until joins are verified. Subtraction must support holes and disconnected land before it is described as general block extraction. Empty subtraction output is valid `ok`; an empty change retains the detached original with `unchanged`. Exclusions are unioned, not area-summed. Unsupported/failed subtraction retains the original land; the input exclusions remain caller data. Corridor failure retains paths because there is no input area to preserve.

### Polygon, units and precision

Use existing GeoJSON-shaped closed rings: outer ring first, holes thereafter. Preserve acceptance of either winding in existing inputs. New generated Boolean/subdivision output should be canonical CCW outer/CW holes, lexicographically smallest first vertex, component order by canonical ring coordinates. Compare positions lexicographically by X then Y; compare complete canonical ring sequences vertex by vertex, using the shorter sequence first if one is an exact prefix. The repeated closing position does not participate in comparison. This canonicalization applies to new procedures only; do not rewrite retained originals or existing split output ordering. Collinear vertices carrying label transitions must not be discarded without preserving the intervals.

Lengths are XY coordinate units; areas are squared units. CRS conversion is outside the functions. A metre-based script declares that convention and transforms lengths, area thresholds and any precision grid together. Preserve magnitude ≤1e6, ≤128 closure-inclusive positions per ring, ≤8192 total positions and ≤1024 components for the first extension unless a new measured bound is explicitly frozen.

Existing topology uses exact comparisons without epsilon snapping; do not inject the research fixture's `1e-8` distance or `1e-7` area constants. New OBB uses the delivered relative area residual threshold `inputArea * 1e-9`, and rejects numerically degenerate children rather than granting minimum-size slack. Minimum guards are strict comparisons against the requested threshold (equality passes). OBB orientation and convexity predicates must distinguish exact predicates from inexact construction. Robust predicates alone do not make computed intersection coordinates exact.

A Boolean backend must expose its precision limitations in the contract before acceptance. Prefer no author tolerance knob in the first release. If integer quantization is selected, the precision grid and displacement/area accounting require a recorded API decision; rounding is not silently absorbed into frontage or existing topology equality. No arbitrary epsilon can establish legal access.

### Boundaries and frontage

Boundary labels are geometric intervals, not indices into mutable rings. `boundaryOverlap` intersects input segments with polygon boundary, preserving labels and splitting intervals where labels change. Point contacts yield zero length. Duplicate/overlapping segments with the same ID are merged; `length` measures the union across all IDs, so an interval labelled by two roads counts once. Returned labelled segments may carry both identities as separate records; their individual lengths must not be blindly summed. Deterministic ordering: polygon boundary traversal, then label ID.

Subdivision clips inherited labels to each child boundary. New internal cut edges have no labels. This representation accepts partial edges without inventing a different polygon convention. Supplied segments need not all overlap; irrelevant segments contribute zero. Invalid/nonfinite/zero-length segments throw. Labels are caller assertions about source meaning. `minimumFrontage` defaults to zero; positive frontage with no useful labels leads to retained failure, never automatic labelling of every outer edge.

For the first contract, minimum frontage means total unique labelled contact length. It does not require one contiguous entrance. Network access additionally requires a road-ID-to-Graph mapping and reachability to a chosen external node. Legal/vehicle access additionally depends on permissions, entrance placement, crossings and road class. None are inferred by this kernel. Road surfaces may overlap geometrically at a bridge while networks remain disconnected; this 2D corridor contract cannot decide grade separation.

### OBB search, completion and failure

Proposed defaults: `minimumArea`, `minimumWidth`, `minimumFrontage` = 0; empty boundary labels; `maximumParcels` = 256, `maximumDepth` = 16, `maximumAttempts` = 1024. Positive finite `targetArea` is mandatory. Budgets are positive integers, except depth may be zero. Cap maximumParcels at 1024 and maximumAttempts at 65536; reject invalid values. These defaults are design choices requiring acceptance, not paper constants.

1. Validate all input/options before work. The first method supports convex, simple, hole-free polygons. Reject valid unsupported concavity/holes before classifying terminal parcels, even if already below targetArea.
2. A leaf is accepted only when its area is at most targetArea and it meets all minimum guards. Here targetArea is explicitly a completion upper bound, not an approximate mean; exact target areas are not promised. An already acceptable root returns `ok`, key `0`, parentKey null, zero attempts. A root at or below targetArea that fails a minimum guard returns `unchanged`, no accepted parts, the detached root in remainingParts, zero attempts and the corresponding guard diagnostic with attempt null. It is not split merely to repair a failing minimum. The same terminal rule applies to descendants; no candidate attempt is charged.
3. Fit the minimum-area edge-aligned OBB. Cut at its long-axis midpoint perpendicular to that axis. Normalize undirected axis angles to theta in [0, pi), measured counterclockwise from positive X. Resolve equal box areas by smallest normalized angle then canonical edge coordinates. On equal side lengths, select the axis with the smaller normalized angle. Use deterministic depth-first traversal; compare complete canonical CCW child ring sequences lexicographically by X then Y to select the lower child first, including when their first vertices coincide. The axis/tie fixture must be frozen before runtime.
4. If the candidate fails guards, try its perpendicular midpoint cut. Each candidate line costs one attempt. Both children must satisfy minimum guards before committing that cut; otherwise retain the parent. A support-width guard measures minimum distance between parallel supporting lines, not an inscribed buildable rectangle.
5. Every committed cut replaces one live leaf by two. The parcel cap counts accepted AND pending leaves, so it bounds memory and unfinished fragments. Depth is root=0. Before testing candidate cuts on an unresolved leaf above targetArea, if liveLeaves equals maximumParcels, stop without incrementing attempts, retain that leaf and every queued unresolved leaf in remainingParts, and emit { code: "maximum-parcels", key, attempt: null }. The result is unchanged with zero committed cuts, or partial after any committed cut. Classify queued leaves against terminal acceptance before returning, so already qualifying leaves remain in parts. Exhausted budgets stop work without losing queued leaves. No random draws and no hidden retries.
6. `parts` contains accepted terminal leaves; `remainingParts` contains valid unresolved leaves. Their interiors must be disjoint and their union must cover the original net region. `areaResidual` = input net area minus the sum of both sets' areas. Conservation alone is insufficient: containment and nonoverlap need independent checks.
7. `ok`: no remaining parts. `partial`: at least one cut committed and unresolved leaves remain. `unchanged`: no cut committed and root unresolved. `unsupported`: root outside method capabilities. `failed`: numerical failure; roll the entire call back to a detached original in remainingParts. Diagnostics may record failed attempts even on `ok`. These rules avoid publishing partly trusted geometry after a numerical fault.

Return fresh deeply immutable data. Malformed geometry/options throw TypeError/RangeError as today. Ordinary unsuccessful search is an outcome. No claim of global optimality or infeasibility follows from exhausting two orientations or a work budget.

### Lineage is not persistence

Keys `0`, `0/0`, `0/1` describe a local binary derivation within this call, and `parentKey` gives the direct ancestor. Prefixes recover intermediate ancestry without a stored mutable tree. Associate the call with a block identity in the author script. Local keys repeat across calls and blocks; they are not globally unique IDs, cadastral identities or edit-stable correspondences.

A future persistence operation would need old/new geometry, matching policy, ambiguity and split/merge state-transfer rules. Identical seeds and similar shapes cannot substitute for that contract. Field state remains separately owned by Grid; a new layout creates new Fields. Keep the existing merge sourceCells provenance unchanged.

## Method scope and scientific evidence

This is a design synthesis. It does not claim faithful reproduction of any paper. Direct primary-source inspection in this task covered Vanegas §§4.2–4.3, Aichholzer event definitions, Parish §4.1 and Chen §§4.1–4.2. The Chen PDF exceeded the web tool's size limit; it was fetched into memory and text-extracted through Poppler, without writing another file. Independent reports supply additional inspected sections and extended bibliography.

| Method | Use in this library | Capability boundary |
| --- | --- | --- |
| OBB | First recursive method; explicit minimum guards and residuals | Convex, hole-free first. No optimality, exact target size or buildability guarantee. |
| Parallel strips | Later independent method for directional layouts | Needs direction, strip width, fragment and residual semantics; concave/holed intersection can produce disconnected pieces. Do not disguise OBB as strips. |
| Straight skeleton | Later road-following strips/back boundaries | Requires actual event handling, face attribution, strip correction and slicing. Skeleton alone is not a parcel generator. |
| Voronoi | `topology.voronoi`, later, explicit sites | Spatial territories, not assured street-facing lots. Convex domain first is simplest; concave clipping may make disconnected cells, which current one-Polygon Layout semantics must resolve. |
| Hierarchical co-generation | Separate future procedure | Couples parcel cuts, new streets and optimization; mutates the design problem by supplying missing access. |

Vanegas et al. (2012), CGF 31(2pt3), 681–690, distinguish OBB recursion from skeleton-derived strips and subsequent slicing. Their OBB method uses random displacement and conditional rotation; their finite skeleton offset can leave an inaccessible patio. Their edit-consistency machinery is additional work, not a consequence of recursive keys. The proposed bounded midpoint search deliberately adopts fewer mechanisms. Appendix pseudocode was not inspected here; no faithful-port claim is justified. [Primary paper](https://www.cs.purdue.edu/cgvlab/www/resources/papers/Vanegas-Eurographics-2012-Procedural_Generation_of_Parcels_in_Urban_Modeling.pdf), DOI [10.1111/j.1467-8659.2012.03047.x](https://doi.org/10.1111/j.1467-8659.2012.03047.x).

Aichholzer, Aurenhammer, Alberts and Gärtner (1995), JUCS 1(12), 752–761, define equal-speed inward edge motion with collapse/split events, including simultaneous events. Straight skeleton and medial axis differ for general polygons. Arbitrary ribs or bisectors do not implement this construction; the theorem is not a frontage, zoning or buildability theorem. [Publisher full text](https://www.jucs.org/jucs_1_12/a_novel_type_of/Aichholzer_O.html).

Parish and Müller (2001), SIGGRAPH, 301–308, recursively subdivide blocks and discard too-small or inaccessible lots. This is useful historical context, but City Library should retain those regions as explicit remaining parts instead. [Author PDF, §4.1](https://cgl.ethz.ch/Downloads/Publications/Papers/2001/p_Par01.pdf).

Chen, Song and Ortner (2024), CGF 43(2), e15053, score candidate cross-field streamlines, extend the street network for unreachable parcels, and optimize geometry. This is not OBB with an access flag. Its connected-network claim depends on its whole procedure; it cannot be transferred to finite-width road subtraction or arbitrary input networks. [Author PDF](https://sutd-cgl.github.io/supp/Publication/papers/2024-EG-UrbanModeling.pdf), [project](https://adaptivedesignlab.com/hierarchical-co-generation-of-parcels-and-streets-in-urban-modeling/).

Extended-paper implications, attributed to the independent primary-source review rather than fresh reproduction here:

- GlobalMapper and COHO generate learned building layouts conditioned on blocks/context. They do not establish a conservative cadastral partition, frontage or planning compliance. Keep data preprocessing, weights and inference out of the geometric kernel. [GlobalMapper](https://openaccess.thecvf.com/content/ICCV2023/html/He_GlobalMapper_Arbitrary-Shaped_Urban_Layout_Generation_ICCV_2023_paper.html), [COHO](https://arxiv.org/html/2407.11294v1).
- Reinforcement-learning urban planning belongs in a later policy layer using explicit actions and rewards. Learned preferences do not replace geometry validity. [Zheng et al.](https://www.nature.com/articles/s43588-023-00503-5).
- Tensor-field, example-driven and L-system road generators remain upstream of corridor unions and block extraction. Centerline cycles are not finite-width land polygons. [Chen et al. 2008](https://www.sci.utah.edu/~chengu/street_sig08/street_sig08.pdf), [Nishida et al.](https://www.cs.purdue.edu/cgvlab/www/resources/papers/Nishida-CGF-2016-Example_Driven_Procedural_Urban_Roads.pdf), [Mei](https://hosei.ecats-library.jp/da/repository/00021530/).

Retain the verified bibliography corrections in synthesis: Wickramasuriya et al., Environmental Modelling & Software 26(12), 1675–1684, DOI `10.1016/j.envsoft.2011.06.003`; Koc et al., Municipal Engineer 175(1), 16–28 (2022 issue, online 2020); GlobalMapper ICCV2023 454–464; Example-Driven Procedural Urban Roads CGF35(6), 5–17; Yandong Mei is the correct author name. Wickramasuriya/Koc full-method access was limited in the independent report: do not derive a faithful algorithm from abstract-level evidence.

## Geometry dependencies: narrow comparison before selection

| Candidate | Suitable job | Tradeoff / decision needed |
| --- | --- | --- |
| Existing bounded TS kernel | Convex OBB, original split, small exact-coordinate fixtures | Lowest integration cost; not general Boolean geometry. Do not extend bespoke clipping into a purported universal robust engine. |
| polygon-clipping | Polygon/MultiPolygon union, intersection and difference | Native JS and MIT; no complete corridor/offset/skeleton solution. Verify near-coincident geometry, deterministic ordering, exception/resource limits and label reconstruction. |
| Clipper2 | Union/difference plus offset/corridor construction | Integer internal model and scaling choices; C++/C#/Delphi upstream means JS/WASM bridge/package questions. Quantization may erase tiny features; conservation and displacement must be audited. |
| CGAL straight skeleton | Later skeleton backend/reference oracle | Real polygon-with-holes skeleton capability; C++/WASM cost and package-specific GPL/commercial license. Not a free substitute for a permissive JS dependency. |

Primary sources checked: [polygon-clipping repository](https://github.com/mfogel/polygon-clipping) and [MIT license](https://github.com/mfogel/polygon-clipping/blob/main/LICENSE.md); [Clipper2 overview](https://www.angusj.com/clipper2/Docs/Overview.htm), [robustness](https://www.angusj.com/clipper2/Docs/Robustness.htm), [license](https://www.angusj.com/clipper2/Docs/License.htm); [CGAL manual](https://doc.cgal.org/latest/Straight_skeleton_2/index.html) and [package header license](https://github.com/CGAL/cgal/blob/main/Straight_skeleton_2/include/CGAL/Straight_skeleton_2.h). CGAL's inspected header says GPL-3.0-or-later OR commercial; check the exact chosen package and distribution, not a blanket claim about all CGAL. Clipper2's upstream license is Boost Software License 1.0; a wrapper needs its own inspection.

Recommendation: evaluate polygon-clipping and Clipper2 against the same block fixtures before choosing. Prefer the smaller JS dependency if it meets the required precision/corridor composition; choose Clipper2 only with an explicit scaling and deployment contract. Defer CGAL runtime integration until skeleton output is an accepted user task. Exact predicates, integer clipping and a famous library name are not universal robustness proofs.

Pin versions and inspect transitive licenses, JS/WASM wrapper license, distribution obligations, browser/Bun/Node compatibility, initialization lifecycle, bundle cost and source provenance. Do not copy paper/reference code until licensing is established. Original paper images remain separately attributed research evidence, not library screenshots or unrestricted assets.

## Migration delta and staged acceptance

No breaking migration is recommended. Keep existing Polygon format, status meanings, numerical bounds, root import, split/merge results, Layout key semantics and Grid behavior. Add new functions only with implementations; add the three small subdivision/label type families and an operation-specific result. `minimumFrontage` and `boundarySegments` are explicit proposed additions to the subdivision catalogue. New canonical output ordering, targetArea-as-upper-bound, budget defaults and label-overlap rules require recorded acceptance. Existing diagnostic strings remain strings; structured diagnostics are new subdivision data only.

1. **Freeze the contract.** Resolve open choices below and freeze four/five asserted scripts for the next slice. Preserve the five delivered foundation checksums. Include negative type cases for mixed method options and unchanged public signatures.
2. **OBB slice from authored blocks.** Implement only deterministic convex recursion, interval inheritance, guard retries and residuals. Verify west-only frontage, narrow strip, acute triangle, rotated/symmetric polygons, point contact, partial labelled edge, rejected concavity/holes, malformed input and every budget. Include partial progress with both accepted and pending leaves, not just all-pending output.
3. **Corridor/block slice.** Compare dependencies on independent analytic fixtures: crossing strips subtract their overlap once; T junctions; clipped road ends; dead-end notch; closed ring road producing an island; narrow necks; coincident boundaries; unequal widths; hole touching domain edge; empty/full exclusion; large allowed coordinates. Check area AND containment/nonoverlap AND boundary attribution. Boolean geometry needs planar intersection handling even without graph construction. Graph planarization for traffic is separate.
4. **Integration slice.** Prove selected extracted blocks can be subdivided. Do not make general topology import claims until partial-edge normalization and concavity/holes policies have their own acceptance. Any state migration remains explicit user code.
5. **Additional methods only on demand.** Parallel strips before skeleton if actual examples need them. Skeleton requires event/offset/strip fixtures and license resolution. Voronoi and co-generation have separate acceptance sets. Randomized OBB needs a displacement distribution, draw order/retry consumption contract, explicit Random input and continuation fixtures before exposure.

For each runtime slice: public behavior/type checks, typecheck/build, packed Bun/Node consumer, complete project check with baseline failures reported, pinned provenance and an independent review under the then-current target instructions. The target worktree's historical Gemini model differs from newer main instructions; do not silently select a reviewer from an old receipt. Rendered visual quality, if a UI is later built, needs matched camera/seed/viewport/DPR images and actual browser interaction plus independent pixel review. Technical conservation cannot approve visual quality.

Open choices that block a final freeze:

- Confirm total frontage versus one contiguous entrance. This proposal chooses total, retaining intervals so models can require more.
- Confirm targetArea as a strict completion upper bound; the name could suggest a statistical mean. Changing it later would change status expectations.
- Accept deterministic OBB first, with randomized cuts deferred despite the catalogue reserving `random` for suitable methods.
- Choose Boolean dependency and precision behavior before claiming arbitrary road-block extraction. No silent precision grid or tolerance parameter.
- Confirm new-procedure canonical ordering and OBB tie rules; add a rotated square and reversed-ring fixture before freezing.
- Confirm rollback-on-numerical-failure and a `partial` status even when progress has only produced pending leaves.
- Decide whether future partial-edge normalization lives in topology import or a dedicated measured geometry operation. Do not squeeze it into Grid.

## Verification statement

This task inspected source, rules, APIs and primary papers and wrote only this proposal file. It did not run implementation tests, public candidates, a build, package consumer or browser verification. It changed no repository, branch or runtime. Numeric examples are analytical contract expectations, not observed library outputs. The proposal is ready for synthesis and independent design review, not runtime acceptance.


## Integrated finite topology track — 8 November 2026

The user accepted Astra's [Townscaper integration proposal](evidence/townscaper-astra-proposal.md) as an addition to this concept. The [API reference](api-reference.md#topology-quadrilaterals) and [implementation handoff](IMPLEMENTATION-HANDOFF.md) own the current integrated syntax and next work. Earlier source/review statements in this file describe the original parcel-only proposal, not approval of later additions.

Use `topology.quadrilaterals({ rings, edgeLength?, random })` for an unrelaxed finite regular hex patch, then `topology.relax({ layout, method: "squareTarget", iterations })`. Both return the existing immutable Layout; no new class or namespace is added. Fixed boundary, shared construction vertices, strict convex-quad validity and local-key correspondence belong to this method's explicit contract. It does not promise arbitrary-domain all-quad coverage, public dual mapping or seamless chunks.

The generator's internal triangle pairing/refinement is neither topology.group nor geometry.subdivide. Square-target relaxation is not Lloyd and never transfers Field state. The prior boundary/pointSpacing/relaxationIterations sketch and Lloyd signature remain deferred research overloads; mixed keys are rejected. OBB, corridor/subtract/frontage and skeleton retain their separate parcel contracts and readiness.

The finite signatures/scope are authorized for integration and implementation planning. Exact enumeration/draw consumption, force scale, step-halving/retry and iteration/resource caps remain pre-example-freeze decisions. The target implementation thread may resolve routine choices with evidence and independent design review, then freeze four or five public examples before runtime. It must preserve already frozen signatures/expectations. See TOWNSCAPER.md for original-source limits and IMPLEMENTATION-HANDOFF.md for the concrete first PR and the full retained catalogue roadmap.
