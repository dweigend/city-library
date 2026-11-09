# Independent Substantial Contract & Architecture Review: Mesa Mechanism Expansion

**Reviewer**: Antigravity Review Sub-Agent (`gemini-3.8-flash`)  
**Workspace**: `/home/david/.t3/worktrees/city-library/t3-4fc992c0`  
**Branch**: `feat/mesa-mechanisms`  
**Reference Baseline**: `AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/CODING_STANDARDS.md`, `docs/agent-loom/api-table.md`, `docs/agent-loom/api-reference.md`, `docs/development/des-contract.md`  
**Frozen Contracts Reviewed**:
- `examples/mesa-measurements/` (`01-shared-measurement.ts`, `02-explicit-bounded-history.ts`, `03-scenarios-and-replications.ts`, `04-run-stop-and-summary.ts`, `05-failure-and-budget.ts`)
- `examples/mesa-dynamics/` (`01-fixed-lifecycle.ts`, `02-priority-and-random.ts`, `03-two-phase.ts`, `04-linear-thresholds.ts`, `05-graph-membership.ts`)
- `examples/mesa-attachment/` (`01-identity-and-clocks.ts`, `02-mixed-batch.ts`, `03-conflict-atomicity.ts`, `04-detach-snapshots.ts`)
- `docs/mesa-expansion/` (`dynamics.md`, `measurements.md`, `models.md`, `STATUS.md`)

---

## 1. Executive Summary & Scope

This review provides an independent, read-only architectural evaluation of the Mesa mechanism expansion in City Library. In compliance with repository delivery gates, **frozen public contract examples and specifications are reviewed first**, prior to runtime finalization.

### 1.1 Scope Boundaries
- **Delivered / Reviewed Serial Slice**: Pure measurement definitions (`measurements.define`), explicit bounded in-memory History (`storage.history`), serial parameter studies (`experiments.design`, `replicate`, `run`, `summarize`), World activation extensions (`order: "fixed"`, `order: "priority"`, scoped `die()`, stable ties), two-phase synchronous updates (`twoPhase`), continuous linear thresholds (`continuous.linear`, `continuous.crossing`), Graph-based group membership, and mixed World attachment contracts.
- **Explicit Open Gates (Out of Scope for this Slice)**: Snapshot serialization and binary/JSON codecs, multi-process Node worker transport (`agent-loom/experiments/node`), checkpoint pause/resume continuation, BehaviorSpace XML data binding, parameter calibration/optimization, NetLogo 7.0.0 MT RNG stream, and public `Process`/`ProcessEvent` facades. Undelivered target capabilities are recognized as open gates rather than deficits of this serial slice.

---

## 2. Ownership & Architecture Separation (Mesa vs. Salabim)

### 2.1 The Single-Owner Rule ("No Duplicate Scheduler / Capacity Owner")
The architecture strictly enforces domain authority:
1. **Salabim Track Ownership**: Owns `Agenda` (causal event scheduling via `next({until})`), `ServiceQueue` (FIFO/priority), `Resource` (sole authority for capacity, requests, and granted allocations), `Store` (producer/consumer queues), `Signal`/`wait` (state predicates), `TimeWeighted` (DES step-integral monitoring), and `EventTrace` (time-tied event logging).
2. **Mesa Track Ownership**: Owns pure measurement projections (`measurements.define`), bounded time-series observation (`storage.history`), serial study design and execution (`experiments`), intra-step entity activation (`world.activate`, `report`, `select`), synchronous update coordination (`twoPhase`), stateless linear progression (`continuous`), and topology-based entity grouping (`Graph`).

