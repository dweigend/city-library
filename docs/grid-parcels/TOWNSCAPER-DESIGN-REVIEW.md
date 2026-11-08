# Independent Design, Archive Transfer, and Example-First Review: Finite Quadrilateral Topology (`E3`)

- **Reviewer:** Antigravity (`gemini-4-argon`)
- **Date:** 2026-11-08
- **Target Worktree:** `/home/david/.t3/worktrees/city-library/feat-townscaper-grid`
- **Branch / Base Commit:** `feat/townscaper-grid` at `2df94d1` (cherry-picked accepted `E0` checkpoint `cf9baea` on top of `feat/grid-parcel-foundations` `2a7f3eb`)
- **Review Scope:** Independent **design, provenance/archive transfer, public example-first contract, and focused test/type design review only** for Stage `E3` (`topology.quadrilaterals` finite hex overload and `topology.relax` with `method: "squareTarget"`). **Not** a runtime implementation or browser/visual review; no runtime library code (`index.ts`, `src/**`) exists yet for this slice.

---

## 1. Executive Summary & Verdict

- **E3 Design, Provenance Transfer & Example-First Freeze Verdict:** **APPROVED FOR FREEZE.**
  - All five public `examples/townscaper-grid/*.ts` scripts are complete, readable top-to-bottom author workflows with independent analytical, refinement, synchronous force, and bounded step-halving oracles.
  - All routine numerical and RNG continuation rules in `docs/grid-parcels/TOWNSCAPER-CONTRACT.md` are justified, deterministic, and implementable using existing `Layout`, `PlanarPolygon`, `Random`, and `Grid` contracts without altering any accepted `E0` city script (`examples/city-simulation/*`) or any frozen foundation script (`examples/grid-parcels/*`).
  - The 28-file research/proposal archive under `docs/library-handover/parcel-proposal/` is verified byte-identical to `dweigend/city_game` commit `5583c03039b1937cfe6d388b54692e583c2cdc26` via `docs/grid-parcels/TOWNSCAPER-PACKAGE-SHA256SUMS`, with `docs/grid-parcels/TOWNSCAPER-RECEIPT.md` maintaining a strict boundary between historical research/documentation provenance and target runtime delivery.
  - Zero blocking (`P0`/`P1`/`P2`) findings. Two non-blocking implementation/editorial notes (`P3`) are recorded in Section 7 to guard the upcoming runtime implementation after the freeze commit.
- **Runtime Delivery Verdict (`E3`):** **NOT DELIVERED (by design).** `bun run examples:townscaper`, `bun run typecheck:townscaper`, and `bun test tests/townscaper-grid.test.ts` fail honestly on the missing `topology.quadrilaterals` and `topology.relax` exports with no mocks, stubs, private imports, or suppressed assertions.
- **Target Capability Verdict (`03-generative-quarter.ts`, `E1`/`E2`):** **OPEN RED TARGET (by design).** The generative quarter script remains an untouched, honestly red `E1`/`E2` target (`geometry.corridor`, `geometry.subtract`, `geometry.subdivide`); this first PR is strictly scoped to `E3`.

---

## 2. Provenance, Archive Transfer & Baseline Integrity

Executed read-only verification commands in `/home/david/.t3/worktrees/city-library/feat-townscaper-grid`:

