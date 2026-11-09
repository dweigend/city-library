# Independent image inspection after the model-script refactor

This review inspects the actual new screenshots after the ten Mesa model/UI pairs were refactored. Earlier screenshot approvals are context only. The reviewer did not edit source, tests, shared UI, browser tabs or servers, and ran no browser automation. The only authored repository file is this report.

## Evidence and method

The initial source scope is `95a5dc8f5e9769b72b7fedb3c79ba35217914236`; the checkout HEAD during initial inspection was `0e84c4a0e3f952b7b09ca3df75edc88ec10959ec`, whose later changes were documentation only. Forty ordinary views cover all ten models at CSS desktop1366×768 and narrow390×844 in light and dark. Three further desktop images show the completed housing, crossing and zoning models. Desktop image exports are1280×720 and narrow images780×1688 at recorded DPR2.

Every one of the43 original PNGs was opened individually using `view_image`. This was not a contact-sheet or statistics-only inspection. All43 PNG SHA-256 values matched the final manifest and their unique browser-original paths. All twenty model/UI source hashes matched both95a5dc8 and the then-current checkout. The manifest is `refactor-evidence/manifest.json`.

The frontend-design and web-design-guidelines skills governed this pass. Latest Web Interface Guidelines were fetched successfully on2026-11-09 into `/tmp/mesa-refactor-image-guidelines.md`. Applicable image-visible criteria included purposeful color, readable labels and units, focus visibility, narrow layout, theme state, content clipping and understandable primary mechanisms. Actual keyboard interactions, invalid input handling, playback, error/rejection instrumentation and viewport transitions belong to the separate browser report; screenshots alone do not prove them.

Some full-image tool displays initially appeared to omit dark canvas glyphs. Direct PNG decoding showed the actual marker colors, and additional native-resolution crops from the unchanged files made every glyph visible through `view_image`. Fourteen dark spatial/gauge crops were inspected, plus a uniquely copied heat original. For example, the energy narrow dark file has SHA-256 `d7f8bdf5cd92ca8bd02c5296d0f8884e68ece3dec841dcca5cc245d6a8ffe0c0`; its unchanged canvas crop shows all15 orange household loads and white house outlines. This was a viewer presentation ambiguity, not an observed product-source defect. No CSS/runtime change was requested for it.

## Findings and response

**IMAGE-01 — Low — pending run caption clips at narrow width.** In `experiments/zoning-scenario-comparison/ui.ts:54` at the inspected source, the right `Run 6 · cap 4 · pending` caption reaches the canvas edge; its last character is clipped in both narrow themes. Evidence: the original verified narrow light/dark zoning PNGs at completedRuns4, including the native-resolution dark canvas crop. Slot blocks, run IDs, caps and aggregate mechanism remain understandable, but the complete pending label should fit.

The coordinator accepted a script-only correction: anchor captions at the panel left edge rather than at the first parcel's inset. It preserves label strings, IDs, cells, slot counts and domain state; the caption x coordinate shifts one view unit left. No shared renderer/CSS change is needed. At this stage, replacement zoning screenshots and independent reinspection were pending; approval was withheld for the unobserved correction.

## Mechanism inspection

| Model | Actual image evidence and assessment |
| --- | --- |
| Neighborhood heat | Real8×8 grid at tick13 shows a cooler purple western half and warmer red eastern half. Green diagonal shade hatches are distinguishable in both themes. The fixed blue0→red30 caption describes index units; the supporting plot shows declining mean heat. No Celsius or forecast claim appears. |
| Household energy | Fifteen white house outlines contain orange load disks at hour13 with shifted share1. The caption distinguishes identical aggregate loads, size and blue-base/orange-appliance state. Layout is schematic and stable, not geographic household positions. Both narrow themes retain the full outline/load pattern. |
| Residential occupancy | Four green dwelling slots with blue residents, four orange waiting markers and one gray released marker agree with occupied4/waiting4 at day4. The terminal view shows the empty slot and two released residents with disabled Run/step controls. Queue labels do not overlap. |
| Pedestrian crossing | Twelve blue markers occupy the striped crosswalk at minute4 under a green signal. The terminal image shows twelve green arrived markers right of the road and a red signal at minute5, with disabled Run/step controls. The schematic caption states discrete cohort stages rather than continuous walking physics. |
| Solar battery | A40-block gauge shows2kWh at the reserve line; solar0kW, load2kW, import2.0kWh and export0.0kWh are legible. The caption states0.25kWh rounding. Narrow reserve, solar/load and grid labels fit without hiding the gauge. |
| Stormwater retention | The real3×3 catchment and aggregate basin gauge remain distinct. A full4m³ basin, blue inflow, red spill and drain line are visible with meaningful m³ labels. Narrow layout retains full capacity, inflow, spill and drain labels. |
| Urban trees | Eleven tree glyphs show different moisture through canopy size and fixed red-to-green color; blue downward markers identify actual daily allocations. Trunks remain visible on dark canvas. The caption and L/day monitors keep the allocation mechanism readable. |
| Household recycling | The13-node ring displays three adjacent green adopters and orange remaining households with real ring edges and compactH1–H13 labels. Both themes and narrow layouts preserve node separation and the topology. |
| Zoning scenarios | Six panels distinguish blue cap2 and green cap4 outcomes; the first four completed outcomes and two pending runs are apparent. Terminal six-run image shows all completed slot counts and disabled controls. IMAGE-01 affects the pending caption edge only and requires the stated recheck. |
| Membership | Eight residents form a three-column home→resident→work graph. Blue home and magenta work edges remain distinct, HomeA/B and WorkA/B labels fit, andR1–R8 labels are readable at narrow width. Layout communicates relationships rather than commuting geography. |

