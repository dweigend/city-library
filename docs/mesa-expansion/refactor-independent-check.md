# Independent post-refactor source and behavior check

The ten Mesa model/UI pairs preserve their domain behavior after the feedback-driven refactor. This check approves the inspected source changes and the verified observable trajectories, with the two explicit presentation corrections below. It does not approve browser evidence that this reviewer did not inspect.

## Scope and source

A separate native subagent reviewed the actual diff from `215b13f0d75de67f1d15774035d98e7bc8359956` to `95a5dc8f5e9769b72b7fedb3c79ba35217914236` on `feat/mesa-mechanisms`, worktree `/home/david/.t3/worktrees/city-library/t3-4fc992c0`. All twenty model/UI files were stable during this check. Their ordered source-hash record in `/tmp/mesa-feedback-refactor-baseline/compare-summary.json` has aggregate SHA-256 `882283a9fb0289f83a2715941f29c5deed0418c84ad4779131b128cad103d76f` (SHA-256 of JSON.stringify(sourceHashes)).

Preparation included the complete coding standards, model-script refactor skill, shared refactoring workflow, decision examples, and the finding/response matrix in `refactor-decisions.md`. This native check is separate from the requested Astra/Gemini feedback and is not a substitute for either reviewer.

No source, tests, shared UI, browser session, server or Git history was modified by this reviewer. The only repository file authored here is this report. Existing concurrently added evidence files were left untouched.

## Findings and decisions

No new blocking defect was found.

| Area | Evidence and decision |
| --- | --- |
| Domain execution | Expanded loops retain validation, run-before-record order, finite-model stop checks and original action calls. The 32-case comparison preserves all original observations and opaque IDs. |
| Heat | Left-associative neighbor accumulation is unchanged. Both phases remain explicit; no compute can see an earlier commit. Fixed palette endpoints and hatch values are unchanged. |
| Demand | Completed-hour quantities retain their original arithmetic. Typed closed-outline traversal emits the same endpoints and segment order; it introduces no domain state. The private projection still needs browser coverage. |
| Occupancy | Resource remains the sole allocation owner. setSlots validates and successfully resizes Resource before publishing new settings. FIFO release and occupied-capacity rejection remain unchanged. |
| Crossing | Stage computation and fixed activation remain unchanged. Deduplicating cells is an intentional projection correction, not an exact array-preserving refactor; see below. |
| Battery and retention | The renamed unconstrained energy/volume keeps crossing detection before clamp. Accumulation, drainage, import/export and current-interval observations preserve arithmetic order and units. No new integration clock or state owner appears. |
| Trees | Old-moisture priority, stable ties, water allocation before loss and seeded initialization remain unchanged. Named glyph constants express view geometry. |
| Recycling | Every nonadopter still draws at zero probability; adopters still avoid a draw. Fixed snapshot and two-phase commit preserve the old-neighbor rule. The ring's non-null assertion has a valid public population invariant. |
| Zoning | Named replication construction preserves Random-before-World creation, three paired seeds per scenario, one replication per outer tick and terminal-outcome summaries. Schematic slots/cap grouping has an explicit binary-build invariant and does not invent original parcel locations. |
| Membership | Named place references preserve construction order, object identity and edge order. Reassignment replaces only the workplace edge. The one-household/one-workplace invariant justifies remaining assertions. The suggested `Unassigned` fallback was correctly rejected: it would hide invariant failure and create an unsupported observation state. |
| Scope | `git diff --name-only 215b13f -- ui src examples` is empty. Shared UI/canvas/palette, core APIs and frozen examples remain unchanged. |

The named layout constants, separate statements, domain variable names and extracted replication construction make rule order and presentation intent easier to read without adding a builder, registry or competing API. Small existing expressions remain inline where an extraction would obscure their mechanism.

### Explicit presentation corrections

1. Occupancy, crossing and zoning bind the existing `complete: state => state.done` UI option. Their models already stop; the binding allows the host to stop playback and disable terminal step/run controls. Source inspection confirms the intended seam. This reviewer did not independently exercise that host behavior in a browser.
2. Crossing emits one final cell for each road coordinate. Last-wins coordinate comparison confirms the same final cell descriptor/color as the old road-plus-stripe overlay. The change also reduces exposed cell count and keyboard traversal entries. Because canvas pointer lookup uses its first matching cell, selecting a stripe can now expose its stripe view ID rather than the hidden road ID formerly underneath it. This is a view-only selection correction: the crossing UI has no selection-driven domain action or inspector. Do not describe the public projection arrays or all selection details as unchanged.

## Executed verification

| Command | Actual result |
| --- | --- |
| `bun /tmp/mesa-feedback-refactor-baseline/capture.ts compare` | Exit 1 as expected: exactly two case differences, both crossing cell arrays. The other 30 cases compare exactly. First changed path in each crossing case is `snapshots.0.projectionsA.crossingData.cells.6.id`, road to stripe. |
| `bun /tmp/mesa-feedback-refactor-baseline/compare-effective-crossing.ts` | 32/32 equal, exit 0. Only crossing cell arrays are interpreted by coordinate with last-wins semantics; every other value remains exact. |
| `bun test tests/mesa-models.test.ts tests/mesa-integration.test.ts tests/mesa-heat-visual.test.ts tests/mesa-social-visuals.test.ts tests/mesa-resource-visuals.test.ts tests/mesa-refactor-regressions.test.ts` | 42 tests passed, 0 failed, 392 assertions across 6 files. |
| `git diff --check` | Passed. |

The replay covers 64 independent instances, 192 paired checkpoint snapshots at requested intervals 0/1/3/10/30/130, 4,736 read/projection checks, 4,352 independent-pair continuation comparisons, 328 rejected-action atomicity checks and 192 detached-observation mutation probes. Seeded models include seeds 0, 17 and 4294967293, plus defaults. Recycling continuation includes zero influence followed by increased influence. Finite models retain their actual terminal tick.

Private UI callbacks are intentionally not extracted through mocks; demand/battery/retention private projections and actual completion/playback/rendering remain covered by the separate current-browser gate. Raw RNG state is not exposed by the factories, so continuation evidence concerns the actual observed trajectories, not a claim of complete serialized RNG equivalence. This reviewer did not rerun typecheck, build, public scripts or the expensive full repository chain; their results must be attributed to the agents that executed them.

**Verdict: approved for this source/observable-behavior scope, with the documented presentation deltas. Browser and actual-image acceptance remain separate.**
