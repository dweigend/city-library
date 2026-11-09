# Independent Runtime Implementation Review: Finite Quadrilateral Topology (`E3`)

- **Reviewer:** Antigravity (`gemini-4-argon`)
- **Date:** 2026-11-08
- **Target Worktree:** `/home/david/.t3/worktrees/city-library/feat-townscaper-grid`
- **Branch / Head Commit:** `feat/townscaper-grid` at `6726d7e627de11d2c01d727eb5e704035aee1f44`
- **Pre-Runtime Freeze Baseline:** `9fca840935cbc152e8faef4cddf877347568261a` (`2df94d1` accepted `E0` checkpoint + reviewed `E3` contract/examples/archive freeze)
- **Reviewed Diff (`9fca840..6726d7e`):**
  - Runtime: [`src/grid/topology/index.ts`](../../src/grid/topology/index.ts), [`src/grid/topology/quad-validation.ts`](../../src/grid/topology/quad-validation.ts), [`src/grid/topology/quadrilaterals.ts`](../../src/grid/topology/quadrilaterals.ts), [`src/grid/topology/relax.ts`](../../src/grid/topology/relax.ts)
  - Public example registration & dev typecheck: [`scripts/examples.ts`](https://github.com/dweigend/city-library/blob/23693e90e199512faf68a04c9a2198b9eb50463b/scripts/examples.ts), [`tsconfig.dev.json`](https://github.com/dweigend/city-library/blob/23693e90e199512faf68a04c9a2198b9eb50463b/tsconfig.dev.json)
  - Focused tests & type checks: [`tests/townscaper-grid.test.ts`](../../tests/townscaper-grid.test.ts), [`tests/townscaper-grid-types.ts`](../../tests/townscaper-grid-types.ts), [`scripts/consumer.ts`](https://github.com/dweigend/city-library/blob/23693e90e199512faf68a04c9a2198b9eb50463b/scripts/consumer.ts)
  - Contract & boundary notes: [`docs/grid-parcels/TOWNSCAPER-CONTRACT.md`](TOWNSCAPER-CONTRACT.md), [`docs/grid-parcels/TOWNSCAPER-REVIEW-RESPONSES.md`](TOWNSCAPER-REVIEW-RESPONSES.md), [`docs/grid-parcels/TOWNSCAPER-VERIFICATION.md`](TOWNSCAPER-VERIFICATION.md)

---

## 1. Executive Summary & Explicit Runtime Verdict

- **E3 Runtime Implementation Verdict:** **APPROVED (Scoped Headless Runtime Delivery for `topology.quadrilaterals` and `topology.relax` at `6726d7e`).**
  - Zero `P0` / `P1` / `P2` / `P3` defects found in the runtime implementation (`src/grid/topology/{index,quad-validation,quadrilaterals,relax}.ts`), frozen public scripts, focused behavior/type tests, or packed consumer additions.
  - Both earlier `P3` design-review implementation guards (`F1`: explicit `undefined` and extra argument `TypeError` rejection before defaults/draws; `F2`: canonical CCW + lexicographically smallest `(x, y)` start normalization and fresh snapshot allocation on `iterations: 0` and stationary steps) are accurately implemented and verified.
  - The post-freeze author boundary finding (`rings: 7, edgeLength: 1e6 / 7` evaluating corner `7 * (1e6 / 7) = 1000000.0000000001 > 1e6` in IEEE 754 binary64) is handled cleanly by the pre-draw `validateSource` preflight (`RangeError` before any RNG draw), with no coordinate snapping, no hidden rounding, and no modification to any frozen script.
- **Frozen Script & Archive Integrity Verdict:** **VERIFIED UNCHANGED.**
  - All 5 `examples/townscaper-grid/*.ts` scripts, all 5 `examples/grid-parcels/*.ts` scripts, all 3 `examples/city-simulation/*.ts` scripts, and all 28 `docs/library-handover/parcel-proposal/**` archive files pass `sha256sum -c` with zero byte changes since their respective freeze commits.
- **Target Capability Verdict (`03-generative-quarter.ts`, `E1`/`E2`):** **HONESTLY RED (by design).**
  - `bun run examples:city:targets` and `bun run typecheck:city:targets` continue to fail honestly at missing `geometry.corridor`, `geometry.subtract`, and `geometry.subdivide`. No mocks, placeholders, or expected-failure wrappers were introduced.
- **Scope & Verification Boundary:**
  - This review approves the headless `E3` runtime implementation and focused verification checks executed below. The coordinator is running the full `bun run check` workflow, UI build, and packed consumer execution separately; this review does not claim those coordinator-owned runs are already completed. No UI or browser-facing flow is added in this slice, and no original-game visual or scientific fidelity is claimed.

---

## 2. Executed Independent Verification Commands

All commands below were executed directly in `/home/david/.t3/worktrees/city-library/feat-townscaper-grid` at commit `6726d7e`:

| Check / Command | Observed Result | Verified Details |
| --- | --- | --- |
| `sha256sum -c examples/townscaper-grid/SHA256SUMS` | Exit `0` (5/5 `OK`) | All 5 frozen `E3` public scripts are byte-identical to pre-runtime freeze `9fca840`. |
| `sha256sum -c examples/grid-parcels/SHA256SUMS` | Exit `0` (5/5 `OK`) | All 5 frozen grid/parcel foundation scripts are untouched. |
| `sha256sum -c docs/development/example-first/SCRIPT-SHA256SUMS` | Exit `0` (3/3 `OK`) | All 3 accepted `E0` city simulation scripts are untouched. |
| `sha256sum -c docs/grid-parcels/TOWNSCAPER-PACKAGE-SHA256SUMS` | Exit `0` (28/28 `OK`) | All 28 source archive files (`49`-row roadmap, `58` signature sections, `27` shared types, 5 attributed paper PNGs, 1 SVG) are untouched. |
| `bun run examples:townscaper` | Exit `0` | All 5 frozen `examples/townscaper-grid/01..05` scripts execute and pass all assertions (`smallCells: 14`, `largeCells: 122`, first-step `[1.1875, 0.8125]`, halving attempt 2 `[1.248546875, 1.6424375000000002]`, `replayedCells: 122`). |
| `bun run typecheck:townscaper` | Exit `0` | Strict TypeScript passes on all 5 `E3` scripts and `tests/townscaper-grid-types.ts` (including `@ts-expect-error` negative checks on literals and named variables). |
| `bun test tests/townscaper-grid.test.ts` | Exit `0` (`14 pass, 0 fail`, `31,183` `expect()` calls) | Covers primitive construction oracles, radii `1..7` area/ownership/budgets/RNG draw counts, malformed/accessor/symbol/undefined preflight, extreme `edgeLength` (`2 ** -400`, `1e6`), `7 * (1e6 / 7)` pre-draw coordinate cap rejection, Gaussian cache continuation, stationary fixed points, multi-vertex diagonal oracle, 2-halving acceptance, 17-attempt exhaustion, underflow stagnation rejection, disconnected components/holes, and `Grid`/`Field` state isolation. |
| `bun test tests/grid-parcels-topology.test.ts tests/grid-parcels-grid.test.ts tests/grid-parcels-geometry.test.ts tests/grid-parcels-conservation.test.ts tests/townscaper-grid.test.ts` | Exit `0` (`35 pass, 0 fail`, `32,548` `expect()` calls) | Full grid-parcel foundation + `E3` test suite passes without regression. |
| `for f in examples/grid-parcels/*.ts; do bun "$f"; done` | Exit `0` (5/5 pass) | All 5 foundation public scripts pass unchanged. |
| `tsc --noEmit && tsc -p tsconfig.dev.json` | Exit `0` | Root library and dev/example/test TypeScript projects (now including `examples/townscaper-grid/**/*.ts`) typecheck cleanly. |
| `bun run examples:city && bun run typecheck:city` | Exit `0` / Exit `0` | Ready `E0` scripts (`01-household-budget.ts` -> `19000`, `02-neighborhood-heat.ts` -> `{ tick: 1, centerTemperature: 20, totalTemperature: 188 }`) pass and typecheck. |
| `bun run examples:city:targets` / `bun run typecheck:city:targets` | Exit `1` / Exit `1` | `03-generative-quarter.ts` remains genuinely red at missing `E1`/`E2` APIs (`geometry.corridor`, `geometry.subtract`, `geometry.subdivide`). |

---

## 3. Detailed Technical Audit of Runtime Implementation

### 3.1 `topology.quadrilaterals` ([`src/grid/topology/quadrilaterals.ts`](../../src/grid/topology/quadrilaterals.ts))

1. **Boundary & Option Validation Before RNG:**
   - Checks `arguments.length !== 1` (`TypeError`), validates plain options record via `validateOptions(options, ["rings", "edgeLength", "random"])` (rejecting non-plain objects, symbol keys, accessors, and unknown/research keys `boundary`, `pointSpacing`, `relaxationIterations` with `TypeError` before inspecting getters), and explicitly rejects any own property with value `undefined` (`Object.values(values).some(value => value === undefined)` -> `TypeError`).
   - Validates `rings` via `finite(values.rings)` and `Number.isInteger(rings) && rings >= 1 && rings <= 7` (`RangeError`), `edgeLength` via `finite("edgeLength" in values ? values.edgeLength : 1)` in `[2 ** -400, 1e6 / rings]` (`RangeError`), and `isRandom(values.random)` (`TypeError`).
2. **Exact Source Enumeration & Pre-Draw Preflight (`triangularPatch`, `validateSource`):**
   - Evaluates each axial lattice vertex `(q, r)` with `max(|q|, |r|, |q + r|) <= rings` once at `[(q + r / 2) * edgeLength, r * (Math.sqrt(3) * edgeLength / 2)]` and caches its integer vertex ID in `vertexIds`.
   - Enumerates `r = -rings..rings`, then `q = -rings..rings`, emitting `[(q, r), (q + 1, r), (q, r + 1)]` and `[(q + 1, r), (q + 1, r + 1), (q, r + 1)]` when all three corners lie inside the hex patch, producing $T = 6\,\text{rings}^2$ CCW triangles.
   - Collects shared undirected edges `(prior, cell)` with `prior < cell` and sorts candidate pairs numerically by `a - c || b - d`, yielding $E = 9\,\text{rings}^2 - 3\,\text{rings}$ candidates.
   - **Pre-draw validation (`validateSource`):** Before calling `pairTriangles` (and thus before the first `random.raw({ kind: "double" })` draw), verifies `triangles.length === 6 * rings ** 2`, `candidates.length === 9 * rings ** 2 - 3 * rings`, worst-case child budgets (`3 * T <= 1024`, `15 * T <= 8192`), positive finite binary64 source triangle areas (`polygonArea(shape)`), and complete source triangle conformity and coordinate bounds (`createLayout(sourcePolygons, true)`).
   - **Author Boundary Finding Verification (`rings: 7, edgeLength: 1e6 / 7`):** In IEEE 754 binary64, `1e6 / 7` rounds to `142857.14285714287`, and `7 * (1e6 / 7)` evaluates to `1000000.0000000001 > 1e6`. While `edgeLength <= 1e6 / rings` passes the scalar interval check, `validateSource` calls `createLayout(sourcePolygons, true)`, which rejects `Math.abs(p.x) > 1e6` with `RangeError` **before** `pairTriangles` is called. No coordinates are snapped or clamped, and `random.state` remains untouched.
3. **Random Candidate Shuffle & Greedy Pairing (`pairTriangles`):**
   - Copies `patch.candidates` and runs descending Fisher–Yates for `index = candidates.length - 1` down to `1`, drawing `random.raw({ kind: "double" })` exactly $E - 1$ times and swapping `candidates[index]` with `candidates[selected]`.
   - Iterates through the shuffled candidates and pairs `(first, second)` greedily when both triangles are still `-1`.
4. **Mixed-Face Assembly & Complete 3/4 Refinement (`mixedFace`, `refineFaces`):**
   - Iterates `cell = 0..T-1`, skipping `partner >= 0 && partner < cell` so each mixed face is emitted in ascending order of its smallest source triangle ID.
   - For paired triangles, removes the shared directed half-edges and traces the 4-corner CCW outer boundary cycle; canonicalizes the mixed face (triangle or quad) to start at its lexicographically smallest `(x, y)` corner (`canonicalStart`) **before** computing `center` by summing corner coordinates in that canonical order and dividing by `face.length`.
   - Caches undirected source-edge midpoints by `edgeKey(first, second)` as exact `[(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]` tuples so adjacent refined quads share identical binary64 midpoint coordinates.
   - Emits `[corner, nextEdgeMidpoint, center, previousEdgeMidpoint]` for each corner in canonical face order, rotates each child quad to its lexicographically smallest `(x, y)` start (`canonicalStart`), checks strict CCW convexity via exact `orient(...) > 0`, and validates the complete output layout via `createLayout(polygons, true)`.

### 3.2 `topology.relax` & Validation ([`src/grid/topology/relax.ts`](../../src/grid/topology/relax.ts), [`src/grid/topology/quad-validation.ts`](../../src/grid/topology/quad-validation.ts))

1. **Boundary Validation & Capability Checks:**
   - Checks `arguments.length !== 1` (`TypeError`), `validateOptions(options, ["layout", "method", "iterations"])` (`TypeError` on unknown/symbol/accessor/mixed keys such as `random`, `strength`, `relaxationIterations`), and rejects explicit `undefined` values (`TypeError`).
   - Validates canonical `Layout` via `requireLayout(values.layout)` (`TypeError`), `values.method === "squareTarget"` (`TypeError`), `typeof values.iterations === "number"` (`TypeError`), and `Number.isSafeInteger(iterations) && iterations >= 0 && iterations <= 256` (`RangeError`).
   - Calls `readIncidence(layout)` and `createLayout(quadPolygons(vertices, incidence.faces), true)` **before** the iteration loop, ensuring `iterations: 0` (and stationary runs) still validate 4-corner hole-free strictly convex quads, the relative quality guard `cross > 1e-12 * maximumSquaredEdge`, and global manifold conformity, while always returning a fresh, deeply frozen canonical `Layout` with normalized CCW + lexicographically smallest `(x, y)` rings.
2. **Real Square-Target Forces (Not Laplace / Not Lloyd):**
   - `readIncidence` deduplicates vertices by exact binary64 `coordinateKey`, records 4-vertex CCW faces, counts undirected edge owners across the layout, pins both endpoints of every single-owner edge (`edge.owners === 1`, covering outer perimeters, disconnected component boundaries, and hole boundaries) in `boundary`, and computes `maximumValence = Math.max(...valences)`.
   - In `squareForces`, each quad's 4 vertex indices are first rotated to start at the lexicographically smallest `(x, y)` corner (`canonicalFace(face, vertices)`) so floating-point summation is invariant to input ring rotation or winding.
   - Computes arithmetic face center `center = sum(corners) / 4`, aligns corner offsets `p - center` by exact quarter turns `rotate(..., (4 - index) % 4)` (`case 0: [x, y]`, `case 1: [-y, x]`, `case 2: [-x, -y]`, `case 3: [y, -x]`, using zero trigonometry), averages the aligned vectors `average = sum(aligned) / 4`, rotates back by `rotate(average, index)`, and accumulates `center + target - position` into `forces[ordered[index]]` in ascending cell-key order.
   - Applies the single global step scale `base = 1 / (2 * incidence.maximumValence)` synchronously across all movable vertices (`!incidence.boundary.has(vertex)`), without per-vertex valence normalization.
3. **Stationary Detection, Stagnation Guard, Step Halving & Atomic Exhaustion (`guardedStep`):**
   - If all movable vertices have exact zero summed force (`!nonzero`), breaks cleanly and returns the current validated `Layout` revision.
   - Otherwise, tests `attempt = 0..16` (`scale = base / 2 ** attempt`):
     - **Stagnation / underflow guard:** If `nonzero` was true but no movable vertex changed representably in binary64 (`!candidate.some(...)`), rejects the candidate (`continue`).
     - **Vertex coalescence guard:** If any two distinct vertices coalesce to the same coordinate (`new Set(candidate.map(coordinateKey)).size !== candidate.length`), rejects the candidate (`continue`).
     - **Orientation & face quality guard (`quadPolygons`):** Verifies that each candidate quad retains its original CCW orientation (`orient(exact[0], exact[1], exact[2]) > 0`, preventing inverted faces from being silently reversed by `canonicalQuad`), has 4 distinct finite corners within `1e6`, and passes both exact `orient > 0` and `cross > 1e-12 * maximumSquaredEdge` at all 4 corners.
     - **Global manifold & interior-disjointness validation (`createLayout(..., true)`):** Verifies full-edge sharing, absence of T-junctions or edge crossings, and pairwise disjoint polygon interiors across all cells and components.
   - If all 17 attempts (`0..16`) fail, throws `RangeError` atomically without mutating the input `Layout` or publishing any partial iteration state.

---

## 4. Architecture, Coding Standards & Provenance Compliance

- **Architecture & Domain Boundaries ([`docs/ARCHITECTURE.md`](../ARCHITECTURE.md), [`docs/CODING_STANDARDS.md`](file:///home/david/Projekte/city-library/docs/CODING_STANDARDS.md)):**
  - All 4 touched runtime files live in `src/grid/topology/` and depend only on existing internal contracts (`../../agent/state.ts`, `../../geometry/space.ts`, `../../geometry/planar/{parcel-input,predicates,types,validation}.ts`, `../../random/random.ts`, `./layout.ts`).
  - Zero imports of `World`, `Agent`, `Grid`, UI/Svelte/Three.js, Node host modules, or external geometry libraries.
  - Functions are small, cohesive, and pure/headless; each file has a single clear responsibility (`quadrilaterals.ts`: 140 lines; `relax.ts`: 140 lines; `quad-validation.ts`: 58 lines; `index.ts`: 42 lines).
  - Meaningful numerical constants (`maximumRings = 7`, `minimumEdgeLength = 2 ** -400`, `coordinateLimit = 1e6`, `minimumRelativeTurn = 1e-12`, `maximumIterations = 256`, `maximumHalvings = 16`) are named and documented at module top.
- **Dependency, License & Provenance Scope ([`package.json`](../../package.json), [`docs/grid-parcels/TOWNSCAPER-RECEIPT.md`](TOWNSCAPER-RECEIPT.md)):**
  - No new runtime or dev dependencies were added to `package.json`.
  - No prototype code (`generator.ts` Laplace smoothing, string-rounded coordinate welding, or 20-unit display normalization) was copied or adapted; `E3` is a clean target-native implementation over City Library's exact binary64 predicates.
  - The 28-file research handover archive in `docs/library-handover/parcel-proposal/` remains strictly documentation/provenance context.

---

## 5. Findings Ledger

| ID | Severity | File(s) | Finding | Status |
| --- | --- | --- | --- | --- |
| — | None (`0` findings) | `src/grid/topology/*`, `tests/townscaper-grid*.ts`, `scripts/consumer.ts`, `docs/grid-parcels/*` | No `P0`, `P1`, `P2`, or `P3` defects identified in the `9fca840..6726d7e` runtime delivery diff. | Closed / Approved |
