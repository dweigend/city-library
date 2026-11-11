# Revision 2: visual fixes after the independent Opus visual review

Author: Claude Opus 5.5 (implementing agent), 2026-11-10. These are author responses and author checks, **not independent approval**. The [independent visual review](revision-2-opus-visual-review.md), the [Gemini mechanism review](revision-2-gemini-mechanism-review.md) and earlier reports stay unchanged as historical records. The visual status remains open until a new independent review of the pictures listed below; see the [central status](../../../../docs/development/city-simulation-models.md#current-revision-status).

## Scope and rules followed

- Changes are limited to the fifteen `models/city-*/ui.ts` declarations, their README "What you see" explanations, one water status measure (below) and this evidence. No shared renderer, host, palette or authoring API changed; no DOM, CSS, lifecycle or local theme color was added to a model script. All colors come from `indexedColor` or `scientificPalette`.
- Headless mechanisms and frozen revision-2 contracts are unchanged, except the water saving-day measure, which was decided and asserted before the runtime edit.
- Plot and encoding corrections use only existing view types (`spatial`, `line`, `bar`, `table`, `inspector`). Where a line chart hid an equal series, the series was either drawn underneath with an explicit label or the interval quantity was moved to a bar chart that starts at zero. The renderer has no dash option, and none was invented.
- Local skills applied: frontend-design, frontend-design-shadcn-svelte, shadcn-svelte and web-design-guidelines. The current Vercel Web Interface Guidelines were fetched on 2026-11-10 from `raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`. Applied items: number formatting with `Intl.NumberFormat` for large kilogram values, units in labels, overflow-free narrow layouts, a table that fits 390 px without horizontal scrolling, state encoded by shape/outline/label in addition to color, and a plain-text `description` per scene. This is an author check, not an accessibility audit.

## Contract decision: water saving days (L-WAT1)

The default rule (trigger 1, cut share 0) reported "Below savings trigger: Yes" and 80 "Saving days" although no demand was cut. This was a wrong status measure, not a display problem. Decision: a saving day is a day on which the rule requests a positive cut (`conservationShare > 0` and storage below the trigger). Requests, volumes and all earlier assertions are unchanged. The new baseline assertions (0 saving days, `isSavingTomorrow` false, shortage still 1200 m³) were added to `tests/public-contracts/city-water/03-policy.ts` first and failed against the old runtime (`conservationDayCount` 120). After the one-line change in `isSaving()`, all water scripts and tests pass. Hashes and the record are in `models/city-water/evidence/checks.md`; the contract text is updated. **This postdates the approved Gemini mechanism review and needs its own targeted independent recheck.**

## Findings, responses and evidence

Screenshot names below are relative to [`../screenshots/city-models/revision-2-visual-fixes/`](../screenshots/city-models/revision-2-visual-fixes/). `-element-N` is figure N alone; the plain name is the viewport.

| Finding | Author response | Executed check | Screenshots |
| --- | --- | --- | --- |
| **M-FIN1** Finance: red outline hides this year's repair | Fixed. Separate channels: the outline carries only the state (red below 0.4, otherwise neutral); a filled amber bar above the asset with a "+CU" label carries this year's repair spending. Both can appear on the same asset. Rows were spaced so labels stay apart on 390 px. No sequencing or finance rule changed. | Worst-first default, year 20: asset 3 shows red outline **and** amber bar "+500" (cash 2100, backlog 20100). Preventive, year 20: "+450" and "+50" on two assets. Scene `description` lists the repaired assets. | `city-finance-default-{desktop-light,narrow-dark}[-element-0]`, `city-finance-intervention-{desktop-dark,narrow-light}[-element-0]` |
| **M-MOB1** Mobility: queue leaves the scene; cars invisible | Fixed. Queued cars fill a fixed 4 × 3 block beside each link entrance, inside the scene, with a "+n" count for the rest; the scene was widened from 6.4 to 7.2 units. Moving cars and walkers are pale (central neutral) symbols with a black outline, larger cars (14 px) than walkers (9 px), so both stand out on every route color. Stop names moved above the stops; long route summaries wrap onto a second line. The histogram returns no series until the first trip arrives, and its title says so. | Capacity 10, minute 20: 12 queued fill the block. New overflow state (walking path 30 min, a valid maximum, minute 12): 15 queued on the first main link shown as 12 squares and "+3". 1000 initial trips (valid maximum), minute 30: 4 % car share, histogram of the completed trips (almost all walking). FIFO and resources untouched. | `city-mobility-*`, `city-mobility-queue-overflow-{desktop-dark,narrow-light}-element-0`, `city-mobility-1000-trips-{narrow-dark,desktop-light}-element-*` |
| **M-ENE1** Energy: scene does not balance | Fixed. Stock and interval are separated: the battery box shows the hour's flow ("out 4.0" / "in 4.0"); the bar under it and "stored x/8.0" show the stock at hour end. Every flow line carries its kWh. A new table "Electricity balance of the last completed hour" lists inputs (solar and wind, battery out, import, unmet shortfall), outputs (demand, battery in, curtailed) and their difference, read from the model's existing `flow` fields. New supporting views: "Battery charge (+) and discharge (−) in each completed hour" (bars from the existing history) and "Battery stored energy · stock at the end of each hour"; "Battery out" was added to the hourly line chart. No dispatch rule changed. | Default, day 2 18:00–19:00: demand 12.0 = solar and wind 2.0 + battery out 4.0 + import 5.0 + unmet 1.0; table check 0.0. Charging hour 09:00–10:00: solar and wind 11.5 = demand 6.0 + battery in 4.0 + curtailed 1.5; stored 6.3/8.0. | `city-energy-default-desktop-light-element-0…5`, `city-energy-charging-desktop-light-element-{0,1}` |
| **M-ENE2** Energy narrow: labels overflow boxes | Fixed. Names sit above each box, amounts inside; heat has three boxes (heat network, heat need, short) so amounts fit; flow numbers sit above sloped lines and beside vertical ones. | Narrow light/dark images: no label crosses a box edge; heat 4.0 = 3.0 + short 1.0. | `city-energy-{default-narrow-dark,intervention-narrow-light}[-element-0]` |
| **M-DAY1** Daily Activities: result not shown | Fixed. All three runs are compared at **day 1 · 20:00**, after every errand of the day is settled (live changes made at tick 0 apply to day 1). The scene's bottom line reads "Errands today: x done · y missed"; adults whose errand no longer fits carry a red ring; a new bar chart shows done, still planned and missed (done and missed from the model's `today` counters, the rest = adults − done − missed). The existing early-closing scenario (services close 17:00) is captured with 6 missed. | Default: 6 done, 0 missed, 12 person-hours of travel. Remote work + local shops: 6 done, 0 missed, 7 person-hours. Close 17:00: 0 done, 6 missed. | `city-daily-activities-{default,intervention}-*`, `city-daily-activities-early-close-{desktop-light,narrow-dark}-*` |
| **M-DAY2** Daily Activities narrow: overlaps | Fixed. Homes, work and school are labeled above their box, service places below; the clock moved to the top-left corner; the scene grew to 5.4 units high. Travelers on the home row no longer cross labels. | 07:45 commute (12 travelers) and 20:00 images at 390 px. Model coordinates and travel times unchanged. | `city-daily-activities-commute-narrow-light-element-0`, narrow images above |
| Daily Activities inspector (coordinator item) | Fixed. The inspector's errand line is read from the resident's fixed plan and the clock: "Planned hh:mm–hh:mm", "At services until …", "Done hh:mm–hh:mm" or "Missed: services close at hh:mm". No new rule. | Default 20:00: "Done 16:15–17:15". Close 17:00: "Missed: services close at 17:00". | `city-daily-activities-default-desktop-light-element-4`, `city-daily-activities-early-close-desktop-light-element-4` |
| **M-EVD1** Default and intervention at different times | Fixed for all fifteen models: every default/intervention pair is captured at the same model time. Heat adds a night pair at 04:00; Stormwater adds infiltration (12 mm/h) and retention (basin 120 m³) counterfactuals at hour 10; Land Use and Habitat isolate one factor per intervention, with labelled combinations as optional extras. | See the same-time table below and the manifest `clock` field. | all |
| **M-ECO1** Economy: desired jobs hide employment | Fixed with the existing API: desired jobs are drawn first and employment on top, and the title states that a single blue line means both are equal. A separate bar chart "Hiring gap · open vacancies (desired − employed)" shows the gap from the model's existing `vacancyCount` history. The orders chart title explains coinciding orders and sales. No dash style was invented. | Slow hiring, month 8: gap bars 3 (month 7) and 1 (month 8), orange visible above blue. Fast hiring: gap 0 throughout, blue line only. | `city-economy-*-element-{1,2,3}` |
| **L-POP1** Population: migration on the axis | Fixed. Annual flows are a bar chart; bars start at zero, so a constant net migration of 10 is a visible bar. | Year 10 default and pulse; one million residents. | `city-population-*-element-1`, `city-population-million-desktop-dark-element-1` |
| **L-HOU1** Housing: axis label clipped | Fixed. Y-axis label "Bid or rent"; the unit (currency/month) is in the title for both axes. Posted rent chart likewise. | Desktop and narrow element images. | `city-housing-default-desktop-light-element-1`, `city-housing-bids-narrow-dark-element-1` |
| **L-HOU2** Housing: construction and displacement not shown; empty canvas | Fixed. Real state captured: allowance 400, three public homes commissioned at month 20, month 21 shows 3 amber homes under construction and 1 displaced household (diamond). The reserved empty area now shows the remaining building sites up to the maximum number of homes as small gray squares, counted in the header ("9 free sites"). | Month 21: building 3, displaced this month 1, vacant 1. | `city-housing-construction-{desktop-light,narrow-dark}-element-0` |
| **L-LAN1** Land Use: amber on orange; edge series; changed year; two factors | Fixed. Converted parcels get a white diamond with a black outline (visible on every use); the urban-edge series uses violet. A year-5 image shows two converted parcels. The intervention is dispersed growth only; corridor protection only is a separate run; the combination is labelled. | Compact y16: edge 1.8 km, 2 patches. Dispersed: 4.9 km, 10 patches. Corridor only: 1.6 km, largest patch 11 ha. Combined: 4.4 km, 7 patches. | `city-land-use-change-year-narrow-light-element-0`, `city-land-use-corridor-desktop-dark-*`, `city-land-use-combined-desktop-light-element-0` |
| **L-SER1** Services: hub labels; bar colors | Fixed. Hub labels sit below the white hub square. "Households by services received" uses one series per category in the map's colors (red 0 → green 3); the legend doubles as the map's key. Found during inspection: in "Daily requests by outcome", served 24 and too far 24 coincided, so one line hid the other; it is now a bar chart with bars side by side. | Central day 2: 24 served, 24 too far, both bars visible. Distributed: 36 served, 12 full. | `city-services-*-element-{0,1,2}` |
| **L-WAT1** Water: "80 saving days" without savings; narrow labels | Fixed in the model (decision above) and in the view: monitor "Savings rule tomorrow" reads "Off (cut 0)", "Cutting demand" or "Not triggered"; "Days with a demand cut"; the trigger line is drawn only while a cut is set. Narrow labels were shortened and moved. | Default day 80: rule off, 0 days with a cut, shortage 1200 m³. Early savings: cutting demand, 44 days, shortage 0. | `city-water-*`, `city-water-early-savings-narrow-dark-element-1` |
| **L-LBL1** Setup labels | Fixed: explicit labels with units for Energy (kW, kWh, ×), Water (m³, m³/day, days), Heat (°C, W/m²), and for consistency Housing (currency/month, share), Employment (currency/month) and Land Use (parcels). | Visible in the desktop viewports. The host-Enter images still show the earlier Employment label "Household Count"; the host behavior they prove is unaffected. | desktop viewports |
| **L-STO1** Stormwater: basin label; crossing runoff; infiltration vs retention | Fixed. The basin label sits above the basin; runoff drops beside each plot and runs in its own lane below all plots into the basin, so it never crosses another plot; plot shares are shortened to "80%" with the meaning in the title. Infiltration and retention counterfactuals were added at the same hour. | Hour 10: single 20.1 m³ overflow total; double storm 57.2; infiltration 12 mm/h 8.3; basin 120 m³ 0.0. | `city-stormwater-*`, `city-stormwater-{infiltration,retention}-*` |
| **L-HEA1** Heat: subtle colors; shade band contrast | The fixed honest 15–50 °C scale is kept. Each block now shows its difference to the air ("+10.4 K vs air") as a second line; the shade band has a light outline. | Day 2 16:00: sealed 41.3 → 35.4 °C with shade 0.4. Night 04:00: 30.4 → 28.1 °C. | `city-heat-*`, `city-heat-night-*` |
| **L-AIR1** Air: narrow table header; scroll proof; zero box | Fixed. The column "Dose (µg·min/m³)" was shortened, so the table fits 390 px with all four headers and needs no horizontal scrolling; the right-scroll image shows the same table because nothing scrolls (recorded `tableScroll: null`). Air boxes have a thin gray outline, so a 0.0 box is visible. | Narrow light table at minute 60. | `city-air-noise-table-narrow-light-{element-4,table-right-4}` |
| **L-BIO1** Habitat: "km" legend; blue contour; two factors | Fixed. The title explains the km map, values below patches, and the region outline (green West, blue East). Value labels were moved slightly further below the patches. The intervention is the stepping stone only; the enlarged east patch and the removed bridge are separate one-factor runs; the combination is labelled. | Year 10 mean occupancy: default 0.486, stepping stone 0.525, enlarge east 0.524, bridge removed 0.451, combination 0.488. | `city-biodiversity-*` |
| **L-MAT1** Materials: narrow overflow; saturation | Fixed. Names above boxes and amounts inside; the collected box is wider; kilograms use `Intl.NumberFormat`. Above the bin scale, the fill stops at full, a triangle marks the rim and the label reads "> scale 5,000,000 kg". | Day 15 default 650 kg uncollected, collection 160 → 450 kg. 1,000,000 kg/day: 9,998,800 kg with the over-scale marker. | `city-materials-*`, `city-materials-large-desktop-light-element-*` |
| **L-FIN2** Finance narrow: labels touch box edges | Fixed together with M-FIN1 (more row spacing and scene height). | Narrow images. | `city-finance-*-narrow-*` |
| **L-GEN1** Sticky bar over figure images; empty histogram | Fixed in the capture method: each figure is scrolled below the sticky transport bar before capture. The mobility histogram is shown with completed trips. | All `-element-N` images. | all |
| **L-GEN2** Zero series on the axis; awkward residuals | Interval series that sit at zero were moved to bar charts where that is the honest form (Population flows, Services daily outcomes, battery flows). Residual monitors and table cells show "≈ 0 (< 1e-6)" when the absolute value is below 10⁻⁶ and keep the exponent otherwise (Water, Materials, Heat, Stormwater, Energy check). Remaining line series at zero, for example a constant zero shortage, still lie on the axis; changing that is a shared renderer decision and was not made here (see open limits). | Monitors in the manifest. | — |

