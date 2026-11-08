# City Library syntax and contract audit

Date: 2026-11-07. Read-only audit; no runtime checks or new acceptance claimed.

## Inspected authority and actual revision

Read city_game root PLAN.md, City Library main AGENTS.md, PLAN.md, docs/DESIGN.md and docs/CODING_STANDARDS.md. Verified actual worktrees: main dfd0584, experiment/netlogo-web-catalog dc7b164, feat/grid-parcel-foundations 2a7f3eb. Main has concurrent uncommitted instructions/docs/UI work and is not the complete grid delivery baseline. Grid phase is separate, not merged into main. Current main AGENTS requires independent substantial design/transfer review with antigravity gemini-4-argon; historical grid PHASE-PLAN used gemini-3.8-flash and does not silently override current review instructions.

The grid worktree docs/DESIGN.md now owns UI design; docs/ARCHITECTURE.md owns domain architecture. Follow actual authority links rather than assuming the old DESIGN structure still applies.

## Existing public syntax

Public import is the package root `city-library`. package.json provides only `.` export; new subpath imports would need an explicit packaging decision. index.ts exports Agent, World, run, Random, Graph, Grid, topology, geometry, stats and public types. No parcel namespace/class exists.

1. `examples/a1/01-energy-model.ts`:

```ts
import { Agent, World, run } from "city-library";
const person = Agent.add({ energy: 10 });
const world = World.add();
world.add(person);
function step() { person.energy -= 1; }
run(world, step, 5);
```

This is ordinary TypeScript with direct typed properties, explicit membership and named rules. An agent is not a compulsory wrapper for geometry. `world.tick.value` differs from procedure invocation count.

2. `examples/grid-parcels/02-square-and-hex-field-rule.ts`:

```ts
const square = topology.square({ columns: 3, rows: 3 });
const squareGrid = Grid.add({ layout: square, state: { temperature: 1 } });
const next = squareGrid.fields.map(field =>
  squareGrid.neighbors(field).reduce((sum, neighbor) => sum + neighbor.temperature, 0));
squareGrid.fields.forEach((field, index) => { field.temperature = next[index]!; });
```

Read old state then publish next state using ordinary arrays/loops. No new process DSL. Layout is detached immutable geometry; Grid/Field owns mutable simulation state. Layout Grid has no regular-only cellSize/space/diffuse capabilities.

3. `examples/grid-parcels/05-convex-split-and-rejections.ts`:

```ts
import { geometry, type PlanarPolygon } from "city-library";
const shape: PlanarPolygon = {
  type: "Polygon",
  coordinates: [[[0, 0], [4, 0], [4, 2], [0, 2], [0, 0]]],
};
const result = geometry.split({
  shape, point: { x: 2, y: 0 }, direction: { x: 0, y: 1 }, minimumArea: 3,
});
```

PlanarPolygon uses CLOSED coordinate rings, not interim `{ outer, holes }`. Additional coordinate rings represent holes. A polygon position is a coordinate tuple; point/direction arguments use accepted Position/Vector objects. Do not invent a third geometry representation.

4. `examples/grid-parcels/04-merge-and-source-provenance.ts` and PHASE-PLAN:
`geometry.merge({ shapes })` or `geometry.merge({ layout, cells })`; outputs preserve source cell keys in caller order. Those numeric keys are local to a layout revision, not persistent parcel/cadastral IDs.

5. `examples/normal/01-affine-normal.ts`:

```ts
const random = Random.add({ seed: 19 });
const value = random.number({ distribution: "normal", mean: 10, deviation: 2 });
```

A seed initializes an explicit stream; it is not a complete continuation snapshot. Accepted API state/cache/draw-order behavior must remain unchanged. Deterministic geometry should make no incidental random draws. Pass a stream only for procedures which explicitly use randomness.

The base experiment `examples/a1/03-membership-lifecycle.ts` confirms `.add`/`.delete`, foreign-world rejection, canonical references, detached collection snapshots. Domain terms remain descriptive; do not add create/remove aliases or an obligatory Parcel Agent class.

## Binding planned operations versus actual exports

Actual geometry export is frozen object `{ direction, normalize, distance, map, contains, bounds, area, merge, split }`. Only square/hex/fromPolygons topology and bounded merge/split are delivered. Existing contains/bounds signatures must not be silently replaced by proposed shape-object overloads.

The approved target inventory `docs/grid-parcels/API.md` already proposes:

```ts
geometry.corridor({ paths, width, endCap?, cornerStyle? })
geometry.subtract({ shape, excludedShapes })
geometry.boundaryOverlap({ shape, boundarySegments })
geometry.subdivide({ shape, method, ... })
```

