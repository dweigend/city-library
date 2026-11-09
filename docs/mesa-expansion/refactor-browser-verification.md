# Browser verification after the model-script refactor

All ten current Mesa entries passed fresh browser flows after the refactor. The three finite entries now stop playback automatically and disable stepping at completion. The primary model views remain spatial grids, schematics or networks; this pass did not change model rules or shared UI code.

## Source and method

The initial tested model/UI source is commit `95a5dc8`; capture metadata records the later documentation-only HEAD `0e84c4a` and individual SHA-256 hashes for all twenty source files. Zoning was subsequently corrected and recaptured at `b35f9e4`, as described below. The [manifest](refactor-evidence/manifest.json) separates43 current states (`images`),4 final boundary probes (`supplementalImages`),5 superseded zoning states and3 historical finding images. Historical files are not current acceptance images. Every current image records its original browser path, dimensions and hashes.

The worker called `preview_status`, then opened its own new T3 Chrome preview tab `tab_2r_903760d6-5433-46c2-8790-7b134aa6c724` with `reuseExistingTab: false` on the existing Svelte server at port3191. The human-controlled tab2l and parent server were not automated, reloaded, closed or stopped. Only the worker's own tab was closed after verification. Fresh navigations loaded each revised entry because this server disables HMR.

The installed frontend-design, frontend-design-shadcn-svelte and standalone shadcn-svelte skills governed the existing layout. Current Web Interface Guidelines were fetched successfully from the upstream raw URL into `/tmp/mesa-refactor-browser-guidelines.md`. No new component, host, CSS or palette change was needed.

After navigation the harness waited for the actual model input to mount. It installed explicit `window.error` and `unhandledrejection` listeners and console warning/error wrappers before Setup. It then entered an invalid setup value, observed native input rejection, corrected it, edited a valid setup value, and initialized the actual public model. DOM inputs and buttons dispatched their normal events; no private model or session state was modified.

For each entry, 1 step changed the displayed counter from0 to1. Actual650ms Run changed it from1 to3. Pause stopped playback, and a further650ms observation retained every monitor value exactly. Live controls and actions were then exercised before capture. The [flow records](refactor-evidence/flows.json) retain the input descriptors, validation state, monitors, button availability and error channels.

Every main image uses CSS1366×768 desktop or390×844 narrow at DPR2, in light and dark. Theme/resize captures wait500ms and two animation frames. The preview backend exports desktop PNGs at1280×720 and narrow PNGs at780×1688; these are image dimensions, not a claim that the desktop CSS viewport was1280pixels. Every capture retained document width at or below its CSS viewport width.

An initial harness attempt captured the asynchronous entry's pre-Setup placeholder. Those twelve images were discarded and removed from the repository. Only the40 verified mechanism states and3 terminal states listed in the final manifest are acceptance evidence. No final image was overwritten after publication of its manifest to the independent inspector.

## Ten current flows and views

| Entry | Edited setup and actual action | Visible state captured | Desktop light |
| --- | --- | --- | --- |
| Neighborhood heat | Width8; live cooling1.3;10 more steps | Tick13, mean index22.75; cool shaded west with green hatching and warm east | [PNG](refactor-evidence/neighborhood-heat-intervention-verified-desktop-light.png) |
| Household energy |15 households; live shifted share1;10 more steps | Hour13,18kW demand,72kWh accumulated; orange appliance loads | [PNG](refactor-evidence/household-energy-demand-verified-desktop-light.png) |
| Residential occupancy |9 applicants; live slots4; another step | Day4,4 occupied and4 waiting; actual slots and queue | [PNG](refactor-evidence/residential-occupancy-verified-desktop-light.png) |
| Pedestrian crossing |12 pedestrians; another step | Minute4, cohort in the crosswalk; signal and unique road cells visible | [PNG](refactor-evidence/pedestrian-crossing-phases-verified-desktop-light.png) |
| Solar battery | Solar6kW;10 more steps | Hour13, battery fill, reserve and completed-interval flows | [PNG](refactor-evidence/solar-battery-microgrid-verified-desktop-light.png) |
| Stormwater | Capacity4m³; live rain50mm/h;10 more steps | Hour13, basin4m³ and cumulative overflow18.60m³ | [PNG](refactor-evidence/stormwater-retention-verified-desktop-light.png) |
| Tree watering |11 trees; daily water20L; another step | Day4,20L allocated; tree moisture and blue allocation markers | [PNG](refactor-evidence/urban-tree-watering-verified-desktop-light.png) |
| Recycling |13 households; live influence1; another step | Tick4,3 adopters; unchanged ring layout and actual adoption colors | [PNG](refactor-evidence/household-recycling-behavior-verified-desktop-light.png) |
| Zoning |8 parcels; another replication |4 completed runs; pending panels distinct from completed capacity | [PNG](refactor-evidence/zoning-b35f9e4-desktop-light.png) |
| Membership |8 residents; Reassign first resident; another step | Real Graph edges in three columns; manual action preserves tick and total membership count | [PNG](refactor-evidence/workplace-household-membership-verified-desktop-light.png) |

