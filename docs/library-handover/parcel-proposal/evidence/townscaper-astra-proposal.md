# Townscaper research integration — proposal for parent discussion

Status: design advice only, 8 November 2026. No accepted/proposed repository contract has been changed. No implementation, tests, independent review or original-game fidelity is claimed.

## Recommendation

Add one finite hex-patch overload to the already proposed `topology.quadrilaterals`, and one explicitly named `squareTarget` method to the already proposed `topology.relax`. Keep their output the existing immutable `Layout`. Generate unrelaxed quads, then relax explicitly. Reuse existing polygon queries, `Random` and `Grid.add`. Do not introduce a mesh class, public halfedges, a registry, a pipeline object or a public dual operation now.

This integrates all research by assigning each finding a consequence, including explicit deferrals. It does not equate research integration with implementing every Townscaper subsystem.

## Inspected baseline and authority

- Source concept worktree `/home/david/.codex/worktrees/city-parcel-contract`: clean `docs/parcel-contract-proposal`, `1b12a18b`. Proposal/reference/inventory, contract, syntax report, classic and extended papers and review responses distinguish proposals from delivery.
- Source primary `/home/david/Projekte/city_game`: `main`, `3e1d34f1`, with two unrelated untracked handover files. Root PLAN owns coordination. Nothing changed there.
- Actual target `/home/david/.t3/worktrees/city-library/feat-grid-parcel-foundations`: clean `feat/grid-parcel-foundations`, `2a7f3eb`. Actual topology export is only `square`, `hex`, `fromPolygons`; Layout queries and the layout Field example confirm the syntax below.
- Target primary `/home/david/Projekte/city-library`: `main`, `dfd0584`, with concurrent changes. Its current coding standards require minimum sufficient architecture and readable ordinary TypeScript. The grid worktree has no `docs/CODING_STANDARDS.md`; main's current standards and the supplied syntax audit are not evidence of an additional delivered API.
- Grid Lab PLAN/README and `core/generator.ts` confirm regular hex-patch triangles, seeded shuffle/pairing, triangle-to-three/quad-to-four subdivision, then eight synchronous Laplacian steps with fixed boundary and weight `relaxation * .35`. Rounded vertex keys and display normalization belong to that experiment, not the target contract.
- No server was started or inspected: this task has no rendered-flow work and makes no server-origin or browser acceptance claim.

## Research consequences

