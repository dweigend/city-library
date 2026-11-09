# Independent DES code recheck

This review inspects the implemented DES kernels and ten city-model pairs after the independent clarity refactor `7773dd9` and normal Mesa integration through `50caf9a`. The reviewer did not implement or refactor these modules. This is a scoped source and behavior review; substantial Gemini review, scientific interpretation and real-browser screenshot acceptance remain separate gates.

## Findings and responses

No blocking runtime defect was found in the inspected scope.

| Severity | Finding | Response and verification |
| --- | --- | --- |
| Low | Cross-track and DES documents still described the public APIs as proposed and World attachment as missing after their freeze and successful integration. | Reported to the coordinator. The coordinator refreshed current status and linked the freeze/runtime commits during this review; the reviewer reread the updated sections. |
| Low | The Resource sentence “A new request cannot bypass the queue” can be read as forbidding a newly arrived higher-priority request from entering ahead of lower-priority waiters. The agreed runtime orders waiting requests by policy, while strict admission never skips the current head. | Reported for the precise wording: priority may reorder waiting tickets, never preempts holders, and admission never skips the policy-sorted head. No runtime or frozen-assertion change is required. |

The source review confirmed these boundaries:

- Successful `Agenda.next` keeps the exact event time, including the last due event; empty extraction moves to the explicit horizon. Batch `advance` retains its distinct cursor and event-limit behavior.
- Handles and tickets are issued per receiver and expose live readonly outcomes. Canonical Agent references are retained. Each queue entry, resource request and stored/blocked producer slot has an independent deletion participant, including duplicate participation by one Agent.
- Resource alone owns allocation and waiting order. Retained overcapacity never preempts; release/cancel admit eligible waiters synchronously. A waiting timeout needs its documented status guard because generic resource cancellation can also release a grant.
- Store producer/consumer settlement preserves FIFO, bounded occupancy and direct handoff. Completed transfers are not undone by cancellation, and an undefined payload is distinguished by get status.
- Signal evaluates pending predicates before commit and rejects mutation reentry and nonboolean/asynchronous results without partially publishing its own state.
- TimeWeighted integrates explicit piecewise-constant levels; reads are pure and overflow rejects. EventTrace is separate equal-time event diagnostics, not another measurement History.
- Explicit Random distributions preserve the selected stream and cached Gaussian state. Gamma follows the shape/rate contract; Bernoulli endpoints and constant triangular calls consume no draws; nonconstant triangular consumes one uniform draw.
- The ten models use distinct mechanisms with explicit units and bounded causal event loops. Their UI declarations project observations and invoke public actions without owning domain rules, timers or allocation state. Combined models use the existing `run` boundary, so a thrown event-limit failure does not complete a World step.
- Public root imports remain headless. Mesa owns World activation, History and global run budgets; no competing Process scheduler or Environment was introduced.

## Executed checks

The reviewer executed:

- `bun test tests/des-adversarial.test.ts tests/random-normal.test.ts tests/random-exponential-poisson.test.ts`: **49 passed, 0 failed, 417 assertions**.
- All five `examples/des/01`–`05` scripts: passed with their assertions enabled.
- `examples/des-models/phase-a.ts` (the five separate phase-A scripts) and each phase-B script `06`–`10`: all ten model contracts passed.
- A separate public-import probe: a bounded zero-delay dispatch loop throws inside `run` without advancing World tick or discarding the pending event; Signal mutation reentry preserves the prior value and wait status; Resource retain-to-zero preserves a waiting request until a later capacity increase. All assertions passed.

The coordinator already owned the full repository check and browser work, so this reviewer did not duplicate those runs or claim their results. No runtime, model, UI or frozen example was edited by this reviewer.

## Approval scope

**Approved for the inspected DES runtime and model source behavior after the recorded refactor.** No blocking code finding remains. The low-severity wording correction should be completed in current documentation before final handoff. This approval does not assert whole Salabim parity, calibrated city predictions, complete continuation, full accessibility or browser/screenshot acceptance, and does not replace the required independent Gemini judgment.