## Same-time comparisons (author readings from the captured monitors)

| Model | Time | Default | Counterfactual(s) |
| --- | --- | --- | --- |
| Population | year 10 | 961 residents, 321 households | pulse of 100 at setup: 1109 residents, 370 households |
| Housing | month 20 | rent 731.86, 16 housed, 2 vacant | allowance 400: rent 899.81, 18 housed, 0 vacant |
| Land Use | year 16 | compact: edge 1.8 km, 2 green patches | dispersed only: 4.9 km, 10 patches · corridor only: 1.6 km, largest 11 ha · both (labelled): 4.4 km, 7 patches |
| Daily Activities | day 1 · 20:00 | 6 done, 0 missed, 12 travel person-hours | remote + local: 6 done, 0 missed, 7 h · close 17:00: 0 done, 6 missed |
| Mobility | minute 20 | car share 57 %, 5 queued, mean trip 12.3 min | capacity 10: 100 %, 12 queued, 11.2 min |
| Employment | month 8 | hiring 1: 11 employed, 46 lost orders total | hiring 10: 13 employed, 8 lost orders |
| Services | day 2 | central: 24 served, 24 too far, 8 without service | distributed: 36 served, 12 full, 4 without service |
| Energy | day 2 · 18–19 | unmet 1.0 kWh this hour, 39.2 curtailed today | half of evening demand shifted: unmet 0, 15.2 curtailed |
| Water | day 80 | rule off: shortage 1200 m³, worst cut 80 % | trigger 0.6, cut 0.15: shortage 0, worst cut 15 %, 44 cut days |
| Stormwater | hour 10 | single storm: overflow 20.1 m³ | double storm 57.2 · infiltration 12 mm/h 8.3 · basin 120 m³ 0.0 |
| Heat | day 2 · 16:00 and 04:00 | sealed 41.3 °C (day), 30.4 °C (night) | shade 0.4: 35.4 °C (day), 28.1 °C (night) |
| Air and Noise | minute 60 | mean 7.13, hotspot 15.60 at 250 m | ventilation 0.8: mean 6.44, hotspot 14.17 at 350 m |
| Habitat | year 10 | mean 0.486, east 0.270 | stepping stone 0.525/0.373 · enlarge east 0.524/0.356 · bridge removed 0.451/0.209 · both (labelled) 0.488/0.319 |
| Materials | day 15 | collection 120: 650 kg uncollected | collection 160: 450 kg |
| Finance | year 20 | worst first: condition 0.162, backlog 20100 CU | preventive: 0.629, 7000 CU, same cash 2100 |

