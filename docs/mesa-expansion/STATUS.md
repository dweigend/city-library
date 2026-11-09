# Mesa mechanism expansion

The [visual correction](visual-correction.md) supersedes the former table-first presentation acceptance. All ten own examples are being rechecked for meaningful mechanism visuals; prior image approvals remain historical evidence.
This work adds ten illustrative city models and reusable headless mechanisms. These examples are additional entries, not accepted ports from the fixed selection of 200 upstream models. README and its approved diagram stay unchanged.

## Ownership and contract inventory

| Capability | Owner and contract | Evidence |
| --- | --- | --- |
| Pure measurements | Mesa; additive `measurements.define(project).read(model)` | Public examples frozen in 9b3b0f6 |
| Bounded explicit History | Mesa; existing `storage.history`, `add`, `samples`, `delete` | Public examples frozen in 9b3b0f6 |
| Scenarios, replications, serial run and summary | Mesa; existing `experiments` signatures and execution budgets | Public examples frozen in 9b3b0f6 |
| Activation and lifecycle | Mesa; existing World methods with additive fixed/priority order | Public examples frozen in 95d94c5 |
| Two-phase updates | Mesa; explicit synchronous compute then commit | Public examples frozen in 95d94c5 |
| Agenda composition | Salabim; existing Agenda plus causal `next` | Normal runtime merge e624416; frozen suites passed |
| Stop conditions and budgets | Mesa studies plus Salabim bounded event dispatch | Independent integration assertions passed |
| Linear progression and crossings | Mesa; explicit caller units, strict start/inclusive end | Public examples frozen in 95d94c5 |
| Groups and membership | Existing Graph and original references; readonly native snapshots | Public examples frozen in 95d94c5 |
| Occupancy and reservations | Salabim Resource is the sole allocation owner | Normal runtime merge e624416; frozen suites passed |

Mesa owns `src/world/world.ts` and activation integration. Salabim owns Agenda, service queues, Resource, Store, waiting conditions and time-weighted monitoring. Root exports are integrated additively by the coordinators. Existing lifecycle participants remain the common deletion coordination seam; no second Agent registry is introduced. Agenda attachment is integrated into that same World implementation, with the four unchanged attachment examples passing.

History's `tick` is an explicit recording coordinate. It does not advance World or Agenda. A caller may deliberately sample Agenda time, but must aggregate same-time numeric measurements before recording, or use a separately named event trace that permits ties. Event trace and History remain different contracts. Process event dispatch must not become a competing population scheduler.

## Scope and acceptance

All ten requested mechanisms and ten own paired entries are implemented locally. Both frozen core suites, the four attachment scripts and all ten DES model scripts executed successfully after the normal runtime merge. All twenty own model tests and eight independent adversarial integration tests passed. The requested local expansion has completed shell, public-consumer, browser and independent review gates, with the scope limits below. Passing examples, implementation, independent review and browser acceptance are separate gates. Full NetLogo compatibility remains an existing open target; fixed/shuffle/priority activation does not claim to complete it. Serial studies and bounded numeric history do not imply snapshot continuation, pause/resume, worker transport or calibration.

Required verification includes public consumer execution, typecheck, full check, explicit Svelte production build, ten browser flows, desktop/narrow light/dark screenshots, independent image inspection and repeated focused refactoring. Required independent models are Antigravity `gemini-3.8-flash` with `thinking_level=high`, and Codex `gpt-6-astra` with `reasoningEffort=high` for deep logical analysis. Catalog availability is confirmed; results are recorded separately when received.

## Late shared-view acceptance gate

The forty-four Mesa images have independent visual approval and all ten interaction flows passed. A later explicit window-error listener reproduced ResizeObserver undelivered-notification events in the integrated DES spatial canvas during setup/resize, while the checked network/chart did not reproduce them. Salabim owns the minimal canvas-only scheduling fix. Final browser acceptance remains qualified until the actual fix is normally merged and targeted resize/setup/playback/switch and image checks complete. Empty snapshot console arrays do not establish universal browser-error absence. The fresh Gemini final review started on98015d0; later central-reference documentation and the accepted maintenance-label presentation change remain explicit post-review deltas.

## Completed final gates

The fresh final Antigravity `gemini-3.8-flash` review (`thinking_level=high`) explicitly approved baseline `98015d0` for the requested scope; [its report](gemini-final-review.md) and [author responses](review-responses.md) preserve approval boundaries. The later canvas-only `11d78f7` fix received separate independent source/lifecycle approval, nineteen passing focused UI tests, complete typecheck, explicit Svelte build, all ten repeated real-browser resize/setup/playback/switch sequences, deterministic pending-frame cancellation, and four independently approved fresh spatial images. [The handoff record](DELIVERY.md) links all ten pairs and exact checks. The previous resize gate is resolved for these ordinary-host flows, not as universal ResizeObserver immunity.
