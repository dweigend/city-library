# Independent DES refactor record

## Scope and preparation

This agent did not implement the original DES kernels or city-model scripts. The review followed the full coding standards and the original repository's exact `refactor-library` and `refactor-model-scripts` skills, including their shared workflow and decision examples. Those auxiliary skills are absent from this worktree; their source location was `/home/david/Projekte/city-library/.agents/skills/`.

The inspected scope was the Agenda, queue/resource/store/condition kernels, lifecycle participation helper, time-weighted observation, event diagnostics, new Random distributions and ten DES model/UI pairs. World, shared lifecycle, state cloning and root exports remained outside this agent's edit ownership. Concurrent coordinator changes were preserved.

## Findings and changes

| Finding | Response | Compatibility risk |
| --- | --- | --- |
| Maintenance event dispatch mixed extraction, failure rules, repair rules, trace recording and queue admission in one loop. Its observation used a nested status conditional. | Extracted the existing ordered mutations into `failMachine` and `completeRepair`; `machineStatus` makes observation classification explicit. Trace recording and admission remain in their original positions after event handling. | Low; no reordered mutation, scheduling, event budget or time rule. Exact observations compared. |
| Parcel journey state was an anonymous seven-field declaration containing a factory-dependent ticket type. | Introduced the private `ParcelJourney` record and the existing public `ResourceRequest<Parcel>` type. | Type-only clarification; public factory/actions and observations unchanged. |
| Gamma's squeeze coefficient was an unexplained acceptance literal. | Named the existing `0.0331` value and linked its role to the Marsaglia–Tsang acceptance bound in a comment. | No expression, draw order, normal-cache use or algorithm change. |

The remaining kernels were retained: each is small and owns a coherent domain state. Per-participation lifecycle closures protect duplicate Agent references independently. Resource admission retains policy order and does not preempt holders. Store settlement visibly distinguishes occupied slots, blocked producers and waiting consumers. Signal evaluates predicates before publishing a new value or completion statuses. No additional generic abstraction, callback dispatcher, scheduler, History or budget API was justified.

The short UI declarations already project observations and call public actions through the shared authoring contract. No UI declaration, renderer, styling or control behavior was changed by this refactor. Browser acceptance still belongs to the full integration gate, including flows affected by these models.

## Executed verification

- Captured all ten default model observations at model times 0, 1, 4 and 10 before editing; reran the same model-order and advancement sequence afterward and compared the complete records with `assert.deepEqual`. All forty observations matched, including identities, ledgers, clocks, trace data and measurements. The temporary baseline was `/tmp/des-refactor-before.json`; it is diagnostic data, not a committed acceptance fixture.
- Imported and executed all ten `examples/des-models/[0-9]*.ts` scripts with assertions enabled: all passed.
- `bun test tests/des-adversarial.test.ts tests/random-normal.test.ts tests/random-exponential-poisson.test.ts`: 49 passed, 0 failed, 417 assertions. The coordinated World attachment was merged while this work ran and passed in this executed test run.
- `bun run typecheck`: passed, including Svelte checks with 0 errors and 0 warnings.

No frozen example, expected result or test assertion was changed by this agent. No new tests were added merely to mirror the refactor. These checks establish behavior preservation at the stated fixtures and tested boundaries; they do not replace scientific validation, browser screenshots or a subsequent independent code-review approval of the edited code.

## Status

The scoped clarity refactor is complete. No blocking source finding remains within this review's inspected scope. This record is refactor evidence, not final independent implementation acceptance; the integration coordinator must retain the separate substantial design/code review and browser gates.
