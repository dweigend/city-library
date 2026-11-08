# Independent research integration review

Date: 8 November 2026. Reviewer: Antigravity `gemini-4-argon`.

The first review could read the city_game source notes but was blocked from the target worktree by its workspace boundary. It provided no target approval. A new review received complete document contents and the tracked diff in its prompt, without attempting access outside its permitted workspace. The coordinator verified all five document hashes against that snapshot before recording this result.

The following is the reviewer's result for that provided content. Command outcomes and worktree identity are coordinator evidence, not independently rerun checks. The verification record's later update only records this completed review.

Source: <t3-thread://v2/cb5e98d1-f255-44ff-8175-d9cf75ded5d7/thread:delegated-task:command%3Amcp%3A7d29158b-d75e-47a6-b899-4ea9e92fa76a%3Adelegate-task%3Ad0bd35f4-6a86-4e3f-b2a8-61b9da2a5b2d>

## Reviewed document hashes

```json
{
  "PLAN.md": "22c099819089226d44e06251c592771413659b8425541eda9bfa5fe043e68a75",
  "docs/development/example-first/PLAN.md": "897e76478be1af3ace96f67e63df99fb8f489c41f5877b4eb705133f7b50c2c9",
  "examples/city-simulation/README.md": "11f81a9de472199b1a9cced3c81418377532380376341999d4935e517f6e0b5b",
  "docs/development/example-first/RESEARCH-INTEGRATION.md": "e4fb0d8cef2c56bc9973891bd60930ba1b5e9bd38a9441dbd6644330f49847c7",
  "docs/development/example-first/RESEARCH-INTEGRATION-VERIFICATION.md": "1d80e2ed6a12eb460e895444928a3f8c179afe01d0455d69bcf77b7f32a34bbf"
}
```

## Reviewer report

**Verdict: APPROVED (for the provided document snapshot)**

### Scope and Verification Boundary
- **Independently verified by this review (from the provided snapshot and tracked diff):** Full text of `docs/development/example-first/PLAN.md`, `examples/city-simulation/README.md`, `docs/development/example-first/RESEARCH-INTEGRATION.md`, and `docs/development/example-first/RESEARCH-INTEGRATION-VERIFICATION.md`, plus the tracked diff across root `PLAN.md`, `docs/development/example-first/PLAN.md`, and `examples/city-simulation/README.md`.
- **Coordinator-reported evidence (not independently executed in the external worktree by this reviewer):** Branch/commit state (`docs/model-research-integration` on `cf9baeaf628b7d09a7c71e0067305e16f1f87984`), `sha256sum -c docs/development/example-first/SCRIPT-SHA256SUMS` passing on the three frozen scripts, `bun run examples:city` passing, `bun run examples:city:targets` exiting `1` at missing `geometry.corridor`, and `git diff --check` passing.

### Review Findings by Criterion

1. **Separation of Delivered, Accepted Target, and Proposed Research Briefs**
   - **Delivered:** `01-household-budget.ts` and `02-neighborhood-heat.ts` remain clearly marked as using delivered APIs and passing in standard/city gates.
   - **Accepted unmet target (frozen gate):** `03-generative-quarter.ts` remains an accepted authoring contract whose dedicated target execution and typecheck gates (`examples:city:targets`, `typecheck:city:targets`) must fail honestly at missing public exports (`geometry.corridor`, `geometry.subtract`, `geometry.subdivide`) without mocks, `any`, fake declarations, or expected-failure wrappers.
   - **Proposals:** The four contrasting briefs in `RESEARCH-INTEGRATION.md` (*Last resource unit*, *Machine lifecycle*, *Recovered components*, *Optional graph counterexample*) are explicitly scoped as proposed research cases rather than accepted or executed scripts, introduce no new public APIs, and preserve the four-or-five-script phase gate for any future expansion.

2. **No Competing Roadmap, Stage Reordering, or New API**
   - `RESEARCH-INTEGRATION.md` and `docs/development/example-first/PLAN.md` explicitly subordinate the research integration guide to `PLAN.md` and `ARCHITECTURE.md`.
   - The `E0`–`E6` delivery sequence is unchanged; `E1`/`E2` (corridor/subtract and bounded OBB subdivision) and the algorithmically independent `E3` (finite quad topology) track are explicitly protected from being blocked or reordered by the later research briefs.
   - The six research lenses (state/balances, transformation, allocation/settlement, connections/transport, time/execution, observation/comparison) are explicitly framed as analytical responsibilities within headless scripts and existing library domains, not package boundaries or managers.

3. **State, Time, Cancellation, and Non-Rollback Semantics**
   - **Authority & identity:** Availability is derived from authoritative stock and reservations rather than competing writable copies; quantities, service slots, temporary access, and identifiable components retain distinct semantics; Graph relations do not imply exclusive assignment by themselves.
   - **Read state & joint feasibility:** Current vs. old-state reads, activation order (fixed, shuffled, staged, synchronous), and RNG stream usage are explicit; synchronous rules read only relevant old values rather than cloning the full `World`; shared reads do not resolve contention for scarce capacity without an explicit conflict rule.
   - **Transition timing & clocks:** Promises, reservations, consumption, arrival, and completion have distinct transition points and explicit same-time ordering; `World` tick, `Agenda` cursor, and host playback time are kept distinct.
   - **Rejection, cancellation & non-rollback:** Expected rejections leave declared state unchanged; post-consumption cancellation requires explicit domain handling (e.g., releasing a service slot does not restore consumed inputs); `run` explicitly does not roll back prior mutations on exception, warning against blind retries that would duplicate state effects.
   - **Inert observation & fair comparison:** Observation and UI never advance ticks, consume simulation RNG, or mutate state; circular-economy comparisons require equivalent service delivery (quantity, quality, deadline) rather than inferring benefit from an R-strategy label or single score.

4. **Documentation Progression & Link Integrity**
   - Establishes a clear single-source progression (executable model $\rightarrow$ measurement $\rightarrow$ rule/order variation $\rightarrow$ failure boundaries $\rightarrow$ independent comparison, with optional `Grid`/`Graph` and separate UI layers) while keeping the three accepted scripts intact as standalone reference tasks and claiming no delivered docs site or UI.
   - All relative links across root `PLAN.md`, `docs/development/example-first/PLAN.md`, `examples/city-simulation/README.md`, `docs/development/example-first/RESEARCH-INTEGRATION.md`, and `docs/development/example-first/RESEARCH-INTEGRATION-VERIFICATION.md` resolve consistently against the repository layout.

No blockers or defects found in the snapshot.

## Coordinator response

No blockers or defects were reported. No design or script changes were required after review. Only the verification status and this evidence record were added. Snapshot approval does not imply runtime acceptance, merge approval or direct filesystem verification by the reviewer.
