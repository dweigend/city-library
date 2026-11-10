# Finite quadrilateral topology contract

Status: E3 example-first contract, frozen before runtime on 8 November 2026
after independent Gemini 4 Argon design approval. Runtime at `6726d7e` passed
fresh independent runtime review and the complete target checks recorded in
[verification](QUAD-LAYOUTS-VERIFICATION.md). The first PR implements only
these two additions to the existing public root `topology` object:

```ts
topology.quadrilaterals(options: {
  rings: number;
  edgeLength?: number;
  random: Random;
  boundary?: never;
  pointSpacing?: never;
  relaxationIterations?: never;
}): Layout;
topology.relax(options: {
  layout: Layout;
  method: "squareTarget";
  iterations: number;
  random?: never;
  strength?: never;
}): Layout;
```

Both accept one plain data options record. Extra arguments, unknown/symbol keys,
accessors, mixed research/finite options and explicit undefined values are
invalid. Forbidden research/control keys use optional `never` in the public
option types so named-variable mixed inputs fail as well as excess object-literal
properties; no public options-type export is required. Required properties must
be present. Invalid structure throws TypeError;
invalid numeric ranges or unsupported input geometry throw RangeError. Neither
operation creates a World, Grid, Field, Agent or public mesh object. All earlier
public APIs and frozen examples remain unchanged.

## Finite generation

- `rings` is an integer from 1 through 7, counting triangular-lattice edges from
  the origin to a hex corner. `edgeLength` defaults to 1 in caller XY units and
  must be finite in `[2 ** -400, 1e6 / rings]`. `random` is an existing canonical
  Random instance. The lower bound is an explicit numerical admission policy:
  squared source lengths remain at least `2 ** -800`, safely above normal-number
  underflow even after finite refinement. It avoids allowing subnormal source
  geometry and does not impose a display-unit floor. The upper bound keeps every
  mathematical source coordinate within the existing magnitude cap. Binary64
  construction must also pass the source-coordinate preflight: at `rings: 7`,
  `edgeLength: 1e6 / 7` evaluates the corner to `1000000.0000000001` and throws
  before drawing. The options interval does not override the coordinate cap or
  permit snapping that corner. These are City Library
  decisions, not recovered original Townscaper constants.
- Use integer axial coordinates `(q,r)` with
  `max(abs(q),abs(r),abs(q+r)) <= rings`. Evaluate each source vertex once at
  `[(q + r / 2) * edgeLength, r * (sqrt(3) * edgeLength / 2)]`. Center is `(0,0)`;
  orientation has horizontal top/bottom hex edges, with corners on the X axis.
- Enumerate `r=-rings..rings`, then `q=-rings..rings`. At each coordinate emit
  triangle `[(q,r),(q+1,r),(q,r+1)]`, then
  `[(q+1,r),(q+1,r+1),(q,r+1)]`, only when all vertices are inside. This yields
  exactly `T=6*rings²` CCW triangles, numbered by emission order.
- Each full shared source edge gives one candidate pair `(lowerTriangleId,
  higherTriangleId)`. Sort pairs numerically by first ID, then second ID. There
  are `E=9*rings²-3*rings` candidates. Shuffle by descending Fisher–Yates:
  for `i=E-1..1`, draw `u=random.raw({kind:"double"})`, let
  `j=floor(u*(i+1))`, and swap candidates `i,j`. Consume exactly `E-1` raw double
  draws, including candidates later skipped. Traverse the shuffled list and pair
  only if both triangles are still unused. Unpaired triangles remain real faces.
- Emit mixed faces by their smallest source triangle ID, skipping the consumed
  partner. For a pair remove its shared edge and follow its CCW exterior.
  Canonicalize each mixed face to CCW, lexicographically smallest `(x,y)` start.
  For each corner emit `[corner, nextEdgeMidpoint, faceCenter,
  previousEdgeMidpoint, corner]`; canonicalize each child similarly, without
  reordering the children. A source triangle makes three quads; a paired rhombus
  makes four. For `P` pairs the final count is `3*T-2*P`.
- One midpoint per undirected source edge is calculated as
  `[(a.x+b.x)/2,(a.y+b.y)/2]`; one center per face is the arithmetic mean of its
  canonical CCW corner coordinates, summed in that order. Shared vertices use
  exact construction identities and cached binary64 coordinates. No coordinate
  rounding, tolerance welding, display normalization or extra random draws.
- Validate all options, canonical Random identity, source coordinate/area
  representability and the conservative resource budget before the first draw.
  The worst case is `18*rings² <= 882` cells and 4410 closure-inclusive positions,
  within existing limits (1024 cells, 8192 positions, magnitude 1e6). Validate
  resulting quads before publishing. If a numerical failure occurs after pairing
  has begun, throw RangeError; already consumed RNG draws remain consumed. There
  is no hidden stream rollback and no incomplete successful Layout.

