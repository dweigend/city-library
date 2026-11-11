# Final targeted corrections after the independent visual review

Coordinator implementation, 2026-11-10. These are author responses, not independent approval. The [independent review](revision-2-final-opus-visual-review.md) remains unchanged. The subsequent [Water recheck](revision-2-water-independent-recheck.md) already approves L-WAT1, which the visual reviewer correctly left outside its scope.

## Corrections and acceptance scenarios

| Finding | Change | Browser scenario |
| --- | --- | --- |
| X-SEL | Spatial selection adds an offset dashed neutral frame instead of painting amber over the semantic outline. The public UI reference records this presentation rule; no authoring API, identity, picking or domain rule changed. | Finance year 20: Home selects a poor asset without removing its red outline. The scene has exactly 47,216 red pixels both before and after selection at the tested desktop size. Housing month 20 still says 0 building and has no false amber construction outline. Economy month 20 keeps its employer color without a false vacancy outline. |
| N-MOB2 | Route summaries have three separate rows below all routes, vehicles and queues. The scene is taller; symbols and the 12-marker queue cap are unchanged. | Default minute 20; walking time 30 min at minute 12 produces 18 queued cars, including the first link's 15 shown as 12 squares and +3. Every summary is below the roads at 390 px. |
| N-ENE3 / M-ENE2 | Move the battery name beside the charging line, move its flow number to the other height and widen the boxes. The last-hour quantities and stored stock remain separate. | Hour ending 34: 11.5 = demand 6 + battery in 4 + curtailed 1.5. Hour ending 43: demand 12 = renewables 2 + battery out 4 + import 5 + unmet 1. Charging and discharge now both have narrow captures. |
| L-MAT1 | Collected amount stays inside its box; capacity has its own line underneath. | Day 15, collection capacity 120 and 160. No 120/120 or 160/160 string crosses the box. |
| R1 | Move Sewage above the plant and Untreated to the downward outflow end. | Water day 80, rule off and trigger 0.6 / cut 0.15. Sewage 136 no longer sits on the untreated line. |
| N-DAY3 | Rename the presentation to "cannot fit today", including monitor, scene, bar and inspector. The domain's advance planning and public observation names are preserved. | Early close 17:00, day 1 at 02:30 and 20:00: six errands cannot fit today. The label no longer claims that an event has already happened at 02:30. |
| N-DAY4 / N-MAT2 | Titles explain coincident series in the activity and material charts. | Counts are unchanged. These views retain the existing line renderer. |
| N-FIN3 | Asset condition labels use three decimal places. | Values such as 0.398 are no longer displayed as 0.40 beside the below-0.4 outline. |
| L-LBL1 | Explicit setup labels for Mobility, Daily Activities, Population and Habitat, including people/count/share/per-year units. | Setup and first step for Population/Habitat; existing scenario captures cover the other two. |

## Executed browser checks

The coordinator used its own T3 preview tab with real clicks on Setup, 1 step and 10 steps, real parameter typing followed by Tab, canvas selection and the Home key. No button-click loops ran inside the page. The tab was closed afterward. Appearance was set with the preview tool; viewport resizing changes CSS size, not the user agent.

The [manifest](revision-2-final-rest-fixes-manifest.json) lists 60 unedited viewport PNGs under `../screenshots/city-models/revision-2-final-rest-fixes/`: fifteen states, each at 390×844 and 1366×768, light and dark. Original browser-artifact filenames are retained as local captures (not tracked). Prior 276 and 147 image sets are unchanged. The manifest also records the independent-before/after red-pixel count from the actual Finance canvas. The coordinator directly inspected the key narrow charging/discharging, traffic overflow, selected Finance/Housing/Economy, materials and Water states as pixels. Independent inspection of the complete new set remains required.

The current Vercel guidelines were fetched to `/tmp/city-current-vercel-guidelines.md`; checks focused on readable state, keyboard selection, theme parity, units and contained narrow layouts. This is not a complete accessibility audit.

## Shell checks

- `bun run typecheck`: zero errors and warnings after the TypeScript edits (`/tmp/city-final-small-fixes-typecheck.log`).
- `bun run build:ui`: exit 0, existing chunk-size warning (`/tmp/city-final-rest-fixes-build-ui.log`).
- `bun run check`: exit 0, 848 tests, 797384 expectations, 352 public scripts, migration, library build and packed consumer passed (`/tmp/city-final-rest-fixes-check.log`). The targeted independent reviewer also read the completed log.
- `git diff --check`: passed after these changes.

## Remaining low-severity limits

The existing chart renderer still places zero series on the axis and offsets individual grouped bars. Coincident activity/material series are now explained in titles. Population sidebar spacing, locale-dependent decimal entry, some raw inspector keys and small Habitat/Stormwater annotations remain low-severity limits from the independent report. No new model mechanism, calibrated prediction or full accessibility claim is introduced. Spatial selection is fixed centrally; selection in other view types is outside this correction's scope.

The acceptance status stays open pending a fresh independent recheck of these changes and images.