## Initial verdict and limits

All non-zoning images pass this visual mechanism inspection. No additional blocking visual issue was found. At that initial stage, zoning approval awaited replacement images for IMAGE-01; the completed follow-up below supersedes that pending status.

This is an actual-image and visual-semantics check, not a formal WCAG/screenreader audit, scientific calibration, universal browser-error guarantee or independent replay of the model rules. Some supporting charts continue below the captured viewport; the primary mechanism views are visible. Browser behavior and source/trajectory checks retain their separate evidence and authorship.

## Caption correction reinspection and boundary finding

At `7de59aa5b7caea0eb1e0370c5977da5b4c374a8b`, the four new `zoning-caption-fixed-{desktop,narrow}-{light,dark}.png` files were individually opened through `view_image`. With8parcels, the pending fifth/sixth captions now fit completely, including the rightmost final character. IMAGE-01 is resolved for these observed states. This late UI-only source delta is outside the95a5dc8 source review; it has its own rendered evidence.

**IMAGE-02 — Medium — valid minimum-parcel/high-cap layout collapses caption space.** The two new `zoning-caption-min-parcels-max-cap-{light,dark}.png` files were individually inspected. At parcels1/baseCap10, the view width derives from only one parcel while its height derives from cap12 and three rows. The resulting6.5:51 view becomes extremely narrow and the two run captions overlap and clip, despite valid model inputs. This is a pre-existing projection-sizing problem exposed by the additional boundary probe, not changed model behavior. The coordinator was informed; a minimum presentation panel width is a possible local correction. No shared UI or model rule edit was requested. Boundary approval remains open until corrected current images are inspected.

The coordinator implemented IMAGE-02's local correction as `8060da2`: each panel receives a minimum width of `panelHeight * PANEL_ROWS / PANEL_COLUMNS`, making the full view at least as wide as it is tall. This reserves two readable caption columns under the existing narrow canvas sizing. Domain observations, cap heights, slot counts and identities remain unchanged; panel spacing and caption coordinates are explicit presentation deltas. Current rendered inspection is still required before approval.


## Final reinspection and approval

The final inspected source is `b35f9e43dcf94ab2a59782e3dc54b16e9c4fb0ee`. The final UI correction also gives captions an inset of2.5view units, placing the first text row fully inside the canvas even at the minimum-parcel/high-cap boundary. This later script-only presentation delta is explicitly separate from the95a5dc8 source/behavior approval and the original Astra/Gemini baseline feedback.

All nine new original PNGs were opened individually through `view_image`:

- `zoning-b35f9e4-{desktop,narrow}-{light,dark}.png` (four current main views).
- `zoning-b35f9e4-terminal-desktop-light.png` (completed six-run view).
- `zoning-b35f9e4-parcels1-cap{1,10}-{light,dark}.png` (four valid-input boundary views).

Four additional unchanged-pixel dark canvas crops confirmed all glyphs and complete text where the full-image tool display was ambiguous. The current8parcel views keep both pending labels fully inside the canvas. At parcels1/baseCap1 and parcels1/baseCap10, all six run captions fit their two columns without overlapping or clipping their top row. At the high-cap boundary, the captions are close but individually readable and fully visible. Slot bases and panel relationships remain apparent. The terminal view preserves six completed outcomes with disabled Run/step controls.

The final manifest contains43 current main/terminal images plus4 supplemental boundary images: **47 current PNGs inspected**. Thirty-eight unchanged current images retain their original actual-image inspection; the five current zoning main/terminal replacements and four boundary additions have the fresh inspection above. Historical superseded images and failed boundary evidence are distinguished in the manifest and are not counted as current acceptance images. The independent final integrity command verified every current PNG SHA-256 against the manifest and unique browser original, and every recorded model/UI source hash against the current checkout: **47 images, 0 integrity/source mismatches**.

| Finding | Final response | Independent result |
| --- | --- | --- |
| IMAGE-01, low | Caption starts at the panel edge; full pending string retained | Resolved in desktop/narrow light/dark current images |
| IMAGE-02, medium | Panel minimum width bounds full-view aspect; caption inset keeps first line inside canvas | Resolved at parcels1/baseCap1 and10 in both themes, plus ordinary and terminal rechecks |
| Apparent missing dark glyphs in tool display | Reopened originals and inspected unchanged native-resolution pixel crops | Withdrawn as a product finding; no CSS/runtime fix needed |

**Final verdict: APPROVED for the actual visual mechanism/legibility scope of all ten models and the47 current recorded states. No unresolved visual finding remains in this inspection.** Browser behavior, model trajectories, keyboard semantics and error-channel claims retain their separate reports and authorship. This approval does not claim complete WCAG compliance, scientific validation or universal rendering/error immunity.
