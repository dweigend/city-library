# Townscaper: finite quad topology and square-target relaxation

The approved integration reuses Layout, Random and Grid. It adds a finite hex-patch overload of `topology.quadrilaterals` and a `squareTarget` method of `topology.relax`, with separate calls. No public mesh class, halfedge framework, solver registry or implicit dual-grid conversion is needed. These remain proposed exports until example-first implementation and checks pass.

## Primary evidence

Oskar Stålberg's [Organic Towns from Square Tiles, IndieCade Europe 2019](https://www.youtube.com/watch?v=1hqt8JkYRdI) explains the original technique. The research agents downloaded and inspected its automatic English subtitles, not just another author's reconstruction.

- [08:53–09:40](https://www.youtube.com/watch?v=1hqt8JkYRdI&t=533s): regular triangles in hexagonal patches, random triangle pairing, complete quad refinement and position-derived patch seeds. Pairing is the random construction step.
- [13:00–14:12](https://www.youtube.com/watch?v=1hqt8JkYRdI&t=780s): relax clusters of three patches together and interpolate between relaxed clusters for seamless extension. Independent fixed-border chunks do not reproduce this mechanism.
- [17:20–18:59](https://www.youtube.com/watch?v=1hqt8JkYRdI&t=1040s): rotate quad corner vectors by quarter turns, average, rotate back and accumulate target forces at shared vertices. This is a square-target solver, not Laplace or Lloyd relaxation. The demonstrated 256 iterations do not establish a universal default.
- [19:10 onward](https://www.youtube.com/watch?v=1hqt8JkYRdI&t=1150s): changing initial patch resolutions produces different local character; cross-resolution conformity is additional work.

[SGC21: Beyond Townscapers, 10:22–10:44](https://www.youtube.com/watch?v=Uxeo9c-PX-w&t=622s) explicitly distinguishes the player grid, including triangles, pentagons and hexagons, from the all-quad dual module grid. [40:41–41:20](https://www.youtube.com/watch?v=Uxeo9c-PX-w&t=2441s) confirms equal triangles in a perfect hexagon, triangle-to-three/quad-to-four refinement and chunks. The Delaunay discussion around 19:45 concerns the later project being presented, not this Townscaper generator.

The author's [Instant town building! development post](https://imgur.com/gallery/instant-town-building-i364LBr) corroborates the four construction steps. Its indexed author text was accessible; direct retrieval returned a JavaScript shell or rate limit. The primary talk subtitles supply the inspected detailed evidence.

The [interview with Stålberg](https://www.gamedeveloper.com/game-platforms/how-townscaper-works-a-story-four-games-in-the-making) describes compatible prioritized architecture modules, enclosed gardens and tolerated unresolved joins. Developer quotations are distinguished from the interviewer's WFC/Marching-Cubes explanation. Neither a 256-case binary mask nor our Quad Layout alone reproduces the architecture solver.

## Source limits and the local prototype

No public original Townscaper code repository was established. Exact seed hashing, pairing heuristics, center/damping choices, interpolation weights, degeneracy policy and complete chunk dependencies remain unknown. Our library's numerical decisions must be documented as its own contract, not recovered original code or fidelity proof.

Grid Lab's existing generator at `prototype/src/lib/experiments/grid-lab/core/generator.ts` is a finite Townscaper-inspired interpretation based on the Sylves tutorial. It already pairs triangular lattice faces and refines them into quads, then performs eight synchronous Laplace-neighbor smoothing passes with fixed boundary vertices and strength `relaxation * 0.35`. It uses rounded coordinate keys and normalizes to a 20-unit display span. Those are source-specific choices: none become City Library units, topology identity or the square-target method. The Voronoi branch's Lloyd relaxation is separate.

## Library use

```ts
import { Random, topology, Grid } from "city-library";

const raw = topology.quadrilaterals({
  rings: 3, edgeLength: 4, random: Random.add({ seed: 7 }),
});
const layout = topology.relax({ layout: raw, method: "squareTarget", iterations: 32 });
const grid = Grid.add({ layout, state: { population: 0 } });
```

This is proposed syntax, not a runnable delivered example. The generated Layout is the module-side geometric substrate. Mutable Fields are model data attached to that Layout; they are not a geometric dual. A later player/module mapping needs cyclic incidence, boundary closure and explicit correspondence, not another assumed meaning of a numeric cell key.

Generation produces conforming quads covering one regular hex domain; relaxation fixes that boundary, preserves cell order/incidence and returns a new immutable revision. Internal edge/face/vertex construction can remain concrete arrays/maps. Keep the existing closed PlanarPolygon format and exact shared-coordinate convention. New Grid construction creates new Fields; transfer of population, density or Agents is a separate explicit model policy.

The older arbitrary-boundary quad overload is still research: clipping can destroy quads. Lloyd remains a distinct Voronoi-site operation needing domain/site provenance. Do not rename either into the finite generator or squareTarget, and do not ship ignored options or always-unsupported placeholders.

## Included now and deferred deliberately

The finite construction and square-target method are the first runtime slice. Pairing enumeration/RNG consumption, exact center/step/step-halving policy, iteration/resource caps and failure behavior must be concretized before example freeze. See the [reference](api-reference.md#topology-quadrilaterals) and [implementation handoff](IMPLEMENTATION-HANDOFF.md).

Public dual mapping, arbitrary-domain all-quad meshing, seamless infinite chunks, coordinate seed hashes, variable-resolution seams, level/color occupancy, architecture compatibility and rendering remain separate future tasks. All findings are integrated as either a concrete contract consequence or an explicit boundary; integration does not mean implementing every subsystem now.

`topology.group` still groups cells without moving boundaries. Random triangle matching is internal construction, not its grouping heuristic. Triangle/quad refinement is not `geometry.subdivide`, whose OBB/strip/skeleton methods divide parcels with area/frontage/residual contracts. No Townscaper finding supplies a parcel-skeleton backend or legal/network access.