Seed 7 independent construction oracles: radius 1 has 6 triangles, 6 candidates,
2 pairs, 2 unpaired triangles, 14 children and 5 draws. Radius 3 has 54 triangles,
72 candidates, 20 pairs, 14 unpaired triangles, 122 children and 71 draws. The
hex area is `3*sqrt(3)/2 * rings² * edgeLength²`. These fixtures pin continuation
and construction, not a claim of original-game fidelity.

## Square-target relaxation

`layout` must be an existing canonical Layout. `method` is exactly `squareTarget`;
`iterations` is required and an integer in 0..256. Source quads must have one
closed ring, exactly four distinct corners and strictly convex CCW geometry after
normalization. Normalize each ring internally/output to CCW and lexicographically
smallest `(x,y)` start; preserve cell order and keys. Triangle, concave, holed or
unresolved near-degenerate inputs are unsupported and throw RangeError, including
when iterations is zero. Global conforming manifold relationships and disjoint
interiors must hold. Existing importer restrictions remain authoritative.

A numerical quality guard additionally requires every consecutive CCW corner
cross product to be greater than `1e-12 * maximumSquaredEdgeLength` for that
face. This relative guard is a declared City Library representability policy,
not an epsilon for welding or adjacency. Exact binary64 geometric predicates
still govern topology relationships. Apply the guard to input and every candidate.

Compute exact-coordinate vertex incidence and undirected edge ownership once.
Every vertex incident to an edge with one owner is boundary and stays bit-for-bit
fixed. Disconnected components and holes in the union pin all of their exposed
boundary edges. Let `maximumValence` be the largest number of incident quads at
any vertex; the one fixed global force scale is `1/(2*maximumValence)`.

For each iteration, use only old positions. For each CCW quad `p0..p3` compute
`c=(p0+p1+p2+p3)/4`, `u=(sum_i R(-i*pi/2)*(pi-c))/4`, and
`target_i=c+R(i*pi/2)*u`. Quarter turns use exact sign/swap arithmetic, not trig.
Sum `target_i-pi` at every shared vertex in ascending cell-key order. Apply all
movable vertices simultaneously using the same global scale. Do not normalize
forces independently by each vertex's valence, and do not use Laplace or Lloyd.

Try global step scales `base / 2**attempt` for attempts 0 through 16 inclusive.
Accept the first candidate satisfying finite bounded coordinates, face quality,
unchanged corner/incidence correspondence, manifold full-edge conformity,
noncrossing edges and globally disjoint interiors. All faces and all components
must pass; positive per-face area alone is insufficient. Shared vertices are
updated once, so every incident cell serializes identical endpoints.

If movable summed forces are all exactly zero, accept the stationary iteration.
If some movable force is nonzero but no movable coordinate changes representably,
the candidate is invalid rather than silently declaring convergence. All-boundary
layouts are stationary. If all 17 candidates fail, throw RangeError and return no
Layout, even when prior iterations were valid. No input changes or partial-result
publication occur. Every successful call returns a fresh deeply immutable
canonical Layout, including zero iterations; zero returns fresh polygon/query
snapshots without executing any force iteration. No RNG draws occur in relaxation.

Cell order, local keys, shared vertex/edge incidence and ascending-key neighbors
correspond to the input revision. Coordinates, polygon snapshots and lookup
results can change. Keys are still layout-local, not global parcel IDs. Old query
snapshots remain valid and unchanged. `Grid.create` on the result makes a distinct
Grid and distinct Fields; copying selected state is explicit caller policy.

## Architecture, evidence and remaining work

Use plain functions and existing Layout/PlanarPolygon/Random/Grid contracts.
Private incidence arrays/maps are sufficient. Dependencies remain directed toward
existing geometry/random contracts; no absolute source-runtime imports or new
packages are needed. Reuse the target's exact predicates and Layout constructor;
source prototype code is inspiration only. Preserve the complete target-owned
[49-row catalogue](https://github.com/dweigend/city-library/blob/cc6d5c3136c07cda94d5a4449b6e384c435f6ad4/docs/library-handover/parcel-proposal/COVERAGE.md) and its
58 operation/property sections. Historical documentation approval is not runtime
approval. See the [receipt](TOWNSCAPER-RECEIPT.md) for source provenance.

Arbitrary-boundary quadrilaterals, Lloyd, player/module dual correspondence,
seamless chunks, architecture solving and parcel OBB/corridor/skeleton work remain
separate roadmap slices without stubs. The finite Layout is the all-quad module
substrate; Fields are state, not the player-grid dual. There is no Townscaper
visual or scientific fidelity claim and no browser-facing flow in this slice.

Before runtime, freeze all five public scripts after fresh independent Gemini 4
Argon design review. Focused public behavior/type tests supplement the scripts
with exact refinement/counts, global validity, actual halving/exhaustion,
near-degeneracy, bounds, continuation and immutable ownership checks. Run current
typecheck, focused tests, all public examples, build, packed Bun/Node consumers
and full check; record unrelated E1/E2 target failures separately.