## Executed checks

Run in this worktree after the final code changes (logs: `/tmp/claude-1000/-home-david--t3-worktrees-city-library-t3-ad043594-efa84c79fbccafc6/9d3262ec-9bb1-400b-a5ac-dca8cd7079d2/scratchpad/visual-fixes-check.log` and `visual-fixes-build-ui.log` in the same folder):

| Command | Result |
| --- | --- |
| `bun tests/public-contracts/city-water/03-policy.ts` before the runtime edit | Failed as intended at the new baseline assertion (`conservationDayCount` 120, expected 0). |
| `bun run typecheck` (also after each batch of edits) | 1852 files, 0 errors, 0 warnings. |
| 64 `tests/public-contracts/city-*/0*.ts` scripts run individually | All passed. |
| `bun test` for the five `tests/public-contracts/city-*/behavior.test.ts` files | 23 pass, 0 fail, 40 696 expectations. |
| `bun test models/` | 50 pass, 0 fail, 48 674 expectations (includes `water-balance.test.ts`). |
| `bun run check` | Exit 0: typecheck 0 errors; 848 tests pass, 0 fail, 797 384 expectations across 107 files; migration receipt 355 files / 3413 assertion calls, historical manifests unchanged; source provenance 57 records; public contracts 352 scripts passed; library build; packed consumer for Bun, Node ESM and ambient-free TypeScript passed. |
| `bun run build:ui` | Exit 0, built in 1.64 s (existing chunk-size advisory only). |
| Browser capture, final round plus a targeted round for Energy, Water and Stormwater | 87 runs, 276 images, 0 px document overflow, no page or console errors, every typed input accepted. |

