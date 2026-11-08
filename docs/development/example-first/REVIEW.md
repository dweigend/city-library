# Independent Design and Test Review: Example-First City Simulation Contracts (`docs/example-first-contracts`)

- **Reviewer:** Antigravity (`gemini-4-argon`)
- **Date:** 2026-11-08
- **Target Worktree:** `/home/david/.codex/worktrees/city-library-example-contracts`
- **Branch / Base Commit:** `docs/example-first-contracts` based on `2a7f3eb` (`feat/grid-parcel-foundations`)
- **Review Scope:** Design, example-as-test contract, runner/typecheck gates, and staged extension plan (`E0`..`E6`) only. **Not** a runtime implementation or target capability acceptance review.

---

## 1. Executive Summary & Verdict

- **Design / Test / Plan Checkpoint Verdict:** **APPROVED** (ready for checkpoint integration once the parent updates the final `bun run examples` status in `docs/development/example-first/VERIFICATION.md`).
- **Runtime / Target Capability Verdict (`03-generative-quarter.ts`, E1–E6):** **NOT ACCEPTED / OPEN TARGET (by design).** No runtime library code (`index.ts`, `src/**`) or UI was modified in this diff, and `geometry.corridor`, `geometry.subtract`, and `geometry.subdivide` remain unimplemented targets.

---

## 2. Diff Scope and Concurrent Workspace Integrity

Verified against `2a7f3eb`:
- **Modified tracked files (4):**
  - `PLAN.md` (+4 lines: pointer to `docs/development/example-first/PLAN.md` with explicit delivered-vs-target boundary)
  - `package.json` (+4 scripts: `examples:city`, `examples:city:targets`, `typecheck:city`, `typecheck:city:targets`)
  - `scripts/examples.ts` (+1 phase entry: `"city-simulation": ["01-household-budget", "02-neighborhood-heat"]`)
  - `tsconfig.dev.json` (+2 explicit ready files: `examples/city-simulation/01-household-budget.ts`, `examples/city-simulation/02-neighborhood-heat.ts`)
- **Added untracked files (10):**
  - `examples/city-simulation/01-household-budget.ts`
  - `examples/city-simulation/02-neighborhood-heat.ts`
  - `examples/city-simulation/03-generative-quarter.ts`
  - `examples/city-simulation/README.md`
  - `scripts/city-examples.ts`
  - `tsconfig.city-examples.json`
  - `tsconfig.city-targets.json`
  - `docs/development/example-first/PLAN.md`
  - `docs/development/example-first/VERIFICATION.md`
  - `docs/development/example-first/SCRIPT-SHA256SUMS`
- **Concurrent checkouts untouched:**
  - Primary checkout (`/home/david/Projekte/city-library`) and Townscaper worktree (`/home/david/.t3/worktrees/city-library/feat-townscaper-grid`) dirty/untracked files remain completely untouched.
  - All local Markdown links across `PLAN.md`, `examples/city-simulation/README.md`, `docs/development/example-first/PLAN.md`, and `docs/development/example-first/VERIFICATION.md` resolve to existing files.
  - `sha256sum -c docs/development/example-first/SCRIPT-SHA256SUMS` passes (`OK` for all three scripts).

---

## 3. Authoring Style & Example-as-Test Verification

All three scripts under `examples/city-simulation/` preserve the user-approved flat, readable top-to-bottom authoring style (`parameters -> setup -> execution -> export/observation -> appended assertions -> short named rule functions`):
- No nested loops or callback chains in the author workflow.
- No invented DSL, manager class, builder, or unapproved public vocabulary (no `route`, `extendPath`, `union`, `circle`, `sample`, etc.).
- Public imports come strictly from `"city-library"` (`Agent`, `World`, `Grid`, `Random`, `geometry`, `run`, `type PlanarPolygon`, `type PlanarXY`).

### 3.1 `01-household-budget.ts` (Delivered API — GREEN)
- **Workflow & Math:** Initial `balance: 1000`, `income: 2400`, `rent: 900`, `months: 12`. Each tick adds `2400 - 900 = 1500`. Analytical balance after 12 ticks: `1000 + 12 * 1500 = 19000`.
- **Assertions:** Verifies `household.balance === 19000`, `world.tick.value === 12`, unchanged `household.income === 2400` and `household.rent === 900`, and canonical membership `world.agents[0] === household`.
- **Scope framing:** Explicitly documented as exogenous cash flows, not a closed-economy conservation claim.

