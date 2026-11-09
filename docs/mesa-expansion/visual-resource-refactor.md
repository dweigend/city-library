# Independent resource visual refactor

This source-level pass reviewed the four visual corrections for Household Energy Demand, Solar Battery Microgrid, Stormwater Retention and Urban Tree Watering. It applied the two local refactor skills and their full shared workflow/decision references, the project coding standards, the frontend design principles and the existing public UI contract. Existing Fire, Traffic 2 Lanes and Preferential Attachment patterns were reference material; no reference file, shared host, component, CSS or library API changed.

## Findings and responses

- **Corrected: tree moisture palette.** The first projection passed a changing numeric value through several NetLogo hue/brightness bands. Equal visual brightness did not mean equal moisture severity, mirroring the heatmap issue. The projection now continuously mixes the public red and green palette anchors on the fixed zero-to-capacity moisture domain. A regression checks equal moisture colors across different population sizes and immutable prior observations. Tree rules and observed quantities are unchanged.
- **Clarified: battery time meaning.** The model reports the solar/demand rates for the last completed hourly interval and derives grid import/export from consecutive cumulative measurements. Initial solar/demand values are input rates, with no completed exchange yet. A compact Flow interval monitor now distinguishes Initial rates from the completed hour range. The battery fill label explicitly says it is rounded to 0.25 kWh; the exact stored value remains available in its monitor.
- **Retained: household category colors.** Household colors encode base-only versus active appliance load, not a continuous spectrum. Symbol size encodes the actual per-household demand relative to fixed model base/peak values. The primary-view label now states that size represents load. Layout is a deterministic arrangement of identical aggregate households, never invented physical geography.
- **Retained: retention semantics.** Catchment cells use the existing Grid coordinates, with a display offset beside a capacity-normalized volume gauge. Readonly interval inflow, discharge and overflow derive from consecutive recorded cumulative quantities; no competing water balance or time owner was added. The visible capacity label explains the normalized schematic scale.
- **Simplified: detached History reads.** Battery and basin observation functions now capture one detached sample snapshot and reuse it for both interval differences and returned history. This avoids two complete History copies in one observation while preserving all values and callback behavior.

No scientific rule, seed, Random draw, World tick, action contract or previously accepted observation field changed. The only model edits in this pass reuse an existing detached sample snapshot. No new component abstraction, generated geometry owner, speculative helper layer or API variant was introduced.

## Executed checks

- `bun test tests/mesa-resource-visuals.test.ts tests/mesa-models.test.ts`: **24 passed**, 278 assertions, including six resource checks. These exercise completed-interval battery balance, basin conservation, detached catchment geometry, inert UI imports, fixed moisture colors and seeded continuation under extra reads.
- Independent baseline comparison against the coordinator's captured `4427227` observations: every original observation key matches exactly for all four models at boundaries 0, 1, 3, 10 and 30. New detached observational keys are additive. The capture uses the public model definitions and seed 17 where exposed.
- `bun run typecheck`: passed with Svelte 0 errors and 0 warnings after the source refactors and again after the final label clarifications.
- `git diff --check`: passed.

## Acceptance limits

This is independent source/refactor evidence, not a browser or screenshot approval. The coordinator must verify real desktop/narrow light/dark drawing, label clipping, mechanism legibility, actual canvas color rendering, live controls and error channels. Schematics remain explicit teaching views rather than physical site geometry. The four visual interfaces make synthetic rules visible; they do not establish empirical energy, hydraulic or irrigation validity.