| Check / Command | Observed Result | Verification Detail |
| --- | --- | --- |
| `sha256sum -c docs/grid-parcels/TOWNSCAPER-PACKAGE-SHA256SUMS` | Exit `0` (28/28 `OK`) | All 28 files (`3,186,191` bytes) in `docs/library-handover/parcel-proposal/` match the committed source blobs at `city_game` `5583c030`. |
| `sha256sum -c docs/development/example-first/SCRIPT-SHA256SUMS` | Exit `0` (3/3 `OK`) | Accepted `E0` scripts (`01-household-budget.ts`, `02-neighborhood-heat.ts`, `03-generative-quarter.ts`) are untouched. |
| `sha256sum -c examples/grid-parcels/SHA256SUMS` | Exit `0` (5/5 `OK`) | All 5 frozen `feat/grid-parcel-foundations` scripts in `examples/grid-parcels/` are untouched. |
| `bun run examples:city` / `bun run typecheck:city` | Exit `0` / Exit `0` | Ready `E0` scripts pass (`19000`; `{ tick: 1, centerTemperature: 20, totalTemperature: 188 }`) and typecheck cleanly. |
| `bun run examples:city:targets` / `bun run typecheck:city:targets` | Exit `1` / Exit `1` | `03-generative-quarter.ts` fails honestly at missing `geometry.corridor` (`TS2339` + 5 downstream `TS7006`). |
| `bun run examples:townscaper` / `bun run typecheck:townscaper` | Exit `1` / Exit `1` | Fails honestly at missing `topology.quadrilaterals` and `topology.relax` (31 TypeScript diagnostics across the 5 examples and `tests/townscaper-grid-types.ts`). |
| `bun test tests/townscaper-grid.test.ts` | Exit `1` (1 pass, 12 fail) | Only the malformed-options preflight rejection test passes incidentally; all 12 positive/RangeError tests fail honestly because `topology.quadrilaterals` and `topology.relax` are undefined. |

- **Provenance & Licensing Hygiene (`TOWNSCAPER-RECEIPT.md`):**
  - Preserves the complete 49-row catalogue (`COVERAGE.md`), 58 operation/property signature sections (`api-table.md`), and 27 supplementary type rows (`api-reference.md#shared-types`) as roadmap/research documentation without claiming them as delivered exports.
  - Explicitly records that the 5 paper PNGs remain attributed research evidence from Vanegas et al. (2012), Aichholzer et al. (1995), Parish & Müller (2001), and Chen, Song & Ortner (2024), not unrestricted library assets or runtime output.
  - Explicitly rejects adopting the prototype's (`prototype/src/lib/experiments/grid-lab/core/generator.ts`) Laplace neighbor smoothing, 7-decimal string coordinate welding, and 20-unit display normalization, and makes no claim of original Townscaper code recovery or visual/architectural fidelity.

---

## 3. Review of the Five Public Author Scripts (`examples/townscaper-grid/`)

All five scripts follow the primary checkout's `AGENTS.md`, `docs/CODING_STANDARDS.md`, and `docs/development/example-first/PLAN.md` authoring rules: flat top-to-bottom control flow, public root imports from `"city-library"`, no private deep imports, no invented wrapper/manager DSL, and independent appended acceptance assertions.

1. **`01-finite-hex-refinement.ts` — Finite Hex Patch Generation, Scaling & Primitive Oracles**
   - **Author workflow:** Generates `rings: 1` (`small`) and `rings: 3` (`large`) patches with `Random.add({ seed: 7 })`, plus `rings: 3, edgeLength: 2` (`scaled`).
   - **Independent oracles verified:**
     - Under descending Fisher–Yates over sorted internal triangle pairs `(lowerTriangleId, higherTriangleId)` using `random.raw({ kind: "double" })`, `seed: 7` at `rings: 1` (`T = 6`, `E = 6`, `5` draws) pairs `(3, 4)` and `(1, 2)`, leaving triangles `0` and `5` unpaired (`4 * 2 + 3 * 2 = 14` quads). At `rings: 3` (`T = 54`, `E = 72`, `71` draws), `20` pairs and `14` unpaired triangles yield `4 * 20 + 3 * 14 = 122` quads.
     - Total area matches the analytical regular hexagon area $\frac{3\sqrt{3}}{2}\,\text{rings}^2\,\text{edgeLength}^2$ within $10^{-10}$, perimeter edge count (`owners.length === 1`) is $12\,\text{rings}$, Euler characteristic $V - E + F = 1$ holds, all shared edges have `owners.length === 2` with mutual `neighbors` and 1 shared boundary segment, and `topology.fromPolygons` independently admits the generated polygons.
     - Directly constructs the 3 child quads of unpaired triangle `0` (`[[-1, 0], [-0.5, -height], [0, 0]]`) and the 4 child quads of paired rhombus `1+2` (`[[-0.5, -height], [0.5, -height], [1, 0], [0, 0]]`) from exact midpoints and face averages and verifies their presence in `small`.
     - Scaling by `edgeLength: 2` produces exact `[2 * x, 2 * y]` coordinates bit-for-bit (since multiplying by $2$ only increments IEEE 754 binary64 exponents without rounding).