### 3.2 `02-neighborhood-heat.ts` (Delivered API — GREEN)
- **Workflow & Math:** `3x3` regular `Grid` (`space = { x: 3, y: 3 }`, hard boundary default), `initialState = { temperature: 20 }`, center `(0, 0)` set to `28`, `diffusion = { rate: 1 }` over default `"faces"` neighborhood for `1` tick.
  - Total initial temperature: `8 * 20 + 28 = 188`.
  - After 1 synchronous step with `rate: 1`:
    - Center `(0, 0)` sends `28 / 4 = 7` to each of 4 face neighbors and receives `20 / 4 = 5` from each: `4 * 5 = 20`.
    - Each of the 4 face neighbors retains `20 / 4 = 5` from its 1 hard-boundary slot, receives `2 * 5 = 10` from its 2 corner neighbors, and receives `7` from center: `5 + 10 + 7 = 22`.
    - Each of the 4 corners retains `2 * 5 = 10` from its 2 hard-boundary slots and receives `2 * 5 = 10` from its 2 face neighbors: `20`.
    - Total temperature: `20 + 4 * 22 + 4 * 20 = 188`.
- **Assertions:** Verifies `world.tick.value === 1`, `grid.fields.length === 9`, `center.temperature === 20`, `totalTemperature() === 188`, `directNeighbors.length === 4`, `neighborTemperatures` deep-equal to `[22, 22, 22, 22]`, 5 fields at `20` (center + 4 corners), and unmutated caller `initialState.temperature === 20`.

### 3.3 `03-generative-quarter.ts` (Unmet Target API — Honestly RED)
- **Contract Alignment (`api-reference.md` & `CONTRACT.md`):**
  - `Random.add({ seed: 42 })` draws `northSouthStreet` (`54.044150076806545`) and `eastWestStreet` (`47.93162235990167`) in `[30, 70)`.
  - `streetLines` preserves `readonly (readonly PlanarXY[])[]` tuple coordinates.
  - `geometry.corridor({ paths: streetLines, width: 8, endCap: "butt" })` matches the proposed straight-segment corridor contract (`width: 8` full width, `"butt"` endCap, status `"ok"` narrowing to `roads.parts`).
  - `geometry.subtract({ shape: site, excludedShapes: roads.parts })` matches the proposed Boolean subtraction contract (`status === "ok" || status === "unchanged"`, returning `land.parts`).
  - `geometry.subdivide({ shape, method: "orientedBoundingBox", targetArea: 400, minimumArea: 100, maximumParcels: 32, maximumAttempts: 64 })` matches `OrientedBoundingBoxOptions` and `SubdivisionResult` (`parts`, `remainingParts`, `status`, `part.shape`).
  - Default export `quarter` preserves `{ site, streetLines, streetSurfaces: roads.parts, blocks: land.parts, subdivisions }`.
- **Analytical Invariants & Split Constraints:**
  - Site `[0, 100] x [0, 100]` has area `10000`.
  - Because both streets lie in `[30, 70)` with width `8` (half-width `4`, strip intervals inside `[26, 74)`), each road strip has area `100 * 8 = 800`, their intersection is `8 * 8 = 64`, their union is `1536`, and the remaining land is `10000 - 1536 = 8464` partitioned into `4` disjoint axis-aligned rectangles (`50.044 x 43.932`, `50.044 x 48.068`, `41.956 x 43.932`, `41.956 x 48.068`, areas `1843.19..2405.54`).
  - All 4 blocks are convex, hole-free rectangles supported by the proposed deterministic midpoint OBB subdivision.
  - Under recursive midpoint OBB cutting with `targetArea: 400` and `minimumArea: 100`, any rectangle with area `> 400` splits into two equal halves of area `> 200 >= 100`, terminating once every leaf lies in `(200, 400] subset [100, 400]`. Each of the 4 blocks requires 3 levels of binary splitting (`7` attempts, `8` accepted parcels per block, `32` total accepted parcels across the quarter), well within `maximumParcels: 32` and `maximumAttempts: 64`.
  - Thus `statuses` is `["ok", "ok", "ok", "ok"]`, `remainingParts.length === 0`, `acceptedParts.length > 4` (`32`), `totalArea(preservedShapes) === 8464` (within `1e-5`), and every accepted parcel has area in `[100, 400]`.

---

## 4. Gate & Runner Policy Verification

Executed read-only verification commands in `/home/david/.codex/worktrees/city-library-example-contracts`:

| Command | Observed Exit Code | Result & Honesty Check |
| --- | --- | --- |
| `sha256sum -c docs/development/example-first/SCRIPT-SHA256SUMS` | `0` | All 3 script hashes match. |
| `bun run examples:city` | `0` | Runs `01-household-budget` (`19000`) and `02-neighborhood-heat` (`{ tick: 1, centerTemperature: 20, totalTemperature: 188 }`) with all assertions active. |
| `bun run typecheck:city` | `0` | Clean strict TypeScript check for the two delivered scripts. |
| `bun run typecheck` | `0` | Full project typecheck (`tsc --noEmit`, `tsconfig.dev.json` with ready scripts, UI tsconfigs, and `svelte-check`: 0 errors, 0 warnings). |
| `bun run examples:city:targets` | `1` | Runs `01` and `02`, then fails honestly at `03-generative-quarter.ts:36:24` (`TypeError: geometry.corridor is not a function`). No try/catch suppression or expected-failure pass. |
| `bun run typecheck:city:targets` | `1` | Fails honestly with 8 diagnostics in `03-generative-quarter.ts`: 3 `TS2339` errors for missing `geometry.corridor`, `geometry.subtract`, `geometry.subdivide`, and 5 derivative `TS7006` implicit-`any` errors on `result` and `part`. No `@ts-expect-error`, `any`, or fake ambient types. |
| `bun run examples` (parent log `/tmp/city-example-contracts-examples.log`) | In progress / incomplete log | Log starts with `19000` and `{ tick: 1, centerTemperature: 20, totalTemperature: 188 }` from the newly registered `city-simulation` phase; parent must record final completion status in `VERIFICATION.md` before committing the checkpoint. |