1. **Regular triangles, not arbitrary random points.** The author explicitly corrects this in [Beyond Townscapers, 40:41–41:20](https://www.youtube.com/watch?v=Uxeo9c-PX-w&t=2441s). Pair adjacent triangles randomly, subdivide every remaining triangle into three quads and every paired quad into four. The Delaunay discussion around 19:45 concerns the next project. It must not justify a Townscaper Delaunay generator.
2. **Randomness belongs to pairing.** [Organic Towns, 08:53–09:40](https://www.youtube.com/watch?v=1hqt8JkYRdI&t=533s) describes patch-position-derived seeds and pairing as the random step. Finite library generation should accept an explicit Random stream; position hashing belongs to a later chunk contract. No jitter, random relaxation or hidden occupancy draws.
3. **Square-target relaxation is its own method.** [Organic Towns, 17:20–18:59](https://www.youtube.com/watch?v=1hqt8JkYRdI&t=1040s) describes corner-vector rotation, averaging, rotation back, accumulated incident-quad forces and iteration. Neither the local Laplacian implementation nor Lloyd is that method.
4. **Two spatial grids.** [Beyond Townscapers, 10:22–10:44](https://www.youtube.com/watch?v=Uxeo9c-PX-w&t=622s) distinguishes player cells including triangles, pentagons and hexagons from their all-quad dual used for modules. Our first quad Layout represents the module-side geometric substrate, not a reproduction of the player's grid. Mesh duality does not mean immutable geometry versus mutable Field state.
5. **Seams require an algorithm.** [Organic Towns, 13:00–14:12](https://www.youtube.com/watch?v=1hqt8JkYRdI&t=780s) jointly relaxes clusters of three patches and interpolates between clusters. Fixed boundaries merely keep our finite domain intact; they do not implement seamless extension. Variable patch resolutions at 19:10 are another future boundary-conformity problem.
6. **Architecture is a separate solver.** The [developer interview](https://www.gamedeveloper.com/game-platforms/how-townscaper-works-a-story-four-games-in-the-making) supports compatible module selection with priorities, enclosed-garden behavior and tolerated unsolved joins. Distinguish the interviewer's WFC/Marching-Cubes explanation from the author's quotations. A 256-case occupancy mask is not the complete architectural solver. A future headless module solver consumes occupancy, color, levels and incidence; rendering consumes its placements. Neither belongs in topology.

The supplied transcripts were inspected locally at the cited ranges. The supplied author [Imgur explanation](https://imgur.com/gallery/instant-town-building-i364LBr) corroborates the four-step pipeline according to the research handoff; direct fetching here returned only the JavaScript shell. Original game source was not identified. Exact seed hash, pair ordering, damping, interpolation and degeneracy safeguards remain unknown. The following numerical choices are library proposals, not recovered Townscaper code.

## Minimal alternatives and choice

A single generator with automatic relaxation saves one statement, but duplicates controls with the existing proposed relax operation and obscures the unrelaxed fixture. A generic public mesh/dual/subdivision framework exposes several unneeded contracts. **Choose two ordinary calls** using the existing namespaces. This keeps generation and relaxation independently inspectable without introducing another authoring vocabulary.

### Minimal before/after delta

Before, current research signatures (not available exports):

```ts
topology.quadrilaterals({ boundary, pointSpacing, relaxationIterations, random });
topology.relax({ layout, method: "lloyd", iterations });
```

After, proposed first deliverable signatures:

```ts
topology.quadrilaterals(options: {
  rings: number;
  edgeLength?: number;
  random: Random;
}): Layout;

topology.relax(options: {
  layout: Layout;
  method: "squareTarget";
  iterations: number;
}): Layout;
```

This is an additive, mutually exclusive generator overload, not a silent reinterpretation of `boundary` or `pointSpacing`. Retain the old arbitrary-boundary signature and Lloyd method as explicitly deferred research records until their owners approve a revision. Do not ship ignored options or always-unsupported placeholder methods. If those calls have been frozen elsewhere, preserve them exactly and agree a separate implementation scope. No delivered API changes. Type and runtime validation reject mixing overloads.

`rings` counts regular triangular-lattice steps from the hex center to each corner; it is not a length or a cell count. `edgeLength` is the source triangle edge length in caller XY units, default 1. Fixed orientation and center `(0,0)` avoid unnecessary transform controls. For radius n, the hex has side length n*edgeLength and 6*n² initial triangles. A simple conservative first cap is 1..7 rings (at most 18*n² quads before accounting for pairing, hence <=882); accept this only with the existing resource budgets. No hidden 20-unit normalization, no implicit metres, no arbitrary-domain clipping.

Do not expose `relaxationIterations` on the new overload. Zero or more relaxation iterations are controlled in exactly one place. Do not add damping, jitter, smoothing-strength or method parameter bags before fixtures establish a real author need.

## Geometric contract proposed for the first slice

**Construction.** Enumerate integer lattice vertices and faces deterministically. Pair only edge-adjacent unused triangles. Give every original edge one shared midpoint and every mixed face one center; subdivision makes conforming quads, including unpaired boundary triangles. Use integer/provenance vertex IDs and compute shared coordinates once. Never import Grid Lab's seven-decimal coordinate welding. Pairing is internal construction, not `topology.group` or repeated public polygon merge calls.

**Domain.** The entire regular hex domain is covered. Pin every boundary vertex during relaxation. Clipping an arbitrary polygon can produce triangles or pentagons, lose coverage, create holes and violate importer conformity. Reject any implication that a clip preserves all-quads; keep arbitrary-domain quad meshing outside this slice. Whole-cell selection could retain quads but would have a jagged domain and must be labelled as selection, not exact clipping.

**Square target.** For consistently CCW corners p0..p3, a concrete library convention is c=(p0+p1+p2+p3)/4 and u=average(R(-i*pi/2)*(pi-c)); the target corner is c+R(i*pi/2)*u. Equivalent inward-vector conventions reverse signs consistently. Compute all targets from the old iteration; accumulate target-minus-current forces for each shared vertex, then publish positions synchronously. This illustrates the author's mechanism; it does not establish his exact center or damping choices.

Propose one fixed internal step scale, applied to summed forces, bounded by maximum incident valence. Choose its numeric value in the fixture stage; do not quietly replace summed forces with Laplacian averaging. Initially support conforming strictly convex quads only, including suitable authored Layouts; reject non-quads and concave/degenerate faces even though the general Layout importer supports a wider set.

**Validity and failure.** All accepted iterations must preserve four distinct corners, positive orientation/area, convexity, noncrossing edges, shared endpoints, full-edge conformity and disjoint interiors. Check global overlap too, not just per-face signed area. Propose deterministic bounded global step-halving when a step is invalid; if no admissible step is found, throw RangeError and publish no result. Freeze retry cap and representability rules before implementation. Do not silently return the last good partial layout as a successful completed run. This follows the proposed Layout-returning operation's throw convention without inventing a universal Result wrapper. Numeric policy is library-specific, not a source-fidelity claim.

**Immutability and identity.** Every successful call returns a new canonical deeply immutable Layout, including zero iterations. Square-target relaxation preserves incidence, cell ordering and local keys as an explicit same-cell correspondence to its input. Numeric keys remain revision-local, never global parcel IDs. Neighbor ordering and boundary point ties keep delivered behavior (ascending keys; lowest containing key). Polygons and spatial cellAt results can change. Output ring serialization must not re-sort cells by their moved coordinates: document this method-specific exception to general proposed canonical-output ordering.

**RNG.** Validate shape/size/resource constraints before consuming the explicit stream. Specify lattice enumeration, Fisher–Yates order, candidate sorting and partner selection/draw count before example freeze; do not copy the prototype's incidental draw on an empty candidate list. Freeze continuation, not merely same-seed screenshots. Pairing consumes RNG; subdivision and relaxation consume none. Reusing an advanced stream intentionally changes output; regeneration from the same initial stream state and algorithm version reproduces output. Chunk-position hashing and cross-version stable IDs are not promised.

## Complete proposed author examples

These are readable proposals, not executed/frozen scripts. Only the new generator/relax calls are unavailable at the target baseline; all surrounding API calls use the inspected vocabulary.

### Generate, relax, query and attach independent state

```ts
import { Grid, Random, geometry, topology } from "city-library";

const raw = topology.quadrilaterals({
  rings: 3,
  edgeLength: 4,
  random: Random.add({ seed: 7 }),
});
const layout = topology.relax({
  layout: raw,
  method: "squareTarget",
  iterations: 32,
});

const area = layout.cells.reduce((total, cell) => {
  return total + geometry.area({ shape: layout.polygon({ cell }) });
}, 0);
console.log("Hex patch area", area);

const grid = Grid.add({ layout, state: { population: 0 } });
const selected = grid.fieldAt({ x: 0, y: 0 });
if (selected) selected.population = 12;

const cell = layout.cellAt({ position: { x: 0, y: 0 } });
if (cell !== undefined) {
  console.log("Cell", cell, "neighbors", layout.neighbors({ cell }));
}
```

This is an ordinary quad-based model. It deliberately does not label quad Fields as Townscaper player cells or simulate a building solver with a height scalar.

### Relax an existing layout; transfer chosen state explicitly

```ts
import { Grid, topology } from "city-library";

const original = topology.square({ columns: 3, rows: 3, cellSize: 2 });
const before = Grid.add({ layout: original, state: { population: 0 } });
const selected = before.fieldAt({ x: 3, y: 3 });
if (selected) selected.population = 20;

const revised = topology.relax({
  layout: original,
  method: "squareTarget",
  iterations: 4,
});
const after = Grid.add({ layout: revised, state: { population: 0 } });

// Explicit model policy using this method's preserved cell ordering.
const previousFields = before.fields;
const nextFields = after.fields;
for (const cell of original.cells) {
  const previous = previousFields[cell];
  const next = nextFields[cell];
  if (previous && next) next.population = previous.population;
}

console.log(before === after); // false: new Grid and new Field identities
console.log(original === revised); // false: new immutable Layout
```

Exact squares are a fixed point with the proposed square-target convention. The second example makes the state-transfer boundary visible; an irregular authored fixture must separately demonstrate actual movement. Copying population by correspondence is a model choice. Density might require area-aware conversion; Agents require their own relocation policy. No transfer helper or Field-ID reuse is implied.

## Reuse, must add, defer

**Reuse:** Layout, PlanarPolygon closed rings, root imports, exact full-edge adjacency, existing queries, `Random.add`, `Grid.add`, direct typed Field values and ordinary functions. Internal vertex-face incidence can be reconstructed once from canonical polygons; maintain only the concrete arrays/maps needed by the algorithm.

**Must add:** finite hex-patch generation, square-target relaxation, shared-construction identity, bounded validity checks, method-specific ordering/continuation contracts, and documentation distinguishing player and module topology. These additions require examples and numerical decisions before runtime work.

**Defer:** public dual mapping; finite dual boundary closure; seamless chunk extension; coordinate seed hash; variable-resolution transitions; occupancy by individual level/color; compatible architecture modules and their priorities; garden detection; rendering; arbitrary-boundary all-quad meshing; generic Lloyd on Layout.

Public duality becomes justified when an actual caller must map player cells to module corners and back. That requires cyclic incidence and a boundary rule; cell-neighbor arrays alone cannot encode it. Internal vertex/edge/face incidence is enough for the finite generator and square relaxation today. If dual mapping becomes public later, require explicit source/output correspondence rather than inferring identity from matching cell numbers. Attaching a Grid to a dual Layout would still be an independent state decision.

Lloyd must remain a genuinely Voronoi operation with domain and generating-site provenance; arbitrary Layout polygons cannot supply that interpretation. Do not rename Lloyd to squareTarget or silently apply either to unsupported geometry.

## Consequences for parcels and grouping

`topology.group` continues to group eligible neighboring cells without moving boundaries or merging polygons. Its reserved random option has a separate draw contract; generation must not rely on its BFS semantics for random triangle matching. Groups may still fail bounded `geometry.merge`.

`geometry.subdivide` remains parcel division with area/frontage constraints and residual accounting. Triangle-to-three/quad-to-four refinement is internal mesh construction, not a new OBB/parallel-strip/straight-skeleton method. Parcel cuts may create T-junctions; neither this generator nor relaxation upgrades `fromPolygons` to accept them. Straight skeletons, road corridors, frontage, learned layouts and street generators retain their existing independent scope. No Townscaper finding resolves the skeleton backend or parcel access questions.

## Five proposed fixture/script tasks

1. **Finite pipeline and domain:** rings 1 and 3, several pinned seeds, shared-edge equality, closed four-corner cells, connectedness, no overlaps/gaps, analytic hex area `3*sqrt(3)/2*(rings*edgeLength)^2`; internal focused fixtures exercise triangle-to-three and quad-to-four independently. Include units scaling and conservative resource-bound rejection.
2. **Square target versus Laplace:** rotated square fixed point and an asymmetric conforming quad patch with a movable interior vertex; independently calculate a first square-target step. Reverse input winding/cyclic start, check synchronous incidence forces and pinned boundary; do not accept a visually smoother Laplacian result as method correctness.
3. **Validity and failures:** thin/near-degenerate quads, unsupported concavity/non-quads, nonmanifold and T-junction inputs, boundary pinning, attempted flips/crossings, step-halving exhaustion and numeric limits. Verify no partial result publication or input mutation. Importer rejection remains distinct from relax rejection.
4. **Determinism and revisions:** matching fresh streams, advanced-stream continuation, invalid-input no-draw guarantee, no RNG in relaxation, zero-iteration new snapshot, preserved local cell order/adjacency, old query immutability, unchanged boundary tie rules and no cross-layout persistent-ID claim.
5. **Public composition and evidence:** both examples above plus explicit state-transfer assertions; unchanged delivered grid scripts and type-negative mixed-option cases. Later render matched seed/camera/viewport/DPR fixtures comparing raw, Laplacian and square-target results against timestamped references, with a separate visual decision. Technical checks alone cannot approve appearance.

These are proposed tasks, not tests run during this advice pass.

## Integration stages and decisions

1. Parent discusses this recommendation with the user. Record acceptance of the overload and the bounded finite scope; retain prior evidence and signatures.
2. Revise only approved proposal sections, then freeze four or five public scripts and numerical/continuation behavior. No runtime implementation before the example-first gate.
3. Implement the finite generator and square-target slice in the target's isolated workflow; run its required checks and authorized independent review. Preserve existing accepted scripts. Review visual fidelity separately if rendered evidence is produced.
4. Add dual mapping, chunks or an architecture solver only when a concrete next author scenario requires them, each with its own examples and boundary policy.

Precise decisions still needed: accept `rings` and source `edgeLength` naming; approve additive overload versus explicit replacement of the old research signature; select deterministic pairing enumeration/draw consumption; select center/damping/step-halving policy and numerical limits; freeze iteration cap (256 is a candidate, not a recovered constant); approve strictly convex input and fixed finite boundary; approve preserved cell ordering across relax revisions. Original-game algorithm details remain unknown even after these library decisions are settled.

## Exact later documentation edits

- `api-reference.md#topology-quadrilaterals`: new finite overload, source algorithm, domain/units/order/RNG/budgets; preserve arbitrary-boundary research scope explicitly.
- `api-reference.md#topology-relax`: squareTarget option and capability/failure/revision semantics; keep Lloyd provenance restriction and defer its implementation.
- `api-reference.md#layout-type`, Shared contracts → Units/precision/budgets and Ownership/ordering/randomness: distinguish revision-local keys, shared construction, preserved relax ordering and no state transfer.
- `api-reference.md#topology-from-polygons`: retain full-edge/T-junction limits; add cross-reference, no expanded admission.
- `api-reference.md#topology-group` and `#geometry-subdivide`: explain grouping versus internal triangle pairing and parcel division versus quad refinement; no signature changes.
- `api-reference.md#grid-bridge` / `#grid-add-layout` and Future generation boundary: identify module-grid versus player-grid meaning and explicit state ownership; defer dual/chunk/architecture contracts.
- `api-table.md#topology-quadrilaterals` and `#topology-relax`: mirror overload, method and status exactly. Shared data table Layout/local-key rows: clarify correspondence. Existing grouping/subdivision and Grid rows retain signatures; add only concise limits/links.
- `README.md` Recommended API / Delivery order: add the separate finite topology track without replacing the parcel roadmap. `CONTRACT.md` Method scope / Migration delta: record the separation and selected decisions. `PAPERS.md`: add timestamped Townscaper primary evidence and unknowns; `EXTENDED-PAPERS.md`: link the architectural-solver boundary without treating it as another parcel method. `SYNTAX.md`: retain delivered syntax baseline and label new calls as proposals. `PLAN.md`: approved scope/next fixtures only.
- `COVERAGE.md` and review evidence: reconcile operation counts/status after approval; preserve the existing independent review as review of its original revision, never retroactively as approval of this proposal.

Only this `/tmp` advice file was written. No repository edits, commits, runtime tests, browser checks, delegated work or independent review were performed.