Unchanged assertions were not weakened; the only contract edit adds three water baseline assertions.

## Screenshot inventory and manifest

All 276 images were produced by 87 fresh headless Chromium runs (playwright-core 1.64.1 from the local Bun cache, not a project dependency) against the Agent Lab dev server on `localhost:3101` from this worktree, desktop 1366×768 or narrow 390×844, theme set before navigation, device scale factor 1. Steps used real clicks on Setup, step buttons and model actions, typed inputs confirmed with Tab, combobox selection and, where an inspector exists, canvas focus plus the Home key. Every typed value was read back from the input with `aria-invalid="false"`; no out-of-range input was used. Figure images are taken after scrolling the figure below the sticky transport bar, so no figure is covered. Every run reported 0 px horizontal document overflow and no page or console errors. The machine-readable manifest is [revision-2-visual-fixes-manifest.json](revision-2-visual-fixes-manifest.json) (model, scenario, policy, clock, viewport, theme, figure titles, files and the monitor line of every run).

I opened every new image myself, as contact sheets and individually where in doubt. After that inspection the defects listed under "Found during my own inspection" were fixed and the whole matrix was captured again from scratch; Energy, Water and Stormwater were captured once more after a last label correction. Only these final images are evidence; the discarded first round is not.

The 147 pre-fix revision-2 images in `../screenshots/city-models/` are kept unchanged as the record the independent visual review looked at; their SHA-256 hashes are in [revision-2-before-image-hashes.txt](revision-2-before-image-hashes.txt). They are superseded for current acceptance by the folder above. The four `host-live-enter-*` images remain the current host evidence (host unchanged; the Employment setup labels were renamed afterwards, see L-LBL1).