- **Readiness & Promotion Policy:** Standard gates (`scripts/examples.ts`, `tsconfig.dev.json`, `examples:city`, `typecheck:city`) include only the two delivered scripts (`01`, `02`), while `03-generative-quarter.ts` stays in `examples/city-simulation/03-generative-quarter.ts` under the dedicated `:targets` gates until `E1` and `E2` are implemented, at which point the exact unchanged file must be promoted into `scripts/examples.ts`, `scripts/city-examples.ts`, `tsconfig.city-examples.json`, and `tsconfig.dev.json`.

---

## 5. Staged Extension Plan (`E0`..`E6`) Verification

`docs/development/example-first/PLAN.md` satisfies all governance and sequencing constraints:
1. **No Loophole for Expansion Phases:** Explicitly states that the three cross-domain scripts (`01`, `02`, `03`) do **not** replace the requirement for **4–5 full asserted public example scripts per new API expansion phase** (`E1`, `E2`, `E3`, `E4`, `E5`, `E6`).
2. **Dependency Order (`E0`..`E6`):**
   - `E0`: Register the 3 accepted examples, verify ready scripts (`01`, `02`), record red target (`03`), no runtime changes.
   - `E1`: Freeze 4–5 asserted scripts for `geometry.corridor` and `geometry.subtract` (crossing roads, clipped ends/T-junctions, holes/components, empty/full exclusion, unchanged/invalid/failure, purity/bounds) and select/verify the Boolean geometry backend.
   - `E2`: Freeze 4–5 asserted scripts for bounded deterministic convex OBB `geometry.subdivide` (analytic rectangle, minimum-area rejection, labelled west-frontage retry, partial budgets/remaining land, invalid/unsupported/determinism); pass `03-generative-quarter.ts` and promote the unchanged file into standard gates.
   - `E3`: Algorithmically independent finite quad topology track (`topology.quadrilaterals`, `topology.relax` with `method: "squareTarget"`); requires its own 4–5 agreed scripts and example-first review (explicitly noting that the 3 city scripts do **not** auto-approve the 5 unreviewed draft scripts in `feat/townscaper-grid`), and cannot block or overtake `E1`/`E2` contracts.
   - `E4`: Compose road-derived blocks with frontage (`boundaryOverlap`, `minimumFrontage`) and explicit Layout/Grid state boundaries (no hidden T-junction normalization or implicit state transfer in `Grid.add`).
   - `E5`: Remaining catalogue capabilities (`topology.group`, `parallelStrips`, Voronoi, measurement, `straightSkeleton`) one task at a time with 4–5 scripts each.
   - `E6`: Broader city generation and live models with separate technical and visual acceptance.
3. **Independent Reviews, Baseline Regressions & Honest Ledger:** Requires fresh `gemini-4-argon` design and runtime reviews per slice, packed consumer verification, baseline regression reporting, and zero placeholder exports.

---

## 6. Concrete Blockers & Smallest Fixes

### Blockers for Design/Test Checkpoint Approval (`E0`)
- **None on the scripts, assertions, tsconfigs, or plan design.**
- **Pre-commit bookkeeping item (1):** In `docs/development/example-first/VERIFICATION.md` (line 15), the entry for `bun run examples` still reads:
  > `- bun run examples: existing complete example registry plus two city scripts: running at initial record; update this entry with final outcome before checkpoint.`
  - **Smallest fix:** Once the parent's `bun run examples` run finishes (or is re-run to completion), replace that line in `docs/development/example-first/VERIFICATION.md` with the actual observed exit code and outcome before creating the checkpoint commit.

### Blockers for Target / Runtime Acceptance (`03-generative-quarter.ts`, not claimed in `E0`)
- `geometry.corridor`, `geometry.subtract`, and `geometry.subdivide` are not yet exported or implemented in `city-library` (`examples:city:targets` and `typecheck:city:targets` exit `1` as required at `E0`).
- Target acceptance remains blocked until `E1` and `E2` freeze their 4–5 phase scripts, pass independent review, implement the runtime slices, pass all quarter assertions and stronger geometry invariants (containment, nonoverlap, boundary attribution), and promote `03-generative-quarter.ts` into the standard gates.
