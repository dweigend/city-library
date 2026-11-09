# Independent model-script refactor

Ten original Mesa teaching examples were inspected in three batches. The independent refactor preserved public model actions, observation shapes, formulas, random draws and update order. It did not inspect browser screenshots or grant UI acceptance.

The work followed the model-script refactoring skill, its shared workflow and decision references, the coding standards and the public model/UI contracts. Scope covered the nine initial model/UI pairs, followed by residential occupancy after Resource integration.

## Focused batch

The first batch covered household energy demand, pedestrian crossing phases and zoning scenario comparison.

- Zoning retained one list of completed public study outcomes. Public run rows and replication summaries now derive from that list when observed, removing two mutable parallel projections. Summary semantics remain terminal outcomes across independent replications, not pooled time samples.
- Pedestrian stage computation now uses explicit guards instead of a nested conditional expression. Compute-before-commit order and stage transitions are unchanged.
- Household energy and all three flat UI declarations were retained. Their current code already exposes the mechanism directly; another wrapper or extraction would add indirection.

A signal-model limitation remains separate from this refactor: the cohort terminates after its first crossing, so it does not demonstrate repeated signal cycles. The existing six-minute phase rule clips a requested four-minute green window starting at minute three. Changing that policy or extending the model's lifetime would be a behavior decision; this refactor did neither.

## Combined batch

The second batch covered neighborhood heat, solar battery storage, stormwater retention, tree watering, recycling behavior and workplace/household membership.

- Recycling measures adopter count once and derives its share from the same count.
- Heat exchange, tree moisture capacity/daily loss, and stormwater unit conversion/drainage capacity have explicit domain names. Arithmetic order, coefficients and units remain unchanged.
- Membership observation uses the existing readonly Graph neighbor snapshot rather than copying and freezing another temporary array. Returned public observations remain detached records.
- Battery description says linear crossings without an unqualified claim of exact numerical arithmetic. Its model still assumes a constant net rate within each hourly interval and lossless storage.
- Flat UI declarations were retained. They consume public actions and detached observations; none requires custom lifecycle, styling or domain logic.

No new shared mechanism, wrapper, registry, dependency or competing state owner was introduced.

## Resource integration pass

Residential occupancy was inspected after the real Resource implementation was integrated. Resource remains the sole owner of waiting/granted allocations; Graph edges describe eligibility, never a second occupancy counter. Capacity changes validate the proposed settings before applying them and publish settings only after Resource accepts the change.

The turnover interval now has a named day value. Its comment and description accurately say that one household moves out periodically; the model does not simulate an individual three-day lease for each holder. This corrects an explanation without changing scheduling or allocations. Its observation directly maps the existing readonly Graph neighbor snapshot. The flat UI and public actions were retained.

A separate before/after capture exercised three applicant/capacity configurations, ordinary steps, explicit move-out, capacity growth and terminal execution. Captures were byte-identical. The nine-model trajectory comparison and all mechanism tests still passed after this pass.

## Executed checks

- `bun test tests/mesa-models.test.ts`: 18 tests passed, 116 assertions, zero failures after each initial batch.
- `bun test tests/mesa-models.test.ts tests/mesa-occupancy.test.ts`: 20 tests passed, 142 assertions, zero failures after the Resource integration pass.
- A headless baseline captured all nine public observations at boundaries 0, 1, 2, 5, 20 and 130. Seeded models used seed 17; terminal models retained their normal stopping boundary. Baseline and both refactored captures were byte-identical. The final comparison covered 143,767 bytes, including retained histories, canonical public IDs, outcomes and group projections.
- The comparison script and captures were temporary local verification artifacts under `/tmp`; they are not published fixtures. Model-private Random continuations are not public observations. Source inspection confirmed unchanged draw calls and order; the trajectory comparison does not claim direct inspection of private RNG state.
- `bunx tsc -p tsconfig.ui.json --noEmit` was executed during parallel integration and failed on missing DES/Agenda/Resource exports and the pending Agenda module, outside these nine entries. No diagnostic named an owned Mesa model/UI entry.
- An intermediate `bun run typecheck` failed on `tests/a2a-types.ts:20`, an unused `@ts-expect-error` directive. The coordinator corrected that independent integration issue. The subsequent complete `bun run typecheck` passed, including Svelte with zero errors and zero warnings.

The coordinator must perform real-browser checks plus independent screenshot inspection and run remaining full integration checks. These headless results do not establish rendering, accessibility, scientific validity or completion of the overall expansion.