| Run (file prefix) | Model | Scenario | Policy | Clock | Viewport | Theme | Figures captured alone |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `city-population-default-desktop-light` | city-population | default | defaults | year 10 | 1366x768 | light | viewport + 0, 1, 2, 3 |
| `city-population-default-narrow-dark` | city-population | default | defaults | year 10 | 390x844 | dark | viewport + 0 |
| `city-population-intervention-desktop-dark` | city-population | intervention | pulse of 100 immigrants aged 25 scheduled at setup | year 10 | 1366x768 | dark | viewport + 0, 1, 2, 3 |
| `city-population-intervention-narrow-light` | city-population | intervention | pulse of 100 immigrants aged 25 scheduled at setup | year 10 | 390x844 | light | viewport + 0 |
| `city-housing-default-desktop-light` | city-housing | default | allowance 0 | month 20 | 1366x768 | light | viewport + 0, 1, 2, 3, 4 |
| `city-housing-default-narrow-dark` | city-housing | default | allowance 0 | month 20 | 390x844 | dark | viewport + 0 |
| `city-housing-intervention-desktop-dark` | city-housing | intervention | allowance 400 | month 20 | 1366x768 | dark | viewport + 0, 1, 2, 3, 4 |
| `city-housing-intervention-narrow-light` | city-housing | intervention | allowance 400 | month 20 | 390x844 | light | viewport + 0 |
| `city-land-use-default-desktop-light` | city-land-use | default | compact, no protection | year 16 | 1366x768 | light | viewport + 0, 1, 2, 3, 4 |
| `city-land-use-default-narrow-dark` | city-land-use | default | compact, no protection | year 16 | 390x844 | dark | viewport + 0 |
| `city-land-use-intervention-desktop-dark` | city-land-use | intervention | dispersed, no protection (one factor) | year 16 | 1366x768 | dark | viewport + 0, 1, 2, 3, 4 |
| `city-land-use-intervention-narrow-light` | city-land-use | intervention | dispersed, no protection (one factor) | year 16 | 390x844 | light | viewport + 0 |
| `city-daily-activities-default-desktop-light` | city-daily-activities | default | central services, close 18:00, no remote work | day 1 20:00 | 1366x768 | light | viewport + 0, 1, 2, 3, 4 |
| `city-daily-activities-default-narrow-dark` | city-daily-activities | default | central services, close 18:00, no remote work | day 1 20:00 | 390x844 | dark | viewport + 0 |
| `city-daily-activities-intervention-desktop-dark` | city-daily-activities | intervention | remote work and local shops set at tick 0, close 18:00 | day 1 20:00 | 1366x768 | dark | viewport + 0, 1, 2, 3, 4 |
| `city-daily-activities-intervention-narrow-light` | city-daily-activities | intervention | remote work and local shops set at tick 0, close 18:00 | day 1 20:00 | 390x844 | light | viewport + 0 |
| `city-mobility-default-desktop-light` | city-mobility | default | capacity 5 | minute 20 | 1366x768 | light | viewport + 0, 1, 2, 3 |
| `city-mobility-default-narrow-dark` | city-mobility | default | capacity 5 | minute 20 | 390x844 | dark | viewport + 0 |
| `city-mobility-intervention-desktop-dark` | city-mobility | intervention | main road capacity 10 | minute 20 | 1366x768 | dark | viewport + 0, 1, 2, 3 |
| `city-mobility-intervention-narrow-light` | city-mobility | intervention | main road capacity 10 | minute 20 | 390x844 | light | viewport + 0 |
| `city-economy-default-desktop-light` | city-economy | default | outside orders 30 for months 1-6 then 90, hiring 1 | month 8 | 1366x768 | light | viewport + 0, 1, 2, 3, 4 |
| `city-economy-default-narrow-dark` | city-economy | default | outside orders 30 for months 1-6 then 90, hiring 1 | month 8 | 390x844 | dark | viewport + 0 |
| `city-economy-intervention-desktop-dark` | city-economy | intervention | same demand path, hiring limit 10 | month 8 | 1366x768 | dark | viewport + 0, 1, 2, 3, 4 |
| `city-economy-intervention-narrow-light` | city-economy | intervention | same demand path, hiring limit 10 | month 8 | 390x844 | light | viewport + 0 |
| `city-services-default-desktop-light` | city-services | default | central layout | day 2 | 1366x768 | light | viewport + 0, 1, 2, 3 |
| `city-services-default-narrow-dark` | city-services | default | central layout | day 2 | 390x844 | dark | viewport + 0 |
| `city-services-intervention-desktop-dark` | city-services | intervention | distributed layout | day 2 | 1366x768 | dark | viewport + 0, 1, 2, 3 |
| `city-services-intervention-narrow-light` | city-services | intervention | distributed layout | day 2 | 390x844 | light | viewport + 0 |
| `city-energy-default-desktop-light` | city-energy | default | flexible share 0 | day 2 18:00-19:00 | 1366x768 | light | viewport + 0, 1, 2, 3, 4, 5 |
| `city-energy-default-narrow-dark` | city-energy | default | flexible share 0 | day 2 18:00-19:00 | 390x844 | dark | viewport + 0 |
| `city-energy-intervention-desktop-dark` | city-energy | intervention | flexible share 0.5 | day 2 18:00-19:00 | 1366x768 | dark | viewport + 0, 1, 2, 3, 4, 5 |
| `city-energy-intervention-narrow-light` | city-energy | intervention | flexible share 0.5 | day 2 18:00-19:00 | 390x844 | light | viewport + 0 |
| `city-water-default-desktop-light` | city-water | default | trigger 1, cut 0 (rule off) | day 80 | 1366x768 | light | viewport + 0, 1, 2 |
| `city-water-default-narrow-dark` | city-water | default | trigger 1, cut 0 (rule off) | day 80 | 390x844 | dark | viewport + 0 |
| `city-water-intervention-desktop-dark` | city-water | intervention | trigger 0.6, cut 0.15 | day 80 | 1366x768 | dark | viewport + 0, 1, 2 |
| `city-water-intervention-narrow-light` | city-water | intervention | trigger 0.6, cut 0.15 | day 80 | 390x844 | light | viewport + 0 |
| `city-stormwater-default-desktop-light` | city-stormwater | default | single storm, infiltration 6 mm/h, basin 60 m³ | hour 10 | 1366x768 | light | viewport + 0, 1, 2, 3 |
| `city-stormwater-default-narrow-dark` | city-stormwater | default | single storm, infiltration 6 mm/h, basin 60 m³ | hour 10 | 390x844 | dark | viewport + 0 |
| `city-stormwater-intervention-desktop-dark` | city-stormwater | intervention | double storm | hour 10 | 1366x768 | dark | viewport + 0, 1, 2, 3 |
| `city-stormwater-intervention-narrow-light` | city-stormwater | intervention | double storm | hour 10 | 390x844 | light | viewport + 0 |
| `city-heat-default-desktop-light` | city-heat | default | shade 0, watering 0.5 | day 2 16:00 | 1366x768 | light | viewport + 0, 1, 2, 3 |
| `city-heat-default-narrow-dark` | city-heat | default | shade 0, watering 0.5 | day 2 16:00 | 390x844 | dark | viewport + 0 |
| `city-heat-intervention-desktop-dark` | city-heat | intervention | shade 0.4 | day 2 16:00 | 1366x768 | dark | viewport + 0, 1, 2, 3 |
| `city-heat-intervention-narrow-light` | city-heat | intervention | shade 0.4 | day 2 16:00 | 390x844 | light | viewport + 0 |
| `city-air-noise-default-desktop-light` | city-air-noise | default | ventilation default | minute 60 | 1366x768 | light | viewport + 0, 1, 2, 3, 4 |
| `city-air-noise-default-narrow-dark` | city-air-noise | default | ventilation default | minute 60 | 390x844 | dark | viewport + 0 |
| `city-air-noise-intervention-desktop-dark` | city-air-noise | intervention | ventilation 0.8 | minute 60 | 1366x768 | dark | viewport + 0, 1, 2, 3, 4 |
| `city-air-noise-intervention-narrow-light` | city-air-noise | intervention | ventilation 0.8 | minute 60 | 390x844 | light | viewport + 0 |
| `city-biodiversity-default-desktop-light` | city-biodiversity | default | no restoration, bridge present | year 10 | 1366x768 | light | viewport + 0, 1, 2, 3 |
| `city-biodiversity-default-narrow-dark` | city-biodiversity | default | no restoration, bridge present | year 10 | 390x844 | dark | viewport + 0 |
| `city-biodiversity-intervention-desktop-dark` | city-biodiversity | intervention | stepping stone only (one factor) | year 10 | 1366x768 | dark | viewport + 0, 1, 2, 3 |
| `city-biodiversity-intervention-narrow-light` | city-biodiversity | intervention | stepping stone only (one factor) | year 10 | 390x844 | light | viewport + 0 |
| `city-materials-default-desktop-light` | city-materials | default | collection 120 | day 15 | 1366x768 | light | viewport + 0, 1, 2, 3 |
| `city-materials-default-narrow-dark` | city-materials | default | collection 120 | day 15 | 390x844 | dark | viewport + 0 |
| `city-materials-intervention-desktop-dark` | city-materials | intervention | collection 160 | day 15 | 1366x768 | dark | viewport + 0, 1, 2, 3 |
| `city-materials-intervention-narrow-light` | city-materials | intervention | collection 160 | day 15 | 390x844 | light | viewport + 0 |
| `city-finance-default-desktop-light` | city-finance | default | worst first | year 20 | 1366x768 | light | viewport + 0, 1, 2, 3, 4 |
| `city-finance-default-narrow-dark` | city-finance | default | worst first | year 20 | 390x844 | dark | viewport + 0 |
| `city-finance-intervention-desktop-dark` | city-finance | intervention | preventive | year 20 | 1366x768 | dark | viewport + 0, 1, 2, 3, 4 |
| `city-finance-intervention-narrow-light` | city-finance | intervention | preventive | year 20 | 390x844 | light | viewport + 0 |
| `city-population-million-desktop-dark` | city-population | large valid input | initial population 1,000,000 | year 20 | 1366x768 | dark | viewport + 0, 1 |
| `city-housing-construction-desktop-light` | city-housing | construction and displacement | allowance 400, 3 public homes commissioned in month 21 | month 21 | 1366x768 | light | 0 |
| `city-housing-construction-narrow-dark` | city-housing | construction and displacement | allowance 400, 3 public homes commissioned in month 21 | month 21 | 390x844 | dark | 0 |
| `city-land-use-corridor-desktop-dark` | city-land-use | counterfactual | compact with green corridor protected (one factor) | year 16 | 1366x768 | dark | 0, 1, 3 |
| `city-land-use-combined-desktop-light` | city-land-use | combination (two factors, labelled) | dispersed growth and green corridor protected | year 16 | 1366x768 | light | 0 |
| `city-land-use-change-year-narrow-light` | city-land-use | change year | compact, no protection | year 5 | 390x844 | light | 0 |
| `city-daily-activities-early-close-desktop-light` | city-daily-activities | counterfactual | services close 17:00 set at tick 0 | day 1 20:00 | 1366x768 | light | viewport + 0, 1, 4 |
| `city-daily-activities-early-close-narrow-dark` | city-daily-activities | counterfactual | services close 17:00 set at tick 0 | day 1 20:00 | 390x844 | dark | 0, 1 |
| `city-daily-activities-commute-narrow-light` | city-daily-activities | travelers in motion | defaults | day 1 07:45 | 390x844 | light | 0 |
| `city-mobility-1000-trips-narrow-dark` | city-mobility | large valid input | 1000 initial trips | minute 30 | 390x844 | dark | 0, 1, 2, 3 |
| `city-mobility-1000-trips-desktop-light` | city-mobility | large valid input | 1000 initial trips | minute 30 | 1366x768 | light | 0, 3 |
| `city-energy-charging-desktop-light` | city-energy | battery charging hour | flexible share 0 | day 2 09:00-10:00 | 1366x768 | light | 0, 1 |
| `city-mobility-queue-overflow-desktop-dark` | city-mobility | queue overflow | walking path 30 min (valid maximum), capacity 5 | minute 12 | 1366x768 | dark | 0 |
| `city-mobility-queue-overflow-narrow-light` | city-mobility | queue overflow | walking path 30 min (valid maximum), capacity 5 | minute 12 | 390x844 | light | 0 |
| `city-housing-bids-narrow-dark` | city-housing | supporting chart | allowance 0 | month 20 | 390x844 | dark | 1 |
| `city-water-early-savings-narrow-dark` | city-water | intervention trigger line | trigger 0.6, cut 0.15 | day 80 | 390x844 | dark | 1 |
| `city-stormwater-infiltration-desktop-light` | city-stormwater | counterfactual | single storm, infiltration 12 mm/h (one factor) | hour 10 | 1366x768 | light | 0, 1, 3 |
| `city-stormwater-retention-desktop-dark` | city-stormwater | counterfactual | single storm, basin 120 m³ (one factor) | hour 10 | 1366x768 | dark | 0, 1, 3 |
| `city-stormwater-table-narrow-dark` | city-stormwater | table | single storm | hour 10 | 390x844 | dark | 3 (+ right-scrolled table) |
| `city-heat-night-default-desktop-light` | city-heat | night counterfactual | shade 0 | day 2 04:00 | 1366x768 | light | 0, 1 |
| `city-heat-night-shade-desktop-dark` | city-heat | night counterfactual | shade 0.4 | day 2 04:00 | 1366x768 | dark | 0, 1 |
| `city-air-noise-table-narrow-light` | city-air-noise | table | ventilation default | minute 60 | 390x844 | light | 4 (+ right-scrolled table) |
| `city-biodiversity-enlarge-east-desktop-dark` | city-biodiversity | counterfactual | enlarge east patch only (one factor) | year 10 | 1366x768 | dark | 0, 1 |
| `city-biodiversity-bridge-removed-desktop-light` | city-biodiversity | counterfactual | bridge patch removed only (one factor) | year 10 | 1366x768 | light | 0, 1 |
| `city-biodiversity-combined-desktop-dark` | city-biodiversity | combination (two factors, labelled) | stepping stone and bridge removed | year 10 | 1366x768 | dark | 0 |
| `city-materials-large-desktop-light` | city-materials | large valid input | normal waste 1,000,000 kg/day | day 10 | 1366x768 | light | 0, 1, 2 |
| `city-finance-table-narrow-light` | city-finance | table | worst first | year 20 | 390x844 | light | 3 |

