# Mesa mechanism expansion

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

All ten requested mechanisms and ten own paired entries are implemented locally. Both frozen core suites, the four attachment scripts and all ten DES model scripts executed successfully after the normal runtime merge. All twenty own model tests and eight independent adversarial integration tests passed. Browser and final independent acceptance remain in progress. Passing examples, implementation, independent review and browser acceptance are separate gates. Full NetLogo compatibility remains an existing open target; fixed/shuffle/priority activation does not claim to complete it. Serial studies and bounded numeric history do not imply snapshot continuation, pause/resume, worker transport or calibration.

Required verification includes public consumer execution, typecheck, full check, explicit Svelte production build, ten browser flows, desktop/narrow light/dark screenshots, independent image inspection and repeated focused refactoring. Required independent models are Antigravity `gemini-3.8-flash` with `thinking_level=high`, and Codex `gpt-6-astra` with `reasoningEffort=high` for deep logical analysis. Catalog availability is confirmed; results are recorded separately when received.