2. **`02-square-target-first-step.ts` — Synchronous Square-Target Force Oracle, Invariance & Fixed Point**
   - **Author workflow:** Relaxes a 4-quad `2x2` patch on $[0, 2]^2$ with perturbed interior vertex $(1.25, 0.75)$ for `iterations: 1`.
   - **Independent oracles verified:**
     - Each of the 4 incident quads has offset $\Delta = (0.25, -0.25)$ at the shared interior vertex, contributing individual corner force $-\frac{1}{2}\Delta = (-0.125, +0.125)$ and summed force $(-0.5, +0.5)$. With $\text{maximumValence} = 4$ and global scale $\frac{1}{2 \times 4} = \frac{1}{8}$, the first synchronous position is $(1.25, 0.75) + \frac{1}{8}(-0.5, +0.5) = (1.1875, 0.8125)$ exactly.
     - Reversing ring winding and cyclically shifting start vertices (`alternate`) yields the identical relaxed geometry.
     - Rotating the symmetric 4-square patch by $(x, y) \mapsto (x - y, x + y)$ (`rotatedSquares`) tests a **non-vacuous** rotated-square fixed point where the shared interior vertex $(0, 1)$ is movable (not boundary-pinned) and remains stationary across 8 iterations.

3. **`03-validation-and-failure.ts` — Global Step-Halving, Exhaustion, Preflight & Capability Guards**
   - **Author workflow & oracles verified:**
     - In `distortedPatch([1.177, 1.739])`, all 4 input quads satisfy strict CCW convexity and the $10^{-12}\,\max e^2$ quality guard. Full step (`attempt = 0`, scale $1/8$) and first halving (`attempt = 1`, scale $1/16$) invert a corner; second halving (`attempt = 2`, scale $1/32$, $\text{base}/4$) is the first globally valid step. Since $\text{base} \times \text{force} = (0.2861875, -0.38625)$, attempt 2 moves the interior vertex to $(1.177 + 0.2861875/4,\, 1.739 - 0.38625/4) = (1.248546875, 1.6424375)$ while keeping all boundary vertices bit-for-bit fixed.
     - In `distortedPatch([1.304019824210452, 1.5675690077264486])`, all 4 input quads pass input validation, but all 17 step scales ($\text{base}/2^0 \dots \text{base}/2^{16}$) invert a corner; `topology.relax` throws `RangeError` without publishing a partial result or mutating input snapshots.
     - Preflight validation rejects out-of-range `rings`, invalid `edgeLength` (`0`, `2 ** -401`, `1e6` at `rings: 3`, `Infinity`, `undefined`), invalid `random`, and mixed research keys (`boundary`, `pointSpacing`, `relaxationIterations`) without advancing `random.state`.
     - Zero-iteration capability validation rejects triangle, concave quad, and near-degenerate quad (`1e-14` height on unit base) with `RangeError`, and preserves `fromPolygons` rejection of T-junctions and 3-owner nonmanifold edges.

4. **`04-continuation-and-revisions.ts` — Exact RNG Continuation & Immutable Layout Revisions**
   - **Author workflow & oracles verified:**
     - Restoring `random.state = initial` reproduces `first` identically (`replay`); continuing from the post-generation stream produces a distinct layout (`advanced`).
     - An independent `Random.add({ seed: 7 })` advanced by `71` calls to `raw({ kind: "double" })` matches `afterPairing` state and subsequent draws exactly.
     - `topology.relax` consumes zero RNG draws, returns a fresh `Layout` object and fresh polygon snapshots even at `iterations: 0` (`zero !== first`, `zero.polygon({ cell: 0 }) !== first.polygon({ cell: 0 })`), preserves `cells` order and `neighbors` correspondence across `first`, `zero`, `relaxed`, and `anotherRevision`, leaves prior query snapshots unchanged, and deeply freezes returned layouts and coordinate tuples.

