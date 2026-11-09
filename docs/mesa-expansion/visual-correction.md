# Visual mechanism correction

The ten original Mesa examples must show their mechanism directly. A field table and a mean chart did not meet that requirement for a spatial heat model. Earlier shell and image approvals remain historical evidence of the previous implementation; they do not establish acceptance of this corrected visual requirement.

Use the existing public UI patterns rather than a new presentation system. Fire projects detached field coordinates and state into a primary grid. Traffic 2 Lanes projects actual car positions into a spatial view and keeps time series secondary. Preferential Attachment projects canonical nodes/edges with meaningful node encoding, then shows distributions and inspection. Those reference files remain unchanged; their older literal colors are not copied as new theme rules.

## Mechanism views

| Entry | Primary visual and factual source |
| --- | --- |
| Neighborhood heat | Actual Grid coordinates, fixed 0–30 abstract heat-index color scale and separate shade hatching. |
| Household energy | Deterministic household schematic; current per-household load controls symbol encoding. |
| Residential occupancy | Resource-owned grant/wait/release outcomes projected as dwelling slots and household queues. |
| Pedestrian crossing | Explicit schematic road/crosswalk/signal and positions derived from actual cohort stages. |
| Solar battery | Stored-energy blocks and reserve boundary, with model-owned current interval-flow observations. |
| Stormwater retention | Actual catchment Grid beside a schematic basin level, drainage and overflow. |
| Tree watering | Deterministic planting schematic with actual moisture and water-allocation observations. |
| Recycling | Actual ring membership/edges with stable view-only positions and visible adoption state. |
| Zoning | Actual planned scenarios and completed outcomes shown as capacity blocks and supporting comparisons. |
| Household/workplace membership | Actual bipartite membership edges with deterministic household/resident/workplace columns. |

Nonspatial layouts are explicitly schematics. View positions are not new canonical domain geometry, random draws or model state. Extra model observations contain detached ordinary values and actual coordinates where available; model files import no UI types. Existing rules, seeds, RNG continuation, World ticks and headless assertions remain binding.

## First working heat slice

The primary spatial view uses actual Field x/y and Grid extents. Green hatching represents the existing shaded property independently of heat. The numerical color domain stays 0–30 across setup widths and time; the same heat index always has the same color. Blue/red anchors come from the public palette and mix continuously, avoiding the misleading brightness resets of traversing NetLogo color bands. Units are abstract index units, never Celsius.

The coordinator rendered the actual Svelte host in a separate owned browser tab. At tick 10, shaded/unshaded pixel samples were RGBA `[188,57,62,255]` and `[215,50,41,255]`. After changing live shade cooling to 2 and advancing to tick 30, the samples were `[52,93,169,255]` and `[201,54,52,255]`, with mean index 11.57 and no captured window errors. This checks actual canvas drawing rather than parser support alone. Full final desktop/narrow light/dark image review remains separate.

## Behavior preservation

Original models were loaded from Git baseline `4427227` in isolated Bun processes. The coordinator captured ordinary observations at steps 0,1,3,10,30, using seed17 where supported, and compared every original key recursively against the corrected models. All ten original trajectories matched exactly; additive observation keys were allowed. Scoped implementation workers also compared longer trajectories. Independent refactoring and new tests check detached projections, real geometry, fixed scale and model purity rather than granting acceptance from source alone.

## Remaining acceptance

All ten corrected entries require real setup/step/timed Run/Pause/live-action/model-switch checks with explicit window error/rejection capture, desktop at least1366×768 and narrow390×844 screenshots in light/dark, and independent actual-image review of whether the mechanism is understandable. Full typecheck, focused behavior/public examples and the explicit Svelte build accompany this change. A fresh Antigravity Gemini3.8Flash high review must assess the corrected visual transfer. Prior approvals are not reused for the new view semantics.

## Completed implementation and browser gates

All ten views are implemented and independently refactored. The final corrected source is `55749cc`; the portable report and image evidence are committed at `2a5edf5`. On the corrected source, the coordinator executed full `bun run typecheck` (Svelte 0 errors / 0 warnings), 43 focused tests with 403 assertions, all 14 frozen Mesa scripts and the explicit Svelte production build (1.23 seconds), all passed. The separate independent behavior pass reconfirmed the same scope and exact original observations through step130.

The real Svelte browser pass completed all ten setup/input/step/timed Run/Pause/live-action/model-switch flows with explicit window error, rejection and console capture. The independent image reviewer opened all42retained PNGs and approved their visible mechanisms after corrected queue labels and zoning/retention caption bands were recaptured. [The report](visual-report.md) contains exact script excerpts and ten screenshots; [image evidence](visual-evidence/manifest.json) preserves all states and hashes. A fresh final Gemini3.8Flash review with `thinking_level=high` remains a separate gate until its verdict is received.
