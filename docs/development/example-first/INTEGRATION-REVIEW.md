# Independent Design & Integration Review: Cross-Domain Probes (`04-scarce-resource`, `05-shared-machine`) and Plan Refinements

- **Date:** 2026-11-08
- **Reviewer:** Antigravity (`gemini-4-argon`, independent read-only review sub-agent)
- **Target Worktree:** `/home/david/.codex/worktrees/city-library-example-contracts` (`docs/example-first-contracts`, uncommitted diff against `cf9baea`)
- **Source Research Baseline:** `/home/david/Projekte/city_game/docs/GLOBAL-ARCHITECTURE-BRAINSTORM.md` and `/home/david/Projekte/city_game/docs/MESA-DESIGN-RESEARCH.md`
- **Governing Standards:** Current City Library `AGENTS.md` and `docs/CODING_STANDARDS.md`
- **Verdict:** **APPROVED** for the cross-domain example/plan integration checkpoint (`docs/example-first-contracts`). Zero blocking issues found. Note: This approval applies strictly to the two new client-model integration probes and documentation/runner integration; it does **not** approve runtime delivery of `03-generative-quarter.ts` or any later API expansion phases (`E1`–`E6`).

---

## 1. Scope, Untouched Baselines & Non-Intrusion Verification

| Requirement | Verification Result |
| --- | --- |
| Only worktree `/home/david/.codex/worktrees/city-library-example-contracts` reviewed | Confirmed (`HEAD` at `cf9baea` on `docs/example-first-contracts`). |
| Original 3 scripts + `SCRIPT-SHA256SUMS` byte-identical | Verified via `sha256sum -c docs/development/example-first/SCRIPT-SHA256SUMS` (exit `0`, all 3 `OK`) and `git status --short` (no modifications to `01`, `02`, `03`, or `SCRIPT-SHA256SUMS`). |
| Separate `INTEGRATION-SCRIPT-SHA256SUMS` matches new probes | Verified via `sha256sum -c docs/development/example-first/INTEGRATION-SCRIPT-SHA256SUMS` (exit `0`, both `04-scarce-resource.ts` and `05-shared-machine.ts` `OK`). |
| Zero modifications to `src/` or `index.ts`; no new public API | Confirmed via `git status --short -uall` and `git diff cf9baea`. Only `PLAN.md`, `docs/development/example-first/*`, `examples/city-simulation/*`, `scripts/city-examples.ts`, `scripts/examples.ts`, `tsconfig.city-examples.json`, and `tsconfig.dev.json` are touched. |
| No premature abstraction (`Resource`, `Reservation`, `ClockManager`, transaction DSL) | Confirmed. Both probes use only existing public root imports (`Agent`, `World` from `"city-library"`) and local model functions. |
| Concurrent `docs/model-research-integration` worktree preserved | Confirmed clean at `13d934a` with zero modifications; semantic merge guidance is explicitly documented in `docs/development/example-first/PLAN.md` and `INTEGRATION-VERIFICATION.md`. |
| Source research docs in `city_game` untouched | Confirmed read-only inspection. |

---

## 2. Mathematical Invariants, Guard Atomicity & Semantic Review of New Probes

### 2.1 `examples/city-simulation/04-scarce-resource.ts`
- **Scenario & Priorities:** Models one indivisible inventory unit (`quantity: 1`) and two applicants (`alice`, `bob`, each `received: 0, eligible: true`) across three independent model instances (`first`, `reversed`, `invalidated`).
  - Priority `[alice, bob]` (`first`) yields `{ inventory: 0, alice: 1, bob: 0, unmet: 1 }`.
  - Reversed priority `[bob, alice]` (`reversed`) yields `{ inventory: 0, alice: 0, bob: 1, unmet: 1 }`.
- **Stale Choice Rejection & Guard Atomicity:**
  - In `invalidated`, `staleChoice` selects `alice` while eligible, then `invalidated.alice.eligible = false` invalidates her before `transferOne(invalidated, staleChoice)`.
  - `transferOne` validates all guards (`applicant === undefined || !applicant.eligible`, ownership identity `applicant !== model.alice && applicant !== model.bob`, single-receipt `applicant.received !== 0`, and stock `model.inventory.quantity < 1`) **before** any mutation, with zero asynchronous steps or callbacks between check and state update.
  - The stale choice returns `false` and leaves `observe(invalidated)` deep-equal to `beforeRejection`.
  - Policy is explicit: a rejected choice does not trigger an invisible retry; considering the next applicant (`bob`) requires a new explicit `chooseApplicant` call.
  - Attempting a second transfer on an exhausted inventory (`transferOne(first, first.bob)`) returns `false`.