Each row has the corresponding desktop-dark, narrow-light and narrow-dark image in the manifest. There are40 main images, not40 separate model instances: each model's four views depict the same paused state through viewport/theme changes.

## Finite-model completion regression

These tests started Run and observed a visible Pause button while playback was active. They did not use100steps to manufacture completion. After2.4seconds, Run and all three step buttons were disabled; every monitor remained stable for another650ms. [Terminal records](refactor-evidence/terminal.json) include the initial active buttons, completed state, subsequent stable state and enabled input controls.

| Model | Actual setup | Automatic terminal state | Image |
| --- | --- | --- | --- |
| Occupancy |2 applicants,1 slot | Day6,0 occupied,0 waiting,1 available; slot input remains enabled | [PNG](refactor-evidence/residential-occupancy-terminal-desktop-light.png) |
| Crossing |12 pedestrians,1 green minute | Minute5,12 arrived,0 waiting/crossing | [PNG](refactor-evidence/pedestrian-crossing-phases-terminal-desktop-light.png) |
| Zoning |8 parcels |6 of6 runs completed | [PNG](refactor-evidence/zoning-b35f9e4-terminal-desktop-light.png) |

This confirms ASTRA-01's corrected host behavior. The models' existing terminal ticks and domain results were not changed.

## Additional actions, keyboard and errors

The [supplemental records](refactor-evidence/supplemental.json) confirm Resource capacity ownership in the real UI: shrinking3 occupied slots to2 reports `Capacity cannot shrink below granted units.` and retains all monitor values. Correcting capacity to4 grants another ticket. Move out first household immediately admits the next waiter, retaining occupied4 while waiting falls4→3, without advancing day0.

Tree watering was additionally changed to0L for one day and100L for the next. The first completed interval uses0L; the next uses81L because allocation stops at actual moisture deficits. The interface does not invent100L consumption merely because that is the budget.

The [keyboard record](refactor-evidence/keyboard.json) confirms a real catalog selection from zoning to membership, an updated experiment URL, focus returned to the selector, Tab to Setup with a computed3px focus ring, and Enter initialization. At390px the Parameters button exposes the actual resident setup input; the document remains within viewport width.

All40 main states,3 completed states and supplemental ordinary flows retained empty explicit error, unhandled-rejection and console warning/error channels, including viewport changes. These are observed flows, not a claim of universal ResizeObserver immunity. The known adversarial case where caller code invokes an update from its own ResizeObserver callback is outside these ordinary host flows and was not expanded or patched here.

## Zoning caption follow-up

Independent actual-image inspection found the pending Run6 caption clipped at narrow width. The coordinator moved captions from the first parcel to the panel's left edge in `7de59aa`. The requested1-parcel, base-cap10 browser probe then exposed a second presentation problem: the tall world produced a64.48×506.40CSS-pixel strip, causing major label overlap. `8060da2` added a minimum display panel width derived from panel height, retaining the original wider content layout.

The width correction made the narrow canvas366×366CSS pixels, but the first row was still clipped at its top. Actual Canvas metrics measured a32buffer-pixel font with25pixel glyph ascent. The old1.5world-unit inset placed its baseline at17.53buffer pixels. The coordinator increased the inset to2.5 in `b35f9e4`, placing the baseline at31.88, beyond the25pixel ascent. These are view geometry corrections; model state, measurement keys, run IDs, RNG and parcel/slot counts and identities are unchanged. Expanding a schematic panel can move its displayed cells; these are view coordinates, not original parcel geography.

At final source `b35f9e4`, a fresh navigation repeated zoning Setup,1step,650ms Run, Pause,650ms stability and a fourth completed run. All four desktop/narrow and light/dark images were captured again at unique `zoning-b35f9e4-*` paths. A fresh Setup and actual Run automatically completed all6 replications; every step/Run button disabled and monitors remained stable650ms later. The fifth replacement image records that terminal state.

Four additional narrow images show all six pending captions at1 parcel with base caps1 and10, in light and dark. Both boundary canvases are366×366CSS pixels with732×732buffers; captions are complete horizontally and vertically. The [follow-up record](refactor-evidence/zoning-followup.json) contains flows, error channels and actual font/canvas metrics. All nine final zoning captures retain empty window-error, rejection and console-warning/error arrays and no document overflow.

The five original zoning images remain explicitly superseded. Three historical reproductions retain the width/top-clip evidence; intermediate captures were removed. Final independent inspection receives the38 unchanged current states,5 new zoning states and4 supplemental boundary images. Earlier approvals do not cover the late layout delta by implication.

## Acceptance boundaries

The browser worker grants interaction evidence, not its own independent visual approval. A separate agent inspects the actual current images and records findings/decisions separately, including fresh inspection of all nine late zoning images. Earlier Gemini image statistics and earlier screenshot approvals do not substitute for that post-refactor inspection.

This pass checks ordinary keyboard focus, setup validation, theme/viewport rendering, pause stability and the model-specific actions above. It is not a full screenreader or WCAG certification, scientific validation, complete RNG-state serialization proof or exhaustive parameter-space audit. No source or dependency changes, commits, publication, user-tab intervention or server shutdown were performed by this worker.
