# Water outlet labels: final targeted correction

Coordinator response to N-WAT3 in the [targeted independent review](revision-2-targeted-final-opus-review.md). Author evidence, not independent approval.

The untreated outlet now has its own right-hand upward lane and its label above the endpoint. The treated outlet remains below the plant with its own label. This separates the two quantities without changing any water measurement, action, history or model rule. Earlier screenshots and reports remain unchanged.

The coordinator used a fresh T3 preview tab and real clicks on Setup and 10 steps, typed the savings trigger and cut share, and confirmed with Tab. Both scenarios finish at day 80: defaults (rule off) and trigger 0.6 / cut 0.15 (reservoir 120 m³, sewage 136, treated 120, untreated 16). Eight unedited captures cover 390×844 and 1366×768, light and dark, listed in the [manifest](revision-2-water-outlet-manifest.json). No horizontal document overflow was measured. The tab was closed. The narrow intervention image was directly inspected as pixels: the orange line stays to the right of Sewage and terminates below Untreated; the green line ends above Treated, crossing neither label.

`bun run typecheck` passed with zero errors and warnings (`/tmp/city-water-final-label-typecheck.log`). `bun run build:ui` passed with the existing chunk-size warning (`/tmp/city-water-final-label-build-ui.log`). `git diff --check` passed. The preceding full check already passed (848 tests, 352 public scripts, migration, library build and packed consumer); this subsequent edit changes only three presentation segments and one label coordinate.

The independent reviewer has approved the other fourteen models and the Water mechanism. Final Water visual acceptance remains open pending inspection of these eight new images. Existing low-severity renderer, locale and annotation limits from the previous report remain explicit.