- **Conservation & Non-Negativity (`assertBalance`):**
  - Exact conservation: `inventory + alice + bob === 1`.
  - Non-negativity: `inventory >= 0 && alice >= 0 && bob >= 0`.
  - At most one accepted claim: `alice + bob <= 1`, with `unmet = 2 - (alice + bob)`.
- **Inert Observation & Instance Independence:**
  - Interleaved execution on `first` leaves `observe(reversed)` equal to `initial`.
  - Repeated `observe(first)` calls return identical snapshots without mutating state.
  - Distinct canonical `Agent` identities verified (`assert.notEqual(first.inventory, reversed.inventory)`, `assert.notEqual(first.alice, reversed.alice)`).

### 2.2 `examples/city-simulation/05-shared-machine.ts`
- **No Duplicated Writable Availability State:**
  - `inventory` stores only `{ quantity: 2, consumed: 0 }`.
  - `available` is strictly derived in `observe(model)` as `model.inventory.quantity - Number(model.machine.phase === "reserved")`. Reservation never mutates `inventory.quantity` or maintains a second writable availability field.
- **Lifecycle Trace (`repairedFirst`):**
  - Initial (`tick: 0`): `inventory: 2, available: 2, consumed: 0, phase: "idle", occupant: null, readyAt: 0, completed: 0`.
  - `reserve(repairedFirst, "A")` (`tick: 0`): `inventory: 2, available: 1, consumed: 0, phase: "reserved", occupant: "A"`. Competing `reserve(repairedFirst, "B")` returns `false`.
  - `start(repairedFirst, "A")` (`tick: 0`): consumes 1 unit and ends material reservation (`inventory: 1, available: 1, consumed: 1, phase: "running", occupant: "A"`). Calling `cancel(repairedFirst, "A")` while running returns `false`.
  - `world.tick.advance(1)` then `fail(repairedFirst, 1)` (`tick: 1`): transitions to `phase: "repair"`, releases occupancy (`occupant: null`), sets `readyAt: 2`, leaves `completed: 0`, and **does not refund** consumed material (`inventory: 1, available: 1, consumed: 1`). Premature `reserve` and premature `repair` at `tick: 1` both return `false`.
  - At `tick: 2` (`repairedFirst.world.tick.advance(1)`): `repair` runs **before** `reserve("B")` and `start("B")` — all three succeed (`true`).
  - At `tick: 3` (`repairedFirst.world.tick.advance(1)`): `complete(repairedFirst, "B")` succeeds, yielding `{ tick: 3, inventory: 0, available: 0, consumed: 2, phase: "idle", occupant: null, readyAt: 2, completed: 1 }`.
- **Same-Time Ordering Contrast (`requestedFirst` at `tick: 2`):**
  - Reaches `tick: 2` under identical failure history, but `reserve(requestedFirst, "B")` runs **before** `repair(requestedFirst)`.
  - `reserve` returns `false` (definitive rejection); subsequent `repair` returns `true` and leaves `occupant: null`, `inventory: 1, consumed: 1, completed: 0` without hidden retry.
- **Pre-Start Cancellation (`cancelled`):**
  - `reserve(cancelled, "A")` followed by `cancel(cancelled, "A")` restores the exact `untouched` observation snapshot (`inventory: 2, available: 2, consumed: 0, phase: "idle", occupant: null`) without consuming stock.
- **Mathematical Invariants (`assertBalance`), Identity & Clock Honesty:**
  - Material conservation: `result.inventory + result.consumed === 2`.
  - Availability bounds: `0 <= result.available <= result.inventory`.
  - Exclusive occupancy invariant: `(result.occupant !== null) === (result.phase === "reserved" || result.phase === "running")`.
  - Canonical machine identity preserved across failure and repair (`assert.equal(repairedFirst.machine, machineIdentity)`) and distinct across instances (`assert.notEqual(repairedFirst.machine, requestedFirst.machine)`).
  - Time is advanced manually via `world.tick.advance(1)` to prescribe scenario hours; documentation and comments explicitly state that this is not an automatic job scheduler or physical failure distribution.

### 2.3 Code Style & Authoring Contract Alignment
- Both scripts follow the user's flat, top-to-bottom TypeScript style: parameters/setup at the top, main scenario operations executed in a clear linear sequence, `console.log` and assertions separated cleanly below the main operations (with only minimal inline state-step checks where interleaving order is the subject of the test), and short named domain functions (`createAllocation`, `chooseApplicant`, `transferOne`, `observe`, `assertBalance`, `createWorkshop`, `reserve`, `start`, `cancel`, `fail`, `repair`, `complete`) below.
- Zero nested loops or callback chains.

