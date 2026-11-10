# Independent integration testing

This pass tested the merged Mesa and Salabim mechanisms through the public `city-library` root. It did not change runtime source, frozen examples, model scripts or dependencies. Browser behavior, visual acceptance, scientific validation and complete NetLogo compatibility are outside this testing pass.

## Public adversarial checks

`tests/mesa-integration.test.ts` adds eight behavioral tests, with 41 assertions:

- Independent outstanding Resource tickets veto activation death before World or Graph membership changes. Releasing one of two tickets is insufficient; cancelling the final ticket permits normal coordinated deletion.
- A mixed Agent/Grid/Graph/Agenda attachment batch with a late foreign Agenda rejects before attaching any local entry. Successful attachment retains canonical identities and immutable membership snapshots.
- Starting at fractional World tick 10.5, two successful study intervals yield tick 12.5, study completed boundary 2 and independently advanced Agenda time 100.
- A failed second two-phase commit retains both earlier and current partial effects while World adds no tick.
- Opposite extreme finite threshold endpoints interpolate without subtraction overflow. Inclusive endpoints retain the supplied duration, subnormal crossing times may round to zero, invalid zero-duration inputs still reject, and linear operation-order overflow rejects.
- An intervening event changes a rate, explicitly cancels a predicted threshold and recomputes its causal event time. No stale threshold dispatch occurs.
- A bounded zero-delay event chain uses the existing adapter-stopped result. Partial event effects do not add a completed interval or force a terminal measurement of aborted state.
- Explicit History recording rejects tied times even after eviction; measurement and recording neither consume Random nor advance World time.

Executed `bun test tests/mesa-integration.test.ts`: 8 passed, 0 failed, 41 assertions.

## Project checks

- First `bun run check`: failed after a successful complete typecheck (Svelte: 0 errors, 0 warnings). Unit suite: 674 passed, 1 failed, 183,624 assertions. `tests/a2a-boundaries.test.ts` still classified the newly supported valid gamma parameters `{distribution:"gamma", shape:1, rate:1}` as invalid. The failure was reported to the coordinator without editing the baseline test or weakening its no-draw assertion. Examples/build/consumer were not reached by this chained run.
- `bun run build`: passed, including declaration generation.
- First separate `bun run consumer`: Bun and Node ESM execution passed; ambient-free packed TypeScript failed with TS2367 because a prior guard narrowed `scheduled.energy` to literal 3 and TypeScript did not infer the later two-phase callback mutation before comparing it to 6. The coordinator owns the consumer script and received the finding.
- `CITY_LIBRARY_UI_RUNTIME=svelte bun run build:ui:svelte`: passed. Vite reported its chunk-size advisory for an approximately 652 kB parameter chunk; this is a warning, not a build failure.

The separate registered-examples run was stopped when the corrected full check began, avoiding duplicate execution of the same expensive Tijuana examples. It is not counted as a passing complete run.

The full check includes ambient-free TypeScript, Svelte diagnostics, unit tests, registered public examples, library build and the packed Bun/Node/TypeScript consumer. These shell checks complement the coordinator's separate real-browser and independent screenshot evidence.

## Corrected verification run

After the coordinator changed the obsolete invalid-domain fixture to gamma shape zero and used a fresh public numeric measurement for the packed-consumer mutation check, the corrected `bun run check` completed its unit stage: 675 tests passed, 0 failed, 183,624 assertions. Its examples subprocess loaded the new DES core/model registrations, as confirmed by the initial five DES pass messages. The chained run then completed all registered examples, library build and packed Bun/Node/ambient-free TypeScript consumer successfully (exit 0). This run began before the final accepted Salabim refactor and 49 additional tests were merged, so a final full check was started on the integrated commit.

The explicit Svelte production build was repeated after the signal-cycle correction and passed in 2.46 seconds, with the same chunk-size advisory.

The explicit Svelte production build on the final accepted cross-track integration was repeated and passed in 1.75 seconds, with only the same chunk-size advisory. The final full check terminal result is recorded below.

## Integrated commit verification

On `79c9ffca16e0e8c03eca19e73638129382e762da`, the repeated full check passed all 707 tests across 79 files, with 183,808 assertions (55.71 seconds). TypeScript and Svelte diagnostics passed with 0 errors and 0 warnings. The same chained run then completed all registered public examples, the library build and the packed Bun, Node ESM and ambient-free TypeScript consumer successfully (exit 0). This repeated run is justified by the accepted cross-track refactor, distribution cleanup and additional adversarial tests merged after the previous full run began.

## Final result and limits

The final independent `bun run check` completed successfully. Its unit stage passed 707 tests across 79 files with 183,808 assertions; every registered Mesa, DES and existing public example passed, followed by the library build and packed public consumers. No runtime source change was required by this independent pass.

The run started on `79c9ffca16e0e8c03eca19e73638129382e762da`. While it ran, the coordinator committed two presentation-only UI declaration changes in `2337d592e0233bcc724c56677c07cfac190c007f`: compact zoning labels/formatting and recycling labels/inspector binding. The coordinator separately reported a complete passing typecheck and explicit Svelte build after those UI fixes and owns their repeated browser/image review. This testing pass does not claim to have independently executed that affected UI verification or inspected screenshots.

The initial failed checks are retained above as findings and corrections, separate from the final passing result. A passing shell suite does not establish scientific equivalence, browser accessibility, mathematical exactness of IEEE-754 arithmetic, full NetLogo compatibility or snapshot continuation.