## Found during my own inspection and fixed

- Services "Daily requests by outcome": served 24 and too far 24 coincided, so one line hid the other. Changed to side-by-side bars.
- Heat README: my first wording said shade "does little after sunset". The 04:00 counterfactual shows 30.4 → 28.1 °C, so the README now explains the night difference as heat not stored during the day.
- Energy: the first "battery charging" capture at 12:00 showed a full battery with no charging. It was moved to 09:00–10:00, where 4.0 kWh are charged. A flow number on the vertical charging line overlapped a label and now sits beside the line.
- Finance (narrow): the second-row repair label touched the first-row condition value, so the row spacing was increased.
- Water, Stormwater, Materials, Habitat, Heat, Economy (narrow): labels touched the canvas edges or neighboring labels; they were moved, shortened or the scene height increased.
- Employment orders chart: when orders and sales coincide, the title now says that every order was sold.
- First capture round: some viewports showed the dev server's "Reload updates" button because model READMEs changed during capture. That round was discarded and recaptured without edits in progress.

## Open limits

- Independent visual acceptance of these pictures is open; this document is self-review only.
- The water saving-day correction needs a targeted independent mechanism recheck.
- Two renderer properties remain and are stated rather than worked around: a series whose values equal the y minimum lies on the x axis (L-GEN2), and several single-point bar series are drawn side by side within a category slot (bars appear offset in Services and Daily Activities). Both are existing shared behavior; changing them needs a shared public contract and was not requested here.
- The host draws the keyboard selection as an amber outline. In Finance it sits next to, but separate from, the amber repair bar; captures that used the Home key show the first asset selected.
- No screen-reader or full accessibility audit was performed. Browser checks were headless Chromium only.