---

## 3. Architecture, Plan & Documentation Review

- **Explicit Model Helper Policy & Generalization Gate (`docs/development/example-first/PLAN.md`, `examples/city-simulation/README.md`):**
  - Clearly establishes that the six operation families (`state/balances`, `transformation`, `choice/allocation/settlement`, `connections/transport`, `time/execution`, `observation/comparison`) are analytical questions rather than six packages or managers.
  - Defines a 6-step generalization gate requiring a concrete need across at least two contrasting author tasks, comparison against existing exports and ordinary TypeScript first, and matched ownership/unit/timing/failure semantics before extracting any public operation.
  - Retains `02-neighborhood-heat.ts` as an explicit non-resource counterexample (grid diffusion without resource reservation/allocation).
- **Parallel Tracks & Preserved Roadmap:**
  - Explicitly decouples geometry (`E1`–`E5`) and Townscaper (`E3`) from economy/resource model probes so neither blocks the other.
  - Preserves all 49 source catalogue rows, 58 integrated operation/property entries, the `E0`–`E6` delivery sequence, and the requirement for 4–5 asserted public example scripts per actual API expansion phase.
- **Link & Checksum Integrity:**
  - Every relative markdown link across `PLAN.md`, `docs/development/example-first/PLAN.md`, `examples/city-simulation/README.md`, and `docs/development/example-first/INTEGRATION-VERIFICATION.md` was programmatically checked and resolves to an existing file/anchor.

---

## 4. Executed Gate Verification

All verification commands were executed read-only against `/home/david/.codex/worktrees/city-library-example-contracts`:

| Command | Exit Code | Observed Output & Honesty Verification |
| --- | --- | --- |
| `sha256sum -c docs/development/example-first/SCRIPT-SHA256SUMS` | `0` | `01`, `02`, `03` `OK` (byte-identical to `cf9baea`). |
| `sha256sum -c docs/development/example-first/INTEGRATION-SCRIPT-SHA256SUMS` | `0` | `04`, `05` `OK`. |
| `bun run examples:city` | `0` | Runs `01`, `02`, `04`, `05` with all assertions active and expected console outputs. |
| `bun run typecheck:city` | `0` | Clean strict TypeScript check across `index.ts`, `src/**/*.ts`, and `01`, `02`, `04`, `05`. |
| `bun run typecheck` | `0` | Full project typecheck (`tsc --noEmit`, `tsconfig.dev.json`, UI tsconfigs, and `svelte-check`: `0 errors and 0 warnings`). |
| `bun run examples:city:targets` | `1` | Runs `01`, `02`, `04`, `05`, then fails honestly at `03-generative-quarter.ts:36:24` (`TypeError: geometry.corridor is not a function`). No mock, skip, or expected-failure catch. |
| `bun run typecheck:city:targets` | `1` | Fails honestly with 8 errors in `03-generative-quarter.ts` (`TS2339` for missing `corridor`, `subtract`, `subdivide` + 5 downstream `TS7006` implicit-`any` errors). |
| `bun run examples` log (`/tmp/city-integration-examples.log` & `integration-examples-console.txt`) | `0` | Parent's full registered examples run has already completed (exit `0`) and is identically recorded in `docs/development/example-first/integration-examples-console.txt` (`7132` bytes, byte-identical to `/tmp/city-integration-examples.log`). |

---

## 5. Concrete Blockers & Smallest Corrections

### Blockers for Cross-Domain Integration Checkpoint (`docs/example-first-contracts`)
- **None.** All code, mathematical invariants, guard atomicity, runner registrations, strict typechecks, checksum manifests, and full-example console logs (`integration-examples-console.txt`) are complete and verified.
- **Final coordinator step before commit:** Update `docs/development/example-first/INTEGRATION-VERIFICATION.md` to replace `"Fresh independent review is pending"` with a link/reference to this completed review and the coordinator's response, and ensure `docs/development/example-first/integration-examples-console.txt` is staged alongside the other checkpoint files.

### Unmet Target & Later Phase Boundaries (Not Claimed Here)
- `03-generative-quarter.ts` remains an intentionally red target (`geometry.corridor`, `geometry.subtract`, `geometry.subdivide` absent).
- Neither `E0` nor this cross-domain probe integration approves runtime delivery for `E1`–`E6` or any browser/UI acceptance.