### 2.2 Boundary Integrity Verification
- **No Duplicate Scheduler**: Mesa's `world.activate` is an intra-step visitor. It operates synchronously within a single World tick, captures entry membership, validates living ownership at visit, and **never advances ticks or event time**. It does not maintain an event queue, priority queue of future actions, or persistent callbacks.
- **No Duplicate Capacity Owner**: In models requiring resource rationing (e.g. `experiments/residential-occupancy` in [models.md](file:///home/david/.t3/worktrees/city-library/t3-4fc992c0/docs/mesa-expansion/models.md)), occupancy is exclusively owned by Salabim's `Resource`. Mesa components (Agent, Graph) do not maintain shadow waiting lists or parallel capacity counters.
- **No Duplicate Group Registry**: Mesa models express agent groups using canonical references as `Graph` nodes and edges for group relations. No competing "GroupManager" or "Population" class is introduced.

### 2.3 Cross-Track World Attachment Seam
The attachment contract frozen in `examples/mesa-attachment/*.ts` establishes:
- `world.add` and `world.delete` accept `Agent`, `Grid`, `Graph`, and `Agenda`.
- Batches are deduplicated at entry and validated atomically: if any component belongs to another World, the entire batch rejects with `TypeError` and zero mutations occur.
- `world.agendas` and `world.graphs` return frozen insertion-order snapshots of canonical references.
- **Architectural Seam Finding**: In `src/world/world.ts`, the draft implementation defines `type WorldComponent = Agent | GridMembership | Graph;` and lacks `world.agendas` on the `World` interface. This causes a type mismatch with `examples/mesa-attachment` until the Salabim `Agenda` definition is formally integrated into the World component union.

---

## 3. Clock, Time, and Lifecycle Semantics

### 3.1 Disentanglement of Clock Semantics
Five distinct time and coordinate concepts operate across the system:
1. **World Tick (`world.tick.value`)**: Nonnegative integer step counter (0, 1, 2, ...). Advanced exclusively by successful intervals of `run(world, step, steps)` or `experiments.run`. Never advanced by `world.activate` or `twoPhase`.
2. **Agenda Time (`agenda.time`)**: Finite, nonnegative continuous/discrete event time (`at >= 0`). Advanced by `agenda.next({until})` or `agenda.advance({until})`. Distinct from World tick; mapping between ticks and event horizons is explicitly owned by the authored model.
3. **Continuous Linear Progression (`continuous.linear`, `continuous.crossing`)**: Pure mathematical interval evaluation over a finite nonnegative `duration`. Rate is quantity per time unit. It possesses **no internal clock, no background timer, and no state**.
4. **History Tick (`history.add({ tick, values })`)**: Monotonic observation coordinate. Must be finite, nonnegative, and strictly increasing within an active series (`tick > lastTick`). Eviction upon reaching capacity does not reset `lastTick`.
5. **EventTrace Time (`samples.record({ at, value })`)**: Discrete event log coordinate. Allows ties (`at1 === at2`), but rejects non-decreasing times.

### 3.2 Threshold Crossing Semantics
The contract in [dynamics.md](file:///home/david/.t3/worktrees/city-library/t3-4fc992c0/docs/mesa-expansion/dynamics.md) and [04-linear-thresholds.ts](file:///home/david/.t3/worktrees/city-library/t3-4fc992c0/examples/mesa-dynamics/04-linear-thresholds.ts) specifies **strict start, inclusive end**:
- Rising: `from < threshold && to >= threshold`
- Falling: `from > threshold && to <= threshold`
- Zero duration or stationary segments (`from === to`) return `undefined`.
- A trajectory starting exactly on the threshold (`from === threshold`) does not cross; moving away and returning fires again.
- Crossing elapsed time uses linear interpolation with ordinary IEEE-754 arithmetic: `fraction = (threshold - from) / (to - from); elapsed = duration * fraction`.
- Scaling is applied prior to subtraction to prevent floating-point overflow near extreme values.

### 3.3 Lifecycle & Deletion Coordination
- **Scoped `die()` in Activation**: When `context.die()` is invoked during `world.activate`, the active entity is deleted (`(self as Agent).delete()`), and a private frame signal is thrown. The active frame catches this signal, preventing leak to the caller, while `finally` marks the frame expired. Outer frames unwind cleanly, and post-death callbacks in the same invocation are skipped because living ownership is re-checked at visit.
- **Graph Node vs. Entity Lifecycle**: Deleting an Agent node from a Graph (`graph.nodes.delete(agent)`) removes incident edges but preserves the Agent identity and its living status (`agent.alive === true`). Conversely, deleting an Agent triggers registered `DeletionParticipant` hooks to cleanly detach graph associations.

---

## 4. Contract Analysis & Exact Binding Mismatches

| Area | Contract / Location | Baseline / Target Spec | Finding / Severity | Recommendation |
| --- | --- | --- | --- | --- |
| **World Activation Options** | `docs/mesa-expansion/dynamics.md`<br>`examples/mesa-dynamics/01-fixed-lifecycle.ts`<br>`02-priority-and-random.ts` | `docs/agent-loom/api-table.md`<br>`api-reference.md` line 307 (`order?: "shuffle" \| "netlogo-7.0.0"`) | **LOW**: Baseline specification omitted `fixed` and `priority` orderings. Added cleanly as backward-compatible extension. Priorities are captured before execution; dead members are filtered prior to priority evaluation. | Update `api-table.md` and `api-reference.md` to document `fixed` and `priority` order options. |
| **Additive Public APIs** | `twoPhase`, `continuous`, `measurements` | Root exports in `index.ts` | **LOW**: These three modules are additions not present in original Agent Loom specification. | Ensure additions adhere to Minimum Sufficient Architecture and are documented in public API reference. |
| **Options Validation on Additive APIs** | `src/execution/index.ts`<br>`src/continuous/index.ts` | `docs/CODING_STANDARDS.md` ("Validate external inputs at boundaries") | **MEDIUM**: `twoPhase(source, actions)` does not call `validateOptions` on `actions`. Unrecognized options are ignored rather than rejected. Similarly, `continuous.linear` and `crossing` read properties directly without option validation. | Add `validateOptions(actions, ["compute", "commit"])` in `twoPhase`, and validate option objects in `continuous`. |
| **World Component Union** | `src/world/world.ts`<br>`examples/mesa-attachment/` | `docs/development/des-contract.md`<br>`docs/mesa-expansion/dynamics.md` | **HIGH**: `WorldComponent` in `src/world/world.ts` lacks `Agenda`. `world.agendas` property is missing from `World` interface. Causes `tsc` failures in `examples/mesa-attachment/`. | Integrate `Agenda` into `WorldComponent` and add `readonly agendas: readonly Agenda[]` to `World`. |
| **History Key Schema & Ordering** | `src/storage/history.ts`<br>`examples/mesa-measurements/02-explicit-bounded-history.ts` | `docs/agent-loom/api-reference.md` line 2382 | **VERIFIED CLEAN**: Key order established on first sample is maintained even if subsequent samples present keys in alternative order. `JSON.stringify` roundtrip preserves exact sample structures. | Keep existing ring-buffer implementation. |
| **Serial Study Preflight Budgets** | `src/experiments/run.ts`<br>`examples/mesa-measurements/05-failure-and-budget.ts` | `docs/agent-loom/api-reference.md` line 1740 | **VERIFIED CLEAN**: `maxTotalSteps` and `maxTotalSamples` are checked against Cartesian product before first `create`. In case of failure with `onError: "stop"`, remaining runs are marked `skipped` with reason `fail-fast`. | Keep existing preflight implementation. |

---

## 5. Architecture Hazards & Risk Mitigation

1. **Hazard: Clock Conflation in Hybrid Models**
   - *Risk*: Authoring models that combine continuous rates (e.g. battery kWh/h, basin outflow) with discrete World steps can lead to confusing step index with physical time.
   - *Mitigation*: [models.md](file:///home/david/.t3/worktrees/city-library/t3-4fc992c0/docs/mesa-expansion/models.md) explicitly mandates that `world.tick.value` advances by 1 per completed interval, while physical duration is tracked in domain properties and exposed via `measurements.define`.
2. **Hazard: Mutable State Leaks in Two-Phase Updates**
   - *Risk*: If `actions.compute(member)` returns a mutable reference to internal state instead of a detached proposal, subsequent compute callbacks could observe partially updated state.
   - *Mitigation*: Contract specifies that proposals must be detached data. In models, enforce pure computations.
3. **Hazard: Non-Finite Values in Measurements & Studies**
   - *Risk*: Unhandled division by zero in metrics (e.g. empty array reduction in mean calculations) corrupting time-series histories or study summaries.
   - *Mitigation*: `numericRecord` and `measurements.define` strictly reject `NaN` and `Infinity` with `RangeError`. `experiments.summarize` rejects non-finite selections.
4. **Hazard: Lifecycle Deletion Deadlocks**
   - *Risk*: Deleting an Agent that holds an unresolved Salabim Resource ticket could silently orphan allocation slots.
   - *Mitigation*: Salabim's `DeletionParticipant` hooks prevent deletion while an entity is actively registered in queues or resources.

---

## 6. Gate Classification & Recommendations

### 6.1 Recommended for Independent Approval Gate
The following contracts are well-bounded, validated by frozen examples, and meet architectural standards:
1. **Measurement Definition**: `measurements.define(project).read(model)` returning frozen, detached, numeric-only records.
2. **Bounded In-Memory History**: `storage.history({ capacity })` with strict monotonic ticks, schema lock, ring-buffer FIFO eviction, and `delete()` reset.
3. **Serial Studies Execution**: `experiments.design`, `experiments.replicate`, `experiments.run`, and `experiments.summarize` with Cartesian planning, preflight budgeting, explicit failure phases (`create`, `step`, `sample`, `measure`, `stop`, `dispose`), and lifecycle disposal guarantees.
4. **World Activation Extensions**: `world.activate`, `world.report`, and `world.select` supporting `order: "fixed"` and deterministic `order: "priority"`, scoped `die()`, and dead-member pre-filtering.
5. **Two-Phase Synchronous Execution**: `twoPhase(source, { compute, commit })` with synchronous non-thenable verification and complete compute-before-commit guarantee.
6. **Continuous Linear Progression**: `continuous.linear` and `continuous.crossing` with strict-start/inclusive-end threshold rules and IEEE-754 scale-safe interpolation.
7. **Graph-Based Grouping**: Using standard `Graph` nodes and edges without competing group management abstractions.

### 6.2 Deferred to Open Gates (Target Spec Continuity)
1. **Snapshot Save / Load Continuation**: Binary/JSON state reconstruction and format versioning.
2. **Node Worker Transport**: Out-of-process study execution (`agent-loom/experiments/node`).
3. **Pause / Resumable Checkpoints**: Incremental study checkpoints (`pause.when`, `pause.save`).
4. **BehaviorSpace Binding**: NetLogo XML finite-data parsing and execution.
5. **Model Parameter Calibration**: Optimization algorithms for parameter fitting.
6. **NetLogo 7.0.0 Compatibility Mode**: Mersenne Twister RNG stream and exact Java tie-breaking.