5. **`05-explicit-grid-state-copy.ts` — Detached Grid Composition & Explicit State Transfer**
   - **Author workflow & oracles verified:**
     - Attaches `before = Grid.add({ layout: raw, ... })` and `after = Grid.add({ layout: relaxed, ... })`, copies only the extensive `population` property across corresponding cell keys (`0..121`, sum $122 \times 123 / 2 = 7503$), and verifies distinct `Grid` and `LayoutField` identities (`oldField !== newField`, `oldField.id !== newField.id`, `oldField.grid === before`, `newField.grid === after`), independent subsequent mutations, uncopied `observation` field defaults, and absence of regular-grid properties (`"space"`, `"cellSize"`, `"diffuse"`).

---

## 4. Assessment of Numerical Constants, Bounds & Type Contracts

Each routine numerical and type decision in `docs/grid-parcels/TOWNSCAPER-CONTRACT.md` is well-founded and verified against the existing codebase (`src/grid/topology/layout.ts`, `src/geometry/planar/predicates.ts`, `src/geometry/planar/validation.ts`):

1. **Lower bound `edgeLength >= 2 ** -400` and upper bound `edgeLength <= 1e6 / rings`:**
   - At `edgeLength = 2 ** -400` ($\approx 3.87 \times 10^{-121}$), squared edge lengths and cross products remain $\ge 2^{-800}$ ($\approx 1.50 \times 10^{-241}$), over 220 binary orders of magnitude above IEEE 754 binary64 normal underflow ($2^{-1022}$) and subnormal minimum ($2^{-1074}$). Because `predicates.ts` decodes binary64 values into exact BigInt multiples of $2^{-1074}$, orientation and containment predicates remain exact at both `2 ** -400` and `1e6 / rings` (verified directly with `createLayout`).
2. **Radius bound `rings` in `1..7`:**
   - Unpaired refinement produces the maximum cell count $18\,\text{rings}^2$ and closure-inclusive position count $5 \times 18\,\text{rings}^2 = 90\,\text{rings}^2$. For $\text{rings} = 7$, $18 \times 49 = 882 \le 1024$ (`maximumCells`) and $90 \times 49 = 4410 \le 8192$ (`maximumPositions`), guaranteeing that every pairing outcome fits within existing `Layout` resource budgets, whereas $\text{rings} = 8$ would reach $18 \times 64 = 1152 > 1024$.
3. **Relative quality guard `cross > 1e-12 * maximumSquaredEdgeLength`:**
   - Prevents near-degenerate slivers whose aspect ratio approaches binary64 cancellation (~$10^{-12}$ rad corner angle) from entering or surviving relaxation, while remaining scale-invariant across the entire `[2 ** -400, 1e6]` coordinate range and keeping topology adjacency/containment predicates exact (no epsilon welding).
4. **Global force scale `1 / (2 * maximumValence)`:**
   - Each vertex of valence $v$ accumulates $v$ corner force vectors $(t_{f,i} - p)$. Scaling globally by $\frac{1}{2\,\text{maximumValence}}$ bounds every vertex update to at most half the mean target displacement of its incident faces while applying a single uniform step multiplier across all movable vertices (preserving translational/rotational symmetry and avoiding per-vertex valence distortion or Laplacian averaging).
5. **17 candidate step scales (`base / 2**attempt`, `attempt = 0..16`) and `iterations` in `0..256`:**
   - Provides a deterministic $2^{-16}$ step-damping range per iteration and caps synchronous relaxation calls at `256` (matching the 256-iteration upper bound discussed in the primary source lecture without making 256 an implicit default).