Methods are `orientedBoundingBox`, `parallelStrips`, `straightSkeleton`; method-specific settings include targetArea, minimumArea, minimumWidth, maximumParcels, maximumDepth, maximumAttempts, direction, stripWidth, random. Require an explicit stopping goal and bounded work. Voronoi belongs only to topology in the current catalogue. A change to a direct Voronoi subdivision method needs a recorded design reason, not a new alias added casually.

The inventory is a target contract, not delivered functionality. STATUS.md explicitly defers all high-level procedures, corridors, general Boolean operations, offsets, organic generation and 3D.

## Error, precision, ownership and units contracts to preserve

- Malformed/invalid inputs throw TypeError/RangeError. Valid unsupported inputs return `unsupported`. No supported useful change returns `unchanged`; numerical failure returns `failed`. Do not collapse these into null/empty arrays or throw for ordinary unsplittable geometry.
- Existing split returns `{ status, parts, diagnostics }`, retaining detached original on unchanged/unsupported/failed. Existing merge returns shape/sourceCells on success or remainingShapes on unsupported. Future recursive results may add `partial`; they must account for all retained area and unfinished pieces.
- XY coordinates use declared local lengths; area is squared coordinates. Do not label arbitrary units metres, or infer traffic/legal access from geometric boundary contact.
- First-phase supported bounds: 1024 cells/shapes, 128 closure-inclusive positions/ring, 8192 positions total, coordinate magnitude <= 1e6. Imported conforming adjacency uses exact predicates without epsilon snapping. Relative 1e-9 applies to area residuals/split diagnostics. Do not import research fixture epsilons or +/-1000 bounds as accepted target defaults.
- Existing split is convex, hole-free; area supports net holes/MultiPolygon sum. A general union is not implied by summing areas. Current merge rejects disconnected, holed, nonconforming output while retaining originals.
- Geometry and topology return detached data; topology queries are immutable. Split/merge never transfer Field state or Agent membership. New output lineage should reference source geometry explicitly, without claiming persistent semantic identity.

## Minimal syntax recommendation

Extend accepted geometry functions and root exports, using one flat configuration and discriminated method-specific types. Retain method names above. Avoid ParcelManager, factory registries, fluent builders, nested pipeline DSL, city policy objects and compulsory World. Keep street use, target lot sizes and building decisions in ordinary script variables/functions.

A proposed author flow should read as ordinary statements: produce corridor geometry, subtract it from a domain, label surviving road-facing intervals, then subdivide each block. Shared road-boundary labels are a genuine missing data contract, not something to hide inside a World or infer from every outer edge. Preserve partial intervals and distinguish geometric frontage from road-network connectivity or legal access.

Do not flatten contradictory algorithm meanings into one universal parameter bag: use a TypeScript discriminated union under `method`, so skeleton-only options do not silently affect OBB. Avoid unnecessary configuration—freeze defaults only after real public examples identify what is required.

## Coding and acceptance requirements

Minimum Sufficient Architecture; functions preferred, classes for identity/lifecycle only. Strict types and unknown external data. Clear control flow; no unnecessary wrappers, service locators or generic frameworks. Review signals ~20 lines/function and ~200/file are not caps. Each state fact has one owner. Measure before optimizing. Four or five complete asserted public example scripts must precede runtime implementation; accepted scripts cannot be weakened for convenience. New slices need public type/behavior/build/packed-consumer checks, exact provenance and independent review; browser work has separate real-browser gates. This audit changes no code and runs no runtime/build/browser checks.

## Scope disposition

Astra should define a small coherent contract plus explicit method capability table. Learned city layout work (GlobalMapper, COHO, RL planning) may inform later conditional generators, but cannot justify adding training/inference dependencies to the minimal geometric kernel. Their bibliography/content is assigned to the research stream; no new primary-source analysis of those papers is claimed by this syntax audit.


## Integrated proposal note — 8 November 2026

The delivered baseline audit above is unchanged. The subsequently accepted Townscaper proposal adds two unavailable calls under the existing topology namespace: finite `quadrilaterals({ rings, edgeLength?, random })` and `relax({ layout, method: "squareTarget", iterations })`. They reuse the public root, Layout, closed PlanarPolygon and Random; no new mesh/Parcel manager or DSL is introduced. Ordinary loops perform explicit chosen Field-state transfer between corresponding layout revisions. The earlier arbitrary-boundary overload and Lloyd method remain research rather than being silently renamed. Exact new signatures, failures and deferred numerical choices are in [the reference](api-reference.md#topology-quadrilaterals); no new exports or runtime checks are claimed by this note.