6. **Mixed-variable negative type contract (`optional never` keys):**
   - Declaring `boundary?: never; pointSpacing?: never; relaxationIterations?: never;` on `topology.quadrilaterals` and `random?: never; strength?: never;` on `topology.relax` ensures TypeScript rejects mixed/forbidden properties both on object literals and on named variables (`mixedGeneration`, `mixedRelaxation`, `mixedStrength` in `tests/townscaper-grid-types.ts` and `scripts/consumer.ts`) without exporting single-slice options interfaces.

---

## 5. Specific Contradiction & Consistency Assessments

### 5.1 Canonicalization & Floating-Point Arithmetic vs. Zero Iterations, Fixed Points & Assertions
- **Assessment:** **No contradiction.**
- **Why it holds:**
  1. **Ring canonicalization on `iterations: 0`:** `topology.quadrilaterals` already canonicalizes every emitted quad ring to CCW winding starting at its lexicographically smallest `(x, y)` corner. Consequently, when `04-continuation-and-revisions.ts` and `scripts/consumer.ts` call `topology.relax({ layout: first, method: "squareTarget", iterations: 0 })`, normalizing output rings to CCW + lexicographically smallest `(x, y)` start produces polygon rings that are `deepEqual` to `first`'s polygons while returning fresh object/array references. In `tests/townscaper-grid.test.ts`, the single rotated square `[[3, 6], [7, 3], [10, 7], [6, 10]]` is already CCW and starts at its lexicographically smallest vertex `[3, 6]`, so `shapes(revised)` also equals `[snapshot]`.
  2. **Internal canonicalization before force evaluation:** Normalizing each quad ring internally to CCW + lexicographically smallest `(x, y)` start *before* computing $c = (p_0 + p_1 + p_2 + p_3)/4$ and $u = \frac{1}{4}\sum_{i=0}^3 R(-i\pi/2)(p_i - c)$ makes the floating-point summation order invariant to caller input winding and cyclic start shifts (`02-square-target-first-step.ts` `alternate` and `tests/townscaper-grid.test.ts` `variants`).
  3. **Exact fixed points vs. underflow rejection:** The contract states: *"If movable summed forces are all exactly zero, accept the stationary iteration. If some movable force is nonzero but no movable coordinate changes representably, the candidate is invalid rather than silently declaring convergence."* In both fixed-point tests (`[[3, 6], [7, 3], [10, 7], [6, 10]]` where all 4 vertices are boundary-pinned, and `rotatedSquares` in `02-square-target-first-step.ts` where the interior vertex `[0, 1]` is movable and all coordinates are small integers), the floating-point forces at movable vertices evaluate to exact `0` (`+0.0`), triggering the stationary acceptance path. Conversely, in the `tests/townscaper-grid.test.ts` underflow fixture (`[2 + 2 ** -51, 2]` with valence-8 companion component), the movable force is nonzero (`-2 ** -49`) while `p[0] + scale * fx === p[0]` for all 17 attempts, properly triggering `RangeError`.

### 5.2 Complete-Domain Coverage vs. Disconnected Components, Holes & Non-Overlap
- **Assessment:** **No contradiction.**
- **Why it holds:**
  - For `topology.quadrilaterals`, the generated quads partition the closed regular hexagon of side `rings * edgeLength` with zero interior gaps, holes, or overlaps ($\sum \text{area} = \frac{3\sqrt{3}}{2}(\text{rings}\cdot\text{edgeLength})^2$, $V - E + F = 1$, $12\,\text{rings}$ single-owner outer boundary edges).
  - For `topology.relax`, input `Layout` instances created via `topology.fromPolygons` may contain disconnected components, gaps, or holes in the union. The contract pins every vertex incident to any single-owner edge (`owners.length === 1`), which includes all outer perimeters, all disconnected component perimeters, and all hole boundaries in the union. Combined with preserving full-edge sharing (`owners.length === 2`) and enforcing global pairwise polygon interior disjointness (reusing `createLayout(..., true)` / `validatePair` exact predicates on every candidate step), the exact occupied domain of any valid input `Layout` is preserved without opening cracks between adjacent cells or allowing components/hole boundaries to cross into gaps or holes.

### 5.3 Source-Validation Preflight vs. Post-Draw Failure Semantics
- **Assessment:** **No contradiction.**
- **Why it holds:**
  - All input admission checks—options record structure (`TypeError`), unknown/symbol/accessor/mixed/undefined keys (`TypeError`), canonical `Random` instance (`TypeError`), integer `rings` in `1..7` (`RangeError`), finite `edgeLength` in `[2 ** -400, 1e6 / rings]` (`RangeError`), and worst-case cell/position budgets (`882 <= 1024`, `4410 <= 8192`)—run deterministically **before** the first `random.raw({ kind: "double" })` draw. Thus every invalid call in the preflight domain leaves `random.state` untouched.
  - Within the admitted preflight domain (`rings` in `1..7`, `edgeLength` in `[2 ** -400, 1e6 / rings]`), exact lattice coordinates, midpoints, and face centers cannot underflow or overflow. The contract's post-draw clause (*"Validate resulting quads before publishing. If a numerical failure occurs after pairing has begun, throw RangeError; already consumed RNG draws remain consumed"*) states the standard Agent Loom atomic-publication / no-hidden-stream-rollback invariant for the final `Layout` construction step rather than creating a conflicting preflight rule.

---

## 6. Findings Summary

| ID | Severity | File(s) | Summary | Blocks Approval? |
| --- | --- | --- | --- | --- |
| `F1` | `P3` (Implementation guard) | `docs/grid-parcels/TOWNSCAPER-CONTRACT.md`, `examples/townscaper-grid/03-validation-and-failure.ts`, `tests/townscaper-grid.test.ts` | Explicit `undefined` option values (`{ rings: 1, edgeLength: undefined, random }`, `{ layout, method: "squareTarget", iterations: undefined }`) must throw `TypeError` during options validation rather than falling through `??` default coalescing. | No |
| `F2` | `P3` (Implementation guard) | `docs/grid-parcels/TOWNSCAPER-CONTRACT.md`, `tests/townscaper-grid.test.ts` | On `iterations: 0` (and stationary iterations), `topology.relax` must still emit the normalized CCW, lexicographically smallest `(x, y)` start ring for each quad (after validating 4 distinct corners, strict convexity, and the `1e-12 * maxEdge²` quality guard) and check `arguments.length === 1`. | No |

---

## 7. Detailed Non-Blocking Implementation Guards (`P3`)

### `F1` (`P3`) · Explicit `undefined` Option Values vs. Default Coalescing
- **Context:** `TOWNSCAPER-CONTRACT.md` specifies: *"Extra arguments, unknown/symbol keys, accessors, mixed research/finite options and explicit undefined values are invalid... Invalid structure throws TypeError."* Both `03-validation-and-failure.ts` (line 35) and `tests/townscaper-grid.test.ts` (lines 126, 223) test `{ rings: 1, edgeLength: undefined, random }` and `{ layout, method: "squareTarget", iterations: undefined }`.
- **Implementation guard:** Unlike `generationOptions` in `src/grid/topology/layout.ts` (which uses `values[sizeName] ?? 1`), the `E3` option validators for `topology.quadrilaterals` and `topology.relax` must check `arguments.length === 1` and reject any own property whose descriptor value is `undefined` with `TypeError` before applying `edgeLength = 1`.

### `F2` (`P3`) · Canonical Ring Normalization on `iterations: 0` and Stationary Steps
- **Context:** `TOWNSCAPER-CONTRACT.md` specifies both: *"Normalize each ring internally/output to CCW and lexicographically smallest `(x,y)` start; preserve cell order and keys"* and *"Every successful call returns a fresh deeply immutable canonical Layout, including zero iterations; zero returns fresh polygon/query snapshots without executing any force iteration."*
- **Implementation guard:** When implementing `topology.relax`, perform ring normalization (to CCW and lexicographically smallest `(x, y)` start) during initial quad extraction/validation so that `iterations: 0` and stationary iterations return fresh `Layout` snapshots built from those normalized rings rather than copying raw caller ring orientation.
